// Sign in with Apple helpers: verify the identity token, exchange the
// authorization code for a refresh token, and revoke it on account deletion.
// Environment variables (Netlify): APPLE_TEAM_ID, APPLE_KEY_ID, APPLE_PRIVATE_KEY (.p8 contents),
// APPLE_BUNDLE_ID (defaults to com.inbal.levain).

var crypto = require("crypto");

var APPLE_ISSUER = "https://appleid.apple.com";
var KEYS_URL = "https://appleid.apple.com/auth/keys";

function bundleId() {
  return process.env.APPLE_BUNDLE_ID || "com.inbal.levain";
}

function b64urlJson(part) {
  return JSON.parse(Buffer.from(part, "base64url").toString("utf8"));
}

// Apple rotates its signing keys rarely; cache them for the life of the function instance.
var cachedKeys = null;
var cachedAt = 0;

async function appleKeys(forceRefresh) {
  if (!forceRefresh && cachedKeys && Date.now() - cachedAt < 6 * 60 * 60 * 1000) return cachedKeys;
  var res = await fetch(KEYS_URL);
  if (!res.ok) throw new Error("Apple keys fetch failed: " + res.status);
  cachedKeys = (await res.json()).keys || [];
  cachedAt = Date.now();
  return cachedKeys;
}

/**
 * Verify an Apple identity token (RS256 JWT). Returns its claims or throws.
 * expectedNonce: the nonce the app passed to Apple (optional).
 */
async function verifyIdentityToken(idToken, expectedNonce) {
  var parts = String(idToken || "").split(".");
  if (parts.length !== 3) throw new Error("Malformed identity token");

  var header = b64urlJson(parts[0]);
  var claims = b64urlJson(parts[1]);
  if (header.alg !== "RS256") throw new Error("Unexpected token algorithm");

  var keys = await appleKeys(false);
  var jwk = keys.find(function (k) { return k.kid === header.kid; });
  if (!jwk) {
    keys = await appleKeys(true);
    jwk = keys.find(function (k) { return k.kid === header.kid; });
  }
  if (!jwk) throw new Error("Unknown Apple signing key");

  var publicKey = crypto.createPublicKey({ key: jwk, format: "jwk" });
  var valid = crypto.verify(
    "RSA-SHA256",
    Buffer.from(parts[0] + "." + parts[1]),
    publicKey,
    Buffer.from(parts[2], "base64url")
  );
  if (!valid) throw new Error("Invalid identity token signature");

  var now = Math.floor(Date.now() / 1000);
  if (claims.iss !== APPLE_ISSUER) throw new Error("Wrong token issuer");
  if (claims.aud !== bundleId()) throw new Error("Wrong token audience");
  if (!claims.exp || claims.exp < now) throw new Error("Identity token expired");
  if (expectedNonce && claims.nonce !== expectedNonce) throw new Error("Nonce mismatch");
  if (!claims.sub) throw new Error("Identity token has no subject");
  return claims;
}

/** The client secret Apple expects: an ES256 JWT signed with the .p8 key, valid for 5 minutes. */
function clientSecret() {
  var teamId = process.env.APPLE_TEAM_ID;
  var keyId = process.env.APPLE_KEY_ID;
  var privateKey = (process.env.APPLE_PRIVATE_KEY || "").replace(/\\n/g, "\n");
  if (!teamId || !keyId || !privateKey) throw new Error("Apple key environment variables are missing");

  var now = Math.floor(Date.now() / 1000);
  var header = Buffer.from(JSON.stringify({ alg: "ES256", kid: keyId })).toString("base64url");
  var payload = Buffer.from(JSON.stringify({
    iss: teamId, iat: now, exp: now + 300, aud: APPLE_ISSUER, sub: bundleId()
  })).toString("base64url");
  var signature = crypto.sign("sha256", Buffer.from(header + "." + payload), {
    key: privateKey, dsaEncoding: "ieee-p1363"
  }).toString("base64url");
  return header + "." + payload + "." + signature;
}

function form(obj) {
  return Object.keys(obj).map(function (k) {
    return encodeURIComponent(k) + "=" + encodeURIComponent(obj[k]);
  }).join("&");
}

/** Exchange a one-time authorization code for a refresh token (needed later to revoke). */
async function exchangeCode(code) {
  var res = await fetch(APPLE_ISSUER + "/auth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form({ client_id: bundleId(), client_secret: clientSecret(), code: code, grant_type: "authorization_code" })
  });
  if (!res.ok) throw new Error("Apple code exchange failed: " + res.status + " " + (await res.text()));
  var data = await res.json();
  return data.refresh_token || "";
}

/** Revoke a refresh token, which signs the user out of Levain in their Apple ID settings. */
async function revokeToken(refreshToken) {
  var res = await fetch(APPLE_ISSUER + "/auth/revoke", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form({
      client_id: bundleId(), client_secret: clientSecret(),
      token: refreshToken, token_type_hint: "refresh_token"
    })
  });
  if (!res.ok) throw new Error("Apple revoke failed: " + res.status + " " + (await res.text()));
}

module.exports = {
  verifyIdentityToken: verifyIdentityToken,
  exchangeCode: exchangeCode,
  revokeToken: revokeToken
};
