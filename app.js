(function () {
  "use strict";

  // =========================================
  // Storage Keys
  // =========================================

  var SK = {
    userEmail: "levain_user_email",
    userName: "levain_user_name",
    language: "levain_language",
    lastFed: "levain_last_fed",
    calcRatio: "levain_calc_ratio",
    calcTare: "levain_calc_tare",
    calcLoaves: "levain_calc_loaves",
    calcBreadWeight: "levain_calc_bread_weight",
    bakeState: "levain_bake_state",
    recipes: "levain_recipes",
  };

  // =========================================
  // Translations
  // =========================================

  var T = {
    he: {
      // Auth
      loginSubtitle: "העוזר האישי שלך לאפייה שקטה",
      authLoginTitle: "התחברות",
      authSignupTitle: "הרשמה",
      emailLabel: "אימייל",
      emailPlaceholder: "you@example.com",
      passwordLabel: "סיסמה",
      passwordPlaceholder: "6 תווים לפחות",
      nameLabel: "שם אופה",
      namePlaceholder: "השם שלך",
      authLoginBtn: "התחבר",
      authSignupBtn: "הרשם",
      authLoginLoading: "מתחבר...",
      authSignupLoading: "נרשם...",
      authToggleToSignup: "אין לך חשבון?",
      authToggleToSignupBtn: "הרשם כאן",
      authToggleToLogin: "כבר יש לך חשבון?",
      authToggleToLoginBtn: "התחבר כאן",

      // Auth errors
      errEmailPasswordRequired: "נא למלא אימייל וסיסמה",
      errPasswordTooShort: "הסיסמה חייבת להכיל לפחות 6 תווים",
      errNameRequired: "נא למלא שם",
      errEmailExists: "האימייל הזה כבר רשום. נסו להתחבר.",
      errUserNotFound: "לא נמצא משתמש עם אימייל זה",
      errWrongPassword: "סיסמה שגויה",
      errGeneric: "משהו השתבש. נסו שנית.",

      // Lang toggle
      langToggle: "EN",

      // Tabs
      tabStarter: "רענון ותחזוקה",
      tabBake: "מעקב אפייה ולו״זים",
      subRoutine: "האכלה שוטפת",
      subCalc: "מחשבון לאפייה",

      // Routine feed
      routineTitle: "האכלה שוטפת",
      routineSubtitle: "פעם ב-3 ימים",
      routineInstruction: 'נשאיר <strong>30 גרם</strong> מחמצת, נאכיל ב-<strong>60 גרם קמח</strong> ו-<strong>60 גרם מים</strong>. נמתין 2-4 שעות לתחילת פעילות ונחזיר למקרר.',
      noFeedYet: "טרם בוצעה האכלה",
      lastFeedAt: "האכלה אחרונה: ",
      fedBtn: "האכלתי!",

      // Calculator
      calcTitle: "מחשבון האכלה לפני אפייה",
      calcSubtitle: "נוסחת הסדנה",
      loafCountLabel: "כמות לחמים מתוכננת",
      breadWeightLabel: "משקל מחמצת לכל לחם (גרם)",
      breadWeightPlaceholder: "100",
      targetWeightLabel: "משקל יעד כולל (גרם)",
      targetHint: "חישוב: כמות לחמים × משקל לכל לחם + 100 לשארית",
      ratioLabel: "יחס האכלה מבוקש",
      ratioCustom: "מותאם אישית",
      customStarter: "מחמצת",
      customFlour: "קמח",
      customWater: "מים",
      tareLabel: "משקל קופסה ריקה - טרה",
      optional: "אופציונלי",
      tarePlaceholder: "גרם",
      calcResult: 'קח <strong>{starter}</strong> גרם מחמצת, תאכיל ב-<strong>{flour}</strong> גרם קמח ו-<strong>{water}</strong> גרם מים.',
      calcTotalResult: 'משקל כולל על המשקל (עם הקופסה): <strong>{total}</strong> גרם.',

      // Lifestyle
      lifestyleTitle: "בחירת סגנון לו״ז",
      lifestyleSubtitle: "בחרו את הלו״ז שמתאים ליום שלכם",
      schedWorkerName: "לו״ז שכיר",
      schedWorkerDesc: "מאכיל בבוקר, עובד אחה״צ, מקרר בלילה, אופה מחר",
      schedThursdayName: "לו״ז חמישי בלילה",
      schedThursdayDesc: "מאכיל בלילה, עובד בבוקר-צהריים, מקרר ואופה בלילה/מחר בבוקר",
      schedTechieName: "לו״ז הייטקיסט",
      schedTechieDesc: "מאכיל בבוקר ביחס נמוך, עובד צהריים עד ערב, אופה בלילה/מחר",

      // Bake workflow
      bakeTracker: "מעקב אפייה",
      resetBtn: "אפס",
      startLabel: "התחלה: ",
      greeting: "שלום, ",

      // Steps
      stepLevain: "האכלת מחמצת לאפייה",
      stepLevainDesc: "להשאיר בחוץ {h} שעות. השתמשו במחשבון בטאב הראשון.",
      stepAutolyse: "אוטוליזה / פרמנטוליזה",
      stepAutolyseDesc: "{m} דקות (ברירת מחדל). ניתן להפעיל במקביל לשעה האחרונה של תפיחת המחמצת.",
      stepBulk: "לישה + תחילת באלק",
      stepBulkDesc: "סך הכל הבאלק ייקח 3-6 שעות. לאחר הלישה יתחילו קיפולים.",
      stepPreshape: "עיצוב ראשוני",
      stepPreshapeDesc: "הוצאה מהקערה, חלוקה לפי מספר הלחמים, כדרור. מנוחה על השיש 10-15 דקות.",
      stepFinalShape: "עיצוב סופי",
      stepFinalShapeDesc: "העברה לסלסילת התפחה + עטיפה בניילון.",
      stepCold: "התפחה במקרר",
      stepColdDesc: "התפחה איטית של 6 עד 24 שעות.",
      stepOvenActive: "🔥 לחמם תנור ל-250 מעלות!",
      stepOvenActiveDesc: "שעה לפני סיום ההתפחה במקרר.",
      stepOvenWaiting: "🔥 תזכורת חימום תנור",
      stepOvenWaitingDesc: "יופעל שעה לפני סיום ההתפחה במקרר: לחמם תנור ל-250 מעלות!",
      stepScoreBake: "חריצה ואפייה",
      stepScoreBakeDesc: "חרצו את הבצק והכניסו לתנור.",

      // Sub-steps & buttons
      btnStartAutolyse: "התחל אוטוליזה במקביל",
      btnStartBulk: "התחל באלק + טיימר קיפולים",
      btnPreshapeTimer: "התחל טיימר מנוחה (10-15 דק׳)",
      btnStartCold: "התחל התפחה במקרר",
      btnStartVolume: "התחל מעקב התפחה",
      btnAddFold4: "+ הוסף קיפול רביעי (אם יש צורך)",

      fold1: "קיפול ראשון",
      fold1Desc: "30 דקות מתחילת הבאלק",
      fold2: "קיפול שני",
      fold2Desc: "45 דקות מהקודם",
      fold3: "קיפול שלישי",
      fold3Desc: "45 דקות מהקודם",
      fold4: "קיפול רביעי",
      fold4Desc: "שעה מהקודם (אם יש צורך)",

      volumeCheck: "התפחה עד לנפח הרצוי",
      volumeCheckDesc: "1-3 שעות נוספות. לבדוק סימון נפח על הקופסה.",
      volumeReminder: "תזכורת: לבדוק סימון נפח על הקופסה",

      coldHoursLabel: "משך (שעות):",
      coldEndEstimate: "סיום משוער: ",
      coldReady: "המקרר מוכן!",
      coldRemaining: "נותרו ",

      parallel: "במקביל",
      elapsed: "⏱ ",
      upcoming: "בעוד ",

      resetBakeBtn: "איפוס וסיום אפייה",
      resetBakeConfirm: "לאפס את כל מעקב האפייה ולהתחיל מחדש?",

      // Recipe Book
      tabRecipes: "ספר המתכונים",
      bpCalcTitle: "מחשבון אחוזי אופה",
      bpCalcSubtitle: "חישוב משקלים לפי אחוזי אופה",
      bpRecipeName: "שם המתכון",
      bpRecipeNamePh: "למשל: לחם כוסמין ביתי",
      bpFlourLabel: "סך הקמח הכולל (גרם)",
      bpHydrationLabel: "אחוז הידרציה / מים (%)",
      bpSaltLabel: "אחוז מלח (%)",
      bpStarterLabel: "אחוז מחמצת (%)",
      bpResultTitle: "משקלים מחושבים",
      bpFlourRow: "קמח",
      bpWaterRow: "מים",
      bpSaltRow: "מלח",
      bpStarterRow: "מחמצת",
      bpTotalRow: "משקל בצק כולל",
      bpGrams: "גרם",
      bpSaveBtn: "שמור לספר המתכונים",
      bpSaved: "נשמר!",
      bpNameRequired: "נא להזין שם למתכון",
      recipesTitle: "המתכונים השמורים שלי",
      noRecipes: "טרם נשמרו מתכונים",
      recipeSelectBtn: "בחר לאפייה",
      recipeLoadBtn: "טען למחשבון",
      recipeDeleteConfirm: "למחוק את המתכון?",
      recipeSelected: "המתכון נטען! עברו ללשונית מעקב אפייה.",
    },

    en: {
      loginSubtitle: "Your personal quiet baking assistant",
      authLoginTitle: "Log in",
      authSignupTitle: "Sign up",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      passwordLabel: "Password",
      passwordPlaceholder: "At least 6 characters",
      nameLabel: "Baker name",
      namePlaceholder: "Your name",
      authLoginBtn: "Log in",
      authSignupBtn: "Sign up",
      authLoginLoading: "Logging in...",
      authSignupLoading: "Signing up...",
      authToggleToSignup: "Don't have an account?",
      authToggleToSignupBtn: "Sign up here",
      authToggleToLogin: "Already have an account?",
      authToggleToLoginBtn: "Log in here",

      errEmailPasswordRequired: "Please enter email and password",
      errPasswordTooShort: "Password must be at least 6 characters",
      errNameRequired: "Please enter your name",
      errEmailExists: "This email is already registered. Try logging in.",
      errUserNotFound: "No account found with this email",
      errWrongPassword: "Incorrect password",
      errGeneric: "Something went wrong. Please try again.",

      langToggle: "עב",

      tabStarter: "Starter care",
      tabBake: "Bake tracker",
      subRoutine: "Routine feed",
      subCalc: "Bake calculator",

      routineTitle: "Routine feed",
      routineSubtitle: "Every 3 days",
      routineInstruction: 'Keep <strong>30 g</strong> starter, feed with <strong>60 g flour</strong> and <strong>60 g water</strong>. Wait 2-4 hours for activity, then refrigerate.',
      noFeedYet: "No feed recorded yet",
      lastFeedAt: "Last fed: ",
      fedBtn: "I fed it!",

      calcTitle: "Pre-bake feed calculator",
      calcSubtitle: "Workshop formula",
      loafCountLabel: "Planned loaf count",
      breadWeightLabel: "Starter per loaf (grams)",
      breadWeightPlaceholder: "100",
      targetWeightLabel: "Total target weight (grams)",
      targetHint: "Formula: loaves × weight per loaf + 100 reserve",
      ratioLabel: "Desired feed ratio",
      ratioCustom: "Custom",
      customStarter: "Starter",
      customFlour: "Flour",
      customWater: "Water",
      tareLabel: "Empty container weight (tare)",
      optional: "optional",
      tarePlaceholder: "grams",
      calcResult: 'Take <strong>{starter}</strong> g starter, feed with <strong>{flour}</strong> g flour and <strong>{water}</strong> g water.',
      calcTotalResult: 'Total on scale (with container): <strong>{total}</strong> g.',

      lifestyleTitle: "Choose a schedule",
      lifestyleSubtitle: "Pick the schedule that fits your day",
      schedWorkerName: "Worker schedule",
      schedWorkerDesc: "Feed in the morning, work afternoon, refrigerate at night, bake tomorrow",
      schedThursdayName: "Thursday night schedule",
      schedThursdayDesc: "Feed at night, work morning-noon, refrigerate and bake at night/next morning",
      schedTechieName: "Techie schedule",
      schedTechieDesc: "Feed in the morning at low ratio, work noon-evening, bake at night/tomorrow",

      bakeTracker: "Bake tracker",
      resetBtn: "Reset",
      startLabel: "Started: ",
      greeting: "Hi, ",

      stepLevain: "Feed starter for baking",
      stepLevainDesc: "Leave at room temp for {h} hours. Use the calculator in the first tab.",
      stepAutolyse: "Autolyse / Fermentolyse",
      stepAutolyseDesc: "{m} minutes (default). Can run in parallel with the last hour of starter rising.",
      stepBulk: "Mix + start bulk",
      stepBulkDesc: "Bulk fermentation takes 3-6 hours total. Folds begin after mixing.",
      stepPreshape: "Pre-shape",
      stepPreshapeDesc: "Turn out dough, divide by loaf count, round into balls. Bench rest 10-15 min.",
      stepFinalShape: "Final shape",
      stepFinalShapeDesc: "Shape and place into proofing basket, wrap with plastic.",
      stepCold: "Cold retard",
      stepColdDesc: "Slow proof for 6 to 24 hours.",
      stepOvenActive: "🔥 Preheat oven to 250°C!",
      stepOvenActiveDesc: "One hour before cold retard ends.",
      stepOvenWaiting: "🔥 Oven preheat reminder",
      stepOvenWaitingDesc: "Will activate one hour before cold retard ends: preheat oven to 250°C!",
      stepScoreBake: "Score & bake",
      stepScoreBakeDesc: "Score the dough and place in the oven.",

      btnStartAutolyse: "Start autolyse in parallel",
      btnStartBulk: "Start bulk + fold timer",
      btnPreshapeTimer: "Start rest timer (10-15 min)",
      btnStartCold: "Start cold retard",
      btnStartVolume: "Start volume tracking",
      btnAddFold4: "+ Add 4th fold (if needed)",

      fold1: "First fold",
      fold1Desc: "30 min from bulk start",
      fold2: "Second fold",
      fold2Desc: "45 min after previous",
      fold3: "Third fold",
      fold3Desc: "45 min after previous",
      fold4: "Fourth fold",
      fold4Desc: "1 hour after previous (if needed)",

      volumeCheck: "Rise to target volume",
      volumeCheckDesc: "1-3 more hours. Check volume mark on container.",
      volumeReminder: "Reminder: check volume mark on container",

      coldHoursLabel: "Duration (hours):",
      coldEndEstimate: "Estimated end: ",
      coldReady: "Cold retard done!",
      coldRemaining: "Remaining: ",

      parallel: "parallel",
      elapsed: "⏱ ",
      upcoming: "in ",

      resetBakeBtn: "Reset & finish bake",
      resetBakeConfirm: "Reset the entire bake tracker and start over?",

      tabRecipes: "My Recipes",
      bpCalcTitle: "Baker's percentage calculator",
      bpCalcSubtitle: "Calculate weights from baker's percentages",
      bpRecipeName: "Recipe name",
      bpRecipeNamePh: "e.g., Country Spelt Loaf",
      bpFlourLabel: "Total flour (grams)",
      bpHydrationLabel: "Hydration / water (%)",
      bpSaltLabel: "Salt (%)",
      bpStarterLabel: "Starter (%)",
      bpResultTitle: "Calculated weights",
      bpFlourRow: "Flour",
      bpWaterRow: "Water",
      bpSaltRow: "Salt",
      bpStarterRow: "Starter",
      bpTotalRow: "Total dough weight",
      bpGrams: "g",
      bpSaveBtn: "Save to recipe book",
      bpSaved: "Saved!",
      bpNameRequired: "Please enter a recipe name",
      recipesTitle: "My saved recipes",
      noRecipes: "No recipes saved yet",
      recipeSelectBtn: "Select for baking",
      recipeLoadBtn: "Load into calculator",
      recipeDeleteConfirm: "Delete this recipe?",
      recipeSelected: "Recipe loaded! Switch to the Bake tracker tab.",
    }
  };

  var currentLang = localStorage.getItem(SK.language) || "he";

  /** Get a translation string */
  function t(key) {
    return (T[currentLang] && T[currentLang][key]) || (T.he[key]) || key;
  }

  // =========================================
  // i18n Engine
  // =========================================

  /** Apply translations to all data-i18n elements in the DOM */
  function applyTranslations() {
    // Text content
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      el.textContent = t(key);
    });

    // HTML content (for bold/strong tags)
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-html");
      el.innerHTML = t(key);
    });

    // Placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-placeholder");
      el.placeholder = t(key);
    });

    // Language toggles show what you switch TO
    document.querySelectorAll(".lang-toggle").forEach(function (btn) {
      btn.textContent = t("langToggle");
    });
  }

  /** Set language, update dir, save preference, re-render */
  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem(SK.language, lang);

    var htmlEl = document.documentElement;
    htmlEl.lang = lang;
    htmlEl.dir = lang === "he" ? "rtl" : "ltr";

    applyTranslations();

    // Re-render auth form (updates title, buttons, toggle text)
    if (typeof updateAuthUI === "function") updateAuthUI();

    // Re-render dynamic sections
    loadRefresh();
    if (isLoggedIn()) {
      var name = localStorage.getItem(SK.userName) || "";
      $("header-greeting").textContent = name ? t("greeting") + name : "";
    }

    // Re-render bake workflow if active
    renderBakeUI();

    // Recalculate
    updateCalc();
    updateBPCalc();
    renderRecipes();
  }

  function toggleLanguage() {
    setLanguage(currentLang === "he" ? "en" : "he");
  }

  // =========================================
  // Helpers
  // =========================================

  function $(id) { return document.getElementById(id); }
  function pad(n) { return String(n).padStart(2, "0"); }

  function formatDuration(ms) {
    if (ms < 0) ms = 0;
    var s = Math.floor(ms / 1000);
    var h = Math.floor(s / 3600);
    var m = Math.floor((s % 3600) / 60);
    s = s % 60;
    return h > 0 ? pad(h) + ":" + pad(m) + ":" + pad(s) : pad(m) + ":" + pad(s);
  }

  function formatTime(d) {
    return d.toLocaleTimeString(currentLang === "he" ? "he-IL" : "en-US", { hour: "2-digit", minute: "2-digit" });
  }

  function formatDate(d) {
    return d.toLocaleDateString(currentLang === "he" ? "he-IL" : "en-US", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  }

  function roundTo(n) {
    return Math.round(n);
  }

  function jsonParse(str, fallback) {
    if (!str) return fallback;
    try { return JSON.parse(str); } catch (e) { return fallback; }
  }

  // =========================================
  // Sound — Web Audio API
  // =========================================

  var audioCtx = null;

  function getAudioContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
  }

  function playChime() {
    try {
      var ctx = getAudioContext();
      if (ctx.state === "suspended") ctx.resume();
      var now = ctx.currentTime;
      [523.25, 659.25].forEach(function (freq) {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.15, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 2);
      });
    } catch (e) { /* silently fail */ }
  }

  var chimeFired = {};

  function checkChime(key, diff) {
    if (diff >= 0 && diff < 2000 && !chimeFired[key]) {
      chimeFired[key] = true;
      playChime();
    }
  }

  // =========================================
  // Authentication (Sign Up / Log In)
  // =========================================

  var authMode = "login"; // "login" or "signup"

  // Map server error codes to translation keys
  var ERROR_MAP = {
    EMAIL_PASSWORD_REQUIRED: "errEmailPasswordRequired",
    PASSWORD_TOO_SHORT: "errPasswordTooShort",
    NAME_REQUIRED: "errNameRequired",
    EMAIL_EXISTS: "errEmailExists",
    USER_NOT_FOUND: "errUserNotFound",
    WRONG_PASSWORD: "errWrongPassword",
    SIGNUP_FAILED: "errGeneric",
    INTERNAL_ERROR: "errGeneric",
    INVALID_ACTION: "errGeneric",
  };

  function showAuthError(msg) {
    var el = $("auth-error");
    el.textContent = msg;
    el.classList.remove("hidden");
  }

  function hideAuthError() {
    $("auth-error").classList.add("hidden");
  }

  /** Update the login form UI to reflect current authMode */
  function updateAuthUI() {
    var isSignup = authMode === "signup";
    var nameField = $("name-field");
    var nameInput = $("login-name");
    var submitBtn = $("auth-submit-btn");
    var title = $("auth-title");

    if (isSignup) {
      nameField.classList.remove("hidden");
      nameInput.required = true;
      title.setAttribute("data-i18n", "authSignupTitle");
      title.textContent = t("authSignupTitle");
      submitBtn.setAttribute("data-i18n", "authSignupBtn");
      submitBtn.textContent = t("authSignupBtn");
      $("auth-toggle-text").setAttribute("data-i18n", "authToggleToLogin");
      $("auth-toggle-text").textContent = t("authToggleToLogin");
      $("auth-toggle-btn").setAttribute("data-i18n", "authToggleToLoginBtn");
      $("auth-toggle-btn").textContent = t("authToggleToLoginBtn");
    } else {
      nameField.classList.add("hidden");
      nameInput.required = false;
      title.setAttribute("data-i18n", "authLoginTitle");
      title.textContent = t("authLoginTitle");
      submitBtn.setAttribute("data-i18n", "authLoginBtn");
      submitBtn.textContent = t("authLoginBtn");
      $("auth-toggle-text").setAttribute("data-i18n", "authToggleToSignup");
      $("auth-toggle-text").textContent = t("authToggleToSignup");
      $("auth-toggle-btn").setAttribute("data-i18n", "authToggleToSignupBtn");
      $("auth-toggle-btn").textContent = t("authToggleToSignupBtn");
    }
    hideAuthError();
  }

  $("auth-toggle-btn").addEventListener("click", function () {
    authMode = authMode === "login" ? "signup" : "login";
    updateAuthUI();
  });

  function apiAuth(action, payload) {
    return fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.assign({ action: action }, payload))
    }).then(function (res) {
      var ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/json")) {
        throw { offline: true };
      }
      return res.json().then(function (data) {
        if (!res.ok) {
          var errKey = ERROR_MAP[data.error] || "errGeneric";
          throw { serverError: true, message: t(errKey) };
        }
        return data;
      });
    });
  }

  function isLoggedIn() {
    return !!localStorage.getItem(SK.userEmail) && !!localStorage.getItem(SK.userName);
  }

  function showApp() {
    $("login-overlay").classList.add("hidden");
    $("app-shell").classList.remove("hidden");
    var name = localStorage.getItem(SK.userName) || "";
    $("header-greeting").textContent = name ? t("greeting") + name : "";
  }

  function showLogin() {
    $("login-overlay").classList.remove("hidden");
    $("app-shell").classList.add("hidden");
    authMode = "login";
    updateAuthUI();
  }

  function completeLogin(email, name) {
    localStorage.setItem(SK.userEmail, email);
    localStorage.setItem(SK.userName, name);
    // Clear form
    $("login-email").value = "";
    $("login-password").value = "";
    $("login-name").value = "";
    hideAuthError();
    showApp();
    initApp();
  }

  $("login-form").addEventListener("submit", function (e) {
    e.preventDefault();
    hideAuthError();

    var email = $("login-email").value.trim();
    var password = $("login-password").value;
    var name = $("login-name").value.trim();
    var isSignup = authMode === "signup";

    // Client-side validation
    if (!email || !password) {
      showAuthError(t("errEmailPasswordRequired"));
      return;
    }
    if (password.length < 6) {
      showAuthError(t("errPasswordTooShort"));
      return;
    }
    if (isSignup && !name) {
      showAuthError(t("errNameRequired"));
      return;
    }

    var btn = $("auth-submit-btn");
    btn.textContent = isSignup ? t("authSignupLoading") : t("authLoginLoading");
    btn.disabled = true;

    var payload = { email: email, password: password };
    if (isSignup) payload.name = name;

    apiAuth(isSignup ? "signup" : "login", payload).then(function (data) {
      completeLogin(data.email || email, data.name || name);
    }).catch(function (err) {
      if (err.offline || err.message === "Failed to fetch" || err.name === "TypeError") {
        // Offline fallback for local dev
        completeLogin(email, name || email.split("@")[0]);
      } else if (err.serverError) {
        showAuthError(err.message);
      } else {
        showAuthError(t("errGeneric"));
      }
    }).finally(function () {
      btn.textContent = isSignup ? t("authSignupBtn") : t("authLoginBtn");
      btn.disabled = false;
    });
  });

  $("btn-logout").addEventListener("click", function () {
    localStorage.removeItem(SK.userEmail);
    localStorage.removeItem(SK.userName);
    showLogin();
  });

  // Language toggles
  $("login-lang-toggle").addEventListener("click", toggleLanguage);
  $("app-lang-toggle").addEventListener("click", toggleLanguage);

  // =========================================
  // Tabs
  // =========================================

  document.querySelectorAll(".tab").forEach(function (tab) {
    tab.addEventListener("click", function () {
      document.querySelectorAll(".tab").forEach(function (t) {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      document.querySelectorAll(".tab-panel").forEach(function (p) {
        p.classList.remove("active");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
      $("panel-" + tab.dataset.tab).classList.add("active");
    });
  });

  document.querySelectorAll(".sub-tab").forEach(function (st) {
    st.addEventListener("click", function () {
      document.querySelectorAll(".sub-tab").forEach(function (s) { s.classList.remove("active"); });
      document.querySelectorAll(".sub-panel").forEach(function (p) { p.classList.remove("active"); });
      st.classList.add("active");
      $("sub-" + st.dataset.sub).classList.add("active");
    });
  });

  // =========================================
  // TAB 1 — Section 1: Routine Feed
  // =========================================

  function loadRefresh() {
    var iso = localStorage.getItem(SK.lastFed);
    var elTime = $("last-refresh-time");
    var elTimer = $("refresh-timer");

    var legacyTs = localStorage.getItem("refresh_last_ts");
    if (!iso && legacyTs) {
      iso = new Date(Number(legacyTs)).toISOString();
      localStorage.setItem(SK.lastFed, iso);
      localStorage.removeItem("refresh_last_ts");
    }

    if (!iso) {
      elTime.textContent = t("noFeedYet");
      elTimer.textContent = "";
      return;
    }
    elTime.textContent = t("lastFeedAt") + formatDate(new Date(iso));
    updateRefreshTimer();
  }

  function updateRefreshTimer() {
    var iso = localStorage.getItem(SK.lastFed);
    if (!iso) return;
    var elapsed = Date.now() - new Date(iso).getTime();
    $("refresh-timer").textContent = t("elapsed") + formatDuration(elapsed);
  }

  $("btn-refreshed").addEventListener("click", function () {
    localStorage.setItem(SK.lastFed, new Date().toISOString());
    loadRefresh();
  });

  // =========================================
  // TAB 1 — Section 2: Calculator
  // =========================================

  var loafInput = $("loaf-count");
  var breadWeightInput = $("bread-weight");
  var targetInput = $("target-weight");
  var ratioSelect = $("calc-ratio");
  var tareInput = $("tare-weight");

  function restoreCalcPrefs() {
    var savedLoaves = localStorage.getItem(SK.calcLoaves);
    var savedBreadWeight = localStorage.getItem(SK.calcBreadWeight);
    var savedRatio = localStorage.getItem(SK.calcRatio);
    var savedTare = localStorage.getItem(SK.calcTare);
    if (savedLoaves) loafInput.value = savedLoaves;
    if (savedBreadWeight) breadWeightInput.value = savedBreadWeight;
    if (savedRatio) ratioSelect.value = savedRatio;
    if (savedTare) tareInput.value = savedTare;
    toggleCustomRatio();
  }

  function saveCalcPref(key, value) {
    if (value !== "" && value != null) localStorage.setItem(key, String(value));
    else localStorage.removeItem(key);
  }

  function defaultTarget() {
    var loaves = parseInt(loafInput.value, 10) || 2;
    var perLoaf = parseInt(breadWeightInput.value, 10) || 100;
    return loaves * perLoaf + 100;
  }

  function syncTarget() {
    targetInput.value = defaultTarget();
    updateCalc();
  }

  document.querySelectorAll(".stepper-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var delta = Number(btn.dataset.delta);
      var cur = parseInt(loafInput.value, 10) || 2;
      loafInput.value = Math.max(1, Math.min(20, cur + delta));
      saveCalcPref(SK.calcLoaves, loafInput.value);
      syncTarget();
    });
  });

  loafInput.addEventListener("input", function () {
    saveCalcPref(SK.calcLoaves, loafInput.value);
    syncTarget();
  });
  breadWeightInput.addEventListener("input", function () {
    saveCalcPref(SK.calcBreadWeight, breadWeightInput.value);
    syncTarget();
  });
  var customStarterInput = $("custom-starter");
  var customFlourInput = $("custom-flour");
  var customWaterInput = $("custom-water");
  var customRatioRow = $("custom-ratio-row");

  function toggleCustomRatio() {
    var isCustom = ratioSelect.value === "custom";
    if (isCustom) {
      customRatioRow.classList.remove("hidden");
    } else {
      customRatioRow.classList.add("hidden");
    }
  }

  targetInput.addEventListener("input", updateCalc);
  ratioSelect.addEventListener("change", function () {
    saveCalcPref(SK.calcRatio, ratioSelect.value);
    toggleCustomRatio();
    updateCalc();
  });
  tareInput.addEventListener("input", function () {
    saveCalcPref(SK.calcTare, tareInput.value);
    updateCalc();
  });
  customStarterInput.addEventListener("input", updateCalc);
  customFlourInput.addEventListener("input", updateCalc);
  customWaterInput.addEventListener("input", updateCalc);

  function parseRatio(str) {
    var parts = str.split(":").map(Number);
    return { starter: parts[0], flour: parts[1], water: parts[2] };
  }

  function getActiveRatio() {
    if (ratioSelect.value === "custom") {
      var s = parseInt(customStarterInput.value, 10) || 1;
      var f = parseInt(customFlourInput.value, 10) || 1;
      var w = parseInt(customWaterInput.value, 10) || 1;
      return { starter: s, flour: f, water: w };
    }
    return parseRatio(ratioSelect.value);
  }

  function updateCalc() {
    var tw = parseInt(targetInput.value, 10);
    if (!tw || tw <= 0) {
      $("calc-result").classList.add("hidden");
      return;
    }
    var r = getActiveRatio();
    var sum = r.starter + r.flour + r.water;
    var divider = tw / sum;

    var starterG = roundTo(divider * r.starter);
    var flourG = roundTo(divider * r.flour);
    var waterG = roundTo(divider * r.water);

    $("calc-sentence").innerHTML = t("calcResult")
      .replace("{starter}", starterG)
      .replace("{flour}", flourG)
      .replace("{water}", waterG);
    $("calc-result").classList.remove("hidden");

    var tare = parseInt(tareInput.value, 10);
    if (tare > 0) {
      $("calc-total-sentence").innerHTML = t("calcTotalResult")
        .replace("{total}", starterG + flourG + waterG + tare);
      $("calc-tare-row").classList.remove("hidden");
    } else {
      $("calc-tare-row").classList.add("hidden");
    }
  }

  // =========================================
  // TAB 2: Bake Workflow
  // =========================================

  var LIFESTYLES = {
    worker:   { labelKey: "schedWorkerName", levainHours: 4, autolyseDef: 45, coldDefault: 12 },
    thursday: { labelKey: "schedThursdayName", levainHours: 5, autolyseDef: 45, coldDefault: 10 },
    techie:   { labelKey: "schedTechieName", levainHours: 6, autolyseDef: 60, coldDefault: 14 },
  };

  var OVEN_PREHEAT_MIN = 60;

  function getBakeState() {
    var raw = localStorage.getItem(SK.bakeState);
    var state = jsonParse(raw, null);

    if (!state) {
      var legacyStart = localStorage.getItem("bake_start_ts");
      var legacyLifestyle = localStorage.getItem("bake_lifestyle");
      if (legacyStart && legacyLifestyle) {
        state = {
          active: true,
          startTime: new Date(Number(legacyStart)).toISOString(),
          scheduleType: legacyLifestyle,
          checked: jsonParse(localStorage.getItem("bake_checked"), []),
          autolyseStart: localStorage.getItem("bake_autolyse_start") ? new Date(Number(localStorage.getItem("bake_autolyse_start"))).toISOString() : null,
          bulkStart: localStorage.getItem("bake_bulk_start") ? new Date(Number(localStorage.getItem("bake_bulk_start"))).toISOString() : null,
          fold4Added: localStorage.getItem("bake_fold4_added") === "true",
          foldStarts: (function () {
            var raw = jsonParse(localStorage.getItem("bake_fold_starts"), {});
            var out = {};
            Object.keys(raw).forEach(function (k) { out[k] = new Date(Number(raw[k])).toISOString(); });
            return out;
          })(),
          volumeStart: localStorage.getItem("bake_volume_start") ? new Date(Number(localStorage.getItem("bake_volume_start"))).toISOString() : null,
          preShapeStart: localStorage.getItem("bake_preshape_start") ? new Date(Number(localStorage.getItem("bake_preshape_start"))).toISOString() : null,
          coldStart: localStorage.getItem("bake_cold_start") ? new Date(Number(localStorage.getItem("bake_cold_start"))).toISOString() : null,
          coldHours: Number(localStorage.getItem("bake_cold_hours")) || 12,
        };
        saveBakeState(state);
        ["bake_lifestyle", "bake_start_ts", "bake_checked", "bake_autolyse_start",
         "bake_bulk_start", "bake_fold4_added", "bake_fold_starts",
         "bake_volume_start", "bake_preshape_start", "bake_cold_start", "bake_cold_hours"
        ].forEach(function (k) { localStorage.removeItem(k); });
      }
    }

    if (!state || !state.active) return null;
    return state;
  }

  function saveBakeState(state) {
    localStorage.setItem(SK.bakeState, JSON.stringify(state));
  }

  function toMs(iso) {
    return iso ? new Date(iso).getTime() : null;
  }

  function clearBake() {
    localStorage.removeItem(SK.bakeState);
    chimeFired = {};
    renderBakeUI();
  }

  function startBake(lifestyle) {
    saveBakeState({
      active: true,
      startTime: new Date().toISOString(),
      scheduleType: lifestyle,
      checked: [],
      autolyseStart: null,
      bulkStart: null,
      fold4Added: false,
      foldStarts: {},
      volumeStart: null,
      preShapeStart: null,
      coldStart: null,
      coldHours: LIFESTYLES[lifestyle].coldDefault,
    });
    chimeFired = {};
    renderBakeUI();
  }

  document.querySelectorAll(".lifestyle-btn").forEach(function (btn) {
    btn.addEventListener("click", function () { startBake(btn.dataset.lifestyle); });
  });

  $("btn-reset-bake").addEventListener("click", clearBake);

  // --- Render ---

  function renderBakeUI() {
    var state = getBakeState();
    if (!state) {
      $("lifestyle-select").classList.remove("hidden");
      $("bake-workflow").classList.add("hidden");
      return;
    }
    $("lifestyle-select").classList.add("hidden");
    $("bake-workflow").classList.remove("hidden");

    var ls = LIFESTYLES[state.scheduleType];
    $("bake-start-time").textContent = t("startLabel") + formatTime(new Date(state.startTime));
    $("bake-lifestyle-label").textContent = t(ls.labelKey);

    var el = $("bake-steps");
    el.innerHTML = "";
    var startMs = toMs(state.startTime);
    buildSteps(state, ls, startMs).forEach(function (step) {
      el.appendChild(createStepEl(step, state));
    });

    // Bottom reset
    var resetLi = document.createElement("li");
    resetLi.className = "step-item reset-step";
    var resetBtn = document.createElement("button");
    resetBtn.className = "btn btn-ghost btn-large reset-bake-btn";
    resetBtn.textContent = t("resetBakeBtn");
    resetBtn.addEventListener("click", function () {
      if (confirm(t("resetBakeConfirm"))) clearBake();
    });
    resetLi.appendChild(resetBtn);
    el.appendChild(resetLi);
  }

  function buildSteps(state, ls, startMs) {
    var levainEnd = startMs + ls.levainHours * 3600000;
    var autolyseRec = levainEnd - ls.autolyseDef * 60000;
    var steps = [];

    steps.push({ id: "levain", name: t("stepLevain"),
      desc: t("stepLevainDesc").replace("{h}", ls.levainHours),
      targetTs: startMs, timerRef: startMs });

    steps.push({ id: "autolyse", name: t("stepAutolyse"),
      desc: t("stepAutolyseDesc").replace("{m}", ls.autolyseDef),
      targetTs: autolyseRec, parallel: true, hasStartBtn: !state.autolyseStart, timerRef: toMs(state.autolyseStart) });

    steps.push({ id: "bulk", name: t("stepBulk"),
      desc: t("stepBulkDesc"),
      targetTs: levainEnd, bulkStep: true });

    steps.push({ id: "preshape", name: t("stepPreshape"),
      desc: t("stepPreshapeDesc"),
      hasPreShapeBtn: !state.preShapeStart, timerRef: toMs(state.preShapeStart) });

    steps.push({ id: "final-shape", name: t("stepFinalShape"),
      desc: t("stepFinalShapeDesc") });

    steps.push({ id: "cold", name: t("stepCold"),
      desc: t("stepColdDesc"), coldStep: true });

    var coldStartMs = toMs(state.coldStart);
    if (coldStartMs) {
      var coldEnd = coldStartMs + state.coldHours * 3600000;
      var ovenTs = coldEnd - OVEN_PREHEAT_MIN * 60000;
      steps.push({ id: "oven", name: t("stepOvenActive"),
        desc: t("stepOvenActiveDesc"), targetTs: ovenTs, ovenReminder: true });
    } else {
      steps.push({ id: "oven", name: t("stepOvenWaiting"),
        desc: t("stepOvenWaitingDesc"), ovenReminder: true });
    }

    steps.push({ id: "score-bake", name: t("stepScoreBake"),
      desc: t("stepScoreBakeDesc") });

    return steps;
  }

  // --- Create Step Element ---

  function createStepEl(step, state) {
    var li = document.createElement("li");
    li.className = "step-item";
    if (state.checked.includes(step.id)) li.classList.add("done");
    if (step.ovenReminder) li.classList.add("oven-reminder");

    var cb = document.createElement("div");
    cb.className = "step-checkbox";
    cb.addEventListener("click", function () {
      var s = getBakeState();
      if (!s) return;
      var idx = s.checked.indexOf(step.id);
      if (idx === -1) s.checked.push(step.id);
      else s.checked.splice(idx, 1);
      saveBakeState(s);
      li.classList.toggle("done");
    });
    li.appendChild(cb);

    var body = document.createElement("div");
    body.className = "step-body";

    var nameEl = document.createElement("div");
    nameEl.className = "step-name";
    nameEl.textContent = step.name;
    if (step.parallel) {
      var badge = document.createElement("span");
      badge.className = "parallel-badge";
      badge.textContent = t("parallel");
      nameEl.appendChild(badge);
    }
    body.appendChild(nameEl);

    if (step.desc) {
      var d = document.createElement("div");
      d.className = "step-desc";
      d.textContent = step.desc;
      body.appendChild(d);
    }

    if (step.targetTs) {
      var m = document.createElement("div");
      m.className = "step-meta";
      m.textContent = formatTime(new Date(step.targetTs));
      body.appendChild(m);
    }

    if (step.timerRef || step.targetTs) {
      var el = document.createElement("div");
      el.className = "step-elapsed";
      el.dataset.target = String(step.timerRef || step.targetTs);
      el.dataset.chimekey = step.id;
      body.appendChild(el);
    }

    if (step.hasStartBtn) {
      var act = document.createElement("div");
      act.className = "step-actions";
      var btn = document.createElement("button");
      btn.className = "btn btn-secondary";
      btn.textContent = t("btnStartAutolyse");
      btn.addEventListener("click", function () {
        var s = getBakeState();
        if (!s) return;
        s.autolyseStart = new Date().toISOString();
        saveBakeState(s);
        renderBakeUI();
      });
      act.appendChild(btn);
      body.appendChild(act);
    }

    if (step.bulkStep) body.appendChild(createBulkSubSteps(state));

    if (step.hasPreShapeBtn) {
      var pa = document.createElement("div");
      pa.className = "step-actions";
      var pb = document.createElement("button");
      pb.className = "btn btn-secondary";
      pb.textContent = t("btnPreshapeTimer");
      pb.addEventListener("click", function () {
        var s = getBakeState();
        if (!s) return;
        s.preShapeStart = new Date().toISOString();
        saveBakeState(s);
        renderBakeUI();
      });
      pa.appendChild(pb);
      body.appendChild(pa);
    } else if (step.id === "preshape" && state.preShapeStart) {
      var pt = document.createElement("div");
      pt.className = "step-elapsed";
      pt.dataset.target = String(toMs(state.preShapeStart));
      pt.dataset.chimekey = "preshape-timer";
      body.appendChild(pt);
    }

    if (step.coldStep) body.appendChild(createColdControls(state));

    li.appendChild(body);
    return li;
  }

  // --- Bulk Sub-Steps ---

  function createBulkSubSteps(state) {
    var c = document.createElement("div");
    c.className = "sub-steps";
    var bulkStartMs = toMs(state.bulkStart);

    if (!bulkStartMs) {
      var sb = document.createElement("button");
      sb.className = "btn btn-secondary";
      sb.style.marginBottom = "6px";
      sb.textContent = t("btnStartBulk");
      sb.addEventListener("click", function () {
        var s = getBakeState();
        if (!s) return;
        s.bulkStart = new Date().toISOString();
        saveBakeState(s);
        renderBakeUI();
      });
      c.appendChild(sb);
      return c;
    }

    var folds = [
      { id: "fold-1", name: t("fold1"), desc: t("fold1Desc"), ms: 30*60000 },
      { id: "fold-2", name: t("fold2"), desc: t("fold2Desc"), ms: 75*60000 },
      { id: "fold-3", name: t("fold3"), desc: t("fold3Desc"), ms: 120*60000 },
    ];
    if (state.fold4Added) {
      folds.push({ id: "fold-4", name: t("fold4"), desc: t("fold4Desc"), ms: 180*60000 });
    }

    folds.forEach(function (fd) {
      var sub = document.createElement("div");
      sub.className = "sub-step";
      if (state.checked.includes(fd.id)) sub.classList.add("done");

      var scb = document.createElement("div");
      scb.className = "sub-checkbox";
      scb.addEventListener("click", function () {
        var s = getBakeState();
        if (!s) return;
        var idx = s.checked.indexOf(fd.id);
        if (idx === -1) {
          s.checked.push(fd.id);
          if (!s.foldStarts[fd.id]) {
            s.foldStarts[fd.id] = new Date().toISOString();
          }
        } else { s.checked.splice(idx, 1); }
        saveBakeState(s);
        sub.classList.toggle("done");
      });
      sub.appendChild(scb);

      var bd = document.createElement("div");
      bd.className = "sub-step-body";
      var nm = document.createElement("div"); nm.className = "sub-step-name"; nm.textContent = fd.name; bd.appendChild(nm);
      var ds = document.createElement("div"); ds.className = "sub-step-desc"; ds.textContent = fd.desc; bd.appendChild(ds);
      sub.appendChild(bd);

      var tm = document.createElement("span");
      tm.className = "sub-step-timer";
      tm.dataset.foldtarget = String(bulkStartMs + fd.ms);
      tm.dataset.chimekey = fd.id;
      sub.appendChild(tm);

      c.appendChild(sub);
    });

    if (!state.fold4Added) {
      var ab = document.createElement("button");
      ab.className = "add-fold-btn";
      ab.textContent = t("btnAddFold4");
      ab.addEventListener("click", function () {
        var s = getBakeState();
        if (!s) return;
        s.fold4Added = true;
        saveBakeState(s);
        renderBakeUI();
      });
      c.appendChild(ab);
    }

    // Volume check
    var vs = document.createElement("div");
    vs.className = "sub-step";
    if (state.checked.includes("volume")) vs.classList.add("done");

    var vcb = document.createElement("div");
    vcb.className = "sub-checkbox";
    vcb.addEventListener("click", function () {
      var s = getBakeState();
      if (!s) return;
      var idx = s.checked.indexOf("volume");
      if (idx === -1) s.checked.push("volume");
      else s.checked.splice(idx, 1);
      saveBakeState(s);
      vs.classList.toggle("done");
    });
    vs.appendChild(vcb);

    var vbd = document.createElement("div"); vbd.className = "sub-step-body";
    var vnm = document.createElement("div"); vnm.className = "sub-step-name"; vnm.textContent = t("volumeCheck"); vbd.appendChild(vnm);
    var vds = document.createElement("div"); vds.className = "sub-step-desc"; vds.textContent = t("volumeCheckDesc"); vbd.appendChild(vds);
    vs.appendChild(vbd);

    if (!state.volumeStart) {
      c.appendChild(vs);
      var vb = document.createElement("button");
      vb.className = "add-fold-btn";
      vb.style.marginTop = "4px";
      vb.textContent = t("btnStartVolume");
      vb.addEventListener("click", function () {
        var s = getBakeState();
        if (!s) return;
        s.volumeStart = new Date().toISOString();
        saveBakeState(s);
        renderBakeUI();
      });
      c.appendChild(vb);
    } else {
      var vt = document.createElement("span");
      vt.className = "sub-step-timer";
      vt.dataset.target = String(toMs(state.volumeStart));
      vs.appendChild(vt);
      c.appendChild(vs);
      var vr = document.createElement("div");
      vr.className = "volume-reminder";
      vr.textContent = t("volumeReminder");
      c.appendChild(vr);
    }

    return c;
  }

  // --- Cold Controls ---

  function createColdControls(state) {
    var c = document.createElement("div");
    c.className = "step-actions";
    var coldStartMs = toMs(state.coldStart);

    if (!coldStartMs) {
      var row = document.createElement("div");
      row.style.cssText = "display:flex;align-items:center;gap:8px;margin-top:8px;margin-bottom:8px;";
      var lbl = document.createElement("span");
      lbl.style.cssText = "font-size:0.82rem;color:var(--text-secondary);";
      lbl.textContent = t("coldHoursLabel");
      row.appendChild(lbl);
      var inp = document.createElement("input");
      inp.type = "number"; inp.inputMode = "numeric"; inp.min = "1"; inp.max = "48";
      inp.value = String(state.coldHours);
      inp.style.cssText = "width:68px;padding:8px 10px;font-size:1rem;border:1px solid var(--border);border-radius:8px;background:var(--surface);color:var(--text);outline:none;text-align:center;";
      inp.addEventListener("change", function () {
        var s = getBakeState();
        if (!s) return;
        s.coldHours = Number(inp.value) || state.coldHours;
        saveBakeState(s);
      });
      row.appendChild(inp);
      c.appendChild(row);

      var btn = document.createElement("button");
      btn.className = "btn btn-secondary";
      btn.textContent = t("btnStartCold");
      btn.addEventListener("click", function () {
        var s = getBakeState();
        if (!s) return;
        s.coldStart = new Date().toISOString();
        s.coldHours = Number(inp.value) || state.coldHours;
        saveBakeState(s);
        renderBakeUI();
      });
      c.appendChild(btn);
    } else {
      var endTs = coldStartMs + state.coldHours * 3600000;
      var info = document.createElement("div");
      info.className = "step-meta";
      info.textContent = t("coldEndEstimate") + formatTime(new Date(endTs));
      c.appendChild(info);
      var timer = document.createElement("div");
      timer.className = "step-elapsed";
      timer.dataset.coldend = String(endTs);
      timer.dataset.chimekey = "cold-end";
      c.appendChild(timer);
    }
    return c;
  }

  // =========================================
  // Timer Updates (1 Hz)
  // =========================================

  function updateAllTimers() {
    updateRefreshTimer();

    var state = getBakeState();
    if (!state) return;
    var now = Date.now();

    document.querySelectorAll(".step-elapsed[data-target]").forEach(function (el) {
      var tgt = Number(el.dataset.target);
      var diff = now - tgt;
      el.textContent = diff >= 0 ? t("elapsed") + formatDuration(diff) : t("upcoming") + formatDuration(-diff);
      if (el.dataset.chimekey) checkChime(el.dataset.chimekey, diff);
    });

    document.querySelectorAll(".sub-step-timer[data-foldtarget]").forEach(function (el) {
      var tgt = Number(el.dataset.foldtarget);
      var diff = now - tgt;
      el.textContent = diff >= 0 ? t("elapsed") + formatDuration(diff) : t("upcoming") + formatDuration(-diff);
      if (el.dataset.chimekey) checkChime("fold-" + el.dataset.chimekey, diff);
    });

    document.querySelectorAll(".sub-step-timer[data-target]").forEach(function (el) {
      var tgt = Number(el.dataset.target);
      el.textContent = t("elapsed") + formatDuration(now - tgt);
    });

    document.querySelectorAll(".step-elapsed[data-coldend]").forEach(function (el) {
      var endTs = Number(el.dataset.coldend);
      var diff = endTs - now;
      if (diff > 0) {
        el.textContent = t("coldRemaining") + formatDuration(diff);
      } else {
        el.textContent = t("coldReady");
        if (el.dataset.chimekey) checkChime(el.dataset.chimekey, -diff);
      }
    });
  }

  // =========================================
  // Baker's Percentage Calculator & Recipe Book
  // =========================================

  var bpFlour = $("bp-flour");
  var bpHydration = $("bp-hydration");
  var bpSalt = $("bp-salt");
  var bpStarter = $("bp-starter");
  var bpName = $("bp-name");

  function updateBPCalc() {
    var flour = parseFloat(bpFlour.value) || 0;
    var hydPct = parseFloat(bpHydration.value) || 0;
    var saltPct = parseFloat(bpSalt.value) || 0;
    var starterPct = parseFloat(bpStarter.value) || 0;

    var water = roundTo(flour * hydPct / 100);
    var salt = roundTo(flour * saltPct / 100);
    var starter = roundTo(flour * starterPct / 100);
    var total = roundTo(flour + water + salt + starter);

    $("bp-val-flour").innerHTML = flour + ' <span data-i18n="bpGrams">' + t("bpGrams") + "</span>";
    $("bp-val-water").innerHTML = water + ' <span data-i18n="bpGrams">' + t("bpGrams") + "</span>";
    $("bp-val-salt").innerHTML = salt + ' <span data-i18n="bpGrams">' + t("bpGrams") + "</span>";
    $("bp-val-starter").innerHTML = starter + ' <span data-i18n="bpGrams">' + t("bpGrams") + "</span>";
    $("bp-val-total").innerHTML = total + ' <span data-i18n="bpGrams">' + t("bpGrams") + "</span>";

    $("bp-pct-water").textContent = "(" + hydPct + "%)";
    $("bp-pct-salt").textContent = "(" + saltPct + "%)";
    $("bp-pct-starter").textContent = "(" + starterPct + "%)";
  }

  [bpFlour, bpHydration, bpSalt, bpStarter].forEach(function (inp) {
    inp.addEventListener("input", updateBPCalc);
  });

  // --- Recipe persistence ---

  function getRecipes() {
    try { return JSON.parse(localStorage.getItem(SK.recipes)) || []; }
    catch (e) { return []; }
  }

  function saveRecipes(arr) {
    localStorage.setItem(SK.recipes, JSON.stringify(arr));
  }

  function renderRecipes() {
    var recipes = getRecipes();
    var list = $("recipe-list");
    var noMsg = $("no-recipes-msg");

    if (recipes.length === 0) {
      noMsg.classList.remove("hidden");
      list.innerHTML = "";
      return;
    }
    noMsg.classList.add("hidden");

    list.innerHTML = recipes.map(function (r, i) {
      return '<div class="recipe-card" data-idx="' + i + '">' +
        '<div class="recipe-card-header">' +
          '<span class="recipe-card-name">' + escHtml(r.name) + '</span>' +
          '<button class="recipe-delete-btn" data-idx="' + i + '" aria-label="delete">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
              '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>' +
            '</svg>' +
          '</button>' +
        '</div>' +
        '<div class="recipe-percentages">' +
          '<span class="recipe-pct-tag"><strong>' + r.flour + 'g</strong> ' + t("bpFlourRow") + '</span>' +
          '<span class="recipe-pct-tag"><strong>' + r.hydration + '%</strong> ' + t("bpWaterRow") + '</span>' +
          '<span class="recipe-pct-tag"><strong>' + r.salt + '%</strong> ' + t("bpSaltRow") + '</span>' +
          '<span class="recipe-pct-tag"><strong>' + r.starter + '%</strong> ' + t("bpStarterRow") + '</span>' +
        '</div>' +
        '<div class="recipe-actions">' +
          '<button class="recipe-select-btn" data-idx="' + i + '">' + t("recipeSelectBtn") + '</button>' +
          '<button class="recipe-load-btn" data-idx="' + i + '">' + t("recipeLoadBtn") + '</button>' +
        '</div>' +
      '</div>';
    }).join("");

    // Wire delete buttons
    list.querySelectorAll(".recipe-delete-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (!confirm(t("recipeDeleteConfirm"))) return;
        var idx = Number(btn.dataset.idx);
        var arr = getRecipes();
        arr.splice(idx, 1);
        saveRecipes(arr);
        renderRecipes();
      });
    });

    // Wire "load into calculator" buttons
    list.querySelectorAll(".recipe-load-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var r = getRecipes()[Number(btn.dataset.idx)];
        if (!r) return;
        bpName.value = r.name;
        bpFlour.value = r.flour;
        bpHydration.value = r.hydration;
        bpSalt.value = r.salt;
        bpStarter.value = r.starter;
        updateBPCalc();
        // Scroll to top of recipes panel
        $("panel-recipes").scrollTo({ top: 0, behavior: "smooth" });
      });
    });

    // Wire "select for baking" buttons
    list.querySelectorAll(".recipe-select-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var r = getRecipes()[Number(btn.dataset.idx)];
        if (!r) return;
        // Calculate weights and store in bake-ready state
        var flour = r.flour;
        var water = roundTo(flour * r.hydration / 100);
        var salt = roundTo(flour * r.salt / 100);
        var starter = roundTo(flour * r.starter / 100);
        localStorage.setItem("levain_selected_recipe", JSON.stringify({
          name: r.name,
          flour: flour,
          water: water,
          salt: salt,
          starter: starter,
          total: roundTo(flour + water + salt + starter)
        }));
        // Switch to bake tab
        document.querySelectorAll(".tab").forEach(function (tb) {
          tb.classList.remove("active");
          tb.setAttribute("aria-selected", "false");
        });
        document.querySelectorAll(".tab-panel").forEach(function (p) {
          p.classList.remove("active");
        });
        var bakeTab = document.querySelector('[data-tab="bake"]');
        bakeTab.classList.add("active");
        bakeTab.setAttribute("aria-selected", "true");
        $("panel-bake").classList.add("active");
        alert(t("recipeSelected"));
      });
    });
  }

  function escHtml(str) {
    var d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
  }

  // Save recipe button
  $("btn-save-recipe").addEventListener("click", function () {
    var name = bpName.value.trim();
    if (!name) {
      alert(t("bpNameRequired"));
      return;
    }
    var recipe = {
      name: name,
      flour: parseFloat(bpFlour.value) || 500,
      hydration: parseFloat(bpHydration.value) || 70,
      salt: parseFloat(bpSalt.value) || 2,
      starter: parseFloat(bpStarter.value) || 20,
    };
    var arr = getRecipes();
    arr.push(recipe);
    saveRecipes(arr);
    renderRecipes();

    // Button feedback
    var btn = $("btn-save-recipe");
    var origText = btn.textContent;
    btn.textContent = t("bpSaved");
    btn.disabled = true;
    setTimeout(function () {
      btn.textContent = origText;
      btn.disabled = false;
    }, 1500);
  });

  // =========================================
  // Init
  // =========================================

  function initApp() {
    restoreCalcPrefs();
    targetInput.value = defaultTarget();
    updateCalc();
    loadRefresh();
    renderBakeUI();
    updateBPCalc();
    renderRecipes();
  }

  // Apply saved language on boot (before showing anything)
  (function () {
    var htmlEl = document.documentElement;
    htmlEl.lang = currentLang;
    htmlEl.dir = currentLang === "he" ? "rtl" : "ltr";
    applyTranslations();
    updateAuthUI();
  })();

  // Boot: check auth
  if (isLoggedIn()) {
    showApp();
    initApp();
  } else {
    showLogin();
  }

  setInterval(updateAllTimers, 1000);

})();
