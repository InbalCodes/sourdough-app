// Netlify serverless function — poll for OAuth result by token.
// Reads from Airtable PendingAuth table, returns result, deletes the record.

function airtableUrl(base, table, recordId) {
  var url = "https://api.airtable.com/v0/" + base + "/" + encodeURIComponent(table);
  if (recordId) url += "/" + recordId;
  return url;
}

exports.handler = async function (event) {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  var token = (event.queryStringParameters || {}).token;
  if (!token) {
    return { statusCode: 400, body: JSON.stringify({ error: "TOKEN_REQUIRED" }) };
  }

  var AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
  var AIRTABLE_BASE = process.env.AIRTABLE_BASE_ID;
  var TABLE = "PendingAuth";

  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE) {
    return { statusCode: 500, body: JSON.stringify({ error: "Server misconfigured" }) };
  }

  try {
    // Look up token
    var url = airtableUrl(AIRTABLE_BASE, TABLE) +
      "?filterByFormula=" + encodeURIComponent('{Token}="' + token.replace(/"/g, '\\"') + '"') +
      "&maxRecords=1";
    var res = await fetch(url, { headers: { Authorization: "Bearer " + AIRTABLE_TOKEN } });
    if (!res.ok) throw new Error("Airtable lookup failed");
    var data = await res.json();

    if (!data.records || data.records.length === 0) {
      // Not ready yet
      return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ pending: true })
      };
    }

    var rec = data.records[0];
    var email = rec.fields.Email || "";
    var name = rec.fields.Name || "";

    // Delete the record (one-time use)
    await fetch(airtableUrl(AIRTABLE_BASE, TABLE, rec.id), {
      method: "DELETE",
      headers: { Authorization: "Bearer " + AIRTABLE_TOKEN }
    }).catch(function () {});

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ success: true, email: email, name: name })
    };

  } catch (err) {
    console.error("Auth result error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "INTERNAL_ERROR" }) };
  }
};
