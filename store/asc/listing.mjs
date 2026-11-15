// Fills the App Store page of Levain 2 in 9 languages: name, subtitle, description, keywords, promo text,
// and 5 iPhone 6.9" screenshots per language (store/screenshots-v2/<lang>). Safe to run again.
// Texts come from phone-apps/apps/levain/store/listings-v2.json.  Run: node store/asc/listing.mjs [--no-shots]
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { api, APP_ID, uploadParts } from "./api.mjs";

const VERSION = "e793e0dd-8636-4fd6-a938-4d18776182cb";
const L = JSON.parse(readFileSync("C:/Users/inbal/Documents/phone-apps/apps/levain/store/listings-v2.json", "utf8"));
const PRIVACY = "https://vocal-lolly-7ebc53.netlify.app/privacy.html";
const TERMS = "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/";
// listings-v2.json code → App Store Connect locale, screenshot folder
const MAP = { "en-US": ["en-US", "en"], "fr-FR": ["fr-FR", "fr"], "de-DE": ["de-DE", "de"], "it-IT": ["it", "it"], "ja-JP": ["ja", "ja"],
  "ko-KR": ["ko", "ko"], "pt-BR": ["pt-BR", "pt"], "es-419": ["es-MX", "es"], "iw-IL": ["he", "he"] };
const SHOTS = !process.argv.includes("--no-shots");

await api("PATCH", `/v1/appStoreVersions/${VERSION}`, { data: { type: "appStoreVersions", id: VERSION, attributes: { versionString: "2.0.2", copyright: "2026 UNIQOPS TECHNOLOGIES LTD" } } });
console.log("version → 2.0.2");

const appInfo = (await api("GET", `/v1/apps/${APP_ID}/appInfos`)).data.find((i) => i.attributes.appStoreState !== "READY_FOR_SALE");
const infoLocs = (await api("GET", `/v1/appInfos/${appInfo.id}/appInfoLocalizations`)).data;
const verLocs = (await api("GET", `/v1/appStoreVersions/${VERSION}/appStoreVersionLocalizations`)).data;
const supportUrl = verLocs.find((l) => l.attributes.locale === "en-US")?.attributes.supportUrl ?? "https://vocal-lolly-7ebc53.netlify.app/";

const ONLY = process.argv.find((a) => a.startsWith("--only="))?.slice(7).split(",");
for (const [code, [locale, dir]] of Object.entries(MAP)) {
  if (ONLY && !ONLY.includes(code)) continue;
  const v = L[code];
  const info = { name: v.ios.name, subtitle: v.ios.subtitle, privacyPolicyUrl: PRIVACY };
  const il = infoLocs.find((l) => l.attributes.locale === locale);
  if (il) await api("PATCH", `/v1/appInfoLocalizations/${il.id}`, { data: { type: "appInfoLocalizations", id: il.id, attributes: info } });
  else await api("POST", "/v1/appInfoLocalizations", { data: { type: "appInfoLocalizations", attributes: { locale, ...info }, relationships: { appInfo: { data: { type: "appInfos", id: appInfo.id } } } } });

  const text = { description: `${v.full}\n\nTerms of Use: ${TERMS}\nPrivacy Policy: ${PRIVACY}`, keywords: v.ios.keywords, promotionalText: v.ios.promo, supportUrl };
  // Adding the app-level language may have created the version-level one too, so look again.
  let vl = (await api("GET", `/v1/appStoreVersions/${VERSION}/appStoreVersionLocalizations`)).data.find((l) => l.attributes.locale === locale);
  if (vl) await api("PATCH", `/v1/appStoreVersionLocalizations/${vl.id}`, { data: { type: "appStoreVersionLocalizations", id: vl.id, attributes: text } });
  else vl = (await api("POST", "/v1/appStoreVersionLocalizations", { data: { type: "appStoreVersionLocalizations", attributes: { locale, ...text }, relationships: { appStoreVersion: { data: { type: "appStoreVersions", id: VERSION } } } } })).data;
  console.log(locale, "texts ok");

  if (!SHOTS) continue;
  // Replace all screenshots with the 5 new ones (6.9" iPhone)
  for (const set of (await api("GET", `/v1/appStoreVersionLocalizations/${vl.id}/appScreenshotSets`)).data) await api("DELETE", `/v1/appScreenshotSets/${set.id}`);
  const set = (await api("POST", "/v1/appScreenshotSets", { data: { type: "appScreenshotSets", attributes: { screenshotDisplayType: "APP_IPHONE_67" }, relationships: { appStoreVersionLocalization: { data: { type: "appStoreVersionLocalizations", id: vl.id } } } } })).data;
  for (const n of [1, 2, 3, 4, 5]) {
    const buf = readFileSync(`C:/Users/inbal/Documents/sourdough-app/store/screenshots-v2/${dir}/${n}.png`);
    const r = (await api("POST", "/v1/appScreenshots", { data: { type: "appScreenshots", attributes: { fileName: `${dir}-${n}.png`, fileSize: buf.length }, relationships: { appScreenshotSet: { data: { type: "appScreenshotSets", id: set.id } } } } })).data;
    await uploadParts(r.attributes.uploadOperations, buf);
    await api("PATCH", `/v1/appScreenshots/${r.id}`, { data: { type: "appScreenshots", id: r.id, attributes: { uploaded: true, sourceFileChecksum: createHash("md5").update(buf).digest("hex") } } });
  }
  console.log(locale, "5 screenshots uploaded");
}
