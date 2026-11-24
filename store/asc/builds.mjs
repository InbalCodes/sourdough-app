import { api, APP_ID } from "./api.mjs";
const b = await api("GET", `/v1/builds?filter[app]=${APP_ID}&sort=-uploadedDate&limit=5&include=preReleaseVersion`);
for (const x of b.data) console.log(x.attributes.version, x.attributes.uploadedDate, x.attributes.processingState, x.relationships.preReleaseVersion.data?.id);
for (const p of b.included ?? []) console.log("pre", p.id, p.attributes.version);
