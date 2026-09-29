#!/usr/bin/env node
import path from "node:path";
import { displayPath, formatReport, parseArgs, resolveRoot, scanContent, writeIndex } from "./lib/content-pipeline.mjs";

const HELP = `Usage: node scripts/build-index.mjs [--root <dir>] [--out <file>]

Scan English Corner content and write a light index.
Passage, script, and turn text are not copied.

Default root:   <repo>/content
Default output: <root>/index.json
`;

let args;
try {
  args = parseArgs(process.argv.slice(2), { allowOut: true });
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

if (args.help) {
  process.stdout.write(HELP);
  process.exit(0);
}

const root = resolveRoot(args.root);
const result = scanContent(root);
process.stdout.write(formatReport(result));
if (result.errors.length) process.exit(1);

const outAbs = args.out ? path.resolve(process.cwd(), args.out) : path.join(root, "index.json");
try {
  writeIndex(result.index, outAbs);
} catch (error) {
  console.error(`ERROR ${displayPath(outAbs)}: could not write index (${error.message})`);
  process.exit(1);
}
process.stdout.write(`wrote ${displayPath(outAbs)}\n`);
