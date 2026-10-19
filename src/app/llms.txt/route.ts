import { source } from '@/lib/source';
import { llms } from 'fumadocs-core/source';

export const revalidate = false;

export function GET() {
  return new Response([
    '# TickerQ documentation versions',
    '',
    'Keep APIs and license terms within the selected version. 5.x is the commercial functional line for 10.5.x, 9.5.x, and 8.5.x packages.',
    '',
    '- [5.x commercial index](https://tickerq.net/llms-5x.txt)',
    '- [5.x commercial full text](https://tickerq.net/llms-5x-full.txt)',
    '- [Legacy full text](https://tickerq.net/llms-full.txt)',
    '',
    '## Legacy documentation index',
    '',
    llms(source).index(),
  ].join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
