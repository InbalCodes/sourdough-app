// Shows TestFlight groups and makes build 4 available to the internal group(s).
import { api, APP_ID } from "./api.mjs";
const build = (await api("GET", `/v1/builds?filter[app]=${APP_ID}&filter[preReleaseVersion.version]=2.0.3&sort=-uploadedDate&limit=1&include=buildBetaDetail`)).data[0];
const det = (await api("GET", `/v1/builds/${build.id}/buildBetaDetail`)).data.attributes;
console.log("build", build.attributes.version, "encryption", build.attributes.usesNonExemptEncryption, "internal", det.internalBuildState, "external", det.externalBuildState);
const groups = (await api("GET", `/v1/apps/${APP_ID}/betaGroups`)).data;
for (const g of groups) {
  const testers = (await api("GET", `/v1/betaGroups/${g.id}/betaTesters?limit=50`)).data.length;
  const has = (await api("GET", `/v1/betaGroups/${g.id}/builds?limit=50`)).data.some((b) => b.id === build.id);
  console.log("group", g.attributes.name, "internal", g.attributes.isInternalGroup, "allBuilds", g.attributes.hasAccessToAllBuilds, "testers", testers, "hasBuild", has);
  if (process.argv.includes("--add") && !has && !g.attributes.hasAccessToAllBuilds) {
    await api("POST", `/v1/betaGroups/${g.id}/relationships/builds`, { data: [{ type: "builds", id: build.id }] });
    console.log("  added build");
  }
}
