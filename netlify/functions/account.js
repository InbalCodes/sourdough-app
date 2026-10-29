// Netlify serverless function — account management.
// POST { action: "delete" } with Authorization: Bearer <session>
// Permanently deletes the user's recipes, user record and pending sign-ins.

var sessionFromEvent = require("../lib/session").sessionFromEvent;
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
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true"
  };
}

/** Return the IDs of every record in `table` whose `field` equals `value` (follows pagination). */
async function findRecordIds(base, token, table, field, value) {
  var ids = [];
  var offset = "";
  do {
    var url = airtableUrl(base, table) +
      "?filterByFormula=" + encodeURIComponent("{" + field + '}="' + value.replace(/"/g, '\\"') + '"') +
      "&fields%5B%5D=" + encodeURIComponent(field) +
      (offset ? "&offset=" + encodeURIComponent(offset) : "");
    var res = await fetch(url, { headers: { Authorization: "Bearer " + token } });
    if (!res.ok) throw new Error("Airtable lookup failed for " + table + ": " + res.status);
    var data = await res.json();
    (data.records || []).forEach(function (r) { ids.push(r.id); });
    offset = data.offset || "";
  } while (offset);
  return ids;
}

/** Revoke the Apple sign-in of every Users record with this email (Apple requires it on deletion). */
async function revokeAppleTokens(base, token, email) {
  var url = airtableUrl(base, "Users") + "?filterByFormula=" +
    encodeURIComponent('{Email}="' + email.replace(/"/g, '\\"') + '"');
  var res = await fetch(url, { headers: { Authorization: "Bearer " + token } });
  if (!res.ok) throw new Error("Airtable lookup failed for Users: " + res.status);
  var records = (await res.json()).records || [];
  for (var i = 0; i < records.length; i++) {
    var refreshToken = records[i].fields.AppleRefreshToken;
    if (refreshToken) await apple.revokeToken(refreshToken);
  }
}

/** Delete records in batches of 10 (Airtable's limit per request). */
async function deleteRecords(base, token, table, ids) {
  for (var i = 0; i < ids.length; i += 10) {
    var qs = ids.slice(i, i + 10).map(function (id) { return "records%5B%5D=" + id; }).join("&");
    var res = await fetch(airtableUrl(base, table) + "?" + qs, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token }
    });
    if (!res.ok) throw new Error("Airtable delete failed for " + table + ": " + res.status);
  }
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

  var session;
  try { session = sessionFromEvent(event); }
  catch (e) { console.error(e.message); return respond(500, { error: "Server misconfigured" }); }
  if (!session) return respond(401, { error: "UNAUTHORIZED" });

  var body;
  try { body = JSON.parse(event.body || "{}"); }
  catch (e) { return respond(400, { error: "Invalid JSON" }); }

  if (body.action !== "delete") return respond(400, { error: "INVALID_ACTION" });

  try {
    var email = session.email;
    // Best-effort: a failed revoke is logged but must not block deleting the user's data.
    try { await revokeAppleTokens(AB, AT, email); }
    catch (e) { console.error("Apple revoke error:", e.message); }
    await deleteRecords(AB, AT, "Recipes", await findRecordIds(AB, AT, "Recipes", "UserEmail", email));
    await deleteRecords(AB, AT, "PendingAuth", await findRecordIds(AB, AT, "PendingAuth", "Email", email));
    await deleteRecords(AB, AT, "Users", await findRecordIds(AB, AT, "Users", "Email", email));
    return respond(200, { success: true });
  } catch (err) {
    console.error("Account delete error:", err);
    return respond(500, { error: "DELETE_FAILED" });
  }
};
