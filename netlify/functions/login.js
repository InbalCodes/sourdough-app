// Netlify serverless function — keeps Airtable token private.
// The token is read from an environment variable set in the Netlify dashboard,
// never exposed to the browser.

exports.handler = async function (event) {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  var AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
  var AIRTABLE_BASE = process.env.AIRTABLE_BASE_ID;
  var TABLE_NAME = "Users";

  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE) {
    return { statusCode: 500, body: JSON.stringify({ error: "Server misconfigured — missing environment variables" }) };
  }

  var body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  var email = (body.email || "").trim();
  var name = (body.name || "").trim();

  if (!email || !name) {
    return { statusCode: 400, body: JSON.stringify({ error: "Email and name are required" }) };
  }

  try {
    // First, check if this email already exists in the table
    var searchUrl =
      "https://api.airtable.com/v0/" + AIRTABLE_BASE + "/" + encodeURIComponent(TABLE_NAME) +
      "?filterByFormula=" + encodeURIComponent('{Email}="' + email.replace(/"/g, '\\"') + '"') +
      "&maxRecords=1";

    var searchRes = await fetch(searchUrl, {
      headers: { Authorization: "Bearer " + AIRTABLE_TOKEN }
    });

    if (!searchRes.ok) {
      var errText = await searchRes.text();
      console.error("Airtable search error:", errText);
      return { statusCode: 502, body: JSON.stringify({ error: "Airtable lookup failed" }) };
    }

    var searchData = await searchRes.json();

    // If user exists, update name (in case it changed) and return
    if (searchData.records && searchData.records.length > 0) {
      var existingRecord = searchData.records[0];
      var updateRes = await fetch(
        "https://api.airtable.com/v0/" + AIRTABLE_BASE + "/" + encodeURIComponent(TABLE_NAME) + "/" + existingRecord.id,
        {
          method: "PATCH",
          headers: {
            Authorization: "Bearer " + AIRTABLE_TOKEN,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            fields: { Name: name }
          })
        }
      );

      if (!updateRes.ok) {
        console.error("Airtable update error:", await updateRes.text());
      }

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          userId: existingRecord.id,
          email: existingRecord.fields.Email,
          name: name,
          returning: true
        })
      };
    }

    // New user — create record
    var createRes = await fetch(
      "https://api.airtable.com/v0/" + AIRTABLE_BASE + "/" + encodeURIComponent(TABLE_NAME),
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + AIRTABLE_TOKEN,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fields: { Name: name, Email: email }
        })
      }
    );

    if (!createRes.ok) {
      var createErr = await createRes.text();
      console.error("Airtable create error:", createErr);
      return { statusCode: 502, body: JSON.stringify({ error: "Failed to save user" }) };
    }

    var created = await createRes.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        userId: created.id,
        email: email,
        name: name,
        returning: false
      })
    };
  } catch (err) {
    console.error("Proxy error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "Internal server error" }) };
  }
};
