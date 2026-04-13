import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, stepCountIs, streamText, tool } from 'ai';
import { z } from 'zod';
import { source, getLLMText } from '@/lib/source';
import { Document, type DocumentData } from 'flexsearch';

interface CustomDocument extends DocumentData {
  url: string;
  title: string;
  description: string;
  content: string;
}

interface SearchResult {
  url: string;
  title: string;
  description: string;
  excerpt: string;
}

const searchServer = createSearchServer();

async function createSearchServer() {
  const search = new Document<CustomDocument>({
    document: {
      id: 'url',
      index: ['title', 'description', 'content'],
      store: true,
    },
    tokenize: 'forward',
  });

  const pages = source.getPages();
  let indexed = 0;

  await Promise.all(
    pages.map(async (page) => {
      try {
        const content = await getLLMText(page);
        search.add({
          url: page.url,
          title: page.data.title,
          description: page.data.description ?? '',
          content: content ?? '',
        });
        indexed++;
      } catch (err) {
        console.error(`[AI Chat] Failed to index page ${page.url}:`, err);
      }
    }),
  );

  console.log(`[AI Chat] Indexed ${indexed}/${pages.length} pages`);
  return search;
}

function extractResults(raw: unknown): SearchResult[] {
  const seen = new Set<string>();
  const results: SearchResult[] = [];

  // FlexSearch Document.searchAsync with merge+enrich returns nested arrays
  // Flatten and deduplicate
  const items = Array.isArray(raw) ? raw : [];
  for (const item of items) {
    // merged format: { id, doc }
    if (item && typeof item === 'object') {
      const doc = (item as Record<string, unknown>).doc as CustomDocument | undefined;
      const id = (item as Record<string, unknown>).id as string | undefined;

      if (doc && !seen.has(doc.url)) {
        seen.add(doc.url);
        results.push({
          url: doc.url,
          title: doc.title,
          description: doc.description,
          excerpt: doc.content.slice(0, 1500),
        });
      } else if (id && !doc) {
        // fallback: result without store data
        if (!seen.has(String(id))) {
          seen.add(String(id));
          results.push({ url: String(id), title: '', description: '', excerpt: '' });
        }
      }

      // nested field results format: { field, result: [{ id, doc }] }
      const nested = (item as Record<string, unknown>).result;
      if (Array.isArray(nested)) {
        for (const sub of nested) {
          const subDoc = (sub as Record<string, unknown>).doc as CustomDocument | undefined;
          if (subDoc && !seen.has(subDoc.url)) {
            seen.add(subDoc.url);
            results.push({
              url: subDoc.url,
              title: subDoc.title,
              description: subDoc.description,
              excerpt: subDoc.content.slice(0, 1500),
            });
          }
        }
      }
    }
  }

  return results;
}

const searchTool = tool({
  description: 'Search the TickerQ documentation. Returns page titles, URLs, and content excerpts.',
  inputSchema: z.object({
    query: z.string().describe('Search query — use keywords like "TimeTicker", "cron", "retry", "dashboard auth"'),
    limit: z.number().int().min(1).max(10).default(5),
  }),
  async execute({ query, limit }) {
    const search = await searchServer;

    // Search with individual words for better coverage
    const words = query.split(/\s+/).filter(w => w.length > 1);
    const queries = [query, ...words];

    const allResults: SearchResult[] = [];
    const seen = new Set<string>();

    for (const q of queries) {
      const raw = await search.searchAsync(q, { limit, enrich: true });
      const results = extractResults(raw);
      for (const r of results) {
        if (!seen.has(r.url)) {
          seen.add(r.url);
          allResults.push(r);
        }
      }
      if (allResults.length >= limit) break;
    }

    return allResults.slice(0, limit);
  },
});

export type SearchTool = typeof searchTool;

const systemPrompt = [
  'You are an AI assistant for the TickerQ documentation site.',
  'TickerQ is a lightweight, source-generated background job scheduler for .NET with Native AOT support.',
  'You ONLY answer questions related to TickerQ, its packages, and .NET background job scheduling.',
  'If a question is not related to TickerQ or its documentation, politely decline and say: "I can only help with TickerQ-related questions."',
  'ALWAYS use the `search` tool first to find relevant documentation before answering.',
  'Use the search results (title, url, excerpt) to ground your answer.',
  'The documentation site domain is https://tickerq.net. When citing sources, use this domain with the url path from search results: [Page Title](https://tickerq.net{url}).',
  'NEVER use tickerq.dev or any other domain. ONLY use https://tickerq.net.',
  'If search returns no results, try broader or different keywords.',
  'If still nothing, say you could not find the answer in the docs.',
  'Do NOT answer general programming questions, trivia, or anything outside the scope of TickerQ.',
].join('\n');

export async function POST(req: Request) {
  const reqJson = await req.json();

  const result = streamText({
    model: openai(process.env.OPENAI_MODEL ?? 'gpt-4o-mini'),
    stopWhen: stepCountIs(5),
    tools: { search: searchTool },
    messages: [
      { role: 'system', content: systemPrompt },
      ...(await convertToModelMessages(reqJson.messages ?? [])),
    ],
    toolChoice: 'auto',
  });

  return result.toUIMessageStreamResponse();
}
