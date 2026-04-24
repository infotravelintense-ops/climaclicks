#!/usr/bin/env node
/**
 * Cross-environment Prisma generate wrapper.
 *
 * Why this exists:
 *  - The original prisma/schema.prisma contains an absolute `output` path
 *    ("/home/ubuntu/climamallorca/nextjs_space/node_modules/.prisma/client")
 *    that the internal Abacus hosting requires.
 *  - On environments like Cloudflare Pages (or any CI) the path /home/ubuntu
 *    does not exist and the postinstall step fails with:
 *      EACCES: permission denied, mkdir '/home/ubuntu'
 *
 * Strategy:
 *  - Try to honour the original schema first.
 *  - If `prisma generate` fails because of the absolute output path, regenerate
 *    using a temporary schema with that line stripped, so Prisma falls back to
 *    its default (node_modules/.prisma/client relative to the schema).
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const projectRoot = path.resolve(__dirname, '..');
const schemaPath = path.join(projectRoot, 'prisma', 'schema.prisma');
const tmpSchemaPath = path.join(projectRoot, 'prisma', 'schema.cloudflare.prisma');

function runPrismaGenerate(schemaArg) {
  const args = ['prisma', 'generate'];
  if (schemaArg) args.push(`--schema=${schemaArg}`);
  const result = spawnSync('npx', args, {
    stdio: 'inherit',
    cwd: projectRoot,
    env: process.env,
    shell: process.platform === 'win32',
  });
  return result.status === 0;
}

function stripAbsoluteOutput(schemaContent) {
  // Remove any `output = "/..."` line that points to an absolute path.
  return schemaContent.replace(
    /^\s*output\s*=\s*"\/[^"]*"\s*\r?\n/gm,
    ''
  );
}

function main() {
  if (!fs.existsSync(schemaPath)) {
    console.warn('[prisma-postinstall] schema.prisma not found, skipping.');
    process.exit(0);
  }

  // First attempt: original schema (works on Abacus).
  console.log('[prisma-postinstall] Attempting prisma generate with original schema...');
  if (runPrismaGenerate()) {
    console.log('[prisma-postinstall] Prisma client generated successfully.');
    process.exit(0);
  }

  // Fallback: rewrite schema without absolute output path (works on Cloudflare/CI).
  console.warn(
    '[prisma-postinstall] Original schema failed. Falling back to portable schema (no absolute output path).'
  );

  try {
    const original = fs.readFileSync(schemaPath, 'utf8');
    const portable = stripAbsoluteOutput(original);
    fs.writeFileSync(tmpSchemaPath, portable, 'utf8');

    const ok = runPrismaGenerate(tmpSchemaPath);
    fs.unlinkSync(tmpSchemaPath);

    if (!ok) {
      console.error('[prisma-postinstall] Prisma generate failed even with portable schema.');
      process.exit(1);
    }

    console.log('[prisma-postinstall] Prisma client generated successfully (portable schema).');
    process.exit(0);
  } catch (err) {
    if (fs.existsSync(tmpSchemaPath)) {
      try { fs.unlinkSync(tmpSchemaPath); } catch (_) { /* noop */ }
    }
    console.error('[prisma-postinstall] Unexpected error:', err);
    process.exit(1);
  }
}

main();
