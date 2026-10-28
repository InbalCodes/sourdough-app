// Signed session tokens (HMAC-SHA256), issued after Google sign-in.
// Format: base64url(JSON payload) + "." + base64url(signature)
// Requires the SESSION_SECRET environment variable in Netlify.

var crypto = require("crypto");

var SESSION_DAYS = 180;

function getSecret() {
  var secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET is missing or shorter than 32 characters");
  }
  return secret;
}

function b64url(buf) {
  return Buffer.from(buf).toString("base64url");
}

function sign(data) {
  return b64url(crypto.createHmac("sha256", getSecret()).update(data).digest());
}

/** Create a session token for a verified Google email. */
function createSession(email, name) {
  var payload = {
    email: String(email || "").toLowerCase(),
    name: name || "",
    exp: Math.floor(Date.now() / 1000) + SESSION_DAYS * 24 * 60 * 60
  };
  var data = b64url(JSON.stringify(payload));
  return data + "." + sign(data);
}

/** Return the session payload if the token is valid and not expired, otherwise null. */
function verifySession(token) {
  if (typeof token !== "string") return null;
  var parts = token.split(".");
  if (parts.length !== 2) return null;

  var expected = Buffer.from(sign(parts[0]));
  var given = Buffer.from(parts[1]);
  if (expected.length !== given.length || !crypto.timingSafeEqual(expected, given)) return null;

  try {
    var payload = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8"));
    if (!payload.email || !payload.exp || payload.exp < Date.now() / 1000) return null;
    return payload;
  } catch (e) {
    return null;
  }
}

/** Read "Authorization: Bearer <token>" from a Netlify event and verify it. */
function sessionFromEvent(event) {
  var headers = event.headers || {};
  var auth = headers.authorization || headers.Authorization || "";
  var match = auth.match(/^Bearer\s+(.+)$/i);
  return match ? verifySession(match[1].trim()) : null;
}

module.exports = { createSession: createSession, verifySession: verifySession, sessionFromEvent: sessionFromEvent };
