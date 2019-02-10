import { Converter } from 'showdown';

const converter = new Converter();
converter.setFlavor('github');
const cache: Map<string, string> = new Map();
export default function htmlToMarkdown(html: string): string {
  if (cache.has(html)) {
    return cache.get(html)!;
  }
  const data = converter.makeMarkdown(html);
  cache.set(html, data);
  return data;
}
