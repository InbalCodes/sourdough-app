import { api, APP_ID } from "./api.mjs";
const infos = await api("GET", `/v1/apps/${APP_ID}/appInfos?include=appInfoLocalizations`);
for (const i of infos.data) console.log("appInfo", i.id, i.attributes.appStoreState);
for (const l of infos.included ?? []) console.log(" infoLoc", l.id, l.attributes.locale, l.attributes.name, "|", l.attributes.subtitle, "|", l.attributes.privacyPolicyUrl);
const v = "e793e0dd-8636-4fd6-a938-4d18776182cb";
const locs = await api("GET", `/v1/appStoreVersions/${v}/appStoreVersionLocalizations`);
for (const l of locs.data) {
  const sets = await api("GET", `/v1/appStoreVersionLocalizations/${l.id}/appScreenshotSets?include=appScreenshots`);
  console.log(" verLoc", l.id, l.attributes.locale, "sets:", sets.data.map((s) => s.attributes.screenshotDisplayType + ":" + (s.relationships.appScreenshots.data?.length ?? "?")).join(","));
}
const b = await api("GET", `/v1/appStoreVersions/${v}/build`).catch(() => ({ data: null }));
console.log("build", b.data?.attributes?.version);
