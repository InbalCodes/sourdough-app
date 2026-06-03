// Netlify serverless function — Google OAuth2 callback.
// Exchanges auth code for user info, upserts to Airtable, redirects back to app.

var NETLIFY_ORIGIN = "https://vocal-lolly-7ebc53.netlify.app";

/**
 * Return an HTML page that opens the native app via an Android Intent URL.
 * Intent URLs are the most reliable way to open an app from Chrome on modern Android.
 * The custom scheme URL is used as fallback for the manual tap link.
 */
function nativeRedirectPage(queryString) {
  // Android Intent URL — Chrome natively handles intent:// URIs
  var intentUrl = "intent://callback/" + queryString +
    "#Intent;scheme=com.inbal.levain;package=com.inbal.levain;end";
  var customSchemeUrl = "com.inbal.levain://callback/" + queryString;

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
    body: '<!DOCTYPE html><html><head><meta charset="utf-8">' +
      '<meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<style>body{font-family:-apple-system,sans-serif;display:flex;align-items:center;' +
      'justify-content:center;min-height:100vh;background:#FDFBF7;color:#2C3531;text-align:center;padding:24px}' +
      '.card{max-width:320px}.title{font-size:2rem;font-weight:300;letter-spacing:.1em;margin-bottom:16px}' +
      'p{font-size:.9rem;color:#6B7280;margin-bottom:24px}' +
      'a{display:block;padding:14px 24px;background:#2C3531;color:#FDFBF7;border-radius:12px;' +
      'text-decoration:none;font-weight:600;font-size:.95rem}</style></head>' +
      '<body><div class="card"><div class="title">Levain</div>' +
      '<p>Authentication complete</p>' +
      '<a href="' + customSchemeUrl + '">Tap to return to Levain</a>' +
      '<script>window.location.href="' + intentUrl + '";</script>' +
      '</div></body></html>'
  };
}

exports.handler = async function (event) {
  var params = event.queryStringParameters || {};
  var code = params.code;
  var state = params.state || "web"; // "native" or "web"
  var error = params.error;

  if (error || !code) {
    if (state === "native") {
      return nativeRedirectPage("?google_auth=cancel");
    }
    return { statusCode: 302, headers: { Location: NETLIFY_ORIGIN + "/" }, body: "" };
  }

  var GOOGLE_CLIENT_ID = "406720545379-6mcjpa3558e848eannfdltd4d9dljtot.apps.googleusercontent.com";
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
      if (state === "native") {
        return nativeRedirectPage("?google_auth=error");
      }
      return { statusCode: 302, headers: { Location: NETLIFY_ORIGIN + "/?google_auth=error" }, body: "" };
    }

    var tokens = await tokenRes.json();

    // 2. Get user info
    var userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: "Bearer " + tokens.access_token }
    });

    if (!userRes.ok) {
      console.error("User info fetch failed:", await userRes.text());
      if (state === "native") {
        return nativeRedirectPage("?google_auth=error");
      }
      return { statusCode: 302, headers: { Location: NETLIFY_ORIGIN + "/?google_auth=error" }, body: "" };
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

        var lookupUrl = baseUrl + "?filterByFormula=" +
          encodeURIComponent('{Email}="' + email.replace(/"/g, '\\"') + '"') + "&maxRecords=1";
        var lookupRes = await fetch(lookupUrl, { headers: { Authorization: "Bearer " + AIRTABLE_TOKEN } });
        var lookupData = await lookupRes.json();
        var existing = (lookupData.records && lookupData.records.length > 0) ? lookupData.records[0] : null;

        if (existing) {
          if (name && name !== (existing.fields.Name || "")) {
            await fetch(baseUrl + "/" + existing.id, {
              method: "PATCH", headers: headers,
              body: JSON.stringify({ fields: { Name: name } })
            });
          }
        } else {
          await fetch(baseUrl, {
            method: "POST", headers: headers,
            body: JSON.stringify({ fields: { Name: name, Email: email } })
          });
        }
      } catch (e) {
        console.warn("Airtable upsert failed (non-blocking):", e);
      }
    }

    // 4. Redirect back to app
    if (state === "native") {
      var qs = "?google_auth=1&email=" + encodeURIComponent(email) +
        "&name=" + encodeURIComponent(name);
      return nativeRedirectPage(qs);
    }

    var returnUrl = NETLIFY_ORIGIN + "/?google_auth=1" +
      "&email=" + encodeURIComponent(email) +
      "&name=" + encodeURIComponent(name);
    return { statusCode: 302, headers: { Location: returnUrl }, body: "" };

  } catch (err) {
    console.error("Google callback error:", err);
    if (state === "native") {
      return nativeRedirectPage("?google_auth=error");
    }
    return { statusCode: 302, headers: { Location: NETLIFY_ORIGIN + "/?google_auth=error" }, body: "" };
  }
};
