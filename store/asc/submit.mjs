// Sends Levain 2.0.3 and the 3 Pro products to App Review.
import { api, APP_ID } from "./api.mjs";

const VERSION = "e793e0dd-8636-4fd6-a938-4d18776182cb";
const SUBS = ["6835043701", "6835094904"]; // yearly, monthly
const IAP = "6835095883"; // lifetime

const tryIt = async (label, fn) => { try { await fn(); console.log(label, "ok"); } catch (e) { console.log(label, "→", String(e.message ?? e).slice(0, 300)); } };

// First-time products are reviewed together with the app version.
for (const id of SUBS)
  await tryIt(`subscription ${id}`, () => api("POST", "/v1/subscriptionSubmissions", { data: { type: "subscriptionSubmissions", relationships: { subscription: { data: { type: "subscriptions", id } } } } }));
await tryIt(`lifetime ${IAP}`, () => api("POST", "/v1/inAppPurchaseSubmissions", { data: { type: "inAppPurchaseSubmissions", relationships: { inAppPurchaseV2: { data: { type: "inAppPurchases", id: IAP } } } } }));

// Reuse an open submission if there is one, else create it.
const open = (await api("GET", `/v1/reviewSubmissions?filter[app]=${APP_ID}&filter[platform]=IOS&filter[state]=READY_FOR_REVIEW`)).data[0];
const sub = open ?? (await api("POST", "/v1/reviewSubmissions", { data: { type: "reviewSubmissions", attributes: { platform: "IOS" }, relationships: { app: { data: { type: "apps", id: APP_ID } } } } })).data;
const items = (await api("GET", `/v1/reviewSubmissions/${sub.id}/items`)).data;
if (!items.length)
  await api("POST", "/v1/reviewSubmissionItems", { data: { type: "reviewSubmissionItems", relationships: { reviewSubmission: { data: { type: "reviewSubmissions", id: sub.id } }, appStoreVersion: { data: { type: "appStoreVersions", id: VERSION } } } } });
await api("PATCH", `/v1/reviewSubmissions/${sub.id}`, { data: { type: "reviewSubmissions", id: sub.id, attributes: { submitted: true } } });

const v = (await api("GET", `/v1/appStoreVersions/${VERSION}`)).data.attributes;
console.log("version", v.versionString, v.appStoreState);
for (const id of SUBS) console.log("sub", id, (await api("GET", `/v1/subscriptions/${id}`)).data.attributes.state);
console.log("lifetime", (await api("GET", `/v2/inAppPurchases/${IAP}`)).data.attributes.state);
