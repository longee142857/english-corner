#!/usr/bin/env node
import { formatReport, parseArgs, resolveRoot, scanContent } from "./lib/content-pipeline.mjs";

const HELP = `Usage: node scripts/validate-content.mjs [--root <dir>]

Validate English Corner content. Missing corpus directories warn and exit 0.
Invalid JSON or schema violations print the file, item id, and the problem, then exit 1.

Default root: <repo>/content
Self-test:    node scripts/validate-content.mjs --root content/fixtures
`;

let args;
try {
  args = parseArgs(process.argv.slice(2));
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

if (args.help) {
  process.stdout.write(HELP);
  process.exit(0);
}

const result = scanContent(resolveRoot(args.root));
process.stdout.write(formatReport(result));
process.exit(result.errors.length ? 1 : 0);
