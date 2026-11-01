#!/usr/bin/env node
// Local renderer: GLSL scenes (WebGL in headless Chromium/SwiftShader) + Canvas2D overlays -> mp4.
// Usage:
//   node engine/render.mjs <spec.mjs> --preview 1.5,10,20 --out prev/      (JPEG frames)
//   node engine/render.mjs <spec.mjs> --out video.mp4 [--workers 2] [--gl 720x1280] [--fps 30]
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const ENGINE = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const specPath = resolve(args[0]);
const opt = (k, d) => { const i = args.indexOf("--" + k); return i >= 0 ? args[i + 1] : d; };
const spec = (await import(pathToFileURL(specPath).href)).default;
const fps = +opt("fps", 30);
const [glW, glH] = opt("gl", "720x1280").split("x").map(Number);
const lib = readFileSync(join(ENGINE, "shaders/lib.glsl"), "utf8");
const shaders = {};
for (const s of spec.scenes) {
  if (!s.glsl || shaders[s.glsl]) continue;
  const local = join(dirname(specPath), "shaders", s.glsl + ".glsl");
  const f = existsSync(local) ? local : join(ENGINE, "shaders", s.glsl + ".glsl");
  shaders[s.glsl] = lib + "\n" + readFileSync(f, "utf8");
}
const payload = { ...spec, glW, glH, shaders };

async function openPage() {
  const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
  const page = await browser.newPage({ viewport: { width: 400, height: 400 } });
  page.on("pageerror", (e) => console.error("pageerror", e.message));
  await page.goto(pathToFileURL(join(ENGINE, "page.html")).href);
  const r = await page.evaluate((p) => window.setup(p), payload);
  return { browser, page, renderer: r };
}
async function grab(page, t) {
  const url = await page.evaluate((t) => { window.frame(t); return window.grab(0.93); }, t);
  return Buffer.from(url.slice(url.indexOf(",") + 1), "base64");
}

const preview = opt("preview", null);
if (preview) {
  const outDir = resolve(opt("out", "prev")); mkdirSync(outDir, { recursive: true });
  const { browser, page, renderer } = await openPage();
  console.log("renderer:", renderer);
  for (const t of preview.split(",").map(Number)) {
    const t0 = Date.now(); const buf = await grab(page, t);
    writeFileSync(join(outDir, `f${t}.jpg`), buf); console.log(`f${t}.jpg ${Date.now() - t0} ms`);
  }
  await browser.close(); process.exit(0);
}

const out = resolve(opt("out", "video.mp4"));
const END = spec.END; const N = Math.round(END * fps);
const workers = +opt("workers", 2);
const parts = [];
const tmp = out + ".parts"; rmSync(tmp, { recursive: true, force: true }); mkdirSync(tmp, { recursive: true });
const t0 = Date.now();
await Promise.all(Array.from({ length: workers }, async (_, w) => {
  const a = Math.floor((N * w) / workers), b = Math.floor((N * (w + 1)) / workers);
  const file = join(tmp, `p${w}.mp4`); parts[w] = file;
  const { browser, page } = await openPage();
  const ff = spawn("ffmpeg", ["-v", "error", "-y", "-f", "image2pipe", "-framerate", String(fps), "-c:v", "mjpeg", "-i", "-",
    "-c:v", "libx264", "-preset", "medium", "-crf", "17", "-pix_fmt", "yuv420p", "-r", String(fps), file], { stdio: ["pipe", "inherit", "inherit"] });
  for (let i = a; i < b; i++) {
    const buf = await grab(page, (i + 0.5) / fps);
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
    if ((i - a) % 60 === 0) console.log(`w${w} frame ${i - a}/${b - a} ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  ff.stdin.end(); await new Promise((r) => ff.on("close", r)); await browser.close();
}));
writeFileSync(join(tmp, "list.txt"), parts.map((p) => `file '${p}'`).join("\n"));
await new Promise((r) => spawn("ffmpeg", ["-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", join(tmp, "list.txt"), "-c", "copy", out], { stdio: "inherit" }).on("close", r));
console.log("done", out, ((Date.now() - t0) / 1000).toFixed(0) + "s");
