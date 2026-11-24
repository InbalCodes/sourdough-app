// Creates/updates Levain Pro products in App Store Connect. Safe to run again: skips what already exists.
import { createHash } from "node:crypto";
import { readFileSync, statSync } from "node:fs";
import { api, APP_ID, uploadParts } from "./api.mjs";

const GROUP = "22581246";
const SHOT = new URL("../paywall-review.png", import.meta.url);
const NOTE = "Levain Pro unlocks the photo check (a photo of a sourdough starter or a loaf's crumb is analyzed by AI and the app explains what to do next) and backward bake planning. Open Settings (gear icon) > Levain Pro, or tap 'Is my starter ready?' on the Today screen. Everything else in the app is free. No account is needed.";

const territories = (await api("GET", "/v1/territories?limit=200")).data.map((t) => ({ type: "territories", id: t.id }));

async function reviewShot(kind, rel, id) {
  const base = kind === "sub" ? "/v1/subscriptions" : "/v2/inAppPurchases";
  const existing = await api("GET", `${base}/${id}/appStoreReviewScreenshot`).catch(() => ({ data: null }));
  if (existing.data) return console.log("  review screenshot already there");
  const buf = readFileSync(SHOT);
  const type = kind === "sub" ? "subscriptionAppStoreReviewScreenshots" : "inAppPurchaseAppStoreReviewScreenshots";
  const r = await api("POST", `/v1/${type}`, { data: { type, attributes: { fileName: "paywall-review.png", fileSize: statSync(SHOT).size }, relationships: { [rel]: { data: { type: kind === "sub" ? "subscriptions" : "inAppPurchases", id } } } } });
  await uploadParts(r.data.attributes.uploadOperations, buf);
  await api("PATCH", `/v1/${type}/${r.data.id}`, { data: { type, id: r.data.id, attributes: { uploaded: true, sourceFileChecksum: createHash("md5").update(buf).digest("hex") } } });
  console.log("  review screenshot uploaded");
}

async function subscription(productId, name, period, usd, display) {
  const subs = (await api("GET", `/v1/subscriptionGroups/${GROUP}/subscriptions`)).data;
  let sub = subs.find((s) => s.attributes.productId === productId);
  if (!sub) {
    sub = (await api("POST", "/v1/subscriptions", { data: { type: "subscriptions", attributes: { name, productId, subscriptionPeriod: period, familySharable: false, reviewNote: NOTE }, relationships: { group: { data: { type: "subscriptionGroups", id: GROUP } } } } })).data;
    console.log("created", productId, sub.id);
  } else {
    await api("PATCH", `/v1/subscriptions/${sub.id}`, { data: { type: "subscriptions", id: sub.id, attributes: { reviewNote: NOTE } } });
    console.log("exists", productId, sub.id);
  }
  const avail = await api("GET", `/v1/subscriptions/${sub.id}/subscriptionAvailability`).catch(() => ({ data: null }));
  if (!avail.data) {
    await api("POST", "/v1/subscriptionAvailabilities", { data: { type: "subscriptionAvailabilities", attributes: { availableInNewTerritories: true }, relationships: { subscription: { data: { type: "subscriptions", id: sub.id } }, availableTerritories: { data: territories } } } });
    console.log("  availability: all territories");
  }
  const prices = await api("GET", `/v1/subscriptions/${sub.id}/prices?limit=1`);
  if (!prices.data.length) {
    const pp = (await api("GET", `/v1/subscriptions/${sub.id}/pricePoints?filter[territory]=USA&limit=200`)).data.find((p) => p.attributes.customerPrice === usd);
    const eq = (await api("GET", `/v1/subscriptionPricePoints/${pp.id}/equalizations?limit=200`)).data;
    let n = 0;
    for (const p of [pp, ...eq]) {
      await api("POST", "/v1/subscriptionPrices", { data: { type: "subscriptionPrices", attributes: { preserveCurrentPrice: false }, relationships: { subscription: { data: { type: "subscriptions", id: sub.id } }, subscriptionPricePoint: { data: { type: "subscriptionPricePoints", id: p.id } } } } });
      n++;
    }
    console.log(`  prices set in ${n} territories ($${usd} US)`);
  }
  const locs = (await api("GET", `/v1/subscriptions/${sub.id}/subscriptionLocalizations`)).data;
  if (!locs.length) {
    await api("POST", "/v1/subscriptionLocalizations", { data: { type: "subscriptionLocalizations", attributes: { locale: "en-US", name: display, description: "Photo checks and backward bake planning" }, relationships: { subscription: { data: { type: "subscriptions", id: sub.id } } } } });
    console.log("  English name added");
  }
  await reviewShot("sub", "subscription", sub.id);
}

