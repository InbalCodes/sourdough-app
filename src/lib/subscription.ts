// Levain Pro through RevenueCat (Google Play Billing on Android, StoreKit on iOS).
// Pro = any active entitlement. RevenueCat uses our install id as its app user id, so the server
// (netlify/pro/plan.mjs) can look the subscription up by the same id. The server decides what a check
// returns; this file only drives the UI. Adapted from RockSure.
import { Purchases, LOG_LEVEL, PACKAGE_TYPE, INTRO_ELIGIBILITY_STATUS, type PurchasesPackage, type CustomerInfo } from "@revenuecat/purchases-capacitor";
import { Capacitor } from "@capacitor/core";
import { SK, loadRaw } from "./store";

const isNative = () => Capacitor.isNativePlatform();
const isIOS = () => Capacitor.getPlatform() === "ios";

/** Anonymous id per install. Also the RevenueCat app user id. */
export function getUserId(): string {
  let id = loadRaw(SK.userId);
  if (!id) {
    id = crypto.randomUUID().replace(/-/g, "");
    try { localStorage.setItem(SK.userId, id); } catch { /* ignore */ }
  }
  return id;
}

/** RevenueCat public SDK keys (they ship inside the app; not secrets). From .env (VITE_REVENUECAT_*). */
const API_KEY = (isIOS() ? import.meta.env.VITE_REVENUECAT_IOS_KEY : import.meta.env.VITE_REVENUECAT_ANDROID_KEY) as string | undefined;
/** Dev builds can skip the paywall (VITE_DEV_UNLOCK=1). Never set for store builds. */
const DEV_UNLOCK = import.meta.env.VITE_DEV_UNLOCK === "1";

let configured: Promise<boolean> | null = null;
export function initPurchases(): Promise<boolean> {
  configured ??= (async () => {
    if (!isNative() || !API_KEY) return false;
    await Purchases.setLogLevel({ level: import.meta.env.DEV ? LOG_LEVEL.DEBUG : LOG_LEVEL.WARN });
    await Purchases.configure({ apiKey: API_KEY, appUserID: getUserId() });
    return true;
  })().catch((e) => { console.error("RevenueCat configure failed", e); return false; });
  return configured;
}

const hasPro = (info: CustomerInfo) => Object.keys(info.entitlements.active).length > 0;

/** True when Pro is active. The browser dev server counts as Pro (for designing); a web build does not. */
export async function isPro(): Promise<boolean> {
  if (DEV_UNLOCK || (import.meta.env.DEV && !isNative() && !location.hash.includes("free"))) return true;
  if (!(await initPurchases())) return false;
  try { return hasPro((await Purchases.getCustomerInfo()).customerInfo); } catch { return false; }
}

export async function onProChange(cb: (pro: boolean) => void): Promise<void> {
  if (!(await initPurchases())) return;
  await Purchases.addCustomerInfoUpdateListener((info) => cb(DEV_UNLOCK || hasPro(info)));
}

export const MANAGE_URL = isIOS()
  ? "https://apps.apple.com/account/subscriptions"
  : "https://play.google.com/store/account/subscriptions?package=com.inbal.levain";

export interface Plan {
  kind: "monthly" | "annual" | "lifetime" | "other";
  pkg: PurchasesPackage;
  price: string; // "$14.99"
  perMonth?: string; // annual only
  trialDays?: number;
}

/** Plans from the current offering: monthly, yearly, lifetime. Empty if the store has no products yet. */
export async function getPlans(): Promise<Plan[]> {
  if (import.meta.env.DEV && !isNative()) return samplePlans();
  if (!(await initPurchases())) return [];
  const current = (await Purchases.getOfferings()).current;
  if (!current) return [];
  const eligible = await iosTrialEligibility(current.availablePackages);
  const plans = current.availablePackages.map((pkg): Plan => {
    const p = pkg.product;
    const kind = pkg.packageType === PACKAGE_TYPE.MONTHLY ? "monthly" : pkg.packageType === PACKAGE_TYPE.ANNUAL ? "annual" : pkg.packageType === PACKAGE_TYPE.LIFETIME ? "lifetime" : "other";
    const fmt = new Intl.NumberFormat(undefined, { style: "currency", currency: p.currencyCode });
    const trial = isIOS()
      ? (p.introPrice && p.introPrice.price === 0 && eligible.has(p.identifier) ? p.introPrice.period : undefined)
      : p.defaultOption?.freePhase?.billingPeriod?.iso8601;
    return { kind, pkg, price: p.priceString, perMonth: kind === "annual" ? fmt.format(p.price / 12) : undefined, trialDays: trial ? isoDays(trial) : undefined };
  });
  const order = { monthly: 0, annual: 1, lifetime: 2, other: 3 };
  return plans.sort((a, b) => order[a.kind] - order[b.kind]);
}

async function iosTrialEligibility(pkgs: PurchasesPackage[]): Promise<Set<string>> {
  if (!isIOS()) return new Set();
  try {
    const r = await Purchases.checkTrialOrIntroductoryPriceEligibility({ productIdentifiers: pkgs.map((p) => p.product.identifier) });
    return new Set(Object.keys(r).filter((id) => r[id].status === INTRO_ELIGIBILITY_STATUS.INTRO_ELIGIBILITY_STATUS_ELIGIBLE));
  } catch { return new Set(); }
}

/** "P3D" → 3, "P1W" → 7 */
export function isoDays(iso: string): number {
  const m = /^P(?:(\d+)W)?(?:(\d+)D)?$/.exec(iso);
  return m ? Number(m[1] ?? 0) * 7 + Number(m[2] ?? 0) : 0;
}

/** Resolves true when Pro is active, false if the user cancelled. */
export async function buy(plan: Plan): Promise<boolean> {
  try {
    return hasPro((await Purchases.purchasePackage({ aPackage: plan.pkg })).customerInfo);
  } catch (e) {
    if ((e as { userCancelled?: boolean }).userCancelled) return false;
    throw e;
  }
}

export async function restore(): Promise<boolean> {
  if (!(await initPurchases())) return false;
  return hasPro((await Purchases.restorePurchases()).customerInfo);
}

/** Sample prices for designing the paywall in the browser. Never used on a phone. */
function samplePlans(): Plan[] {
  const pkg = (title: string) => ({ product: { title } }) as unknown as PurchasesPackage;
  return [
    { kind: "monthly", pkg: pkg("Monthly"), price: "$2.99" },
    { kind: "annual", pkg: pkg("Yearly"), price: "$14.99", perMonth: "$1.25", trialDays: 7 },
    { kind: "lifetime", pkg: pkg("Lifetime"), price: "$19.99" },
  ];
}
