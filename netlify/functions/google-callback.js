// Netlify serverless function — Google OAuth2 callback.
// Exchanges auth code for user info, upserts to Airtable, redirects back to app.

var NETLIFY_ORIGIN = "https://vocal-lolly-7ebc53.netlify.app";

exports.handler = async function (event) {
  var params = event.queryStringParameters || {};
  var code = params.code;
  var state = params.state || "web"; // "native" or "web"
  var error = params.error;

  if (error || !code) {
    // User cancelled or error occurred — redirect back to login
    var cancelUrl = state === "native" ? "https://localhost/" : NETLIFY_ORIGIN + "/";
    return { statusCode: 302, headers: { Location: cancelUrl }, body: "" };
  }

  var GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  var GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  var AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
  var AIRTABLE_BASE = process.env.AIRTABLE_BASE_ID;
  var REDIRECT_URI = NETLIFY_ORIGIN + "/api/google-callback";

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    return { statusCode: 500, body: "Google OAuth not configured" };
  }

  try {
    // 1. Exchange auth code for tokens
    var tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "code=" + encodeURIComponent(code) +
        "&client_id=" + encodeURIComponent(GOOGLE_CLIENT_ID) +
        "&client_secret=" + encodeURIComponent(GOOGLE_CLIENT_SECRET) +
        "&redirect_uri=" + encodeURIComponent(REDIRECT_URI) +
        "&grant_type=authorization_code"
    });

    if (!tokenRes.ok) {
      console.error("Token exchange failed:", await tokenRes.text());
      var errUrl = state === "native" ? "https://localhost/" : NETLIFY_ORIGIN + "/";
      return { statusCode: 302, headers: { Location: errUrl + "?google_auth=error" }, body: "" };
    }

    var tokens = await tokenRes.json();

    // 2. Get user info
    var userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: "Bearer " + tokens.access_token }
    });

    if (!userRes.ok) {
      console.error("User info fetch failed:", await userRes.text());
      var errUrl2 = state === "native" ? "https://localhost/" : NETLIFY_ORIGIN + "/";
      return { statusCode: 302, headers: { Location: errUrl2 + "?google_auth=error" }, body: "" };
    }

    var userInfo = await userRes.json();
    var email = (userInfo.email || "").toLowerCase();
    var name = userInfo.name || "";

    // 3. Upsert to Airtable (best-effort)
    if (AIRTABLE_TOKEN && AIRTABLE_BASE && email) {
      try {
        var TABLE = "Users";
        var baseUrl = "https://api.airtable.com/v0/" + AIRTABLE_BASE + "/" + encodeURIComponent(TABLE);
        var headers = { Authorization: "Bearer " + AIRTABLE_TOKEN, "Content-Type": "application/json" };

        // Check if user exists
        var lookupUrl = baseUrl + "?filterByFormula=" +
          encodeURIComponent('{Email}="' + email.replace(/"/g, '\\"') + '"') + "&maxRecords=1";
        var lookupRes = await fetch(lookupUrl, { headers: { Authorization: "Bearer " + AIRTABLE_TOKEN } });
        var lookupData = await lookupRes.json();
        var existing = (lookupData.records && lookupData.records.length > 0) ? lookupData.records[0] : null;

        if (existing) {
          // Update name if changed
          if (name && name !== (existing.fields.Name || "")) {
            await fetch(baseUrl + "/" + existing.id, {
              method: "PATCH", headers: headers,
              body: JSON.stringify({ fields: { Name: name } })
            });
          }
        } else {
          // Create new user
          await fetch(baseUrl, {
            method: "POST", headers: headers,
            body: JSON.stringify({ fields: { Name: name, Email: email } })
          });
        }
      } catch (e) {
        console.warn("Airtable upsert failed (non-blocking):", e);
      }
    }

    // 4. Redirect back to app with user info
    var returnBase = state === "native" ? "https://localhost/" : NETLIFY_ORIGIN + "/";
    var returnUrl = returnBase + "?google_auth=1" +
      "&email=" + encodeURIComponent(email) +
      "&name=" + encodeURIComponent(name);

    return { statusCode: 302, headers: { Location: returnUrl }, body: "" };

  } catch (err) {
    console.error("Google callback error:", err);
    var errUrl3 = state === "native" ? "https://localhost/" : NETLIFY_ORIGIN + "/";
    return { statusCode: 302, headers: { Location: errUrl3 + "?google_auth=error" }, body: "" };
  }
};
