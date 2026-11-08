// Light / dark / follow the phone. Light is the default.
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";

export type Theme = "light" | "dark" | "auto";

const isDark = (t: Theme) => t === "dark" || (t === "auto" && matchMedia("(prefers-color-scheme: dark)").matches);

export function applyTheme(t: Theme = "light"): void {
  document.documentElement.dataset.theme = t;
  const dark = isDark(t);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#171311" : "#fbf8f4");
  // Status bar icons: dark icons on the light app, light icons on the dark one.
  if (Capacitor.isNativePlatform()) void StatusBar.setStyle({ style: dark ? Style.Dark : Style.Light }).catch(() => {});
}
