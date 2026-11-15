import { api, APP_ID } from "./api.mjs";
const app = await api("GET", `/v1/apps/${APP_ID}?include=appStoreVersions`);
console.log(app.data.attributes.name, app.data.attributes.bundleId, app.data.attributes.primaryLocale);
for (const v of app.included ?? []) console.log("version", v.id, v.attributes.versionString, v.attributes.appStoreState, v.attributes.platform);
const subs = await api("GET", `/v1/subscriptionGroups/22581246/subscriptions`);
for (const s of subs.data) console.log("sub", s.id, s.attributes.productId, s.attributes.state);
const iaps = await api("GET", `/v1/apps/${APP_ID}/inAppPurchasesV2`);
for (const s of iaps.data) console.log("iap", s.id, s.attributes.productId, s.attributes.state);
