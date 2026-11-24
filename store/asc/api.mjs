// Tiny App Store Connect API client. The private key is read from the NEVER_DELETE folder and never printed.
import { createSign, createPrivateKey } from "node:crypto";
import { readFileSync } from "node:fs";

const DIR = "C:/Users/inbal/Documents/NEVER_DELETE_APP_BUNDLE_KEY/Levain";
// The key ID lives next to the .p8 (outside the repo) so it never reaches the site's build output.
const KEY_ID = readFileSync(`${DIR}/asc-key-id.txt`, "utf8").trim();
const ISSUER = "9f015a66-1e48-465c-887c-71281f9992fa";
export const APP_ID = "6828526036";

function token() {
  const enc = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${enc({ alg: "ES256", kid: KEY_ID, typ: "JWT" })}.${enc({ iss: ISSUER, iat: now, exp: now + 1100, aud: "appstoreconnect-v1" })}`;
  const key = createPrivateKey(readFileSync(`${DIR}/AuthKey_${KEY_ID}.p8`, "utf8"));
  const sig = createSign("SHA256").update(unsigned).sign({ key, dsaEncoding: "ieee-p1363" });
  return `${unsigned}.${sig.toString("base64url")}`;
}

export async function api(method, path, body) {
  const url = path.startsWith("http") ? path : `https://api.appstoreconnect.apple.com${path}`;
  const res = await fetch(url, { method, headers: { Authorization: `Bearer ${token()}`, "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}: ${JSON.stringify(data.errors?.map((e) => ({ d: e.detail ?? e.title, m: e.meta })))}`);
  return data;
}

/** Upload a file through an App Store Connect upload reservation (screenshots, review images). */
export async function uploadParts(operations, buf) {
  for (const op of operations) {
    const part = buf.subarray(op.offset, op.offset + op.length);
    const res = await fetch(op.url, { method: op.method, headers: Object.fromEntries(op.requestHeaders.map((h) => [h.name, h.value])), body: part });
    if (!res.ok) throw new Error(`upload part → ${res.status}`);
  }
}
