import { readFile, rm } from "node:fs/promises";
import { basename, resolve } from "node:path";

const workspaceDirectory = process.cwd();
const packageManifest = JSON.parse(
  await readFile(resolve(workspaceDirectory, "package.json"), "utf8"),
);
const outputDirectory = resolve(workspaceDirectory, ".next");

if (packageManifest.name !== "@rei-os/web" || basename(outputDirectory) !== ".next") {
  throw new Error("Refusing to clean outside the @rei-os/web .next directory.");
}

await rm(outputDirectory, {
  force: true,
  recursive: true,
  maxRetries: 3,
  retryDelay: 100,
});
