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
  };

  // =========================================
  // Translations
  // =========================================

  var T = {
    he: {
      // Login
      loginSubtitle: "העוזר האישי שלך לאפייה שקטה",
      emailLabel: "אימייל",
      emailPlaceholder: "you@example.com",
      nameLabel: "שם אופה",
      namePlaceholder: "השם שלך",
      loginBtn: "התחבר",
      loginBtnLoading: "מתחבר...",
      loginFail: "ההתחברות נכשלה",
      tryAgain: "נסו שנית.",

      // Lang toggle label (shows what you switch TO)
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
    },

    en: {
      loginSubtitle: "Your personal quiet baking assistant",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      nameLabel: "Baker name",
      namePlaceholder: "Your name",
      loginBtn: "Log in",
      loginBtnLoading: "Logging in...",
      loginFail: "Login failed",
      tryAgain: "Please try again.",

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
      $("header-greeting").textContent = name ? t("greeting") + name : "";
    }

    // Re-render bake workflow if active
    renderBakeUI();

    // Recalculate
    updateCalc();
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
  // Authentication
  // =========================================

  var PROXY_AVAILABLE = null;

  function apiLogin(email, name) {
    return fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, name: name })
    }).then(function (res) {
      var ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/json")) {
        PROXY_AVAILABLE = false;
        throw { offline: true };
      }
      if (!res.ok) {
        return res.json().then(function (err) {
          throw new Error(err.error || t("loginFail"));
        });
      }
      PROXY_AVAILABLE = true;
      return res.json();
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
  }

  $("login-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var email = $("login-email").value.trim();
    var name = $("login-name").value.trim();
    if (!email || !name) return;

    var btn = this.querySelector("button[type=submit]");
    btn.textContent = t("loginBtnLoading");
    btn.disabled = true;

    apiLogin(email, name).then(function () {
      localStorage.setItem(SK.userEmail, email);
      localStorage.setItem(SK.userName, name);
      showApp();
      initApp();
    }).catch(function (err) {
      if (err.offline || err.message === "Failed to fetch" || err.name === "TypeError") {
        localStorage.setItem(SK.userEmail, email);
        localStorage.setItem(SK.userName, name);
        showApp();
        initApp();
      } else {
        alert(t("loginFail") + ": " + (err.message || "") + "\n" + t("tryAgain"));
      }
    }).finally(function () {
      btn.textContent = t("loginBtn");
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
  targetInput.addEventListener("input", updateCalc);
  ratioSelect.addEventListener("change", function () {
    saveCalcPref(SK.calcRatio, ratioSelect.value);
    updateCalc();
  });
  tareInput.addEventListener("input", function () {
    saveCalcPref(SK.calcTare, tareInput.value);
    updateCalc();
  });

  function parseRatio(str) {
    var parts = str.split(":").map(Number);
    return { starter: parts[0], flour: parts[1], water: parts[2] };
  }

  function updateCalc() {
    var tw = parseInt(targetInput.value, 10);
    if (!tw || tw <= 0) {
      $("calc-result").classList.add("hidden");
      return;
    }
    var r = parseRatio(ratioSelect.value);
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
  // Init
  // =========================================

  function initApp() {
    restoreCalcPrefs();
    targetInput.value = defaultTarget();
    updateCalc();
    loadRefresh();
    renderBakeUI();
  }

  // Apply saved language on boot (before showing anything)
  (function () {
    var htmlEl = document.documentElement;
    htmlEl.lang = currentLang;
    htmlEl.dir = currentLang === "he" ? "rtl" : "ltr";
    applyTranslations();
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
