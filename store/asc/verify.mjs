import { api, APP_ID } from "./api.mjs";
for (const s of (await api("GET", "/v1/subscriptionGroups/22581246/subscriptions")).data) {
  const p = await api("GET", `/v1/subscriptions/${s.id}/prices?filter[territory]=USA&include=subscriptionPricePoint`);
  const intro = await api("GET", `/v1/subscriptions/${s.id}/introductoryOffers?limit=5`);
  console.log(s.attributes.productId, s.attributes.state, "US:", p.included?.map((x) => x.attributes.customerPrice).join(","), "intro:", intro.data.map((o) => o.attributes.offerMode + " " + o.attributes.duration).slice(0, 1).join());
}
for (const i of (await api("GET", `/v1/apps/${APP_ID}/inAppPurchasesV2`)).data) {
  const m = await api("GET", `/v1/inAppPurchasePriceSchedules/${i.id}/manualPrices?include=inAppPurchasePricePoint,territory`).catch((e) => ({ err: e.message }));
  console.log(i.attributes.productId, i.attributes.state, m.err ?? m.included?.filter((x) => x.type === "inAppPurchasePricePoints").map((x) => x.attributes.customerPrice).join(","));
}
