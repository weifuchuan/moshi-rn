import { Converter } from "showdown";
import axios from "axios";

const converter = new Converter();
converter.setFlavor("github");
const cache: Map<string, string> = new Map();
export default async function markdownToHtml(md: string): Promise<string> {
  if (cache.has(md)) {
    return cache.get(md)!;
  }
  const lines = md.split("\n");
  let containsCode = false;
  for (let line of lines) {
    if (line.trim() === "```") {
      containsCode = true;
      break;
    }
  }
  if (containsCode) {
    const { data } = await axios.post(
      "https://api.github.com/markdown",
      { text: md, mode: "markdown" },
      { responseType: "text" }
    );
    cache.set(md, data);
    return data;
  } else {
    const data = converter.makeHtml(md);
    cache.set(md, data);
    return data;
  }
}