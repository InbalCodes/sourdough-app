// Netlify serverless function — Sign in with Apple (iOS app).
// POST { identityToken, authorizationCode, nonce, givenName?, familyName? }
// Verifies the token with Apple, upserts the user in Airtable (by email, like Google),
// stores Apple's refresh token for revoking on account deletion, and returns a session.

var createSession = require("../lib/session").createSession;
var apple = require("../lib/apple");

function airtableUrl(base, table, recordId) {
  var url = "https://api.airtable.com/v0/" + base + "/" + encodeURIComponent(table);
  if (recordId) url += "/" + recordId;
  return url;
}

function corsHeaders(event) {
  var origin = (event.headers && (event.headers.origin || event.headers.Origin)) || "*";
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Credentials": "true"
  };
}

/** Create or update the Users record. A missing AppleRefreshToken column must not break sign-in. */
async function upsertUser(base, token, email, name, refreshToken) {
  var headers = { Authorization: "Bearer " + token, "Content-Type": "application/json" };
  var lookup = await fetch(airtableUrl(base, "Users") + "?filterByFormula=" +
    encodeURIComponent('{Email}="' + email.replace(/"/g, '\\"') + '"') + "&maxRecords=1",
    { headers: headers });
  if (!lookup.ok) throw new Error("Airtable lookup failed: " + lookup.status);
  var existing = ((await lookup.json()).records || [])[0] || null;

  var fields = {};
  if (!existing) { fields.Email = email; fields.Name = name; }
  else if (name && !existing.fields.Name) fields.Name = name;
  if (refreshToken) fields.AppleRefreshToken = refreshToken;
  if (Object.keys(fields).length === 0) return existing.fields.Name || "";

  async function write(f) {
    return fetch(existing ? airtableUrl(base, "Users", existing.id) : airtableUrl(base, "Users"), {
      method: existing ? "PATCH" : "POST", headers: headers, body: JSON.stringify({ fields: f })
    });
  }
  var res = await write(fields);
  if (res.status === 422 && fields.AppleRefreshToken) {
    console.error("Airtable Users has no AppleRefreshToken column — Apple revoke on deletion will not work");
    delete fields.AppleRefreshToken;
    if (Object.keys(fields).length) res = await write(fields);
  }
  if (!res.ok && res.status !== 422) throw new Error("Airtable write failed: " + res.status);
  return (existing && existing.fields.Name) || name;
}

exports.handler = async function (event) {
  var CORS = corsHeaders(event);
  function respond(status, body) {
    return { statusCode: status, headers: CORS, body: JSON.stringify(body) };
  }

  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers: CORS, body: "" };
  if (event.httpMethod !== "POST") return respond(405, { error: "Method not allowed" });

  var AT = process.env.AIRTABLE_TOKEN;
  var AB = process.env.AIRTABLE_BASE_ID;
  if (!AT || !AB) return respond(500, { error: "Server misconfigured" });

  var body;
  try { body = JSON.parse(event.body || "{}"); }
  catch (e) { return respond(400, { error: "Invalid JSON" }); }
  if (!body.identityToken) return respond(400, { error: "TOKEN_REQUIRED" });

  var claims;
  try {
    claims = await apple.verifyIdentityToken(body.identityToken, body.nonce || "");
  } catch (e) {
    console.warn("Apple token rejected:", e.message);
    return respond(401, { error: "INVALID_TOKEN" });
  }

  var email = String(claims.email || "").toLowerCase();
  if (!email) return respond(400, { error: "APPLE_NO_EMAIL" });

  var name = [body.givenName, body.familyName].filter(Boolean).join(" ").slice(0, 100);

  try {
    // The refresh token lets the server revoke the Apple sign-in when the account is deleted.
    var refreshToken = "";
    if (body.authorizationCode) {
      try { refreshToken = await apple.exchangeCode(body.authorizationCode); }
      catch (e) { console.error(e.message); }
    }
    name = await upsertUser(AB, AT, email, name, refreshToken);
    return respond(200, { success: true, email: email, name: name || "", session: createSession(email, name || "") });
  } catch (err) {
    console.error("Apple sign-in error:", err);
    return respond(500, { error: "INTERNAL_ERROR" });
  }
};
