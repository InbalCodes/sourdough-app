// Netlify serverless function — Google OAuth2 callback.
// Exchanges auth code for user info, upserts to Airtable Users,
// stores result in PendingAuth for native polling, or redirects for web.

var NETLIFY_ORIGIN = "https://vocal-lolly-7ebc53.netlify.app";

function airtableUrl(base, table, recordId) {
  var url = "https://api.airtable.com/v0/" + base + "/" + encodeURIComponent(table);
  if (recordId) url += "/" + recordId;
  return url;
}

function airtableHeaders(token) {
  return { Authorization: "Bearer " + token, "Content-Type": "application/json" };
}

/** Show a styled page telling the user to return to the app */
function nativeDonePage(success) {
  var msg = success
    ? "Authentication complete — return to the Levain app."
    : "Authentication failed — return to the Levain app and try again.";
  return {
    statusCode: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
    body: '<!DOCTYPE html><html><head><meta charset="utf-8">' +
      '<meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<style>body{font-family:-apple-system,sans-serif;display:flex;align-items:center;' +
      'justify-content:center;min-height:100vh;background:#FDFBF7;color:#2C3531;text-align:center;padding:24px}' +
      '.card{max-width:320px}.title{font-size:2rem;font-weight:300;letter-spacing:.1em;margin-bottom:16px}' +
      'p{font-size:.95rem;color:#6B7280;line-height:1.6}</style></head>' +
      '<body><div class="card"><div class="title">Levain</div>' +
      '<p>' + msg + '</p>' +
      '<p style="margin-top:32px;font-size:2.5rem">👆</p>' +
      '<p style="font-size:1rem;font-weight:600;color:#2C3531">Switch back to Levain</p>' +
      '<p style="font-size:.8rem;color:#9CA3AF;margin-top:4px">You can close this tab</p>' +
      '</div></body></html>'
  };
}

exports.handler = async function (event) {
  var params = event.queryStringParameters || {};
  var code = params.code;
  var state = params.state || "web";
  var error = params.error;

  // Parse state: "web" or "native_TOKENXXX"
  var isNativeFlow = state.indexOf("native_") === 0;
  var authToken = isNativeFlow ? state.substring(7) : "";

  if (error || !code) {
    if (isNativeFlow) return nativeDonePage(false);
    return { statusCode: 302, headers: { Location: NETLIFY_ORIGIN + "/" }, body: "" };
  }

  var GOOGLE_CLIENT_ID = "406720545379-6mcjpa3558e848eannfdltd4d9dljtot.apps.googleusercontent.com";
  var GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  var AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
  var AIRTABLE_BASE = process.env.AIRTABLE_BASE_ID;
  var REDIRECT_URI = NETLIFY_ORIGIN + "/api/google-callback";

  if (!GOOGLE_CLIENT_SECRET) {
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
      if (isNativeFlow) return nativeDonePage(false);
      return { statusCode: 302, headers: { Location: NETLIFY_ORIGIN + "/?google_auth=error" }, body: "" };
    }

    var tokens = await tokenRes.json();

    // 2. Get user info
    var userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: "Bearer " + tokens.access_token }
    });

    if (!userRes.ok) {
      console.error("User info fetch failed:", await userRes.text());
      if (isNativeFlow) return nativeDonePage(false);
      return { statusCode: 302, headers: { Location: NETLIFY_ORIGIN + "/?google_auth=error" }, body: "" };
    }

    var userInfo = await userRes.json();
    var email = (userInfo.email || "").toLowerCase();
    var name = userInfo.name || "";

    // 3. Upsert to Airtable Users (best-effort)
    if (AIRTABLE_TOKEN && AIRTABLE_BASE && email) {
      try {
        var USERS_TABLE = "Users";
        var usersUrl = airtableUrl(AIRTABLE_BASE, USERS_TABLE);
        var headers = airtableHeaders(AIRTABLE_TOKEN);

        var lookupUrl = usersUrl + "?filterByFormula=" +
          encodeURIComponent('{Email}="' + email.replace(/"/g, '\\"') + '"') + "&maxRecords=1";
        var lookupRes = await fetch(lookupUrl, { headers: { Authorization: "Bearer " + AIRTABLE_TOKEN } });
        var lookupData = await lookupRes.json();
        var existing = (lookupData.records && lookupData.records.length > 0) ? lookupData.records[0] : null;

        if (existing) {
          if (name && name !== (existing.fields.Name || "")) {
            await fetch(usersUrl + "/" + existing.id, {
              method: "PATCH", headers: headers,
              body: JSON.stringify({ fields: { Name: name } })
            });
          }
        } else {
          await fetch(usersUrl, {
            method: "POST", headers: headers,
            body: JSON.stringify({ fields: { Name: name, Email: email } })
          });
        }
      } catch (e) {
        console.warn("Airtable Users upsert failed:", e);
      }
    }

    // 4a. Native flow: store in PendingAuth for polling + redirect via deep link
    if (isNativeFlow && authToken && AIRTABLE_TOKEN && AIRTABLE_BASE) {
      // Store for polling fallback
      try {
        await fetch(airtableUrl(AIRTABLE_BASE, "PendingAuth"), {
          method: "POST",
          headers: airtableHeaders(AIRTABLE_TOKEN),
          body: JSON.stringify({
            fields: { Token: authToken, Email: email, Name: name }
          })
        });
      } catch (e) {
        console.error("PendingAuth store failed:", e);
      }

      // Try deep link redirect — if appUrlOpen listener catches it, great.
      // If not, polling will pick it up.
      var deepLink = "com.inbal.levain://callback/?google_auth=1" +
        "&email=" + encodeURIComponent(email) +
        "&name=" + encodeURIComponent(name);
      return {
        statusCode: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
        body: '<!DOCTYPE html><html><head><meta charset="utf-8">' +
          '<meta name="viewport" content="width=device-width,initial-scale=1">' +
          '<style>body{font-family:-apple-system,sans-serif;display:flex;align-items:center;' +
          'justify-content:center;min-height:100vh;background:#FDFBF7;color:#2C3531;text-align:center;padding:24px}' +
          '.card{max-width:320px}.title{font-size:2rem;font-weight:300;letter-spacing:.1em;margin-bottom:16px}' +
          'p{font-size:.95rem;color:#6B7280;line-height:1.6}' +
          'a{display:block;margin-top:24px;padding:14px 24px;background:#2C3531;color:#FDFBF7;' +
          'border-radius:12px;text-decoration:none;font-weight:600;font-size:.95rem}</style></head>' +
          '<body><div class="card"><div class="title">Levain</div>' +
          '<p>Authentication complete</p>' +
          '<a href="' + deepLink + '">Tap to return to Levain</a></div>' +
          '<script>window.location.href="' + deepLink + '";</script>' +
          '</body></html>'
      };
    }

    // 4b. Web flow: redirect back with params
    var returnUrl = NETLIFY_ORIGIN + "/?google_auth=1" +
      "&email=" + encodeURIComponent(email) +
      "&name=" + encodeURIComponent(name);
    return { statusCode: 302, headers: { Location: returnUrl }, body: "" };

  } catch (err) {
    console.error("Google callback error:", err);
    if (isNativeFlow) return nativeDonePage(false);
    return { statusCode: 302, headers: { Location: NETLIFY_ORIGIN + "/?google_auth=error" }, body: "" };
  }
};
