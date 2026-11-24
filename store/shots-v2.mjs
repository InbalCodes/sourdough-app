// Renders Levain 2 store screenshots with headless Edge, from store/shots-v2.html.
// Needs the dev server: npm run dev (port 5184).   Run: node store/shots-v2.mjs [lang ...]
// Default: App Store 1320×2868 → store/screenshots-v2/<lang>.   SIZE=play: Google Play 1080×1920 → store/screenshots-v2/play-<lang>
import { execFileSync } from "node:child_process";
import { mkdirSync, existsSync, statSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { tmpdir } from "node:os";

const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const BASE = process.env.BASE ?? "http://localhost:5184";
const LANGS = process.argv.slice(2).length ? process.argv.slice(2) : ["en", "fr", "de", "it", "ja", "ko", "pt", "es", "he"];
const PLAY = process.env.SIZE === "play";
const [W, H, SCALE] = PLAY ? [540, 960, 2] : [440, 956, 3];
for (const lang of LANGS) {
  const dir = resolve("store/screenshots-v2", PLAY ? `play-${lang}` : lang);
  mkdirSync(dir, { recursive: true });
  for (const shot of [1, 2, 3, 4, 5]) {
    const out = resolve(dir, `${shot}.png`);
    for (let attempt = 1; ; attempt++) {
      if (existsSync(out)) rmSync(out);
      try {
        execFileSync(EDGE, ["--headless=new", `--user-data-dir=${resolve(tmpdir(), `levain2-shots-${lang}-${shot}-${attempt}`)}`, "--disable-gpu",
          "--hide-scrollbars", "--mute-audio", `--force-device-scale-factor=${SCALE}`, `--window-size=${W},${H}`,
          "--virtual-time-budget=12000", `--screenshot=${out}`,
          `${BASE}/store/shots-v2.html?shot=${shot}&lang=${lang}${PLAY ? "&size=play" : ""}`], { stdio: "ignore", timeout: 90000 });
      } catch (e) { console.error(e.message); }
      if (existsSync(out) && statSync(out).size > 80000) break;
      if (attempt === 3) throw new Error(`failed: ${out}`);
    }
    console.log(out);
  }
}
