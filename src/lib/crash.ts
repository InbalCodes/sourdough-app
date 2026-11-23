// Crash and error reporting through Firebase Crashlytics (native crashes are caught automatically).
// Same file in every app: copy it and change APP only. Setup steps: phone-apps/infra/CRASH-REPORTING.md
// No personal data: the user id is the anonymous install id, logs are step names only.
import { FirebaseCrashlytics } from "@capacitor-firebase/crashlytics";
import { Capacitor } from "@capacitor/core";

/** Phone builds for testing (vite --mode device) don't report, so real users' numbers stay clean.
 *  Android only for now: the iOS app has no Firebase app (GoogleService-Info.plist) and leaves the plugin out. */
const ON = Capacitor.getPlatform() === "android" && import.meta.env.PROD && import.meta.env.MODE !== "device";

let started = false;

/** Call once at startup. */
export function initCrash(userId: string): void {
  if (started) return;
  started = true;
  if (!ON) return;
  FirebaseCrashlytics.setUserId({ userId }).catch(() => {});
  addEventListener("error", (e) => report(e.error ?? e.message, "window.onerror"));
  addEventListener("unhandledrejection", (e) => report(e.reason, "unhandledrejection"));
}

/** A breadcrumb shown with the next crash or error, e.g. step("export start"). */
export function step(message: string): void {
  if (ON) FirebaseCrashlytics.log({ message }).catch(() => {});
}

let taps = 0;
let lastTap = 0;

/** Hidden test: 7 quick taps on the logo crash the app, to check that reports reach Firebase. */
export function secretTap(): void {
  if (Capacitor.getPlatform() !== "android") return;
  const now = Date.now();
  taps = now - lastTap < 700 ? taps + 1 : 1;
  lastTap = now;
  if (taps >= 7) { taps = 0; FirebaseCrashlytics.crash({ message: "Test crash (7 taps on the logo)" }).catch(() => {}); }
}

/** Records an unexpected error (the app keeps running). */
export function report(error: unknown, where = ""): void {
  if (!ON) return;
  const e = error as { message?: string; code?: string; stack?: string } | string | undefined;
  const msg = typeof e === "string" ? e : [e?.code, e?.message].filter(Boolean).join(": ") || String(error);
  FirebaseCrashlytics.recordException({ message: where ? `${where}: ${msg}` : msg }).catch(() => {});
}
