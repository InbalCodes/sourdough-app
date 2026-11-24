// Attaches the newest 2.0.3 build to the App Store version and answers the encryption question (none beyond HTTPS).
import { api, APP_ID } from "./api.mjs";

const VERSION = "e793e0dd-8636-4fd6-a938-4d18776182cb";
const build = (await api("GET", `/v1/builds?filter[app]=${APP_ID}&filter[preReleaseVersion.version]=2.0.3&sort=-uploadedDate&limit=1`)).data[0];
if (!build) throw new Error("no 2.0.3 build");
if (build.attributes.usesNonExemptEncryption == null)
  await api("PATCH", `/v1/builds/${build.id}`, { data: { type: "builds", id: build.id, attributes: { usesNonExemptEncryption: false } } });
await api("PATCH", `/v1/appStoreVersions/${VERSION}/relationships/build`, { data: { type: "builds", id: build.id } });
const v = (await api("GET", `/v1/appStoreVersions/${VERSION}?include=build`)).data;
console.log("version", v.attributes.versionString, v.attributes.appStoreState, "→ build", build.attributes.version);
