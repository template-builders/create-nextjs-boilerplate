#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDir = process.argv[2];
if (!targetDir) {
  console.error("Usage: npx create-my-stack <project-name>");
  process.exit(1);
}

const dest = path.resolve(process.cwd(), targetDir);

const templateDir = path.join(__dirname, "..", "template");
fs.cpSync(templateDir, dest, { recursive: true });

console.log("Installing dependencies...");
execSync("npm install", { cwd: dest, stdio: "inherit" });

console.log(`
✅ All set!

cd ${targetDir}
npm run dev
`);