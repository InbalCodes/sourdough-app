// Bake step alerts as phone notifications, so they arrive even when Levain is closed.
// Every time the bake changes, all pending alerts are replaced by the current plan.
import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";
import { alerts, type BakeState } from "./bake";

const CHANNEL = "bake";
const native = () => Capacitor.isNativePlatform();

/** Stable small number per alert key (fold-2 → always the same id), so rescheduling replaces, not duplicates. */
export function alertId(key: string): number {
  let h = 7;
  for (const c of key) h = (h * 31 + c.charCodeAt(0)) % 1_000_000;
  return 1000 + h;
}

let ready: Promise<void> | null = null;
function setup(): Promise<void> {
  return (ready ??= LocalNotifications.createChannel({
    id: CHANNEL, name: "Bake steps", description: "A heads-up at each step of your bake",
    importance: 5, visibility: 1, vibration: true,
  }).catch(() => {}));
}

/** Ask once, when the first bake starts. Returns true if notifications are allowed. */
export async function askPermission(): Promise<boolean> {
  if (!native()) return false;
  try {
    let p = await LocalNotifications.checkPermissions();
    if (p.display === "prompt" || p.display === "prompt-with-rationale") p = await LocalNotifications.requestPermissions();
    return p.display === "granted";
  } catch {
    return false;
  }
}

/** "granted", "denied" (turned off in phone settings), "ask" (never answered), or "none" (web). */
export async function permissionState(): Promise<"granted" | "denied" | "ask" | "none"> {
  if (!native()) return "none";
  try {
    const p = (await LocalNotifications.checkPermissions()).display;
    return p === "granted" ? "granted" : p === "denied" ? "denied" : "ask";
  } catch {
    return "none";
  }
}

/** Android 12+: exact timing needs "Alarms & reminders". Without it, alerts can arrive a few minutes late. */
export async function exactAllowed(): Promise<boolean> {
  if (Capacitor.getPlatform() !== "android") return true;
  try { return (await LocalNotifications.checkExactNotificationSetting()).exact_alarm === "granted"; } catch { return true; }
}
export async function openExactSetting(): Promise<void> {
  try { await LocalNotifications.changeExactNotificationSetting(); } catch { /* not on this Android */ }
}

/** Replace all pending bake notifications with the alerts still ahead in this bake (none if bake is null). */
export async function scheduleBake(bake: BakeState | null, text: (msg: string) => string, enabled: boolean): Promise<void> {
  if (!native()) return;
  try {
    await setup();
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length) await LocalNotifications.cancel({ notifications: pending.notifications.map((n) => ({ id: n.id })) });
    if (!bake || !enabled) return;
    if ((await LocalNotifications.checkPermissions()).display !== "granted") return;
    const now = Date.now();
    const upcoming = alerts(bake).filter((a) => a.ts > now + 5_000);
    if (!upcoming.length) return;
    await LocalNotifications.schedule({
      notifications: upcoming.map((a) => ({
        id: alertId(a.key),
        title: "Levain",
        body: text(a.msg),
        channelId: CHANNEL,
        smallIcon: "ic_stat_levain",
        iconColor: "#B5704A",
        schedule: { at: new Date(a.ts), allowWhileIdle: true },
      })),
    });
  } catch {
    /* notifications are a bonus; the in-app chime still works */
  }
}
