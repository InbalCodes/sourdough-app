// Netlify serverless function — handles Sign Up and Log In.
// Passwords are hashed with scrypt before storing in Airtable.
// The Airtable token lives only here, never sent to the browser.

var crypto = require("crypto");

// --- Password hashing helpers (scrypt, Node.js built-in) ---

function hashPassword(plain) {
  return new Promise(function (resolve, reject) {
    var salt = crypto.randomBytes(16).toString("hex");
    crypto.scrypt(plain, salt, 64, function (err, derived) {
      if (err) return reject(err);
      resolve(salt + ":" + derived.toString("hex"));
    });
  });
}

function verifyPassword(plain, stored) {
  return new Promise(function (resolve, reject) {
    var parts = stored.split(":");
    if (parts.length !== 2) return resolve(false);
    var salt = parts[0];
    var hash = parts[1];
    crypto.scrypt(plain, salt, 64, function (err, derived) {
      if (err) return reject(err);
      resolve(derived.toString("hex") === hash);
    });
  });
}

// --- Airtable helpers ---

function airtableUrl(base, table, recordId) {
  var url = "https://api.airtable.com/v0/" + base + "/" + encodeURIComponent(table);
  if (recordId) url += "/" + recordId;
  return url;
}

function airtableHeaders(token) {
  return {
    Authorization: "Bearer " + token,
    "Content-Type": "application/json"
  };
}

async function findUserByEmail(base, token, table, email) {
  var url = airtableUrl(base, table) +
    "?filterByFormula=" + encodeURIComponent('{Email}="' + email.replace(/"/g, '\\"') + '"') +
    "&maxRecords=1";
  var res = await fetch(url, { headers: { Authorization: "Bearer " + token } });
  if (!res.ok) throw new Error("Airtable lookup failed");
  var data = await res.json();
  return (data.records && data.records.length > 0) ? data.records[0] : null;
}

// --- Main handler ---

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  var AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
  var AIRTABLE_BASE = process.env.AIRTABLE_BASE_ID;
  var TABLE_NAME = "Users";

  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE) {
    return { statusCode: 500, body: JSON.stringify({ error: "Server misconfigured" }) };
  }

  var body;
  try { body = JSON.parse(event.body); }
  catch (e) { return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) }; }

  var action = body.action; // "signup" or "login"
  var email = (body.email || "").trim().toLowerCase();
  var password = body.password || "";
  var name = (body.name || "").trim();

  if (!email || !password) {
    return { statusCode: 400, body: JSON.stringify({ error: "EMAIL_PASSWORD_REQUIRED" }) };
  }

  if (password.length < 6) {
    return { statusCode: 400, body: JSON.stringify({ error: "PASSWORD_TOO_SHORT" }) };
  }

  try {
    var existing = await findUserByEmail(AIRTABLE_BASE, AIRTABLE_TOKEN, TABLE_NAME, email);

    // ========================
    // SIGN UP
    // ========================
    if (action === "signup") {
      if (!name) {
        return { statusCode: 400, body: JSON.stringify({ error: "NAME_REQUIRED" }) };
      }

      if (existing) {
        return { statusCode: 409, body: JSON.stringify({ error: "EMAIL_EXISTS" }) };
      }

      var hashed = await hashPassword(password);

      var createRes = await fetch(airtableUrl(AIRTABLE_BASE, TABLE_NAME), {
        method: "POST",
        headers: airtableHeaders(AIRTABLE_TOKEN),
        body: JSON.stringify({
          fields: { Name: name, Email: email, Password: hashed }
        })
      });

      if (!createRes.ok) {
        console.error("Airtable create error:", await createRes.text());
        return { statusCode: 502, body: JSON.stringify({ error: "SIGNUP_FAILED" }) };
      }

      var created = await createRes.json();
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          userId: created.id,
          email: email,
          name: name
        })
      };
    }

    // ========================
    // LOG IN
    // ========================
    if (action === "login") {
      if (!existing) {
        return { statusCode: 401, body: JSON.stringify({ error: "USER_NOT_FOUND" }) };
      }

      var storedHash = existing.fields.Password;
      if (!storedHash) {
        return { statusCode: 401, body: JSON.stringify({ error: "WRONG_PASSWORD" }) };
      }

      var valid = await verifyPassword(password, storedHash);
      if (!valid) {
        return { statusCode: 401, body: JSON.stringify({ error: "WRONG_PASSWORD" }) };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          userId: existing.id,
          email: existing.fields.Email,
          name: existing.fields.Name || ""
        })
      };
    }

    // ========================
    // FORGOT PASSWORD (mock)
    // ========================
    if (action === "forgot") {
      if (!existing) {
        return { statusCode: 401, body: JSON.stringify({ error: "USER_NOT_FOUND" }) };
      }
      // TODO: integrate SMTP provider to send actual reset email
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: "RESET_SENT" })
      };
    }

    return { statusCode: 400, body: JSON.stringify({ error: "INVALID_ACTION" }) };

  } catch (err) {
    console.error("Proxy error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "INTERNAL_ERROR" }) };
  }
};
