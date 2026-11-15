#!/usr/bin/env node
/**
 * GPU / SwiftShader WebGL + SVG deterministic renderer for lowpoly-video, pixel-video, flat-video, and Canvas 2D scenes.
 * Wraps the same CLI flags as render_html.mjs (--html, --seconds, --width, --height, --fps, --output, --preview, --overwrite)
 * while automatically resolving Playwright from PLAYWRIGHT_DIR, current project, or parent workspace.
 */
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync, renameSync, copyFileSync, rmSync, statSync } from 'node:fs';
import { resolve, dirname, join, basename, extname, sep } from 'node:path';
import { tmpdir } from 'node:os';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { spawn, spawnSync } from 'node:child_process';

function parseArgs(argv) {
  const flags = new Set(['preview', 'overwrite', 'keep-frames']);
  const opts = {};
  for (let i = 0; i < argv.length; i++) {
    const s = argv[i];
    if (!s.startsWith('--')) throw new Error(`Unknown argument: ${s}`);
    const key = s.slice(2);
    if (flags.has(key)) opts[key] = true;
    else if (i + 1 < argv.length && !argv[i + 1].startsWith('--')) opts[key] = argv[++i];
    else throw new Error(`Missing value for --${key}`);
  }
  return opts;
}

function need(c, message) { if (!c) throw new Error(message); }

function resolvePlaywright() {
  const candidates = [
    process.env.PLAYWRIGHT_DIR,
    process.cwd(),
    resolve(process.cwd(), '..'),
    resolve(process.cwd(), '../..'),
    resolve(process.cwd(), '../../..'),
    resolve(process.cwd(), '../../../..'),
    process.env.LEMO_OPUSCAR_HOME,
  ].filter(Boolean);
  for (const dir of candidates) {
    const pkg = resolve(dir, 'package.json');
    if (!existsSync(pkg)) continue;
    const req = createRequire(pkg);
    try { return req('playwright'); } catch (_) {}
    try { return req('playwright-core'); } catch (_) {}
  }
  if (process.env.PLAYWRIGHT_MODULE_PATH) {
    const req = createRequire(import.meta.url);
    return req(resolve(process.env.PLAYWRIGHT_MODULE_PATH));
  }
  throw new Error('Playwright is not installed. Run: npm install --save-dev playwright && npx playwright install chromium');
}

async function run(programName, argv) {
  await new Promise((ok, fail) => {
    const child = spawn(programName, argv, { stdio: ['ignore', 'pipe', 'pipe'] });
    let last = '';
    for (const s of [child.stdout, child.stderr]) s.on('data', b => { last = (last + b.toString()).slice(-8000); });
    child.on('error', fail);
    child.on('close', code => code === 0 ? ok() : fail(new Error(`${programName} exited ${code}:\n${last}`)));
  });
}

async function openLocalServer(html, kitRoot) {
  const root = dirname(html);
  const mime = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.glb': 'model/gltf-binary', '.wasm': 'application/wasm' };
  const server = createServer(async (req, res) => {
    try {
      const raw = new URL(req.url, 'http://127.0.0.1').pathname;
      const rel = decodeURIComponent(raw).replace(/^\/+/, '');
      let filepath = resolve(root, rel);
      if (!existsSync(filepath) && kitRoot && (rel.startsWith('fonts/') || rel.startsWith('vendor/'))) {
        filepath = resolve(kitRoot, rel);
      }
      const bytes = await readFile(filepath);
      res.writeHead(200, { 'Content-Type': mime[extname(filepath).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      res.end(bytes);
    } catch (_) {
      res.writeHead(404);
      res.end('Not found');
    }
  });
  await new Promise((ok, fail) => { server.once('error', fail); server.listen(0, '127.0.0.1', ok); });
  return { server, url: `http://127.0.0.1:${server.address().port}/${encodeURIComponent(basename(html))}` };
}

async function main() {
  const o = parseArgs(process.argv.slice(2));
  for (const k of ['html', 'seconds', 'width', 'height', 'output']) need(o[k], `Required: --${k}`);
  const html = resolve(o.html), output = resolve(o.output);
  const seconds = Number(o.seconds), width = Number(o.width), height = Number(o.height), fps = Number(o.fps || 30);
  const n = Math.max(1, Math.round(seconds * fps));
  need(existsSync(html), `HTML file missing: ${html}`);
  mkdirSync(dirname(output), { recursive: true });
  const previewsDir = join(dirname(output), 'previews');
  mkdirSync(previewsDir, { recursive: true });

  const playwright = resolvePlaywright();
  const kitRoot = resolve(dirname(new URL(import.meta.url).pathname), '../kit');
  const localServer = await openLocalServer(html, existsSync(kitRoot) ? kitRoot : null);
  const browser = await playwright.chromium.launch({
    headless: true,
    args: ['--enable-webgl', '--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
  });
  let framesDir;
  try {
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(String(e)));
    await page.goto(localServer.url, { waitUntil: 'load', timeout: 30000 });
    await page.waitForFunction('window.ready === true && typeof window.renderFrame === "function"', null, { timeout: 60000 });
    await page.evaluate('document.fonts && document.fonts.ready');

    const points = [1, Math.max(1, Math.round(n * 0.15)), Math.max(1, Math.round(n * 0.5)), Math.max(1, Math.round(n * 0.85)), n];
    if (o.preview) {
      for (const f of [...new Set(points)]) {
        await page.evaluate(async fr => { await window.renderFrame(fr); }, f);
        if (errors.length) throw new Error(errors.join(' | '));
        await page.screenshot({ path: join(previewsDir, `frame_${String(f).padStart(6, '0')}.png`) });
      }
      console.log(`Preview frames written to ${previewsDir}`);
    } else {
      framesDir = o['keep-frames'] ? join(dirname(output), 'frames') : mkdtempSync(join(tmpdir(), 'video-frames-'));
      mkdirSync(framesDir, { recursive: true });
      for (let f = 1; f <= n; f++) {
        await page.evaluate(async fr => { await window.renderFrame(fr); }, f);
        if (errors.length) throw new Error(errors.join(' | '));
        const dest = join(framesDir, `frame_${String(f).padStart(6, '0')}.png`);
        await page.screenshot({ path: dest });
        if (points.includes(f)) copyFileSync(dest, join(previewsDir, `frame_${String(f).padStart(6, '0')}.png`));
      }
      await run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-framerate', String(fps), '-start_number', '1', '-i', join(framesDir, 'frame_%06d.png'), '-frames:v', String(n), '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', output]);
      console.log(`Rendered ${output} (${width}x${height}, ${n} frames @ ${fps} fps)`);
    }
  } finally {
    await browser.close().catch(() => {});
    await new Promise(r => localServer.server.close(r));
    if (framesDir && !o['keep-frames']) rmSync(framesDir, { recursive: true, force: true });
  }
}

main().catch(e => { console.error(e.message); process.exitCode = 1; });
