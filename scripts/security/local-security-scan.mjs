import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT = path.resolve(import.meta.dirname, "../..");
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const IGNORED_DIRECTORIES = new Set([
  ".git",
  ".next",
  ".obsidian",
  ".serena",
  ".turbo",
  "build",
  "coverage",
  "dist",
  "infra/data",
  "node_modules",
]);

const SECRET_RULES = [
  ["private-key", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/u],
  ["aws-access-key", /\bAKIA[0-9A-Z]{16}\b/u],
  ["github-token", /\bgh[pousr]_[A-Za-z0-9_]{30,}\b/u],
  ["gitlab-token", /\bglpat-[A-Za-z0-9_-]{20,}\b/u],
  ["slack-token", /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/u],
  ["stripe-live-key", /\b(?:sk|rk)_live_[A-Za-z0-9]{20,}\b/u],
  ["npm-token", /\bnpm_[A-Za-z0-9]{30,}\b/u],
  ["credential-url", /:\/\/[^\s/:]+:[^\s/@]{8,}@/u],
];

function normalizedRelative(filePath) {
  return path.relative(ROOT, filePath).split(path.sep).join("/");
}

function isIgnoredDirectory(filePath) {
  const relative = normalizedRelative(filePath);
  return [...IGNORED_DIRECTORIES].some(
    (ignored) => relative === ignored || relative.startsWith(`${ignored}/`),
  );
}

function isForbiddenEnvironmentFile(filePath) {
  const name = path.basename(filePath);
  return name === ".env" || (name.startsWith(".env.") && name !== ".env.example");
}

async function collectFiles(directory, files = []) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (!isIgnoredDirectory(filePath)) await collectFiles(filePath, files);
    } else if (entry.isFile()) {
      files.push(filePath);
    }
  }
  return files;
}

async function scanFile(filePath) {
  if (isForbiddenEnvironmentFile(filePath)) return ["tracked-or-local-env-file"];
  if ((await stat(filePath)).size > MAX_FILE_BYTES) return [];

  const content = await readFile(filePath);
  if (content.includes(0)) return [];
  const text = content.toString("utf8");
  return SECRET_RULES.filter(([, pattern]) => pattern.test(text)).map(([rule]) => rule);
}

const findings = [];
for (const filePath of await collectFiles(ROOT)) {
  for (const rule of await scanFile(filePath)) {
    findings.push({ file: normalizedRelative(filePath), rule });
  }
}

if (findings.length > 0) {
  console.error("security scan: failed");
  for (const finding of findings) console.error(`${finding.file}: ${finding.rule}`);
  process.exitCode = 1;
} else {
  console.log("security scan: ok");
}
