// ============================================================
// ⚙️ إعدادات الروابط المشتركة — Shared Site Configuration
// عدّل الروابط هنا فقط، وسيتم تطبيقها تلقائياً على كل الموقع:
// صفحة "اسأل الدكتور" (ask.html) والشات بوت (chatbot.js)
// ============================================================

/**
 * 1. رابط نموذج Google Form لطرح الأسئلة:
 * استبدل النص التالي برابط النموذج الخاص بك.
 * مثال: "https://docs.google.com/forms/d/e/.../viewform"
 */
const FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSevGikb8lT15niODCdbEACvoXG7P3udEIY5ABXnUJNdBwPpYg/viewform";

/**
 * 2. رابط Google Sheet المنشور بتنسيق CSV:
 * في جوجل شيت: File -> Share -> Publish to web -> اختر تنسيق CSV.
 * مثال: "https://docs.google.com/spreadsheets/d/e/.../pub?output=csv"
 */
const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTWPgwzdUmYecMGhLmhGtdPBbvzYC2YQFH7aPTSlin_bnQevSpM_6qg-MgZF0_h_66X-PB6OhGVxuRd/pub?gid=1228016318&single=true&output=csv";

/**
 * 3. معرفات حقول النموذج (Form Field Entry IDs):
 * سيتم تعيينها بالمعرفات الفعلية لنموذج Google Form.
 */
const ENTRY_SUBJECT = "entry.1540295220";
const ENTRY_QUESTION = "entry.932564472";

// ============================================================
// 👥 إعدادات "اسأل زميلك" — Ask Your Colleague Configuration
// ثوابت منفصلة خاصة بنظام أسئلة وإجابات الطلاب
// ============================================================
const STUDENT_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdIIXiks6SOB4vPidFpHoicKakBhfUWtUwJZGQXOGX1ymeGTw/viewform";
const STUDENT_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQKMg53WPGwBcquZmGAetNmjIwRPiPpS8120PrvIWX0_T5Lo180oQ4BcCW0OgSCtRoVGvjjas3t1Pys/pub?gid=1193762460&single=true&output=csv";
const STUDENT_FORM_ENTRY_SUBJECT = "entry.1349988251";
const STUDENT_FORM_ENTRY_QUESTION = "entry.1862128244";

// إتاحة الروابط والثوابت في النطاق العام (window) لضمان وصول كل الملفات إليها
if (typeof window !== "undefined") {
    window.FORM_URL = FORM_URL;
    window.CSV_URL = CSV_URL;
    window.ENTRY_SUBJECT = ENTRY_SUBJECT;
    window.ENTRY_QUESTION = ENTRY_QUESTION;
    window.STUDENT_FORM_URL = STUDENT_FORM_URL;
    window.STUDENT_CSV_URL = STUDENT_CSV_URL;
    window.STUDENT_FORM_ENTRY_SUBJECT = STUDENT_FORM_ENTRY_SUBJECT;
    window.STUDENT_FORM_ENTRY_QUESTION = STUDENT_FORM_ENTRY_QUESTION;
}