async function lifetime() {
  const iaps = (await api("GET", `/v1/apps/${APP_ID}/inAppPurchasesV2`)).data;
  let iap = iaps.find((s) => s.attributes.productId === "levain_pro_lifetime");
  if (!iap) {
    iap = (await api("POST", "/v2/inAppPurchases", { data: { type: "inAppPurchases", attributes: { name: "Levain Pro Lifetime", productId: "levain_pro_lifetime", inAppPurchaseType: "NON_CONSUMABLE", reviewNote: NOTE, familySharable: false }, relationships: { app: { data: { type: "apps", id: APP_ID } } } } })).data;
    console.log("created levain_pro_lifetime", iap.id);
  } else console.log("exists levain_pro_lifetime", iap.id);
  const avail = await api("GET", `/v2/inAppPurchases/${iap.id}/inAppPurchaseAvailability`).catch(() => ({ data: null }));
  if (!avail.data) {
    await api("POST", "/v1/inAppPurchaseAvailabilities", { data: { type: "inAppPurchaseAvailabilities", attributes: { availableInNewTerritories: true }, relationships: { inAppPurchase: { data: { type: "inAppPurchases", id: iap.id } }, availableTerritories: { data: territories } } } });
    console.log("  availability: all territories");
  }
  const sched = await api("GET", `/v2/inAppPurchases/${iap.id}/iapPriceSchedule`).catch(() => ({ data: null }));
  if (!sched.data) {
    const pp = (await api("GET", `/v2/inAppPurchases/${iap.id}/pricePoints?filter[territory]=USA&limit=200`)).data.find((p) => p.attributes.customerPrice === "19.99");
    const tmp = "${price-1}";
    await api("POST", "/v1/inAppPurchasePriceSchedules", {
      data: { type: "inAppPurchasePriceSchedules", relationships: { inAppPurchase: { data: { type: "inAppPurchases", id: iap.id } }, baseTerritory: { data: { type: "territories", id: "USA" } }, manualPrices: { data: [{ type: "inAppPurchasePrices", id: tmp }] } } },
      included: [{ type: "inAppPurchasePrices", id: tmp, attributes: { startDate: null }, relationships: { inAppPurchasePricePoint: { data: { type: "inAppPurchasePricePoints", id: pp.id } } } }],
    });
    console.log("  price $19.99 (other countries follow the US price)");
  }
  const locs = (await api("GET", `/v2/inAppPurchases/${iap.id}/inAppPurchaseLocalizations`)).data;
  if (!locs.length) {
    await api("POST", "/v1/inAppPurchaseLocalizations", { data: { type: "inAppPurchaseLocalizations", attributes: { locale: "en-US", name: "Levain Pro (Lifetime)", description: "Photo checks and backward planning, forever" }, relationships: { inAppPurchaseV2: { data: { type: "inAppPurchases", id: iap.id } } } } });
    console.log("  English name added");
  }
  await reviewShot("iap", "inAppPurchaseV2", iap.id);
}

// Group name shown in the iPhone's subscription settings
const gl = (await api("GET", `/v1/subscriptionGroups/${GROUP}/subscriptionGroupLocalizations`)).data;
if (!gl.length) {
  await api("POST", "/v1/subscriptionGroupLocalizations", { data: { type: "subscriptionGroupLocalizations", attributes: { locale: "en-US", name: "Levain Pro" }, relationships: { subscriptionGroup: { data: { type: "subscriptionGroups", id: GROUP } } } } });
  console.log("group name added");
}
await subscription("levain_pro_yearly", "Levain Pro Yearly", "ONE_YEAR", "14.99", "Levain Pro (Yearly)");
await subscription("levain_pro_monthly", "Levain Pro Monthly", "ONE_MONTH", "2.99", "Levain Pro (Monthly)");
await lifetime();
