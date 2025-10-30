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

// Ensure .gitignore exists in the created project
const gitignorePath = path.join(dest, ".gitignore");
const plainGitignorePath = path.join(dest, "gitignore");

if (fs.existsSync(plainGitignorePath)) {
  fs.renameSync(plainGitignorePath, gitignorePath);
} else if (!fs.existsSync(gitignorePath)) {
  const defaultGitignore = `# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files (can opt-in for committing if needed)
.env*
migrations/*

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
`;
  fs.writeFileSync(gitignorePath, defaultGitignore);
}

console.log("Installing dependencies...");
execSync("npm install", { cwd: dest, stdio: "inherit" });

console.log(`
✅ All set!

cd ${targetDir}
npm run dev
`);