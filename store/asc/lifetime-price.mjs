// Sets the lifetime purchase price: $19.99 in the US, other countries follow automatically.
import { api } from "./api.mjs";

const IAP = "6835095883";
const pp = (await api("GET", `/v2/inAppPurchases/${IAP}/pricePoints?filter[territory]=USA&limit=200`)).data.find((p) => p.attributes.customerPrice === "19.99");
const tmp = "${price-1}";
await api("POST", "/v1/inAppPurchasePriceSchedules", {
  data: { type: "inAppPurchasePriceSchedules", relationships: { inAppPurchase: { data: { type: "inAppPurchases", id: IAP } }, baseTerritory: { data: { type: "territories", id: "USA" } }, manualPrices: { data: [{ type: "inAppPurchasePrices", id: tmp }] } } },
  included: [{ type: "inAppPurchasePrices", id: tmp, attributes: { startDate: null }, relationships: { inAppPurchasePricePoint: { data: { type: "inAppPurchasePricePoints", id: pp.id } } } }],
});
const i = (await api("GET", `/v2/inAppPurchases/${IAP}`)).data;
console.log(i.attributes.productId, i.attributes.state);
