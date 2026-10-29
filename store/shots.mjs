// Renders the App Store screenshots (1320×2868, iPhone 6.9") in Hebrew and English with headless Edge.
// Needs a local server at the repo root:  npx serve -l 3000 .
// Run from PowerShell (the repo root):     node store/shots.mjs [he|en ...]
import { execFileSync } from "node:child_process";
import { mkdirSync, existsSync, statSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { tmpdir } from "node:os";

const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const BASE = process.env.BASE ?? "http://localhost:3000";
const LANGS = process.argv.slice(2).length ? process.argv.slice(2) : ["he", "en"];
const ONLY = process.env.SHOT ? [Number(process.env.SHOT)] : [1, 2, 3, 4, 5];

for (const lang of LANGS) {
  const dir = resolve("store/screenshots", lang);
  mkdirSync(dir, { recursive: true });
  for (const shot of ONLY) {
    const out = resolve(dir, `${shot}.png`);
    for (let attempt = 1; ; attempt++) {
      if (existsSync(out)) rmSync(out);
      try {
        execFileSync(EDGE, ["--headless=new", `--user-data-dir=${resolve(tmpdir(), `levain-shots-${lang}-${shot}-${attempt}`)}`, "--disable-gpu",
          "--hide-scrollbars", "--mute-audio", "--force-device-scale-factor=3", "--window-size=440,956",
          "--virtual-time-budget=8000", `--screenshot=${out}`,
          `${BASE}/store/shots?shot=${shot}&lang=${lang}`], { stdio: "ignore", timeout: 60000 });
      } catch (e) { console.error(e.message); }
      if (existsSync(out) && statSync(out).size > 50000) break;
      if (attempt === 3) throw new Error(`failed: ${out}`);
    }
    console.log(out);
  }
}
