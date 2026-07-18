import fs from "node:fs";
import path from "node:path";

const file = path.join(process.cwd(), "data", "state-page-content.json");
const content = JSON.parse(fs.readFileSync(file, "utf8"));
const rows = Object.entries(content).map(([slug, entry]) => {
  const count = String(entry.body || "").trim().split(/\s+/).filter(Boolean).length;
  return { slug, count };
});
const failures = rows.filter((row) => row.count < 500);
if (rows.length !== 52 || failures.length) {
  console.error({ pageCount: rows.length, failures });
  process.exit(1);
}
console.log(`SEO content audit passed: ${rows.length} state pages, minimum ${Math.min(...rows.map((row) => row.count))} words.`);
