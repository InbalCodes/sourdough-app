// Renders the Google Play feature graphic (1024×500) per language with headless Edge.
// Needs: npx serve -l 3000 .   Run from PowerShell (repo root): node store/feature.mjs
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { tmpdir } from "node:os";

const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const BASE = process.env.BASE ?? "http://localhost:3000";
mkdirSync(resolve("store/screenshots"), { recursive: true });
for (const lang of ["he", "en"]) {
  const out = resolve("store/screenshots", `feature-${lang}.png`);
  execFileSync(EDGE, ["--headless=new", `--user-data-dir=${resolve(tmpdir(), `levain-feature-${lang}`)}`, "--disable-gpu",
    "--hide-scrollbars", "--force-device-scale-factor=1", "--window-size=1024,500", "--virtual-time-budget=5000",
    `--screenshot=${out}`, `${BASE}/store/feature?lang=${lang}`], { stdio: "ignore", timeout: 60000 });
  console.log(out);
}
