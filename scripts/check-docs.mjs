import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { verifyCommercialNavigation } from './check-navigation.mjs';
const base = process.env.DOCS_TEST_URL ?? 'http://127.0.0.1:3000';
// Drain network responses, including image/error bodies, so the CLI can close
// its pooled HTTP connections and exit after the assertions finish.
const request=async (path,init)=>{
 const response=await fetch(base+path,init);
 const body=await response.arrayBuffer();
 return new Response(body,{status:response.status,headers:response.headers});
};
const get=async (path,init)=>{const r=await request(path,init);assert.equal(r.status,200,path);return r;};
const sitemap=await (await get('/sitemap.xml')).text();
const urls=[...sitemap.matchAll(/<loc>https:\/\/tickerq.net(\/docs[^<]*)<\/loc>/g)].map(m=>m[1]);
let canonicalChecks=0;
const renderedPages = new Map();
for(let i=0;i<urls.length;i+=6) await Promise.all(urls.slice(i,i+6).map(async path=>{
 const html=await (await get(path)).text();
 renderedPages.set(path, html);
 assert.ok(html.includes(`rel="canonical" href="https://tickerq.net${path}"`),`${path}: canonical`);
 const version=path==='/docs/5.x'||path.startsWith('/docs/5.x/')?'5.x commercial documentation':'Legacy documentation';
 assert.ok(html.includes(version),`${path}: banner`); canonicalChecks++;
}));
for(const version of ['5.x','legacy']) for(const query of ['cron','StageAsync','IntegrationSettings','MapTicker','GetParentResult']) {
 const results=await (await get(`/api/search?version=${version}&query=${query}`)).json();
 if(query==='cron' || version==='5.x')assert.ok(results.length>0,`${version}: search results for ${query}`);
 for(const item of results) assert.equal(item.url.startsWith('/docs/5.x'),version==='5.x',`${version}: mixed search result ${item.url}`);
}
for(const path of ['/docs/5.x/getting-started/quick-start.mdx','/docs/getting-started/quick-start.mdx','/docs/5.x.mdx']) {
 const r=await get(path); assert.match(r.headers.get('content-type'),/text\/markdown/);
 const text=await r.text();assert.match(text,/Documentation:/);
}
const markdown=await get('/docs/5.x',{headers:{Accept:'text/markdown'}});assert.match(markdown.headers.get('content-type'),/text\/markdown/);
for(const path of ['/llms-5x.txt','/llms-5x-full.txt','/llms.txt','/llms-full.txt'])assert.ok((await (await get(path)).text()).length>200);
for(const path of ['/og/docs/5.x/image.png','/og/docs/dashboard/image.png'])assert.match((await get(path)).headers.get('content-type'),/image\/png/);
assert.equal((await request('/api/search?version=bad&query=cron')).status,400);
assert.equal((await request('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({version:'bad'})})).status,400);
assert.equal((await request('/docs/5.x/missing-page')).status,404);

// Validate source links against actual rendered anchors, not an approximated slugger.
const contentRoot = new URL('../content/docs-5x/', import.meta.url);
const contentFiles = await readdir(contentRoot, { recursive: true });
let anchorChecks = 0;
const screenshots = new Set();
for (const file of contentFiles.filter(file => file.endsWith('.mdx'))) {
 const body = (await readFile(new URL(file, contentRoot), 'utf8')).replace(/```[\s\S]*?```/g, '');
 const pagePath = '/docs/5.x/' + file.replace(/\.mdx$/, '').replace(/(^|\/)index$/, '');
 for (const [, path, hash] of body.matchAll(/\]\((\/docs[^\s)#?]*|)(?:#([^)]*))?\)/g)) {
  const target = path || pagePath.replace(/\/$/, '');
  const html = renderedPages.get(target);
  assert.ok(html, `${file}: missing page ${target}`);
  if (hash) {
   assert.ok(html.includes(`id="${decodeURIComponent(hash)}"`), `${file}: missing anchor ${target}#${hash}`);
   anchorChecks++;
  }
 }
 for (const [, target] of body.matchAll(/\bhref="(\/docs[^"?#]*)"/g)) {
  assert.ok(renderedPages.has(target), `${file}: missing card/link target ${target}`);
 }
 for (const [, name] of body.matchAll(/<DashboardScreenshot\s+name="([^"]+)"/g)) screenshots.add(name);
}
for (const name of screenshots) {
 const response = await get(`/images/dashboard/${name}.jpg`);
 assert.match(response.headers.get('content-type'), /image\/jpeg/, `screenshot ${name}`);
}
// Check the actual composed sidebar, including metadata-only task groups.
verifyCommercialNavigation();

console.log(JSON.stringify({anchors:anchorChecks,screenshots:screenshots.size,navigation:"passed",documentationPages:canonicalChecks,commercialPages:urls.filter(p=>p.startsWith('/docs/5.x')).length,search:'isolated',markdown:'passed',machineExports:'passed',images:'passed',invalidVersion:'rejected'}));
