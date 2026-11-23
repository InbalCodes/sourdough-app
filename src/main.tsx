import { render } from "preact";
import { App } from "./app";
import { SK, load, type Settings } from "./lib/store";
import { applyTheme } from "./lib/theme";
import { initCrash } from "./lib/crash";
import { getUserId } from "./lib/subscription";
import "./style.css";

initCrash(getUserId());

applyTheme(load<Settings>(SK.settings, {}).theme);

render(<App />, document.getElementById("app")!);
