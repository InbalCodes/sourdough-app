// Updates the App Review notes for Levain 2 (no sign-in any more).
import { api } from "./api.mjs";

const VERSION = "e793e0dd-8636-4fd6-a938-4d18776182cb";
const NOTES = `Levain 2.0 is a rebuilt version. There is no account and no sign-in: all data stays on the device.

Free features: starters, feeding calculator, baker's percentage and pizza dough calculators, bake tracker with local notifications, recipes.

Levain Pro (auto-renewable monthly or yearly with a 7-day free trial, or a one-time lifetime purchase) unlocks:
1. Photo check: on the Today screen tap "Is my starter ready?" or "How did my bread turn out?", take or choose a photo. The photo is sent to our server and analyzed by an AI model (Anthropic Claude); the app shows a verdict and next steps. 3 checks are free, so it can be tried without buying.
2. Backward planning in the Bake tab: choose when you want the bread to be ready.

The paywall opens from Settings (gear icon) > Levain Pro. It shows prices, the trial terms, Restore Purchases, Terms of Use (Apple standard EULA) and the Privacy Policy.`;

const d = (await api("GET", `/v1/appStoreVersions/${VERSION}/appStoreReviewDetail`)).data;
await api("PATCH", `/v1/appStoreReviewDetails/${d.id}`, { data: { type: "appStoreReviewDetails", id: d.id, attributes: { notes: NOTES, demoAccountRequired: false, demoAccountName: null, demoAccountPassword: null } } });
console.log("review notes updated; contact:", d.attributes.contactFirstName ? "set" : "missing");
