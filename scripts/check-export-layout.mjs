import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const indexPath = join(root, "out", "index.html");
const html = readFileSync(indexPath, "utf8");

function fail(message) {
  console.error(`Export layout check failed: ${message}`);
  process.exit(1);
}

function requireIncludes(needle, label) {
  if (!html.includes(needle)) {
    fail(`${label} is missing from out/index.html`);
  }
}

requireIncludes('meta name="build-version"', "cache-busting build marker");
requireIncludes("<style>:root", "inline CSS fallback");
requireIncludes(".workspace", "workspace CSS");
requireIncludes(".knowledge-map", "knowledge map CSS");
requireIncludes('class="knowledge-map"', "rendered knowledge map");
requireIncludes("LangChain 기초에서", "hero copy");
requireIncludes("GraphRAG 제품까지", "hero copy");

if (html.includes("<svg") || html.includes("<path") || html.includes("<circle")) {
  fail("legacy hero SVG is still present in the exported first screen");
}

const cssInlineStart = html.indexOf("<style>:root");
const cssInlineEnd = html.indexOf("</style>", cssInlineStart);
if (cssInlineStart === -1 || cssInlineEnd === -1 || cssInlineEnd - cssInlineStart < 8_000) {
  fail("inline CSS fallback looks too small to protect GitHub Pages rendering");
}

const stat = statSync(indexPath);
if (stat.size < 40_000) {
  fail("exported page is unexpectedly small and may not contain prerendered content");
}

console.log("Export layout check passed");
