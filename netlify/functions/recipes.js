// Netlify serverless function — CRUD for user recipes stored in Airtable.
// Actions: "list", "save", "delete"

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

function corsHeaders(event) {
  var origin = (event.headers && (event.headers.origin || event.headers.Origin)) || "*";
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Credentials": "true"
  };
}

var _evt;
function respond(statusCode, body) {
  return { statusCode: statusCode, headers: corsHeaders(_evt), body: JSON.stringify(body) };
}

exports.handler = async function (event) {
  _evt = event;
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders(event), body: "" };
  }
  if (event.httpMethod !== "POST") {
    return respond(405, { error: "Method not allowed" });
  }

  var AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
  var AIRTABLE_BASE = process.env.AIRTABLE_BASE_ID;
  var TABLE_NAME = "Recipes";

  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE) {
    return respond(500, { error: "Server misconfigured" });
  }

  var body;
  try { body = JSON.parse(event.body); }
  catch (e) { return respond(400, { error: "Invalid JSON" }); }

  var action = body.action;
  var userEmail = (body.userEmail || "").trim().toLowerCase();

  if (!userEmail) {
    return respond(400, { error: "EMAIL_REQUIRED" });
  }

  try {

    // ========================
    // LIST — get all recipes for a user
    // ========================
    if (action === "list") {
      var url = airtableUrl(AIRTABLE_BASE, TABLE_NAME) +
        "?filterByFormula=" + encodeURIComponent('{UserEmail}="' + userEmail.replace(/"/g, '\\"') + '"');

      var res = await fetch(url, { headers: { Authorization: "Bearer " + AIRTABLE_TOKEN } });
      if (!res.ok) throw new Error("Airtable list failed");
      var data = await res.json();

      var recipes = (data.records || []).map(function (rec) {
        return {
          id: rec.id,
          name: rec.fields.Name || "",
          flour: Number(rec.fields.Flour) || 500,
          hydration: Number(rec.fields.Hydration) || 70,
          salt: Number(rec.fields.Salt) || 2,
          starter: Number(rec.fields.Starter) || 20,
        };
      });

      return respond(200, { success: true, recipes: recipes });
    }

    // ========================
    // SAVE — create a new recipe
    // ========================
    if (action === "save") {
      var recipe = body.recipe;
      if (!recipe || !recipe.name) {
        return respond(400, { error: "RECIPE_NAME_REQUIRED" });
      }

      var createRes = await fetch(airtableUrl(AIRTABLE_BASE, TABLE_NAME), {
        method: "POST",
        headers: airtableHeaders(AIRTABLE_TOKEN),
        body: JSON.stringify({
          fields: {
            Name: recipe.name,
            Flour: recipe.flour || 500,
            Hydration: recipe.hydration || 70,
            Salt: recipe.salt || 2,
            Starter: recipe.starter || 20,
            UserEmail: userEmail,
          }
        })
      });

      if (!createRes.ok) {
        console.error("Airtable create error:", await createRes.text());
        return respond(502, { error: "SAVE_FAILED" });
      }

      var created = await createRes.json();
      return respond(200, {
        success: true,
        recipe: {
          id: created.id,
          name: recipe.name,
          flour: recipe.flour,
          hydration: recipe.hydration,
          salt: recipe.salt,
          starter: recipe.starter,
        }
      });
    }

    // ========================
    // DELETE — remove a recipe by Airtable record ID
    // ========================
    if (action === "delete") {
      var recordId = body.recordId;
      if (!recordId) {
        return respond(400, { error: "RECORD_ID_REQUIRED" });
      }

      // Verify the record belongs to this user before deleting
      var checkRes = await fetch(airtableUrl(AIRTABLE_BASE, TABLE_NAME, recordId), {
        headers: { Authorization: "Bearer " + AIRTABLE_TOKEN }
      });
      if (!checkRes.ok) {
        return respond(404, { error: "RECIPE_NOT_FOUND" });
      }
      var checkData = await checkRes.json();
      if ((checkData.fields.UserEmail || "").toLowerCase() !== userEmail) {
        return respond(403, { error: "NOT_YOUR_RECIPE" });
      }

      var delRes = await fetch(airtableUrl(AIRTABLE_BASE, TABLE_NAME, recordId), {
        method: "DELETE",
        headers: { Authorization: "Bearer " + AIRTABLE_TOKEN }
      });
      if (!delRes.ok) {
        return respond(502, { error: "DELETE_FAILED" });
      }

      return respond(200, { success: true });
    }

    return respond(400, { error: "INVALID_ACTION" });

  } catch (err) {
    console.error("Recipes error:", err);
    return respond(500, { error: "INTERNAL_ERROR" });
  }
};
