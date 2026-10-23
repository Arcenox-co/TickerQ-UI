import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loader } from 'fumadocs-core/source';

function filesIn(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const path = resolve(dir, entry.name);
    return entry.isDirectory() ? filesIn(path) : [path];
  });
}

export function verifyCommercialNavigation() {
  const root = fileURLToPath(new URL('../content/docs-5x/', import.meta.url));
  const files = filesIn(root).flatMap(file => {
    const path = relative(root, file).split('\\').join('/');
    if (file.endsWith('meta.json')) {
      return [{ type: 'meta', path, data: JSON.parse(readFileSync(file, 'utf8')) }];
    }
    if (!file.endsWith('.mdx')) return [];
    const title = readFileSync(file, 'utf8').match(/^title:\s*"(.*)"$/m)?.[1];
    assert.ok(title, `${path}: title is required`);
    return [{ type: 'page', path, data: { title } }];
  });
  // Use the real page-tree builder: metadata-only groups can reference pages
  // elsewhere without moving their files or changing existing URLs.
  const source = loader({ baseUrl: '/docs/5.x', source: { files } });
  const tree = source.getPageTree();
  const urls = [];
  const visit = nodes => {
    for (const node of nodes) {
      if (node.type === 'page') urls.push(node.url);
      if (node.type === 'folder') {
        assert.ok(!node.root, `${node.name}: must remain in the shared sidebar`);
        if (node.index) urls.push(node.index.url);
        visit(node.children);
      }
    }
  };
  visit(tree.children);
  const expected = source.getPages().map(page => page.url).sort();
  assert.deepEqual([...urls].sort(), expected, 'Every commercial page must appear exactly once in the primary navigation');
  const entryPages = tree.children.filter(node => node.type === 'page').slice(0, 3);
  assert.deepEqual(entryPages.map(node => ({ name: node.name, url: node.url })), [
    { name: 'Guide', url: '/docs/5.x' },
    { name: 'What is TickerQ?', url: '/docs/5.x/what-is-tickerq' },
    { name: 'Changelog', url: '/docs/5.x/changelog' },
  ], 'Guide, product introduction, and Changelog must remain visible above the task groups');
  const groups = tree.children.filter(node => node.type === 'folder').map(node => node.name);
  assert.deepEqual(groups, [
    'Getting started',
    'Jobs and schedules',
    'Workflows',
    'Storage',
    'Dashboard',
    'Configuration and operations',
    'Integrations',
  ]);
  return { pages: urls.length, groups: groups.length };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  console.log(JSON.stringify(verifyCommercialNavigation()));
}
