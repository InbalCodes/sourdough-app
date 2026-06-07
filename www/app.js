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
    starters: "levain_starters",
    activeStarter: "levain_active_starter",
    settings: "levain_settings",
  };

  // =========================================
  // Translations
  // =========================================

  var T = {
    he: {
      // Auth
      loginSubtitle: "העוזר האישי שלך לאפייה שקטה",
      googleSignInBtn: "התחברות באמצעות Google",
      googleSignInLoading: "מתחבר...",
      errGoogleCancelled: "ההתחברות בוטלה",
      errGeneric: "משהו השתבש. נסו שנית.",

      // Lang toggle
      langToggle: "EN",

      // Tabs
      tabStarter: "רענון ותחזוקה",
      tabBake: "מעקב אפייה",
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

      // 2-Phase baking
      bakePhase1Title: "פאזה 1 — אפייה ראשונית",
      bakePhase2Title: "פאזה 2 — השחמה",
      bakeTempLabel: "טמפרטורה (°C)",
      bakeMinLabel: "דקות",
      btnStartBakePhase: "התחל אפייה",
      bakePhase1Done: "פאזה 1 הסתיימה! שנו טמפרטורה ופתחו סיר.",
      bakePhase2Done: "האפייה הסתיימה! 🎉",
      bakePhaseAlert: "פאזה 1 הסתיימה! שנו טמפרטורה ופתחו סיר.",

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

      // Chime notifications
      chimeAutolyse: "🔔 הגיע הזמן לאוטוליזה!",
      chimeBulk: "🔔 הגיע הזמן ללישה + באלק!",
      chimeFold: "🔔 הגיע הזמן לקיפול!",
      chimePreshape: "🔔 מנוחת עיצוב ראשוני הסתיימה!",
      chimeOven: "🔔 חממו תנור ל-250 מעלות!",
      chimeCold: "🔔 ההתפחה במקרר הסתיימה!",
      chimeBakePhase1: "🔔 פאזה 1 הסתיימה! שנו טמפרטורה ופתחו סיר.",
      chimeBakePhase2: "🔔 האפייה הסתיימה! 🎉",

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
      btnSplitFlour: "+ פיצול סוגי קמח",
      btnAddFlour: "+ הוסף סוג קמח",
      flourTypeName: "סוג קמח",
      flourTypeNamePh: "למשל: קמח לחם",
      flourTotalLabel: "סה״כ קמח",
      flourBread: "קמח לחם",
      completedIn: "הושלם תוך",

      // Starters
      btnAddStarter: "+ הוסף מחמצת",
      newStarterName: "מחמצת חדשה",
      starterAge: "{m} חודשים",
      starterAgeYears: "{y} שנים",
      statusActive: "פעילה",
      statusResting: "במקרר",
      statusNeedsFeeding: "דורשת האכלה",
      deleteStarter: "מחק מחמצת",
      deleteStarterConfirm: "למחוק מחמצת זו?",

      // Settings
      settingsTitle: "הגדרות",
      settingsUnits: "יחידות מידה",
      settingsMetric: "מטרי (גרם)",
      settingsImperial: "אימפריאלי (אונקיות)",
      settingsNotifications: "התראות",
      settingsBakeAlerts: "התראות שלבי אפייה",
      settingsFeedReminder: "תזכורת האכלה",
      settingsStarterMgmt: "ניהול מחמצות",
      unitGrams: "גרם",
      unitOz: "oz",

      recipesTitle: "המתכונים השמורים שלי",
      noRecipes: "טרם נשמרו מתכונים",
      recipeSelectBtn: "בחר לאפייה",
      recipeLoadBtn: "טען למחשבון",
      recipeDeleteConfirm: "למחוק את המתכון?",
      recipeDeleteFailed: "מחיקה נכשלה",
      confirmYes: "כן",
      confirmNo: "ביטול",
      recipeSelected: "המתכון נטען! עברו ללשונית מעקב אפייה.",
      loading: "טוען…",
      saving: "שומר…",
      saveFailed: "השמירה נכשלה",
    },

    en: {
      loginSubtitle: "Your personal quiet baking assistant",
      googleSignInBtn: "Sign in with Google",
      googleSignInLoading: "Signing in...",
      errGoogleCancelled: "Sign-in was cancelled",
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

      bakePhase1Title: "Phase 1 — Initial bake",
      bakePhase2Title: "Phase 2 — Crust browning",
      bakeTempLabel: "Temperature (°C)",
      bakeMinLabel: "Minutes",
      btnStartBakePhase: "Start baking",
      bakePhase1Done: "Phase 1 done! Adjust temp and open pot.",
      bakePhase2Done: "Baking complete! 🎉",
      bakePhaseAlert: "Phase 1 done! Adjust temperature and open the pot.",

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

      chimeAutolyse: "🔔 Time for autolyse!",
      chimeBulk: "🔔 Time to mix + start bulk!",
      chimeFold: "🔔 Time for a fold!",
      chimePreshape: "🔔 Pre-shape rest is done!",
      chimeOven: "🔔 Preheat oven to 250°C!",
      chimeCold: "🔔 Cold retard is done!",
      chimeBakePhase1: "🔔 Phase 1 done! Adjust temp & open pot.",
      chimeBakePhase2: "🔔 Baking complete! 🎉",

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
      btnSplitFlour: "+ Split flour types",
      btnAddFlour: "+ Add flour type",
      flourTypeName: "Flour type",
      flourTypeNamePh: "e.g. Bread flour",
      flourTotalLabel: "Total flour",
      flourBread: "Bread flour",
      completedIn: "Completed in",

      btnAddStarter: "+ Add starter",
      newStarterName: "New starter",
      starterAge: "{m} months",
      starterAgeYears: "{y} years",
      statusActive: "Active",
      statusResting: "Fridge resting",
      statusNeedsFeeding: "Needs feeding",
      deleteStarter: "Delete starter",
      deleteStarterConfirm: "Delete this starter?",

      settingsTitle: "Settings",
      settingsUnits: "Measurement units",
      settingsMetric: "Metric (grams)",
      settingsImperial: "Imperial (ounces)",
      settingsNotifications: "Notifications",
      settingsBakeAlerts: "Bake stage alerts",
      settingsFeedReminder: "Feed reminder",
      settingsStarterMgmt: "Starter management",
      unitGrams: "grams",
      unitOz: "oz",

      recipesTitle: "My saved recipes",
      noRecipes: "No recipes saved yet",
      recipeSelectBtn: "Select for baking",
      recipeLoadBtn: "Load into calculator",
      recipeDeleteConfirm: "Delete this recipe?",
      recipeDeleteFailed: "Delete failed",
      confirmYes: "Yes",
      confirmNo: "Cancel",
      recipeSelected: "Recipe loaded! Switch to the Bake tracker tab.",
      loading: "Loading…",
      saving: "Saving…",
      saveFailed: "Save failed",
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

    // Re-render dynamic sections
    loadRefresh();
    if (isLoggedIn()) {
      var name = localStorage.getItem(SK.userName) || "";
      var email = localStorage.getItem(SK.userEmail) || "";
      var display = name || email.split("@")[0] || "";
      $("header-greeting").textContent = display ? t("greeting") + display : "";
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
    var d = Math.floor(s / 86400);
    s = s % 86400;
    var h = Math.floor(s / 3600);
    var m = Math.floor((s % 3600) / 60);
    s = s % 60;
    if (d > 0) {
      var time = pad(h) + ":" + pad(m) + ":" + pad(s);
      return d + "d " + time;
    }
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
  var toastTimeout = null;

  function showToast(msg) {
    var el = $("toast");
    el.textContent = msg;
    el.classList.remove("hidden");
    // Force reflow for transition
    void el.offsetWidth;
    el.classList.add("visible");
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(function () {
      el.classList.remove("visible");
      setTimeout(function () { el.classList.add("hidden"); }, 300);
    }, 5000);
  }

  /** Map chime keys to i18n notification keys */
  var CHIME_MESSAGES = {
    "autolyse": "chimeAutolyse",
    "bulk": "chimeBulk",
    "fold-fold-1": "chimeFold",
    "fold-fold-2": "chimeFold",
    "fold-fold-3": "chimeFold",
    "fold-fold-4": "chimeFold",
    "preshape-timer": "chimePreshape",
    "oven": "chimeOven",
    "cold-retard": "chimeCold",
    "bake-phase1": "chimeBakePhase1",
    "bake-phase2": "chimeBakePhase2",
  };

  function checkChime(key, diff) {
    if (diff >= 0 && diff < 2000 && !chimeFired[key]) {
      chimeFired[key] = true;
      playChime();
      var msgKey = CHIME_MESSAGES[key];
      if (msgKey) showToast(t(msgKey));
    }
  }

  // =========================================
  // Authentication (Google Sign-In)
  // =========================================

  // Google Client ID — set this to your Google Cloud OAuth 2.0 Client ID
  var GOOGLE_CLIENT_ID = "406720545379-6mcjpa3558e848eannfdltd4d9dljtot.apps.googleusercontent.com";

  function showAuthError(msg) {
    var el = $("auth-error");
    el.textContent = msg;
    el.classList.remove("hidden");
  }

  function hideAuthError() {
    $("auth-error").classList.add("hidden");
  }

  function isLoggedIn() {
    return !!localStorage.getItem(SK.userEmail);
  }

  function showApp() {
    $("login-overlay").classList.add("hidden");
    $("app-shell").classList.remove("hidden");
    var name = localStorage.getItem(SK.userName) || "";
    var email = localStorage.getItem(SK.userEmail) || "";
    var display = name || email.split("@")[0] || "";
    $("header-greeting").textContent = display ? t("greeting") + display : "";
  }

  function showLogin() {
    $("login-overlay").classList.remove("hidden");
    $("app-shell").classList.add("hidden");
    hideAuthError();
  }

  function completeLogin(email, name) {
    localStorage.setItem(SK.userEmail, email);
    localStorage.setItem(SK.userName, name);
    hideAuthError();
    showApp();
    initApp();
  }

  // Detect native Capacitor environment (Android/iOS WebView)
  var isNative = typeof window.Capacitor !== "undefined" && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform();
  var NETLIFY_ORIGIN = "https://vocal-lolly-7ebc53.netlify.app";
  var API_BASE = isNative ? NETLIFY_ORIGIN : "";
  var OAUTH_REDIRECT_URI = NETLIFY_ORIGIN + "/api/google-callback";

  // Polling state for native auth
  var authPollTimer = null;

  // Capacitor plugin references (vanilla JS / non-bundled access)
  var Cap = window.Capacitor || null;
  var CapPlugins = Cap && Cap.Plugins ? Cap.Plugins : {};
  var CapBrowser = CapPlugins.Browser || (Cap && Cap.registerPlugin ? Cap.registerPlugin("Browser") : null);
  var CapApp = CapPlugins.App || (Cap && Cap.registerPlugin ? Cap.registerPlugin("App") : null);

  // Native: listen for deep link returns from OAuth
  if (isNative && CapApp) {
    CapApp.addListener("appUrlOpen", function (data) {
      var url = data.url || "";
      if (url.indexOf("com.inbal.levain://callback") !== 0) return;

      // Close Custom Chrome Tab if open
      if (CapBrowser) { try { CapBrowser.close(); } catch (e) {} }

      // Parse params and complete login
      try {
        var qIdx = url.indexOf("?");
        if (qIdx === -1) return;
        var params = {};
        url.substring(qIdx + 1).split("&").forEach(function (part) {
          var kv = part.split("=");
          params[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1] || "");
        });
        if (params.google_auth === "1" && params.email) {
          stopPolling();
          completeLogin(params.email, params.name || "");
        }
      } catch (e) {
        console.error("[Levain] Deep link parse error:", e);
      }
    });
    console.log("[Levain] appUrlOpen listener registered");
  }

  // Track the current polling token so we can force-check on resume
  var currentPollToken = null;

  // When app resumes from background (Custom Tab closed), immediately check poll
  if (isNative && CapApp) {
    CapApp.addListener("appStateChange", function (state) {
      console.log("[Levain] appStateChange isActive:", state.isActive);
      if (state.isActive && currentPollToken) {
        console.log("[Levain] App resumed — force-checking auth result");
        fetch(NETLIFY_ORIGIN + "/api/login?token=" + encodeURIComponent(currentPollToken))
          .then(function (res) { return res.json(); })
          .then(function (data) {
            console.log("[Levain] Force-check result:", JSON.stringify(data));
            if (data.success && data.email) {
              stopPolling();
              currentPollToken = null;
              if (CapBrowser) { try { CapBrowser.close(); } catch (e) {} }
              completeLogin(data.email, data.name || "");
            }
          })
          .catch(function (err) {
            console.error("[Levain] Force-check failed:", err);
          });
      }
    });
  }

  console.log("[Levain] isNative:", isNative, "CapBrowser:", !!CapBrowser, "CapApp:", !!CapApp);

  /**
   * Check on boot if we're returning from the Google OAuth callback (web only).
   */
  function checkOAuthRedirect() {
    var search = window.location.search;
    if (!search || search.indexOf("google_auth") === -1) return false;

    var params = {};
    search.substring(1).split("&").forEach(function (part) {
      var kv = part.split("=");
      params[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1] || "");
    });

    history.replaceState(null, "", window.location.pathname);

    if (params.google_auth === "error") {
      showLogin();
      showAuthError(t("errGeneric"));
      return true;
    }

    if (params.google_auth === "1" && params.email) {
      completeLogin(params.email, params.name || "");
      return true;
    }

    return false;
  }

  /** Generate a random token for native OAuth polling */
  function generateToken() {
    var chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    var token = "";
    for (var i = 0; i < 32; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }

  /** Poll the server for OAuth result (native flow) */
  function startPolling(token) {
    var attempts = 0;
    var maxAttempts = 60; // 2 minutes at 2-second intervals

    authPollTimer = setInterval(function () {
      attempts++;
      if (attempts > maxAttempts) {
        clearInterval(authPollTimer);
        authPollTimer = null;
        showAuthError(t("errGeneric"));
        var btn = $("btn-google-signin");
        btn.querySelector("span").textContent = t("googleSignInBtn");
        btn.disabled = false;
        return;
      }

      fetch(NETLIFY_ORIGIN + "/api/login?token=" + encodeURIComponent(token))
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.success && data.email) {
            // Got it!
            clearInterval(authPollTimer);
            authPollTimer = null;
            // Close the Custom Chrome Tab
            if (CapBrowser) { try { CapBrowser.close(); } catch (e) {} }
            completeLogin(data.email, data.name || "");
          }
          // If data.pending, keep polling
        })
        .catch(function () {
          // Network error, keep trying
        });
    }, 2000);
  }

  /** Stop polling if active */
  function stopPolling() {
    if (authPollTimer) {
      clearInterval(authPollTimer);
      authPollTimer = null;
    }
  }

  /** Start Google OAuth */
  function startGoogleOAuth() {
    if (isNative) {
      // Native: generate token, open system browser, poll for result
      var token = generateToken();
      var state = "native_" + token;
      var authUrl = "https://accounts.google.com/o/oauth2/v2/auth" +
        "?client_id=" + encodeURIComponent(GOOGLE_CLIENT_ID) +
        "&redirect_uri=" + encodeURIComponent(OAUTH_REDIRECT_URI) +
        "&response_type=code" +
        "&scope=" + encodeURIComponent("email profile") +
        "&state=" + encodeURIComponent(state) +
        "&prompt=select_account" +
        "&access_type=online";

      // Save token for resume-check
      currentPollToken = token;

      // Open in Custom Chrome Tab (preferred — closeable, stays in-app)
      if (CapBrowser && typeof CapBrowser.open === "function") {
        console.log("[Levain] Opening OAuth via Browser.open (Custom Tab)");
        CapBrowser.open({ url: authUrl });
      } else {
        console.log("[Levain] Browser plugin unavailable, using window.open _system");
        window.open(authUrl, "_system");
      }

      // Start polling for the result
      startPolling(token);
    } else {
      // Web: direct redirect
      var authUrl = "https://accounts.google.com/o/oauth2/v2/auth" +
        "?client_id=" + encodeURIComponent(GOOGLE_CLIENT_ID) +
        "&redirect_uri=" + encodeURIComponent(OAUTH_REDIRECT_URI) +
        "&response_type=code" +
        "&scope=" + encodeURIComponent("email profile") +
        "&state=web" +
        "&prompt=select_account" +
        "&access_type=online";
      window.location.href = authUrl;
    }
  }

  // Google button click
  $("btn-google-signin").addEventListener("click", function () {
    hideAuthError();
    stopPolling();
    var btn = $("btn-google-signin");
    var label = btn.querySelector("span");
    label.textContent = t("googleSignInLoading");
    btn.disabled = true;

    startGoogleOAuth();
  });

  $("btn-logout").addEventListener("click", function () {
    stopPolling();
    currentPollToken = null;
    localStorage.removeItem(SK.userEmail);
    localStorage.removeItem(SK.userName);
    // Reset Google button state
    var btn = $("btn-google-signin");
    btn.querySelector("span").textContent = t("googleSignInBtn");
    btn.disabled = false;
    showLogin();
  });

  // Language toggles
  $("login-lang-toggle").addEventListener("click", toggleLanguage);
  $("app-lang-toggle").addEventListener("click", toggleLanguage);

  // =========================================
  // User Settings
  // =========================================

  var GRAMS_PER_OZ = 28.3495;

  function getSettings() {
    try { return JSON.parse(localStorage.getItem(SK.settings)) || {}; }
    catch (e) { return {}; }
  }

  function saveSettings(s) {
    localStorage.setItem(SK.settings, JSON.stringify(s));
  }

  function isImperial() {
    return !!getSettings().imperial;
  }

  function convertWeight(grams) {
    if (!isImperial()) return grams;
    return roundTo(grams / GRAMS_PER_OZ);
  }

  function weightUnit() {
    return isImperial() ? t("unitOz") : t("unitGrams");
  }

  // Settings panel
  $("btn-settings").addEventListener("click", function () {
    var s = getSettings();
    $("setting-imperial").checked = !!s.imperial;
    $("setting-bake-alerts").checked = s.bakeAlerts !== false;
    $("setting-feed-reminder").checked = s.feedReminder !== false;
    $("settings-overlay").classList.remove("hidden");
  });

  $("btn-close-settings").addEventListener("click", function () {
    $("settings-overlay").classList.add("hidden");
  });

  $("settings-overlay").addEventListener("click", function (e) {
    if (e.target === $("settings-overlay")) $("settings-overlay").classList.add("hidden");
  });

  $("setting-imperial").addEventListener("change", function () {
    var s = getSettings();
    s.imperial = this.checked;
    saveSettings(s);
    updateCalc();
    updateBPCalc();
  });

  $("setting-bake-alerts").addEventListener("change", function () {
    var s = getSettings();
    s.bakeAlerts = this.checked;
    saveSettings(s);
  });

  $("setting-feed-reminder").addEventListener("change", function () {
    var s = getSettings();
    s.feedReminder = this.checked;
    saveSettings(s);
  });

  // =========================================
  // Multi-Starter Management
  // =========================================

  function getStarters() {
    try { return JSON.parse(localStorage.getItem(SK.starters)) || []; }
    catch (e) { return []; }
  }

  function saveStarters(arr) {
    localStorage.setItem(SK.starters, JSON.stringify(arr));
  }

  function getActiveStarterId() {
    return localStorage.getItem(SK.activeStarter) || null;
  }

  function setActiveStarterId(id) {
    localStorage.setItem(SK.activeStarter, id);
  }

  function getActiveStarter() {
    var starters = getStarters();
    var id = getActiveStarterId();
    if (!id && starters.length > 0) {
      id = starters[0].id;
      setActiveStarterId(id);
    }
    for (var i = 0; i < starters.length; i++) {
      if (starters[i].id === id) return starters[i];
    }
    return null;
  }

  function ensureDefaultStarter() {
    var starters = getStarters();
    if (starters.length === 0) {
      var defaultStarter = {
        id: "starter_" + Date.now(),
        name: t("newStarterName"),
        creationDate: new Date().toISOString(),
        status: "active",
        lastFed: localStorage.getItem(SK.lastFed) || null,
      };
      starters.push(defaultStarter);
      saveStarters(starters);
      setActiveStarterId(defaultStarter.id);
    }
  }

  function calcStarterAge(creationDate) {
    var created = new Date(creationDate);
    var now = new Date();
    var months = (now.getFullYear() - created.getFullYear()) * 12 + (now.getMonth() - created.getMonth());
    if (months >= 12) {
      var years = Math.floor(months / 12);
      return t("starterAgeYears").replace("{y}", years);
    }
    return t("starterAge").replace("{m}", Math.max(1, months));
  }

  function getStarterStatus(starter) {
    if (!starter.lastFed) return "needs-feeding";
    var elapsed = Date.now() - new Date(starter.lastFed).getTime();
    var days = elapsed / 86400000;
    if (days > 4) return "needs-feeding";
    return starter.status || "active";
  }

  function statusLabel(status) {
    if (status === "active") return t("statusActive");
    if (status === "resting") return t("statusResting");
    return t("statusNeedsFeeding");
  }

  function renderStarterCards() {
    ensureDefaultStarter();
    var starters = getStarters();
    var activeId = getActiveStarterId();
    var container = $("starter-cards");

    container.innerHTML = starters.map(function (s) {
      var status = getStarterStatus(s);
      var isActive = s.id === activeId;
      return '<div class="starter-card' + (isActive ? ' active' : '') + '" data-id="' + s.id + '">' +
        '<div class="starter-card-name">' + escHtml(s.name) + '</div>' +
        '<div class="starter-card-age">' + calcStarterAge(s.creationDate) + '</div>' +
      '</div>';
    }).join("");

    container.querySelectorAll(".starter-card").forEach(function (card) {
      card.addEventListener("click", function () {
        setActiveStarterId(card.dataset.id);
        renderStarterCards();
        loadRefreshForActiveStarter();
      });
    });

    // Update detail card
    var active = getActiveStarter();
    if (active) {
      var status = getStarterStatus(active);
      $("starter-detail-name").textContent = active.name;
      $("starter-detail-age").textContent = calcStarterAge(active.creationDate);
      var badge = $("starter-status-badge");
      badge.textContent = statusLabel(status);
      badge.className = "starter-status-badge " + status;

      // Photo
      var photoEl = $("starter-photo");
      if (active.photo) {
        photoEl.src = active.photo;
        photoEl.classList.add("has-photo");
      } else {
        photoEl.src = "";
        photoEl.classList.remove("has-photo");
      }

      // Delete button — only show if more than 1 starter
      var delBtn = $("btn-delete-starter");
      delBtn.style.display = starters.length > 1 ? "" : "none";
    }
  }

  function loadRefreshForActiveStarter() {
    var active = getActiveStarter();
    if (!active) { loadRefresh(); return; }
    // Update SK.lastFed to point to the active starter's lastFed
    var elTime = $("last-refresh-time");
    var elTimer = $("refresh-timer");
    if (!active.lastFed) {
      elTime.textContent = t("noFeedYet");
      elTimer.textContent = "";
      return;
    }
    elTime.textContent = t("lastFeedAt") + formatDate(new Date(active.lastFed));
    // Timer update handled by interval
  }

  $("btn-add-starter").addEventListener("click", function () {
    var starters = getStarters();
    var newStarter = {
      id: "starter_" + Date.now(),
      name: t("newStarterName") + " " + (starters.length + 1),
      creationDate: new Date().toISOString(),
      status: "active",
      lastFed: null,
    };
    starters.push(newStarter);
    saveStarters(starters);
    setActiveStarterId(newStarter.id);
    renderStarterCards();
    loadRefreshForActiveStarter();
    // Let user rename immediately via the detail card name
    var nameEl = $("starter-detail-name");
    nameEl.contentEditable = "true";
    nameEl.focus();
    // Select all text
    var range = document.createRange();
    range.selectNodeContents(nameEl);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    // Save on blur or Enter
    function saveName() {
      nameEl.contentEditable = "false";
      var newName = nameEl.textContent.trim();
      if (newName) {
        var arr = getStarters();
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].id === newStarter.id) { arr[i].name = newName; break; }
        }
        saveStarters(arr);
        renderStarterCards();
      }
      nameEl.removeEventListener("blur", saveName);
      nameEl.removeEventListener("keydown", onKey);
    }
    function onKey(e) {
      if (e.key === "Enter") { e.preventDefault(); nameEl.blur(); }
    }
    nameEl.addEventListener("blur", saveName);
    nameEl.addEventListener("keydown", onKey);
  });

  // Override the fed button to work with active starter
  $("btn-refreshed").addEventListener("click", function () {
    var starters = getStarters();
    var activeId = getActiveStarterId();
    var now = new Date().toISOString();
    for (var i = 0; i < starters.length; i++) {
      if (starters[i].id === activeId) {
        starters[i].lastFed = now;
        starters[i].status = "active";
        break;
      }
    }
    saveStarters(starters);
    localStorage.setItem(SK.lastFed, now); // backward compat
    renderStarterCards();
    loadRefreshForActiveStarter();
  });

  // Tap starter name to edit
  $("starter-detail-name").addEventListener("click", function () {
    var nameEl = $("starter-detail-name");
    if (nameEl.contentEditable === "true") return;
    nameEl.contentEditable = "true";
    nameEl.focus();
    var range = document.createRange();
    range.selectNodeContents(nameEl);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);

    function saveName() {
      nameEl.contentEditable = "false";
      var newName = nameEl.textContent.trim();
      if (newName) {
        var arr = getStarters();
        var activeId = getActiveStarterId();
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].id === activeId) { arr[i].name = newName; break; }
        }
        saveStarters(arr);
        renderStarterCards();
      }
      nameEl.removeEventListener("blur", saveName);
      nameEl.removeEventListener("keydown", onKey);
    }
    function onKey(e) {
      if (e.key === "Enter") { e.preventDefault(); nameEl.blur(); }
    }
    nameEl.addEventListener("blur", saveName);
    nameEl.addEventListener("keydown", onKey);
  });

  // Tap starter age to change creation date
  $("starter-detail-age").addEventListener("click", function () {
    var active = getActiveStarter();
    if (!active) return;
    var dateInput = $("starter-date-input");
    var d = new Date(active.creationDate);
    dateInput.value = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    dateInput.max = new Date().toISOString().split("T")[0];
    dateInput.showPicker ? dateInput.showPicker() : dateInput.click();
  });

  $("starter-date-input").addEventListener("change", function () {
    var val = this.value;
    if (!val) return;
    var arr = getStarters();
    var activeId = getActiveStarterId();
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].id === activeId) {
        arr[i].creationDate = new Date(val + "T00:00:00").toISOString();
        break;
      }
    }
    saveStarters(arr);
    renderStarterCards();
  });

  // Delete starter from detail card
  $("btn-delete-starter").addEventListener("click", function () {
    showConfirm(t("deleteStarterConfirm"), function () {
      var id = getActiveStarterId();
      var arr = getStarters().filter(function (s) { return s.id !== id; });
      saveStarters(arr);
      if (arr.length > 0) setActiveStarterId(arr[0].id);
      renderStarterCards();
      loadRefreshForActiveStarter();
    });
  });

  // Starter photo upload
  $("starter-photo-input").addEventListener("change", function (e) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    // Resize and store as base64 data URL
    var reader = new FileReader();
    reader.onload = function (ev) {
      var img = new Image();
      img.onload = function () {
        var canvas = document.createElement("canvas");
        var size = 200; // max dimension
        var w = img.width, h = img.height;
        if (w > h) { canvas.width = size; canvas.height = Math.round(h * size / w); }
        else { canvas.height = size; canvas.width = Math.round(w * size / h); }
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        var dataUrl = canvas.toDataURL("image/jpeg", 0.7);

        var arr = getStarters();
        var activeId = getActiveStarterId();
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].id === activeId) { arr[i].photo = dataUrl; break; }
        }
        saveStarters(arr);
        renderStarterCards();
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = ""; // reset so same file can be re-selected
  });

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
    var active = getActiveStarter();
    var iso = active ? active.lastFed : localStorage.getItem(SK.lastFed);
    if (!iso) return;
    var elapsed = Date.now() - new Date(iso).getTime();
    $("refresh-timer").textContent = t("elapsed") + formatDuration(elapsed);
  }

  // btn-refreshed handler is in Multi-Starter Management section above

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
    // Backward compat: add new fields if missing
    if (!state.completedAt) state.completedAt = {};
    if (!state.targetDurations) {
      var ls = LIFESTYLES[state.scheduleType] || LIFESTYLES.worker;
      state.targetDurations = {
        levain: ls.levainHours * 60,
        autolyse: ls.autolyseDef,
        cold: ls.coldDefault * 60,
      };
    }
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
    var ls = LIFESTYLES[lifestyle];
    saveBakeState({
      active: true,
      startTime: new Date().toISOString(),
      scheduleType: lifestyle,
      checked: [],
      completedAt: {},
      targetDurations: {
        levain: ls.levainHours * 60,
        autolyse: ls.autolyseDef,
        cold: ls.coldDefault * 60,
      },
      autolyseStart: null,
      bulkStart: null,
      fold4Added: false,
      foldStarts: {},
      volumeStart: null,
      preShapeStart: null,
      coldStart: null,
      coldHours: ls.coldDefault,
      bakePhase1Start: null,
      bakePhase2Start: null,
      bakePhase1Temp: 250,
      bakePhase1Min: 20,
      bakePhase2Temp: 220,
      bakePhase2Min: 20,
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
      showConfirm(t("resetBakeConfirm"), clearBake);
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
      desc: t("stepScoreBakeDesc"), bakePhaseStep: true });

    // When a step is completed, subsequent unchecked steps should count
    // elapsed time from the most recent completed predecessor's timestamp,
    // instead of counting down to their original scheduled target.
    var ca = state.completedAt || {};
    var lastDoneTs = null;
    for (var si = 0; si < steps.length; si++) {
      var doneTs = toMs(ca[steps[si].id]);
      if (doneTs && state.checked.includes(steps[si].id)) {
        lastDoneTs = doneTs;
      } else if (lastDoneTs && !steps[si].timerRef && steps[si].targetTs) {
        // This step is unchecked and has a scheduled target but no manual timer —
        // override so it counts up from the last completed step
        steps[si].timerRef = lastDoneTs;
      }
    }

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
      if (!s.completedAt) s.completedAt = {};
      var idx = s.checked.indexOf(step.id);
      if (idx === -1) {
        // Mark done — capture actual timestamp
        s.checked.push(step.id);
        s.completedAt[step.id] = new Date().toISOString();
      } else {
        // Uncheck
        s.checked.splice(idx, 1);
        delete s.completedAt[step.id];
      }
      saveBakeState(s);
      renderBakeUI();
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

    if (step.targetTs || step.timerRef) {
      var m = document.createElement("div");
      m.className = "step-meta";
      // Show actual start reference (from completed predecessor) over original schedule
      var displayTs = step.timerRef || step.targetTs;
      m.textContent = formatTime(new Date(displayTs));
      body.appendChild(m);
    }

    // Show actual completion time if done, otherwise show live timer
    var completedAt = (state.completedAt || {})[step.id];
    if (completedAt && state.checked.includes(step.id)) {
      var completedMs = toMs(completedAt);
      var startRef = step.timerRef || step.targetTs || toMs(state.startTime);
      if (startRef && completedMs > startRef) {
        var actualMin = Math.round((completedMs - startRef) / 60000);
        var actualH = Math.floor(actualMin / 60);
        var actualM = actualMin % 60;
        var actualStr = actualH > 0 ? actualH + "h " + actualM + "m" : actualM + "m";
        var doneEl = document.createElement("div");
        doneEl.className = "step-elapsed";
        doneEl.style.color = "var(--accent-text)";
        doneEl.textContent = t("completedIn") + " " + actualStr;
        body.appendChild(doneEl);
      }
    } else if (step.timerRef || step.targetTs) {
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
    if (step.bakePhaseStep) body.appendChild(createBakePhaseControls(state));

    li.appendChild(body);
    return li;
  }

  // --- 2-Phase Bake Controls ---

  function createBakePhaseControls(state) {
    var c = document.createElement("div");
    c.className = "bake-phases";

    var p1Start = toMs(state.bakePhase1Start);
    var p2Start = toMs(state.bakePhase2Start);
    var p1Min = state.bakePhase1Min || 20;
    var p2Min = state.bakePhase2Min || 20;
    var p1Temp = state.bakePhase1Temp || 250;
    var p2Temp = state.bakePhase2Temp || 220;

    // --- Phase 1 card ---
    var card1 = document.createElement("div");
    card1.className = "bake-phase-card";
    if (p1Start && !p2Start) card1.classList.add("active-phase");

    var h1 = document.createElement("div");
    h1.className = "bake-phase-header";
    h1.textContent = t("bakePhase1Title");
    card1.appendChild(h1);

    var inputs1 = document.createElement("div");
    inputs1.className = "bake-phase-inputs";

    var tempWrap1 = document.createElement("div"); tempWrap1.className = "bake-phase-input";
    var tempLbl1 = document.createElement("label"); tempLbl1.textContent = t("bakeTempLabel"); tempWrap1.appendChild(tempLbl1);
    var tempInp1 = document.createElement("input"); tempInp1.type = "number"; tempInp1.value = p1Temp; tempInp1.min = "100"; tempInp1.max = "350";
    if (p1Start) tempInp1.disabled = true;
    tempInp1.addEventListener("change", function () {
      var s = getBakeState(); if (!s) return;
      s.bakePhase1Temp = parseInt(tempInp1.value, 10) || 250;
      saveBakeState(s);
    });
    tempWrap1.appendChild(tempInp1);
    inputs1.appendChild(tempWrap1);

    var minWrap1 = document.createElement("div"); minWrap1.className = "bake-phase-input";
    var minLbl1 = document.createElement("label"); minLbl1.textContent = t("bakeMinLabel"); minWrap1.appendChild(minLbl1);
    var minInp1 = document.createElement("input"); minInp1.type = "number"; minInp1.value = p1Min; minInp1.min = "1"; minInp1.max = "120";
    if (p1Start) minInp1.disabled = true;
    minInp1.addEventListener("change", function () {
      var s = getBakeState(); if (!s) return;
      s.bakePhase1Min = parseInt(minInp1.value, 10) || 20;
      saveBakeState(s);
    });
    minWrap1.appendChild(minInp1);
    inputs1.appendChild(minWrap1);
    card1.appendChild(inputs1);

    if (p1Start) {
      var p1End = p1Start + p1Min * 60000;
      if (p2Start || Date.now() >= p1End) {
        var done1 = document.createElement("div");
        done1.className = "bake-phase-done";
        done1.textContent = t("bakePhase1Done");
        card1.appendChild(done1);
      } else {
        var timer1 = document.createElement("div");
        timer1.className = "bake-phase-timer";
        timer1.dataset.phaseend = String(p1End);
        timer1.dataset.phase = "1";
        card1.appendChild(timer1);
      }
    }
    c.appendChild(card1);

    // --- Phase 2 card ---
    var card2 = document.createElement("div");
    card2.className = "bake-phase-card";
    if (p2Start) card2.classList.add("active-phase");

    var h2 = document.createElement("div");
    h2.className = "bake-phase-header";
    h2.textContent = t("bakePhase2Title");
    card2.appendChild(h2);

    var inputs2 = document.createElement("div");
    inputs2.className = "bake-phase-inputs";

    var tempWrap2 = document.createElement("div"); tempWrap2.className = "bake-phase-input";
    var tempLbl2 = document.createElement("label"); tempLbl2.textContent = t("bakeTempLabel"); tempWrap2.appendChild(tempLbl2);
    var tempInp2 = document.createElement("input"); tempInp2.type = "number"; tempInp2.value = p2Temp; tempInp2.min = "100"; tempInp2.max = "350";
    if (p2Start) tempInp2.disabled = true;
    tempInp2.addEventListener("change", function () {
      var s = getBakeState(); if (!s) return;
      s.bakePhase2Temp = parseInt(tempInp2.value, 10) || 220;
      saveBakeState(s);
    });
    tempWrap2.appendChild(tempInp2);
    inputs2.appendChild(tempWrap2);

    var minWrap2 = document.createElement("div"); minWrap2.className = "bake-phase-input";
    var minLbl2 = document.createElement("label"); minLbl2.textContent = t("bakeMinLabel"); minWrap2.appendChild(minLbl2);
    var minInp2 = document.createElement("input"); minInp2.type = "number"; minInp2.value = p2Min; minInp2.min = "1"; minInp2.max = "120";
    if (p2Start) minInp2.disabled = true;
    minInp2.addEventListener("change", function () {
      var s = getBakeState(); if (!s) return;
      s.bakePhase2Min = parseInt(minInp2.value, 10) || 20;
      saveBakeState(s);
    });
    minWrap2.appendChild(minInp2);
    inputs2.appendChild(minWrap2);
    card2.appendChild(inputs2);

    if (p2Start) {
      var p2End = p2Start + p2Min * 60000;
      if (Date.now() >= p2End) {
        var done2 = document.createElement("div");
        done2.className = "bake-phase-done";
        done2.textContent = t("bakePhase2Done");
        card2.appendChild(done2);
      } else {
        var timer2 = document.createElement("div");
        timer2.className = "bake-phase-timer";
        timer2.dataset.phaseend = String(p2End);
        timer2.dataset.phase = "2";
        card2.appendChild(timer2);
      }
    }
    c.appendChild(card2);

    // --- Start button ---
    if (!p1Start) {
      var startBtn = document.createElement("button");
      startBtn.className = "btn-start-bake-phase";
      startBtn.textContent = t("btnStartBakePhase");
      startBtn.addEventListener("click", function () {
        var s = getBakeState(); if (!s) return;
        s.bakePhase1Temp = parseInt(tempInp1.value, 10) || 250;
        s.bakePhase1Min = parseInt(minInp1.value, 10) || 20;
        s.bakePhase2Temp = parseInt(tempInp2.value, 10) || 220;
        s.bakePhase2Min = parseInt(minInp2.value, 10) || 20;
        s.bakePhase1Start = new Date().toISOString();
        saveBakeState(s);
        renderBakeUI();
      });
      c.appendChild(startBtn);
    }

    return c;
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

    // Track last completed fold time so the next fold counts from it
    var lastFoldDoneTs = null;

    folds.forEach(function (fd, fi) {
      var sub = document.createElement("div");
      sub.className = "sub-step";
      var isDone = state.checked.includes(fd.id);
      if (isDone) sub.classList.add("done");

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
        renderBakeUI();
      });
      sub.appendChild(scb);

      // Determine timer reference: use previous fold's completion time if available
      var scheduledTs = bulkStartMs + fd.ms;
      var timerTs = (lastFoldDoneTs && !isDone) ? lastFoldDoneTs : scheduledTs;

      var bd = document.createElement("div");
      bd.className = "sub-step-body";
      var nm = document.createElement("div"); nm.className = "sub-step-name"; nm.textContent = fd.name; bd.appendChild(nm);
      var ds = document.createElement("div"); ds.className = "sub-step-desc"; ds.textContent = fd.desc; bd.appendChild(ds);

      // Show start time
      var mt = document.createElement("div");
      mt.className = "step-meta";
      mt.textContent = formatTime(new Date(timerTs));
      bd.appendChild(mt);

      sub.appendChild(bd);

      var tm = document.createElement("span");
      tm.className = "sub-step-timer";
      tm.dataset.foldtarget = String(timerTs);
      tm.dataset.chimekey = fd.id;
      sub.appendChild(tm);

      c.appendChild(sub);

      // Update lastFoldDoneTs for next iteration
      var foldDoneTs = toMs(state.foldStarts[fd.id]);
      if (isDone && foldDoneTs) {
        lastFoldDoneTs = foldDoneTs;
      }
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

    // --- 2-Phase Bake Timers ---
    document.querySelectorAll(".bake-phase-timer[data-phaseend]").forEach(function (el) {
      var endTs = Number(el.dataset.phaseend);
      var remaining = endTs - now;
      if (remaining > 0) {
        var min = Math.floor(remaining / 60000);
        var sec = Math.floor((remaining % 60000) / 1000);
        el.textContent = String(min).padStart(2, "0") + ":" + String(sec).padStart(2, "0");
      } else {
        el.textContent = "00:00";
        var phase = el.dataset.phase;
        if (phase === "1" && !chimeFired["bake-phase1"]) {
          chimeFired["bake-phase1"] = true;
          playChime();
          showToast(t("chimeBakePhase1"));
          // Auto-start phase 2
          var s = getBakeState();
          if (s && !s.bakePhase2Start) {
            s.bakePhase2Start = new Date().toISOString();
            saveBakeState(s);
            renderBakeUI();
          }
        }
        if (phase === "2") {
          checkChime("bake-phase2", now - endTs);
        }
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
    inp.addEventListener("input", function () { updateBPCalc(); });
  });

  // --- Multi-flour split ---

  var flourTypes = []; // each: { name, grams, pct }
  var flourSplitActive = false;

  function flourTypeSum() {
    var sum = 0;
    for (var i = 0; i < flourTypes.length; i++) sum += (flourTypes[i].grams || 0);
    return sum;
  }

  function flourTypePctSum() {
    var sum = 0;
    for (var i = 0; i < flourTypes.length; i++) sum += (flourTypes[i].pct || 0);
    return roundTo(sum);
  }

  function recalcGramsFromPct() {
    var totalFlour = parseFloat(bpFlour.value) || 0;
    for (var i = 0; i < flourTypes.length; i++) {
      flourTypes[i].grams = roundTo(totalFlour * (flourTypes[i].pct || 0) / 100);
    }
  }

  function updateFlourTotalDisplay() {
    var totalFlour = parseFloat(bpFlour.value) || 0;
    var pctSum = flourTypePctSum();
    var display = $("flour-total-display");
    var warning = pctSum > 100;
    display.textContent = flourTypeSum() + "g / " + totalFlour + "g (" + pctSum + "%)";
    display.style.color = warning ? "var(--danger)" : "";
    display.style.fontWeight = warning ? "600" : "";
  }

  function renderFlourRows() {
    var container = $("flour-rows");
    container.innerHTML = flourTypes.map(function (f, i) {
      return '<div class="flour-row" data-idx="' + i + '">' +
        '<div class="flour-row-name"><label>' + t("flourTypeName") + '</label>' +
        '<input type="text" value="' + escHtml(f.name) + '" data-field="name" data-idx="' + i + '" placeholder="' + t("flourTypeNamePh") + '"></div>' +
        '<div class="flour-row-grams"><label>' + t("bpGrams") + '</label>' +
        '<input type="number" inputmode="numeric" value="' + f.grams + '" data-field="grams" data-idx="' + i + '" min="0"></div>' +
        '<div class="flour-row-pct"><label>%</label>' +
        '<input type="number" inputmode="numeric" value="' + roundTo(f.pct) + '" data-field="pct" data-idx="' + i + '" min="0" step="0.1"></div>' +
        '<button class="flour-row-remove" type="button" data-idx="' + i + '" aria-label="remove">&times;</button>' +
      '</div>';
    }).join("");

    updateFlourTotalDisplay();

    // Wire events
    container.querySelectorAll("input").forEach(function (inp) {
      inp.addEventListener("input", function () {
        var idx = Number(inp.dataset.idx);
        var field = inp.dataset.field;
        var totalFlour = parseFloat(bpFlour.value) || 0;

        if (field === "name") {
          flourTypes[idx].name = inp.value;
          return;
        } else if (field === "grams") {
          // Changing grams updates percentage — total stays fixed
          flourTypes[idx].grams = parseFloat(inp.value) || 0;
          flourTypes[idx].pct = totalFlour > 0 ? roundTo(flourTypes[idx].grams / totalFlour * 100) : flourTypes[idx].pct;
          var pctInput = container.querySelector('input[data-field="pct"][data-idx="' + idx + '"]');
          if (pctInput) pctInput.value = roundTo(flourTypes[idx].pct);
        } else if (field === "pct") {
          // Changing percentage updates grams — total stays fixed
          flourTypes[idx].pct = parseFloat(inp.value) || 0;
          flourTypes[idx].grams = roundTo(totalFlour * flourTypes[idx].pct / 100);
          var gramsInput = container.querySelector('input[data-field="grams"][data-idx="' + idx + '"]');
          if (gramsInput) gramsInput.value = flourTypes[idx].grams;
        }
        updateFlourTotalDisplay();
        updateBPCalc();
      });
    });

    container.querySelectorAll(".flour-row-remove").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var idx = Number(btn.dataset.idx);
        flourTypes.splice(idx, 1);
        if (flourTypes.length === 0) {
          flourSplitActive = false;
          $("flour-rows-container").classList.add("hidden");
          $("btn-split-flour").classList.remove("hidden");
        }
        renderFlourRows();
        updateBPCalc();
      });
    });
  }

  $("btn-split-flour").addEventListener("click", function () {
    flourSplitActive = true;
    var totalFlour = parseFloat(bpFlour.value) || 500;
    _flourLastTotal = totalFlour;
    flourTypes = [
      { name: t("flourBread") || "Bread flour", grams: totalFlour, pct: 100 }
    ];
    $("flour-rows-container").classList.remove("hidden");
    $("btn-split-flour").classList.add("hidden");
    renderFlourRows();
  });

  $("btn-add-flour").addEventListener("click", function () {
    flourTypes.push({ name: "", grams: 0, pct: 0 });
    renderFlourRows();
  });

  // When total flour changes, recalculate all type grams from stored percentages
  var _flourLastTotal = 0;
  var _flourUpdating = false;
  (function () {
    var origUpdate = updateBPCalc;
    updateBPCalc = function () {
      if (flourSplitActive && flourTypes.length > 0 && !_flourUpdating) {
        var newTotal = parseFloat(bpFlour.value) || 0;
        if (newTotal !== _flourLastTotal) {
          _flourUpdating = true;
          _flourLastTotal = newTotal;
          recalcGramsFromPct();
          renderFlourRows();
          _flourUpdating = false;
        }
      }
      origUpdate();
    };
  })();

  // --- Recipe persistence (Airtable-backed) ---

  // In-memory cache of recipes fetched from Airtable
  var recipesCache = [];

  function getUserEmail() {
    return (localStorage.getItem(SK.userEmail) || "").trim().toLowerCase();
  }

  async function fetchRecipesFromServer() {
    var email = getUserEmail();
    if (!email) return [];
    try {
      var res = await fetch(API_BASE + "/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "list", userEmail: email })
      });
      var data = await res.json();
      if (data.success && data.recipes) {
        recipesCache = data.recipes;
        return data.recipes;
      }
      return [];
    } catch (e) {
      console.error("Failed to fetch recipes:", e);
      return [];
    }
  }

  async function saveRecipeToServer(recipe) {
    var email = getUserEmail();
    if (!email) {
      console.error("Save failed: not logged in");
      return null;
    }
    try {
      var res = await fetch(API_BASE + "/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save", userEmail: email, recipe: recipe })
      });
      if (!res.ok) {
        console.error("Save failed: HTTP " + res.status);
        return null;
      }
      var data = await res.json();
      if (data.success && data.recipe) {
        return data.recipe;
      }
      console.error("Save failed:", JSON.stringify(data));
      return null;
    } catch (e) {
      console.error("Failed to save recipe:", e);
      return null;
    }
  }

  async function deleteRecipeFromServer(recordId) {
    var email = getUserEmail();
    if (!email) return false;
    try {
      var res = await fetch(API_BASE + "/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", userEmail: email, recordId: recordId })
      });
      var data = await res.json();
      return !!data.success;
    } catch (e) {
      console.error("Failed to delete recipe:", e);
      return false;
    }
  }

  async function renderRecipes() {
    var list = $("recipe-list");
    var noMsg = $("no-recipes-msg");

    // Show loading state
    list.innerHTML = '<div style="text-align:center;padding:1rem;opacity:0.6;">' + t("loading") + '</div>';

    var recipes = await fetchRecipesFromServer();

    if (recipes.length === 0) {
      noMsg.classList.remove("hidden");
      list.innerHTML = "";
      return;
    }
    noMsg.classList.add("hidden");

    list.innerHTML = recipes.map(function (r, i) {
      return '<div class="recipe-card" data-id="' + escHtml(r.id) + '">' +
        '<div class="recipe-card-header">' +
          '<span class="recipe-card-name">' + escHtml(r.name) + '</span>' +
          '<button class="recipe-delete-btn" data-id="' + escHtml(r.id) + '" data-idx="' + i + '" aria-label="delete">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
              '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>' +
            '</svg>' +
          '</button>' +
        '</div>' +
        '<div class="recipe-percentages">' +
          '<span class="recipe-pct-tag"><strong>' + r.flour + 'g</strong> ' + t("bpFlourRow") + '</span>' +
          (r.flourTypes && r.flourTypes.length > 0 ? r.flourTypes.map(function (f) {
            return '<span class="recipe-pct-tag recipe-flour-type"><strong>' + f.grams + 'g</strong> ' + escHtml(f.name || t("flourTypeName")) + '</span>';
          }).join("") : '') +
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
        showConfirm(t("recipeDeleteConfirm"), async function () {
          var recordId = btn.dataset.id;
          btn.disabled = true;
          var ok = await deleteRecipeFromServer(recordId);
          if (ok) {
            await renderRecipes();
          } else {
            alert(t("recipeDeleteFailed") || "Delete failed");
            btn.disabled = false;
          }
        });
      });
    });

    // Wire "load into calculator" buttons
    list.querySelectorAll(".recipe-load-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var r = recipesCache[Number(btn.dataset.idx)];
        if (!r) return;
        bpName.value = r.name;
        bpFlour.value = r.flour;
        bpHydration.value = r.hydration;
        bpSalt.value = r.salt;
        bpStarter.value = r.starter;
        // Restore flour types if available
        if (r.flourTypes && r.flourTypes.length > 0) {
          flourTypes = r.flourTypes.map(function (f) {
            return { name: f.name, grams: f.grams, pct: r.flour > 0 ? roundTo(f.grams / r.flour * 100) : 0 };
          });
          flourSplitActive = true;
          $("flour-rows-container").classList.remove("hidden");
          $("btn-split-flour").classList.add("hidden");
          renderFlourRows();
        }
        updateBPCalc();
        // Scroll to top of recipes panel
        $("panel-recipes").scrollTo({ top: 0, behavior: "smooth" });
      });
    });

    // Wire "select for baking" buttons
    list.querySelectorAll(".recipe-select-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var r = recipesCache[Number(btn.dataset.idx)];
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

  function showConfirm(msg, onYes) {
    var overlay = document.createElement("div");
    overlay.className = "confirm-overlay";
    overlay.innerHTML = '<div class="confirm-box">' +
      '<p>' + escHtml(msg) + '</p>' +
      '<div class="confirm-btns">' +
        '<button class="btn btn-primary confirm-yes">' + t("confirmYes") + '</button>' +
        '<button class="btn confirm-no">' + t("confirmNo") + '</button>' +
      '</div></div>';
    document.body.appendChild(overlay);
    overlay.querySelector(".confirm-yes").addEventListener("click", function () {
      document.body.removeChild(overlay);
      onYes();
    });
    overlay.querySelector(".confirm-no").addEventListener("click", function () {
      document.body.removeChild(overlay);
    });
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) document.body.removeChild(overlay);
    });
  }

  // Save recipe button
  $("btn-save-recipe").addEventListener("click", async function () {
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
    // Include flour types if multi-flour is active
    if (flourSplitActive && flourTypes.length > 0) {
      recipe.flourTypes = flourTypes.map(function (f) {
        return { name: f.name, grams: f.grams, pct: f.pct };
      });
    }

    var btn = $("btn-save-recipe");
    var origText = btn.textContent;
    btn.textContent = t("saving") || "Saving...";
    btn.disabled = true;

    var saved = await saveRecipeToServer(recipe);
    if (saved) {
      btn.textContent = t("bpSaved");
      await renderRecipes();
    } else {
      btn.textContent = t("saveFailed") || "Save failed";
    }
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
    renderStarterCards();
    loadRefreshForActiveStarter();
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
  })();

  // Boot: check if returning from OAuth redirect (native flow)
  var handlingRedirect = checkOAuthRedirect();

  // Boot: check auth
  // Skip login screen on localhost (local dev)
  var isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  if (!handlingRedirect) {
    if (isLoggedIn() || isLocalhost) {
      showApp();
      initApp();
    } else {
      showLogin();
    }
  }

  setInterval(updateAllTimers, 1000);

})();
