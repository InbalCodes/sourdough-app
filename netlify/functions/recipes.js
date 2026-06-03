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

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  var AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
  var AIRTABLE_BASE = process.env.AIRTABLE_BASE_ID;
  var TABLE_NAME = "Recipes";

  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE) {
    return { statusCode: 500, body: JSON.stringify({ error: "Server misconfigured" }) };
  }

  var body;
  try { body = JSON.parse(event.body); }
  catch (e) { return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) }; }

  var action = body.action;
  var userEmail = (body.userEmail || "").trim().toLowerCase();

  if (!userEmail) {
    return { statusCode: 400, body: JSON.stringify({ error: "EMAIL_REQUIRED" }) };
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

      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, recipes: recipes })
      };
    }

    // ========================
    // SAVE — create a new recipe
    // ========================
    if (action === "save") {
      var recipe = body.recipe;
      if (!recipe || !recipe.name) {
        return { statusCode: 400, body: JSON.stringify({ error: "RECIPE_NAME_REQUIRED" }) };
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
        return { statusCode: 502, body: JSON.stringify({ error: "SAVE_FAILED" }) };
      }

      var created = await createRes.json();
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          recipe: {
            id: created.id,
            name: recipe.name,
            flour: recipe.flour,
            hydration: recipe.hydration,
            salt: recipe.salt,
            starter: recipe.starter,
          }
        })
      };
    }

    // ========================
    // DELETE — remove a recipe by Airtable record ID
    // ========================
    if (action === "delete") {
      var recordId = body.recordId;
      if (!recordId) {
        return { statusCode: 400, body: JSON.stringify({ error: "RECORD_ID_REQUIRED" }) };
      }

      // Verify the record belongs to this user before deleting
      var checkRes = await fetch(airtableUrl(AIRTABLE_BASE, TABLE_NAME, recordId), {
        headers: { Authorization: "Bearer " + AIRTABLE_TOKEN }
      });
      if (!checkRes.ok) {
        return { statusCode: 404, body: JSON.stringify({ error: "RECIPE_NOT_FOUND" }) };
      }
      var checkData = await checkRes.json();
      if ((checkData.fields.UserEmail || "").toLowerCase() !== userEmail) {
        return { statusCode: 403, body: JSON.stringify({ error: "NOT_YOUR_RECIPE" }) };
      }

      var delRes = await fetch(airtableUrl(AIRTABLE_BASE, TABLE_NAME, recordId), {
        method: "DELETE",
        headers: { Authorization: "Bearer " + AIRTABLE_TOKEN }
      });
      if (!delRes.ok) {
        return { statusCode: 502, body: JSON.stringify({ error: "DELETE_FAILED" }) };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ success: true })
      };
    }

    return { statusCode: 400, body: JSON.stringify({ error: "INVALID_ACTION" }) };

  } catch (err) {
    console.error("Recipes error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "INTERNAL_ERROR" }) };
  }
};
