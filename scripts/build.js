#!/usr/bin/env node
/**
 * Unified build wrapper.
 *
 * Two build modes are supported:
 *
 *  1. Default (SSR build used by Abacus / Hostinger / Node hosting):
 *       $ npm run build
 *     Runs plain `next build` with API routes and admin enabled.
 *
 *  2. Static export (used by Cloudflare Pages and any static host):
 *       $ STATIC_EXPORT=true npm run build
 *     - Temporarily moves `app/api/` and `app/admin/` out of the `app/`
 *       directory so Next.js cannot discover them (they can't coexist with
 *       `output: 'export'`).
 *     - Runs `next build` with `NEXT_OUTPUT_MODE=export`, producing the
 *       fully static site in `out/`.
 *     - Restores the moved directories afterwards, even on failure, so the
 *       source tree is always left untouched.
 *
 * Cloudflare Pages auto-sets `CF_PAGES=1`; we treat that as implicit
 * STATIC_EXPORT=true for convenience.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const projectRoot = path.resolve(__dirname, '..');
const appDir = path.join(projectRoot, 'app');
// Quarantine dir sits OUTSIDE app/ so Next.js never discovers routes inside.
const quarantineDir = path.join(projectRoot, '.static-disabled');

const isStaticExport =
  process.env.STATIC_EXPORT === 'true' || process.env.CF_PAGES === '1';

// Relative dirs (inside app/) that must NOT exist during a static export build.
const DIRS_TO_HIDE = ['api', 'admin'];

function hideDirs() {
  const moved = [];
  if (!fs.existsSync(quarantineDir)) {
    fs.mkdirSync(quarantineDir, { recursive: true });
  }
  for (const name of DIRS_TO_HIDE) {
    const src = path.join(appDir, name);
    const dst = path.join(quarantineDir, name);
    if (fs.existsSync(src)) {
      // Clean any stale backup from a previously interrupted build.
      if (fs.existsSync(dst)) fs.rmSync(dst, { recursive: true, force: true });
      fs.renameSync(src, dst);
      moved.push({ src, dst });
      console.log(`[build] Moved app/${name}/ → .static-disabled/${name}/`);
    }
  }
  return moved;
}

function restoreDirs(moved) {
  for (const { src, dst } of moved) {
    if (fs.existsSync(dst)) {
      if (fs.existsSync(src)) fs.rmSync(src, { recursive: true, force: true });
      fs.renameSync(dst, src);
      console.log(`[build] Restored app/${path.basename(src)}/`);
    }
  }
  // Try to remove the quarantine dir if empty.
  try {
    const remaining = fs.readdirSync(quarantineDir);
    if (remaining.length === 0) {
      fs.rmdirSync(quarantineDir);
    }
  } catch (_) {
    /* noop */
  }
}

function cleanBuildArtifacts() {
  for (const d of ['.build', '.next', 'out']) {
    const p = path.join(projectRoot, d);
    if (fs.existsSync(p)) {
      fs.rmSync(p, { recursive: true, force: true });
      console.log(`[build] Cleaned ${d}/`);
    }
  }
}

function runNextBuild(extraEnv) {
  const env = { ...process.env, ...extraEnv };
  const result = spawnSync('npx', ['next', 'build'], {
    stdio: 'inherit',
    cwd: projectRoot,
    env,
    shell: process.platform === 'win32',
  });
  return result.status === 0;
}

function main() {
  if (!isStaticExport) {
    console.log('[build] Running SSR build (default mode).');
    process.exit(runNextBuild({}) ? 0 : 1);
    return;
  }

  console.log('[build] Running STATIC EXPORT build for Cloudflare Pages.');
  // Always start from a clean slate so stale types from a previous SSR build
  // don't pollute the static export.
  cleanBuildArtifacts();

  const moved = hideDirs();

  const cleanup = () => {
    try {
      restoreDirs(moved);
    } catch (err) {
      console.error('[build] Failed to restore directories:', err);
    }
  };

  process.on('SIGINT', () => {
    cleanup();
    process.exit(130);
  });
  process.on('SIGTERM', () => {
    cleanup();
    process.exit(143);
  });

  let ok = false;
  try {
    ok = runNextBuild({
      NEXT_OUTPUT_MODE: 'export',
      // Static export needs the default distDir so that `out/` sits alongside.
      NEXT_DIST_DIR: '.next',
      STATIC_EXPORT: 'true',
    });
  } finally {
    cleanup();
  }

  if (!ok) {
    console.error('[build] next build failed.');
    process.exit(1);
  }

  const outDir = path.join(projectRoot, 'out');
  if (!fs.existsSync(outDir)) {
    console.error('[build] Expected `out/` directory was not produced.');
    process.exit(1);
  }

  console.log('[build] Static site generated in out/.');
  process.exit(0);
}

main();
