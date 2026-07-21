import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const COMPOSE_FILE = path.join(ROOT, "infra/compose/solo-budget.yml");
const MIGRATIONS_DIR = path.join(ROOT, "db/migrations");

export function discoverMigrations(directory: string = MIGRATIONS_DIR): string[] {
  return readdirSync(directory)
    .filter((name) => /^V\d+__[a-z0-9_]+\.sql$/u.test(name))
    .sort((a, b) => a.localeCompare(b));
}

function psql(args: readonly string[], input?: string): string {
  const result = spawnSync(
    "docker",
    [
      "compose",
      "-f",
      COMPOSE_FILE,
      "exec",
      "-T",
      "postgres",
      "psql",
      "-v",
      "ON_ERROR_STOP=1",
      "-U",
      "rei",
      "-d",
      "rei_os",
      ...args,
    ],
    { cwd: ROOT, encoding: "utf8", input },
  );
  if (result.status !== 0) {
    const message = (result.stderr || result.stdout || "database migration command failed").trim();
    throw new Error(message);
  }
  return result.stdout.trim();
}

export function migrate(): void {
  psql([
    "-c",
    "CREATE TABLE IF NOT EXISTS schema_migrations (version TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT now())",
  ]);

  for (const migration of discoverMigrations()) {
    const applied = psql([
      "-tAc",
      `SELECT 1 FROM schema_migrations WHERE version = '${migration.replaceAll("'", "''")}'`,
    ]);
    if (applied === "1") {
      console.log(`migration: skipped ${migration}`);
      continue;
    }

    const sql = readFileSync(path.join(MIGRATIONS_DIR, migration), "utf8");
    const version = migration.replaceAll("'", "''");
    psql(
      [],
      `BEGIN;\n${sql}\nINSERT INTO schema_migrations(version) VALUES ('${version}');\nCOMMIT;`,
    );
    console.log(`migration: applied ${migration}`);
  }
  console.log("migration: ok");
}

if (path.resolve(process.argv[1] ?? "") === fileURLToPath(import.meta.url)) {
  try {
    migrate();
  } catch (error) {
    console.error(error instanceof Error ? error.message : "database migration failed");
    process.exitCode = 1;
  }
}
