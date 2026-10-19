import { commercialSource } from '@/lib/source';
import { llms } from 'fumadocs-core/source';

export const revalidate = false;

export function GET() {
  return new Response([
    '# TickerQ 5.x · Commercial documentation',
    '',
    'Functional line 5.x covers 10.5.x (.NET 10), 9.5.x (.NET 9), and 8.5.x (.NET 8). These docs cover Community, Evaluation, and paid subscriptions under the commercial agreement. Do not mix these APIs with legacy docs.',
    '',
    llms(commercialSource).index(),
  ].join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
