# העלאת Levain ל-iOS דרך Codemagic (בלי מק)

הבילד רץ על מק בענן של Codemagic, נחתם אוטומטית ועולה ל-TestFlight.
הקובץ `codemagic.yaml` כבר מוכן. נשארו שלבים חד-פעמיים שאפשר לעשות רק בממשקים.

## 1. Apple Developer (חד-פעמי)
1. להירשם ל-Apple Developer Program **כארגון** (Uniqops Technologies). צריך מספר D-U-N-S.
2. ב-[Certificates, Identifiers & Profiles](https://developer.apple.com/account/resources/identifiers/list) → Identifiers → **+** → App IDs → App:
   - Bundle ID (Explicit): `com.inbal.levain`
   - Capabilities: לא צריך שום דבר מיוחד

## 2. App Store Connect: יצירת האפליקציה
1. [App Store Connect](https://appstoreconnect.apple.com) → Apps → **+** → New App
   - Platform: iOS, Name: Levain, Primary language: Hebrew (או English), Bundle ID: `com.inbal.levain`, SKU: `levain-ios`
2. אחרי היצירה: App Information → להעתיק את **Apple ID** (מספר של כ-10 ספרות)
3. להדביק אותו ב-`codemagic.yaml` במקום `"0000000000"` ב-`APP_STORE_APPLE_ID`

## 3. מפתח API ל-App Store Connect
1. App Store Connect → Users and Access → **Integrations** → App Store Connect API → Team Keys → **+**
   - Name: `Codemagic`, Access: **App Manager**
2. להוריד את קובץ ה-`.p8` (אפשר להוריד **פעם אחת בלבד**) ולשמור את Issuer ID ואת Key ID

## 4. Codemagic
1. להירשם ל-[codemagic.io](https://codemagic.io) עם GitHub ולהוסיף את הריפו `sourdough-app`
2. Team settings → Integrations → **Developer Portal** → Connect:
   - Key name: `Levain ASC Key` (חייב להיות זהה לשם ב-`codemagic.yaml`)
   - להזין Issuer ID ו-Key ID ולהעלות את קובץ ה-`.p8`
3. Code signing identities → iOS certificates → **Generate certificate** (Apple Distribution), ולשמור את הסיסמה
4. Code signing identities → iOS provisioning profiles → **Fetch profiles** → לבחור App Store profile ל-`com.inbal.levain`
   (אם עוד אין פרופיל: אפשר ליצור אותו ב-Apple Developer → Profiles → App Store Connect)

## 5. הרצת בילד
- **ידנית:** ב-Codemagic → Start new build → בוחרים branch ו-workflow `iOS → TestFlight`
- **אוטומטית:** דוחפים tag שמתחיל ב-`ios-v`, למשל:
  ```
  git tag ios-v1.0.0 && git push origin ios-v1.0.0
  ```
הבילד לוקח כ-10–15 דקות. אחר כך אפל מעבדת אותו עוד כ-10–30 דקות, והוא מופיע ב-TestFlight.

## 6. בדיקה על אייפון
- App Store Connect → TestFlight → Internal Testing → להוסיף את עצמך → להתקין את TestFlight באייפון
- **לבדוק במיוחד:** התחברות עם Google (נפתח דפדפן, ואחרי האישור צריך לחזור לאפליקציה), שמירת מתכונים, ותצוגה בעברית (RTL)

## 7. לפני שליחה לביקורת של אפל (חשוב!)
- **Sign in with Apple (סעיף 4.8):** אפליקציה שמחייבת התחברות עם Google חייבת להציע גם Sign in with Apple, או לא לחייב התחברות בכלל
- **מחיקת חשבון (סעיף 5.1.1(v)):** אם יש התחברות, חייבת להיות אפשרות למחוק את החשבון מתוך האפליקציה
- מדיניות פרטיות: `privacy.html` כבר קיים, ומעלים את הכתובת שלו ל-App Store Connect
- צילומי מסך: 6.9" (1320×2868), לפחות 3. אפשר לצלם מ-TestFlight על אייפון, או ב-Chrome DevTools במצב מובייל
- App Privacy: מצהירים על איסוף אימייל ושם (להתחברות)
