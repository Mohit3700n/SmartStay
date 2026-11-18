import { cp, mkdir } from "node:fs/promises";
import path from "node:path";

const standaloneDirectory = path.resolve(".next", "standalone");
const nextDirectory = path.join(standaloneDirectory, ".next");

await mkdir(path.join(nextDirectory, "static"), { recursive: true });
await cp(path.resolve(".next", "static"), path.join(nextDirectory, "static"), {
  recursive: true,
  force: true,
});
await cp(path.resolve("public"), path.join(standaloneDirectory, "public"), {
  recursive: true,
  force: true,
});
