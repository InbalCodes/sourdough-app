// Waits (up to 45 min) until a build of version 2.0.3 shows up in App Store Connect and finishes processing.
import { api, APP_ID } from "./api.mjs";

const end = Date.now() + 45 * 60 * 1000;
while (Date.now() < end) {
  const b = await api("GET", `/v1/builds?filter[app]=${APP_ID}&filter[preReleaseVersion.version]=2.0.3&sort=-uploadedDate&limit=1`).catch(() => ({ data: [] }));
  const build = b.data[0];
  if (build && build.attributes.processingState !== "PROCESSING") {
    console.log("build", build.id, "number", build.attributes.version, build.attributes.processingState);
    process.exit(0);
  }
  await new Promise((r) => setTimeout(r, 60000));
}
console.log("no 2.0.3 build after 45 minutes");
process.exit(1);
