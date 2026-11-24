// Creates the next App Store version (if missing) and fills "What's New" in every language from store/release-notes.md.
// Run: node store/asc/new-version.mjs 2.0.5
import { readFileSync } from "node:fs";
import { api, APP_ID } from "./api.mjs";

const VERSION = process.argv[2];
if (!/^\d+\.\d+\.\d+$/.test(VERSION ?? "")) throw new Error("Usage: node store/asc/new-version.mjs <x.y.z>");
// Play locale in release-notes.md → App Store Connect locale
const MAP = { "en-US": "en-US", "fr-FR": "fr-FR", "de-DE": "de-DE", "it-IT": "it", "ja-JP": "ja", "ko-KR": "ko", "pt-BR": "pt-BR", "es-419": "es-MX", "iw-IL": "he" };

const md = readFileSync(new URL("../release-notes.md", import.meta.url), "utf8").replace(/\r\n/g, "\n");
const section = md.split(/^## /m).find((s) => s.startsWith(VERSION + " "));
if (!section) throw new Error(`No "## ${VERSION}" section in release-notes.md`);
const notes = {};
for (const m of section.matchAll(/<([a-zA-Z0-9-]+)>\n([\s\S]*?)\n<\/\1>/g)) if (MAP[m[1]]) notes[MAP[m[1]]] = m[2].trim();

const all = (await api("GET", `/v1/apps/${APP_ID}/appStoreVersions?filter[platform]=IOS&limit=10`)).data;
let v = all.find((x) => x.attributes.versionString === VERSION);
if (!v) {
  v = (await api("POST", "/v1/appStoreVersions", { data: { type: "appStoreVersions",
    attributes: { platform: "IOS", versionString: VERSION, releaseType: "AFTER_APPROVAL", copyright: "2026 UNIQOPS TECHNOLOGIES LTD" },
    relationships: { app: { data: { type: "apps", id: APP_ID } } } } })).data;
  console.log("created version", VERSION, v.id);
} else console.log("version exists", VERSION, v.id, v.attributes.appStoreState);

const locs = (await api("GET", `/v1/appStoreVersions/${v.id}/appStoreVersionLocalizations?limit=50`)).data;
for (const l of locs) {
  const text = notes[l.attributes.locale];
  if (!text) { console.log("no notes for", l.attributes.locale); continue; }
  await api("PATCH", `/v1/appStoreVersionLocalizations/${l.id}`, { data: { type: "appStoreVersionLocalizations", id: l.id, attributes: { whatsNew: text } } });
  console.log("whatsNew", l.attributes.locale);
}
