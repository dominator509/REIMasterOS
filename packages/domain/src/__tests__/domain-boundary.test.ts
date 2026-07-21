import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const SOURCE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FORBIDDEN_IMPORT =
  /from\s+["'](?:@nestjs|next|react|typeorm|prisma|pg|ioredis|bullmq|@opentelemetry|node:fs|node:process)/u;

async function productionSourceFiles(directory: string): Promise<string[]> {
  const files: string[] = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name === "__tests__") continue;
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await productionSourceFiles(entryPath)));
    else if (entry.isFile() && entry.name.endsWith(".ts")) files.push(entryPath);
  }
  return files;
}

describe("domain boundary", () => {
  it("has no framework, persistence, provider, environment, or telemetry imports", async () => {
    for (const file of await productionSourceFiles(SOURCE_ROOT)) {
      expect(await readFile(file, "utf8"), file).not.toMatch(FORBIDDEN_IMPORT);
    }
  });

  it("does not read the system clock directly", async () => {
    for (const file of await productionSourceFiles(SOURCE_ROOT)) {
      expect(await readFile(file, "utf8"), file).not.toContain("new Date(");
    }
  });
});
