// ============================================================
// 🤖 شات بوت مجمع طلاب BIS — Chatbot Script
// يعمل بالكامل على المتصفح بدون أي AI أو خوادم أو مفاتيح API
// يستمد بياناته من: Google Sheet CSV + بيانات الموقع في data.js
// ============================================================

// التأكد من تضمين ملف الستايل الخاص بالشات بوت تلقائياً
if (typeof document !== "undefined" && !document.querySelector('link[href*="chatbot.css"]')) {
    const chatCssLink = document.createElement("link");
    chatCssLink.rel = "stylesheet";
    chatCssLink.href = "css/chatbot.css";
    document.head.appendChild(chatCssLink);
}

// ------------------------------------------------------------
// ⚙️ إعدادات وثوابت الشات بوت (سهلة التعديل)
// ------------------------------------------------------------

/**
 * نسبة التطابق الأدنى (Threshold) لاعتبار السؤال مشابهاً لسؤال الطالب.
 * قيمة بين 0.0 و 1.0 (0.35 تعني 35% تطابق في الكلمات المفتاحية).
 * يمكنك رفعها لزيادة دقة الإجابات أو خفضها لقبول أسئلة بصيغ أوسع.
 */
const SIMILARITY_THRESHOLD = 0.35;

/**
 * استخراج رابط الفورم ورابط الشيت من ملف js/config.js المشترك
 */
function getBotFormUrl() {
    if (typeof FORM_URL !== "undefined") return FORM_URL;
    if (typeof window !== "undefined" && window.FORM_URL) return window.FORM_URL;
    return "ضع_رابط_الفورم_هنا";
}

function getBotCsvUrl() {
    if (typeof CSV_URL !== "undefined") return CSV_URL;
    if (typeof window !== "undefined" && window.CSV_URL) return window.CSV_URL;
    return "ضع_رابط_الشيت_CSV_هنا";
}


// ------------------------------------------------------------
// 🗃️ بيانات تجريبية (تُستخدم فقط إذا كان رابط الشيت هو الافتراضي)
// ------------------------------------------------------------
const BOT_FALLBACK_QUESTIONS = [
    {
        subject: "قواعد البيانات",
        question: "ما هو تعريف قواعد البيانات؟",
        answer: "قاعدة البيانات مجموعة منظمة من البيانات المترابطة."
    },
    {
        subject: "محاسبة تكاليف",
        question: "ما الفرق بين التكلفة الثابتة والتكلفة المتغيرة؟",
        answer: "التكلفة الثابتة لا تتغير بتغير حجم النشاط، والمتغيرة تتغير بتغيره."
    },
    {
        subject: "اقتصاد كلي",
        question: "ما هو التضخم",
        answer: "التضخم هو الارتفاع المستمر في المستوى العام للأسعار خلال فترة زمنية، وينتج عنه انخفاض القوة الشرائية للنقود."
    },
    {
        subject: "قواعد البيانات",
        question: "إيه الفرق بين المفتاح الأساسي والمفتاح الأجنبي؟",
        answer: "المفتاح الأساسي بيحدد كل صف في الجدول بشكل فريد، ومينفعش يتكرر أو يبقى فاضي. المفتاح الأجنبي عمود في جدول بيشاور على المفتاح الأساسي في جدول تاني، عشان يربط الجدولين ببعض."
    },
    {
        subject: "محاسبة ضرائب",
        question: "الفرق بين الضريبة المباشرة والضريبة غير المباشرة؟",
        answer: "الضريبة المباشرة بيدفعها الشخص أو الشركة من دخله أو أرباحه، ومبيقدرش ينقل عبأها لحد تاني، زي ضريبة الدخل وضريبة الأرباح التجارية. أما الضريبة غير المباشرة فبتتفرض على السلع والخدمات، والمستهلك هو اللي بيتحمل عبأها فعليًا لأنها بتتضاف على السعر، والبائع بيحصّلها ويوردها للدولة، زي ضريبة القيمة المضافة والضريبة الجمركية."
    },
    {
        subject: "دراسات إدارة بالإنجليزية",
        question: "What is SWOT analysis?",
        answer: "SWOT analysis is a planning tool that helps an organization identify its internal Strengths and Weaknesses, and its external Opportunities and Threats, so it can make better strategic decisions."
    },
    {
        subject: "دراسات إدارة بالإنجليزية",
        question: "What is the difference between efficiency and effectiveness in management",
        answer: "Efficiency means doing things right: using the fewest resources, such as time, money and effort, to get a task done. Effectiveness means doing the right things: choosing goals that matter and actually achieving them. A manager can be efficient but not effective, for example by completing the wrong task very quickly."
    },
    {
        subject: "محاسبة تكاليف",
        question: "ما هي نقطة التعادل وإزاي بتتحسب؟",
        answer: "نقطة التعادل هي حجم المبيعات اللي عنده إجمالي الإيرادات يساوي إجمالي التكاليف، فمفيش ربح ولا خسارة. بتتحسب بالوحدات كده: التكاليف الثابتة مقسومة على (سعر بيع الوحدة ناقص التكلفة المتغيرة للوحدة). والفرق ده اسمه هامش المساهمة للوحدة."
    },
    {
        subject: "قواعد البيانات 2",
        question: "ما الفرق بين Transaction و Deadlock وكيف يتم معالجته في SQL Server؟",
        answer: "الـ Transaction هي وحدة عمل منطقية إما أن تُنفذ بالكامل (Commit) أو تُلغى بالكامل (Rollback) وفق خصائص ACID.\nأما الـ Deadlock فيحدث عندما تنتظر عمليتان أو أكثر موارد يقفلها الطرف الآخر، ويقوم الـ SQL Server تلقائياً بإنهاء إحدى العمليات (Deadlock Victim) لفك التعليق."
    },
    {
        subject: "إحصاء وحزم بحوث العمليات",
        question: "كيف نفرق بين استخدام اختبار T-Test وتحليل التباين ANOVA؟",
        answer: "نستخدم اختبار T-Test عند مقارنة متوسطين فقط (عينتين مستقلتين أو مرتبطتين)، بينما نستخدم ANOVA (Analysis of Variance) عندما نريد مقارنة متوسطات 3 مجموعات أو أكثر لتجنب زيادة خطأ من النوع الأول (Type I Error)."
    }
];


// ------------------------------------------------------------
// ------------------------------------------------------------
// 🧠 الحالة العامة للبوت (Chatbot State)
// ------------------------------------------------------------
const chatbotState = {
    isOpen: false,           // هل نافذة الشات مفتوحة؟
    hasWelcomed: false,      // هل تم إرسال رسالة الترحيب؟
    sheetQuestions: [],      // الأسئلة المحملة من Google Sheet
    coursesCatalog: [],      // فهرس المواد والمحاضرات المنشأ تلقائياً من data.js
    isCsvLoading: false,     // هل جاري تحميل الشيت؟
    csvLoadPromise: null,    // Promise للتحميل لضمان انتظار اكتمال الجلب قبل البحث
    csvFetchFailed: false,   // هل فشل تحميل الشيت؟
    isTyping: false          // هل البوت يكتب الآن؟
};


// ------------------------------------------------------------
// 🔤 كلمات الوصل والزوائد الشائعة في العربية (Stop Words)
// يتم استبعادها للتركيز على الكلمات المفتاحية المهمة
// ------------------------------------------------------------
const RAW_STOP_WORDS = [
    "ما", "هي", "هو", "ايه", "يعني", "ازاي", "وازاي", "في", "من",
    "على", "علي", "عن", "هل", "وهل", "و", "يا",
    "اين", "متى", "كم", "لماذا", "ليه", "كيف", "وكيف",
    "الذي", "التي", "اللذين", "اللتين", "الذين", "اللاتي", "اللواتي", "اللي",
    "لو", "ان", "أن", "إن", "كان", "كانت", "يكون", "تكون",
    "عايز", "عاوز", "محتاج", "ممكن", "بدي", "لو_سمحت", "من_فضلك",
    "ثم", "أو", "او", "بل", "لكن", "لا", "لم", "لن", "ليس",
    "كل", "بعض", "غير", "فقط", "بدون", "دا", "ده", "دي", "دول",
    // كلمات عامية مصرية شائعة في أسئلة الطلاب
    "ازي", "وازي", "بقى", "كده", "عشان", "علشان",
    "يلا", "طيب", "بتاع", "بتاعت", "بتاعه", "خالص", "اوي",
    "تقدر", "نقدر", "عارف", "عارفه"
];

// خريطة تحويل الأرقام المكتوبة ككلمات إلى أرقام عددية
const NUMBER_WORDS_MAP = {
    "اول": 1, "اولى": 1, "الاول": 1, "الاولى": 1, "1": 1, "١": 1,
    "ثاني": 2, "ثانيه": 2, "الثاني": 2, "الثانية": 2, "الثانيه": 2, "2": 2, "٢": 2,
    "ثالث": 3, "ثالثه": 3, "الثالث": 3, "الثالثة": 3, "الثالثه": 3, "3": 3, "٣": 3,
    "رابع": 4, "رابعه": 4, "الرابع": 4, "الرابعة": 4, "الرابعه": 4, "4": 4, "٤": 4,
    "خامس": 5, "خامسه": 5, "الخامس": 5, "الخامسة": 5, "الخامسه": 5, "5": 5, "٥": 5,
    "سادس": 6, "سادسه": 6, "السادس": 6, "السادسة": 6, "السادسه": 6, "6": 6, "٦": 6,
    "سابع": 7, "سابعه": 7, "السابع": 7, "السابعة": 7, "السابعه": 7, "7": 7, "٧": 7,
    "ثامن": 8, "ثامنه": 8, "الثامن": 8, "الثامنة": 8, "الثامنه": 8, "8": 8, "٨": 8,
    "تاسع": 9, "تاسعه": 9, "التاسع": 9, "التاسعة": 9, "التاسعه": 9, "9": 9, "٩": 9,
    "عاشر": 10, "عاشره": 10, "العاشر": 10, "العاشرة": 10, "العاشره": 10, "10": 10, "١٠": 10
};


// ------------------------------------------------------------
// 🧹 دوال تنظيف وتوحيد النصوص وحساب الكلمات المفتاحية
// ------------------------------------------------------------

/**
 * تنظيف وتوحيد الحروف وإزالة علامات الترقيم والتشكيل
 * - إزالة التشكيل وعلامات الترقيم (؟ ? ! ، ,)
 * - توحيد أ إ آ إلى ا، ى إلى ي، ة إلى ه، ؤ/ئ إلى و/ي
 * - تصغير الأحرف الإنجليزية
 * - إزالة بادئة التعريف "ال" أو "وال" من بداية الكلمات (اختياري)
 */
function normalizeText(text, stripDefiniteArticle = true) {
    if (!text) return "";
    let cleaned = String(text)
        // 0. إزالة علامات الاتجاه المخفية والتحكم (LRM, RLM, LRE, RLE, PDF, LRO, RLO, LRI, RLI, FSI, PDI, BOM, ZWSP...)
        .replace(/[\u200E\u200F\u202A-\u202E\u2066-\u2069\u200B-\u200D\uFEFF]/g, "")
        // 0.1 استبدال المسافات الغريبة (non-breaking space وغيرها) بمسافة عادية
        .replace(/[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g, " ")
        // 1. إزالة التشكيل والتطويل
        .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
        // 2. توحيد الألف والهمزات والتاء والياء
        .replace(/[أإآ]/g, "ا")
        .replace(/ة/g, "ه")
        .replace(/ى/g, "ي")
        .replace(/ؤ/g, "و")
        .replace(/ئ/g, "ي")
        // 3. إزالة علامات الترقيم والأقواس (؟ ? ! ، , وغيرها)
        .replace(/[؟?!،,.:_()\[\]{}"'\\\/+\-*=<>#@$%^&~`|;؛]/g, " ")
        // 4. حروف صغيرة ومسافات موحدة
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();


    if (stripDefiniteArticle) {
        cleaned = cleaned
            .split(" ")
            .map(word => {
                // إزالة أداة العطف والتعريف "وال" من بداية الكلمة (لو الباقي 3+ حروف)
                if (word.startsWith("وال") && word.length > 4) {
                    return word.slice(3);
                }
                // إزالة أداة التعريف "ال" من بداية الكلمة (لو الباقي 2+ حروف)
                if (word.startsWith("ال") && word.length > 3) {
                    return word.slice(2);
                }
                return word;
            })
            .join(" ");
    }

    return cleaned;
}

/**
 * دالة مساعدة عامة لتنظيف النص بدون حذف "ال"
 */
function cleanText(text) {
    return normalizeText(text, false);
}

/**
 * تنظيف وتوحيد النصوص وإزالة علامات الاتجاه المخفية والمسافات الغريبة
 * وتوحيد الحروف العربية وإزالة الأرقام والرموز اللاتينية من نهاية الأسماء
 * @param {string} text - النص المراد تنظيفه
 * @param {boolean} [stripTrailing=true] - هل يتم إزالة الأرقام واللواحق اللاتينية من نهاية الاسم
 * @returns {string} النص بعد التنظيف والتوحيد
 */
function normalize(text, stripTrailing = true) {
    if (!text || typeof text !== "string") return "";

    let cleaned = text
        // 1. إزالة علامات الاتجاه المخفية ومحارف التحكم (LRM, RLM, LRE, RLE, PDF, LRO, RLO, LRI, RLI, FSI, PDI, BOM, ZWSP...)
        .replace(/[\u200E\u200F\u202A-\u202E\u2066-\u2069\u200B-\u200D\uFEFF]/g, "")
        // 2. استبدال المسافات الغريبة (non-breaking space وغيرها) بمسافة عادية
        .replace(/[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g, " ")
        // 3. إزالة حركات التشكيل والتطويل (الكشيدة)
        .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
        // 4. توحيد الهمزات والألف والتاء المربوطة والياء
        .replace(/[أإآا]/g, "ا")
        .replace(/ة/g, "ه")
        .replace(/ى/g, "ي")
        // 5. تقليص المسافات المكررة وعمل trim وتصغير الحروف اللاتينية إن وجدت
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();

    // توحيد المرادفات الشائعة مثل (إدارية / إدارة)
    cleaned = cleaned.replace(/\bاداريه\b/g, "اداره");

    // 6. إزالة الأرقام والحروف اللاتينية من آخر الاسم لو سبقتها حروف عربية (مثل: "قواعد البيانات 2" -> "قواعد البيانات")
    if (stripTrailing) {
        if (/[\u0600-\u06FF]/.test(cleaned)) {
            cleaned = cleaned.replace(/(?:[\s\-_.:/]*[0-9\u0660-\u0669\u06F0-\u06F9a-zA-Z]+)+$/g, "").trim();
        } else {
            cleaned = cleaned.replace(/(?:[\s\-_.:/]*[0-9\u0660-\u0669\u06F0-\u06F9]+)+$/g, "").trim();
        }
    }

    return cleaned;
}


// توحيد وتنظيف كلمات التوقف لتتطابق تماماً مع normalizeText
const ARABIC_STOP_WORDS = new Set(RAW_STOP_WORDS.map(w => normalizeText(w, false)));

/**
 * استخراج الكلمات المفتاحية من النص بعد استبعاد حروف الجر وكلمات الوصل
 * وحذف زوائد التعريف "ال" و "وال" من البداية
 */
function extractKeywords(text) {
    const norm = normalizeText(text, true);
    if (!norm) return [];
    return norm
        .split(" ")
        .filter(word => word.length > 1 && !ARABIC_STOP_WORDS.has(word));
}


// ------------------------------------------------------------
// 📚 المصدر 2: بناء الفهرس تلقائياً من data.js
// ------------------------------------------------------------

/**
 * دالة تفحص مصفوفة courses في data.js وتبني منها فهرساً ذكياً
 * بحيث أي محاضرة جديدة تُضاف في data.js يتعرف عليها البوت تلقائياً
 */
function buildCoursesCatalog() {
    if (typeof courses === "undefined" || !Array.isArray(courses)) {
        return [];
    }

    return courses.map(course => {
        // تجهيز الكلمات المفتاحية للمادة مع دعم الاسم الرسمي في الفورم
        let subjectText = course.subject || "";
        if (course.id === 3 || course.title === "دراسات إدارية بالإنجليزية") {
            subjectText += " دراسات إدارة بالإنجليزية";
        }
        const normFormSubj = normalize(course.formSubject || course.title, true);
        const courseKeywords = extractKeywords(`${course.title} ${course.titleEn || ""} ${subjectText} ${normFormSubj}`);

        // فهرسة محاضرات المادة
        const lecturesList = (course.lectures || []).map(lec => {
            return {
                id: lec.id,
                title: lec.title || `المحاضرة ${lec.id}`,
                cleanTitle: cleanText(lec.title),
                // روابط الملفات المتاحة
                lectureFile: (lec.lectureFile || lec.lectureUrl || "").trim(),
                summaryFile: (lec.summaryFile || lec.summaryUrl || "").trim(),
                sectionUrl: (lec.sectionUrl || lec.sectionFile || "").trim(),
                bookUrl: (lec.bookUrl || lec.bookFile || "").trim(),
                video: (lec.video || "").trim(),
                pageUrl: `lecture.html?course=${course.id}&lecture=${lec.id}`
            };
        });

        return {
            id: course.id,
            title: course.title,
            cleanTitle: cleanText(course.title),
            titleEn: course.titleEn || "",
            subject: course.subject || "",
            keywords: courseKeywords,
            pageUrl: `course.html?id=${course.id}`,
            lectures: lecturesList
        };
    });
}


// ------------------------------------------------------------
// 📑 المصدر 1: جلب وتحليل بيانات Google Sheet CSV
// ------------------------------------------------------------

/**
 * محلل نصوص CSV حقيقي متكامل ومضمون (RFC-4180)
 * يتعامل مع الحقول المقتبسة، الفواصل والأسطر الجديدة داخل الاقتباس،
 * الهروب بالعلامات المزدوجة ""، وبداية BOM، ونهايات CRLF.
 * لا يستخدم split(",") نهائياً.
 */
function parseCSV(text) {
    if (!text) return [];
    let str = String(text);
    // إزالة علامة الـ BOM من بداية الملف إن وجدت
    if (str.charCodeAt(0) === 0xFEFF) {
        str = str.slice(1);
    }

    const rows = [];
    let row = [];
    let field = "";
    let inQuotes = false;
    const len = str.length;

    for (let i = 0; i < len; i++) {
        const c = str[i];
        if (inQuotes) {
            if (c === '"') {
                if (i + 1 < len && str[i + 1] === '"') {
                    field += '"';
                    i++; // تجاوز علامة التنصيص المهربة
                } else {
                    inQuotes = false;
                }
            } else {
                field += c;
            }
        } else {
            if (c === '"') {
                inQuotes = true;
            } else if (c === ',') {
                row.push(field);
                field = "";
            } else if (c === '\r' || c === '\n') {
                if (c === '\r' && i + 1 < len && str[i + 1] === '\n') {
                    i++; // تجاوز \n التالية لـ \r
                }
                row.push(field);
                field = "";
                if (row.some(f => f.trim().length > 0)) {
                    rows.push(row);
                }
                row = [];
            } else {
                field += c;
            }
        }
    }

    if (field.length > 0 || row.length > 0) {
        row.push(field);
        if (row.some(f => f.trim().length > 0)) {
            rows.push(row);
        }
    }

    return rows;
}
if (typeof window !== "undefined") {
    window.parseCSV = parseCSV;
}

/**
 * دالة تفكيك CSV مشتركة تدعم PapaParse لو متاح أو المحلل الداخلي parseCSV
 */
function parseCsvSafely(csvText) {
    if (typeof Papa !== "undefined" && typeof Papa.parse === "function") {
        const result = Papa.parse(csvText, { header: false, skipEmptyLines: "greedy" });
        return result.data || [];
    }
    return parseCSV(csvText);
}

/**
 * معالجة صفوف الـ CSV وتحويلها لكائنات منظمة
 * الأعمدة: المادة، السؤال، الإجابة
 * يتخطى صف العناوين وأي صف سؤاله أو إجابته فارغة
 */
function processRawCsvRows(rows) {
    if (!Array.isArray(rows) || rows.length < 2) return [];

    // 1. تجاهل صف العناوين (الصف الأول)
    const dataRows = rows.slice(1);

    // 2. طباعة أول صف بعد الـ parse كما هو
    console.log("📄 [chatbot.js] أول صف بعد الـ parse:", dataRows[0]);

    const parsedData = [];
    for (let i = 0; i < dataRows.length; i++) {
        const row = dataRows[i];
        if (!row || row.length === 0) continue;

        // 1. قراءة الأعمدة بالترتيب: العمود الأول (0) = المادة، التاني (1) = السؤال، التالت (2) = الإجابة
        let rawSubject = (row[0] !== undefined && row[0] !== null) ? String(row[0]).trim() : "عام";
        const question = (row[1] !== undefined && row[1] !== null) ? String(row[1]).trim() : "";
        const answer = (row[2] !== undefined && row[2] !== null) ? String(row[2]).trim() : "";

        // 3. تجاهل أي صف عمود السؤال فيه فاضي، أو عمود الإجابة فاضي
        if (!question || !answer) {
            continue;
        }

        // تنظيف وتوحيد اسم المادة
        let subject = rawSubject;
        if (subject === "دراسات إدارية بالإنجليزية") {
            subject = "دراسات إدارة بالإنجليزية";
        }
        const normSubject = normalize(subject, true);

        parsedData.push({
            subject: subject || "عام",
            normalizedSubject: normSubject,
            question,
            answer,
            normalizedQuestion: normalizeText(question, true),
            normalizedAnswer: normalizeText(answer, true),
            questionKeywords: extractKeywords(question),
            answerKeywords: extractKeywords(answer),
            allKeywords: extractKeywords(question + " " + answer),
            subjectKeywords: extractKeywords(`${subject} ${normSubject}`)
        });
    }

    return parsedData;
}

/**
 * تحميل ومعالجة بيانات الأسئلة من Google Sheet مع إعادة المحاولة والانتظار
 */
async function loadSheetQuestions(retryOnFail = true) {
    if (!navigator.onLine) {
        chatbotState.csvFetchFailed = true;
        chatbotState.isCsvLoading = false;
        return [];
    }

    if (chatbotState.sheetQuestions && chatbotState.sheetQuestions.length > 0) {
        return chatbotState.sheetQuestions;
    }

    if (chatbotState.csvLoadPromise) {
        return chatbotState.csvLoadPromise;
    }

    chatbotState.isCsvLoading = true;
    chatbotState.csvFetchFailed = false;

    chatbotState.csvLoadPromise = (async () => {
        // 1. فحص إذا كانت صفحة ask.html قد حملت الأسئلة بالفعل في state.allQuestions
        if (typeof state !== "undefined" && state.allQuestions && state.allQuestions.length > 0) {
            const fromPageState = state.allQuestions
                .filter(q => q.question && q.answer && q.answer !== "لم تتم إضافة إجابة بعد.")
                .map(q => ({
                    subject: (q.subject === "دراسات إدارية بالإنجليزية") ? "دراسات إدارة بالإنجليزية" : (q.subject || "عام"),
                    question: q.question.trim(),
                    answer: q.answer.trim(),
                    normalizedQuestion: normalizeText(q.question, true),
                    normalizedAnswer: normalizeText(q.answer, true),
                    questionKeywords: extractKeywords(q.question),
                    answerKeywords: extractKeywords(q.answer),
                    allKeywords: extractKeywords(q.question + " " + q.answer),
                    subjectKeywords: extractKeywords(q.subject || "عام")
                }));
            if (fromPageState.length > 0) {
                chatbotState.sheetQuestions = fromPageState;
                chatbotState.isCsvLoading = false;
                console.log(`[Chatbot] Loaded ${chatbotState.sheetQuestions.length} answered rows from page state. First row:`, chatbotState.sheetQuestions[0]);
                return chatbotState.sheetQuestions;
            }
        }

        const csvUrl = getBotCsvUrl();
        const isPlaceholder = !csvUrl || csvUrl === "ضع_رابط_الشيت_CSV_هنا";

        if (isPlaceholder) {
            chatbotState.sheetQuestions = BOT_FALLBACK_QUESTIONS.map(q => ({
                ...q,
                normalizedQuestion: normalizeText(q.question, true),
                normalizedAnswer: normalizeText(q.answer, true),
                questionKeywords: extractKeywords(q.question),
                answerKeywords: extractKeywords(q.answer),
                allKeywords: extractKeywords(q.question + " " + q.answer),
                subjectKeywords: extractKeywords(q.subject)
            }));
            chatbotState.isCsvLoading = false;
            console.log(`[Chatbot] Loaded ${chatbotState.sheetQuestions.length} answered rows from fallback. First row:`, chatbotState.sheetQuestions[0]);
            return chatbotState.sheetQuestions;
        }

        let lastErr = null;
        for (let attempt = 1; attempt <= (retryOnFail ? 2 : 1); attempt++) {
            try {
                const response = await fetch(csvUrl, { cache: "no-cache" });
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const csvText = await response.text();
                const rawRows = parseCsvSafely(csvText);
                const parsed = processRawCsvRows(rawRows);

                if (parsed.length > 0) {
                    chatbotState.sheetQuestions = parsed;
                    chatbotState.isCsvLoading = false;
                    chatbotState.csvFetchFailed = false;
                    console.log(`[Chatbot] Loaded ${chatbotState.sheetQuestions.length} answered rows from CSV (attempt ${attempt}). First row:`, chatbotState.sheetQuestions[0]);
                    return chatbotState.sheetQuestions;
                }
            } catch (err) {
                lastErr = err;
                console.warn(`[Chatbot] CSV fetch attempt ${attempt} failed:`, err);
                if (attempt === 1 && retryOnFail) {
                    await new Promise(r => setTimeout(r, 400));
                }
            }
        }

        // في حال فشل المحاولتين: استخدام البيانات الاحتياطية لضمان عمل البوت
        console.warn("[Chatbot] CSV fetch failed after retries, using fallback data. Error:", lastErr);
        chatbotState.csvFetchFailed = true;
        chatbotState.isCsvLoading = false;
        chatbotState.sheetQuestions = BOT_FALLBACK_QUESTIONS.map(q => ({
            ...q,
            normalizedQuestion: normalizeText(q.question, true),
            normalizedAnswer: normalizeText(q.answer, true),
            questionKeywords: extractKeywords(q.question),
            answerKeywords: extractKeywords(q.answer),
            allKeywords: extractKeywords(q.question + " " + q.answer),
            subjectKeywords: extractKeywords(q.subject)
        }));
        console.log(`[Chatbot] Loaded ${chatbotState.sheetQuestions.length} answered rows from fallback. First row:`, chatbotState.sheetQuestions[0]);
        return chatbotState.sheetQuestions;
    })();

    return chatbotState.csvLoadPromise;
}

// دالة متوافقة مع الكود القديم
function fetchSheetQuestions() {
    return loadSheetQuestions(true);
}


// ------------------------------------------------------------
// 🔍 محرك البحث والمطابقة الذكي (Matching Engine)
// ------------------------------------------------------------

/**
 * فحص ما إذا كان استفسار الطالب يطلب ملفاً أو محاضرة من data.js
 */
function searchCatalogIntent(userQuery) {
    const cleanedQuery = cleanText(userQuery);
    const userWords = extractKeywords(userQuery);
    if (userWords.length === 0) return null;

    // تحديد نوع المورد المطلوب
    const isSummaryReq = /(ملخص|ملخصات|تلخيص)/.test(cleanedQuery);
    const isLectureReq = /(محاضره|محاضرات|سلايد|سلايدات|شرح|فيديو)/.test(cleanedQuery);
    const isSectionReq = /(سكشن|سكاشن|تمرين|تمارين|عملي)/.test(cleanedQuery);
    const isBookReq = /(كتاب|كتب|مرجع|مراجع|book)/.test(cleanedQuery);
    const isGeneralCatalogReq = isSummaryReq || isLectureReq || isSectionReq || isBookReq || /(ماده|مواد|كورس)/.test(cleanedQuery);

    // البحث عن رقم المحاضرة إن وجد (مثل "محاضرة 2" أو "المحاضرة الثانية")
    let targetLectureNum = null;
    for (const [word, num] of Object.entries(NUMBER_WORDS_MAP)) {
        // مطابقة كلمة كاملة
        const regex = new RegExp(`(^|\\s)${word}(\\s|$)`);
        if (regex.test(cleanedQuery)) {
            targetLectureNum = num;
            break;
        }
    }

    // مطابقة المادة الأكثر تشابهاً مع كلمات الطالب
    let matchedCourse = null;
    let highestCourseScore = 0;

    chatbotState.coursesCatalog.forEach(course => {
        let score = 0;
        // فحص مطابقة اسم المادة مباشرة
        if (cleanedQuery.includes(course.cleanTitle) || course.cleanTitle.includes(cleanedQuery)) {
            score += 4;
        }
        // فحص الكلمات المشتركة
        course.keywords.forEach(kw => {
            if (userWords.includes(kw)) score += 1;
        });

        // دعم كلمات دلالية إضافية مثل داتابيز، تكاليف، اقتصاد، ضرائب
        if (course.id === 1 && /(داتابيز|database|بيانات|قواعد)/.test(cleanedQuery)) score += 2;
        if (course.id === 2 && /(احصاء|بحوث|عمليات|حزم)/.test(cleanedQuery)) score += 2;
        if (course.id === 3 && /(اداره|اداريه|انجليزي|management)/.test(cleanedQuery)) score += 2;
        if (course.id === 4 && /(اقتصاد|كلي|macro)/.test(cleanedQuery)) score += 2;
        if (course.id === 5 && /(ضرائب|ضريبه|tax)/.test(cleanedQuery)) score += 2;
        if (course.id === 6 && /(تكاليف|تكلفه|cost)/.test(cleanedQuery)) score += 2;

        if (score > highestCourseScore && score >= 2) {
            highestCourseScore = score;
            matchedCourse = course;
        }
    });

    if (!matchedCourse && !isGeneralCatalogReq) {
        return null; // لا يخص المقررات أو الملفات
    }

    return {
        course: matchedCourse,
        lectureNum: targetLectureNum,
        isSummaryReq,
        isLectureReq,
        isSectionReq,
        isBookReq
    };
}

/**
 * فحص مطابقة السؤال العلمي مع أسئلة Google Sheet
 * 1. فحص التطابق المباشر أو الاحتواء (Containment) بعد التوحيد (Rule 3)
 * 2. احتساب النقاط بناءً على نسبة الكلمات المفتاحية (تطابق السؤال يُحسب ضعف الإجابة - Rule 4)
 * 3. قبول التطابق إذا تحقق: نسبة >= 50% أو (استعلام من كلمتين أو أقل وتطابقت كلمة من 3+ أحرف)
 * 4. تسجيل أعلى 3 نتائج للتصحيح عبر console.log (Rule 8)
 */
function searchSheetQuestions(userQuery) {
    if (!chatbotState.sheetQuestions || chatbotState.sheetQuestions.length === 0) {
        return { bestMatch: null, suggestions: [] };
    }

    // 1. التطابق المباشر التام أو الاحتواء (Rule 3)
    const normQuery = normalizeText(userQuery, true);
    if (normQuery && normQuery.length >= 2) {
        for (const item of chatbotState.sheetQuestions) {
            const normQ = item.normalizedQuestion || normalizeText(item.question, true);
            if (normQ && (normQ === normQuery || normQ.includes(normQuery) || normQuery.includes(normQ))) {
                console.log(`[Chatbot Search] Direct match found for query "${userQuery}":`, item.question);
                console.log("[Chatbot Search] Top 3 candidates:", [{
                    rank: 1,
                    question: item.question,
                    subject: item.subject,
                    score: "100%",
                    keywordShare: "100%",
                    matchType: "Direct Containment Match"
                }]);
                return {
                    bestMatch: item,
                    bestScore: 1.0,
                    keywordShare: 1.0,
                    suggestions: []
                };
            }
        }
    }

    // 2. مطابقة الكلمات المفتاحية والأوزان (Rule 4)
    const userKeywords = extractKeywords(userQuery);
    if (userKeywords.length === 0) return { bestMatch: null, suggestions: [] };

    const scored = [];

    chatbotState.sheetQuestions.forEach((item) => {
        const qWords = item.questionKeywords || extractKeywords(item.question);
        const aWords = item.answerKeywords || extractKeywords(item.answer);
        const sWords = item.subjectKeywords || extractKeywords(item.subject);

        let matchCount = 0;
        let has3LetterMatch = false;
        let weightedPoints = 0;

        userKeywords.forEach(uWord => {
            const inQuestion = qWords.some(qw =>
                qw === uWord || (qw.length >= 3 && uWord.length >= 3 && (qw.includes(uWord) || uWord.includes(qw)))
            );
            const inAnswer = aWords.some(aw =>
                aw === uWord || (aw.length >= 3 && uWord.length >= 3 && (aw.includes(uWord) || uWord.includes(aw)))
            );

            if (inQuestion || inAnswer) {
                matchCount++;
                if (uWord.length >= 3) {
                    has3LetterMatch = true;
                }
                if (inQuestion) {
                    weightedPoints += 2; // السؤال يُحسب بضعف الوزن (count double)
                } else {
                    weightedPoints += 1; // الإجابة
                }
            }
        });

        if (matchCount === 0) return;

        // نسبة الكلمات المفتاحية الموجودة في السؤال + الإجابة
        const keywordShare = matchCount / userKeywords.length;
        // النقاط الموزونة نسبة للحد الأقصى (كل الكلمات في السؤال = 2 * userKeywords.length)
        let finalScore = weightedPoints / (2 * userKeywords.length);

        // بونص ذكر اسم المادة في السؤال
        const mentionsSubject = userKeywords.some(uWord =>
            sWords.some(sw => sw === uWord || (sw.length >= 3 && (sw.includes(uWord) || uWord.includes(sw))))
        );
        if (mentionsSubject) {
            finalScore += 0.1;
        }

        scored.push({
            item,
            score: finalScore,
            keywordShare,
            matchCount,
            has3LetterMatch
        });
    });

    scored.sort((a, b) => b.score - a.score);

    // تسجيل أعلى 3 نتائج للتصحيح (Rule 8)
    console.log("[Chatbot Search] Query:", userQuery);
    console.log("[Chatbot Search] Keywords:", userKeywords);
    console.log("[Chatbot Search] Top 3 candidates:",
        scored.slice(0, 3).map((s, idx) => ({
            rank: idx + 1,
            question: s.item.question,
            subject: s.item.subject,
            score: Math.round(s.score * 100) + "%",
            share: Math.round(s.keywordShare * 100) + "%",
            matches: s.matchCount + "/" + userKeywords.length
        }))
    );

    if (scored.length === 0) return { bestMatch: null, suggestions: [] };

    const top = scored[0];
    const isAccepted =
        top.keywordShare >= 0.50 ||
        (userKeywords.length <= 2 && top.has3LetterMatch && top.matchCount >= 1);

    const suggestions = scored.slice(1, 3)
        .filter(s => s.score >= 0.15)
        .map(s => s.item);

    return {
        bestMatch: isAccepted ? top.item : null,
        bestScore: top.score,
        keywordShare: top.keywordShare,
        suggestions
    };
}


// ------------------------------------------------------------
// 💬 معالجة رسائل الطالب وتوليد الردود المناسبة
// ------------------------------------------------------------

/**
 * الدالة الرئيسية لتوليد رد البوت
 */
async function processUserMessage(userText) {
    if (!navigator.onLine) {
        return;
    }

    const trimmed = userText.trim();
    if (!trimmed) return;

    // 1. إضافة رسالة الطالب للشات
    appendMessage(trimmed, "user");

    // إظهار أنيميشن "جاري الكتابة..."
    showTypingIndicator();

    // التأكد من اكتمال تحميل وتحليل الـ CSV قبل تشغيل محرك البحث (Step 1)
    try {
        await loadSheetQuestions(true);
    } catch (e) {
        console.warn("[Chatbot] Error awaiting sheet questions load:", e);
    }

    hideTypingIndicator();

    // فحص حالة الخطأ
    if (chatbotState.csvFetchFailed && chatbotState.sheetQuestions.length === 0) {
        appendMessage("في مشكلة مؤقتة، جرب بعد شوية", "bot");
        return;
    }

    // 2. ترتيب البحث (Rule 5):
    // أ) المصدر 1: الشيت (أسئلة علمية)
    const sheetResult = searchSheetQuestions(trimmed);
    // ب) المصدر 2: data.js (محاضرات، ملخصات، كتب، سكاشن)
    const catalogResult = searchCatalogIntent(trimmed);

    const hasSheetMatch = Boolean(sheetResult.bestMatch);
    const hasCatalogMatch = Boolean(catalogResult && catalogResult.course);

    // لو الكلمات تنفع للمصدرين: اعرض إجابة الشيت الأول وبعدها لينكات المحاضرات المرتبطة
    if (hasSheetMatch && hasCatalogMatch) {
        appendSheetAnswer(sheetResult.bestMatch, sheetResult.suggestions);
        appendCatalogResponse(catalogResult, "روابط ومحاضرات متعلقة بالمادة:");
        return;
    }

    // لو في تطابق مع أسئلة الشيت فقط (Rule 6)
    if (hasSheetMatch) {
        appendSheetAnswer(sheetResult.bestMatch, sheetResult.suggestions);
        return;
    }

    // لو الطلب خاص بالمحاضرات والملخصات والكتب
    if (hasCatalogMatch) {
        appendCatalogResponse(catalogResult);
        return;
    }

    // لو مفيش أي تطابق: التوجيه لنموذج السؤال داخل الصفحة (Rule 7)
    appendNoMatchResponse(trimmed);
}

/**
 * عرض إجابة الشيت مع الاقتراحات التابعة لها
 * هام: جميع النصوص تُعرض عبر textContent منعاً لأي كود XSS
 */
function appendSheetAnswer(sheetItem, suggestions = []) {
    const container = createBotBubbleContainer();

    // شارة المادة
    const badge = document.createElement("span");
    badge.className = "chatbot-bubble-badge";
    badge.textContent = `📚 ${sheetItem.subject || "عام"}`;
    container.appendChild(badge);

    // نص السؤال المطابق
    const qTitle = document.createElement("div");
    qTitle.style.fontWeight = "700";
    qTitle.style.marginBottom = "6px";
    qTitle.textContent = sheetItem.question;
    container.appendChild(qTitle);

    // نص الإجابة
    const answerText = document.createElement("div");
    answerText.className = "chatbot-bubble-text";
    answerText.textContent = sheetItem.answer; // 🛡️ آمن تماماً بـ textContent
    container.appendChild(answerText);

    // لو في أسئلة مقترحة تالية (أقرب 2 أسئلة)
    if (suggestions && suggestions.length > 0) {
        const chipsTitle = document.createElement("div");
        chipsTitle.className = "chatbot-chips-title";
        chipsTitle.textContent = "أسئلة ذات صلة قد تهمك:";
        container.appendChild(chipsTitle);

        const chipsWrap = document.createElement("div");
        chipsWrap.className = "chatbot-chips";

        suggestions.forEach(sug => {
            const chipBtn = document.createElement("button");
            chipBtn.type = "button";
            chipBtn.className = "chatbot-chip-btn";

            const iconSpan = document.createElement("span");
            iconSpan.className = "chip-icon";
            iconSpan.textContent = "💡";

            const textSpan = document.createElement("span");
            textSpan.textContent = sug.question; // 🛡️ textContent

            chipBtn.appendChild(iconSpan);
            chipBtn.appendChild(textSpan);

            // عند الضغط على السؤال المقترح
            chipBtn.addEventListener("click", () => {
                processUserMessage(sug.question);
            });

            chipsWrap.appendChild(chipBtn);
        });

        container.appendChild(chipsWrap);
    }

    scrollToBottom();
}

/**
 * عرض رد الموارد والمحاضرات والملخصات والكتب من data.js
 */
function appendCatalogResponse(catalogResult, customIntro = "") {
    const { course, lectureNum, isSummaryReq, isLectureReq, isSectionReq, isBookReq } = catalogResult;
    const container = createBotBubbleContainer();

    const intro = document.createElement("div");
    intro.className = "chatbot-bubble-text";

    if (customIntro) {
        intro.textContent = customIntro;
    } else if (lectureNum) {
        intro.textContent = `إليك روابط المحاضرة ${lectureNum} في مادة ${course.title}:`;
    } else {
        intro.textContent = `إليك روابط ومحتويات مادة ${course.title}:`;
    }
    container.appendChild(intro);

    const resourcesWrap = document.createElement("div");
    resourcesWrap.className = "chatbot-resources";

    // لو الطالب طلب محاضرة برقم محدد
    if (lectureNum) {
        const lecture = course.lectures.find(l => l.id === lectureNum);

        if (!lecture) {
            const notFound = document.createElement("div");
            notFound.style.fontSize = "0.85rem";
            notFound.style.color = "var(--text-muted)";
            notFound.style.marginTop = "4px";
            notFound.textContent = `لم يتم العثور على المحاضرة رقم ${lectureNum}، هذه المادة تحتوي حالياً على ${course.lectures.length} محاضرات.`;
            container.appendChild(notFound);
        } else {
            // أزرار التحميل المتاحة
            if (isSummaryReq || (!isLectureReq && !isSectionReq && !isBookReq)) {
                if (lecture.summaryFile) {
                    addResourceButton(resourcesWrap, "📋 تحميل ملخص المحاضرة (PDF)", lecture.summaryFile, true);
                }
            }
            if (isLectureReq || (!isSummaryReq && !isSectionReq && !isBookReq)) {
                if (lecture.lectureFile) {
                    addResourceButton(resourcesWrap, "📥 تحميل سلايدات المحاضرة (PDF)", lecture.lectureFile, true);
                }
            }
            if (isSectionReq) {
                if (lecture.sectionUrl) {
                    addResourceButton(resourcesWrap, "📝 تحميل السكشن (PDF)", lecture.sectionUrl, true);
                }
            }
            if (isBookReq || lecture.bookUrl) {
                if (lecture.bookUrl) {
                    addResourceButton(resourcesWrap, "📖 تحميل كتاب المادة (PDF)", lecture.bookUrl, true);
                }
            }

            // رابط صفحة المحاضرة
            addResourceButton(resourcesWrap, "🎬 فتح صفحة المحاضرة والشرح", lecture.pageUrl, false);
        }
    } else {
        // طلب عام للمادة أو كتابها
        // البحث عن كتاب المادة في المحاضرات
        const lectureWithBook = course.lectures.find(l => l.bookUrl);
        if (isBookReq && lectureWithBook) {
            addResourceButton(resourcesWrap, "📖 تحميل كتاب المادة (PDF)", lectureWithBook.bookUrl, true);
        }

        // رابط صفحة المادة العامة
        addResourceButton(resourcesWrap, `📂 صفحة مادة ${course.title}`, course.pageUrl, false);

        // ملخص المحاضرة الأولى كخيار سريع
        const firstLecture = course.lectures[0];
        if (firstLecture && firstLecture.summaryFile) {
            addResourceButton(resourcesWrap, "📋 ملخص المحاضرة الأولى", firstLecture.summaryFile, true);
        }
    }

    container.appendChild(resourcesWrap);
    scrollToBottom();
}

/**
 * دالة مساعدة لإنشاء زر تحميل أو رابط داخل رسالة البوت
 */
function addResourceButton(parent, label, url, isDownload = false) {
    if (!url) return;
    const btn = document.createElement("a");
    btn.className = "chatbot-resource-btn";
    btn.href = url;
    btn.target = "_blank";
    btn.rel = "noopener noreferrer";
    if (isDownload) {
        btn.setAttribute("download", "");
    }

    const textSpan = document.createElement("span");
    textSpan.textContent = label; // 🛡️ textContent
    btn.appendChild(textSpan);

    parent.appendChild(btn);
}

/**
 * الرد عند عدم وجود تطابق: "ملقيتش إجابة لسؤالك" مع زر التوجيه لنموذج السؤال
 */
function appendNoMatchResponse(userQuestion = "") {
    const container = createBotBubbleContainer();

    const msgText = document.createElement("div");
    msgText.className = "chatbot-bubble-text";
    msgText.textContent = "ملقيتش إجابة لسؤالك في قاعدة البيانات الحالية.\nتقدر تطرح سؤالك مباشرة على الدكتور ليتم الرد عليك ونشر الإجابة ليستفيد الجميع!";
    container.appendChild(msgText);

    // زر "اسأل الدكتور": بدلاً من فتح Google Form، يتم التمرير للنموذج في ask.html أو الانتقال إليها وتعبئة السؤال
    const askDoctorBtn = document.createElement("button");
    askDoctorBtn.type = "button";
    askDoctorBtn.className = "chatbot-ask-btn";

    const iconSpan = document.createElement("span");
    iconSpan.textContent = "✍️";
    const textSpan = document.createElement("span");
    textSpan.textContent = "اسأل الدكتور الآن";

    askDoctorBtn.appendChild(iconSpan);
    askDoctorBtn.appendChild(textSpan);

    askDoctorBtn.addEventListener("click", () => {
        closeChatWindow();
        const isOnAskPage = Boolean(document.getElementById("ask-form")) || window.location.pathname.endsWith("ask.html");

        if (isOnAskPage) {
            // على صفحة ask.html: التمرير للنموذج وتعبئة السؤال وتركيز المؤشر
            if (typeof window.prefillAskForm === "function") {
                window.prefillAskForm(userQuestion);
            } else {
                const textarea = document.getElementById("questionInput");
                const formCard = document.getElementById("ask-form");
                if (textarea) {
                    textarea.value = userQuestion;
                    textarea.dispatchEvent(new Event("input"));
                }
                if (formCard) {
                    formCard.scrollIntoView({ behavior: "smooth", block: "center" });
                }
                if (textarea) textarea.focus();
            }
        } else {
            // من أي صفحة أخرى: تخزين السؤال في sessionStorage والانتقال إلى ask.html#ask-form
            try {
                if (userQuestion) {
                    sessionStorage.setItem("bis_prefill_question", userQuestion);
                }
            } catch (e) {}
            window.location.href = "ask.html#ask-form";
        }
    });

    container.appendChild(askDoctorBtn);
    scrollToBottom();
}


// ------------------------------------------------------------
// 🎨 إدارة واجهة الـ DOM وبناء عناصر الشات
// ------------------------------------------------------------

/**
 * بناء هيكل الشات بوت بالكامل وإدراجه في الصفحة تلقائياً
 */
function injectChatbotDOM() {
    if (document.getElementById("bisChatbotToggle")) return;

    // 1. الزر العايم
    const toggleBtn = document.createElement("button");
    toggleBtn.id = "bisChatbotToggle";
    toggleBtn.type = "button";
    toggleBtn.setAttribute("aria-label", "مساعد طلاب BIS");
    toggleBtn.setAttribute("title", "مساعد طلاب BIS");
    toggleBtn.innerHTML = `
        <span class="chatbot-icon-open">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
        </span>
        <span class="chatbot-icon-close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </span>
    `;

    // 2. تلميح صغير فوق الزر
    const hint = document.createElement("div");
    hint.id = "bisChatbotHint";
    hint.innerHTML = `<span>💬 اسألني عن المحاضرات والأسئلة!</span>`;
    hint.addEventListener("click", () => {
        openChatWindow();
        hint.classList.add("hidden");
    });

    // 3. نافذة الشات
    const windowEl = document.createElement("div");
    windowEl.id = "bisChatbotWindow";
    windowEl.setAttribute("role", "dialog");
    windowEl.setAttribute("aria-label", "مساعد مجمع طلاب BIS");
    windowEl.innerHTML = `
        <div class="chatbot-header">
            <div class="chatbot-header-info">
                <div class="chatbot-avatar">
                    🎓
                    <span class="chatbot-status-dot"></span>
                </div>
                <div class="chatbot-header-text">
                    <h3>مساعد طلاب BIS</h3>
                    <span>إجابات فورية على مواد دراستك وأسئلتك</span>
                </div>
            </div>
            <div class="chatbot-header-actions">
                <button type="button" class="chatbot-close-btn" id="bisChatbotClose" aria-label="إغلاق الشات">✕</button>
            </div>
        </div>
        <div class="chatbot-messages" id="bisChatbotMessages"></div>
        <div class="chatbot-footer">
            <form class="chatbot-form" id="bisChatbotForm">
                <input type="text" class="chatbot-input" id="bisChatbotInput" placeholder="اكتب سؤالك أو اسم المحاضرة..." autocomplete="off">
                <button type="submit" class="chatbot-send-btn" id="bisChatbotSend" aria-label="إرسال">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </button>
            </form>
        </div>
    `;

    document.body.appendChild(hint);
    document.body.appendChild(toggleBtn);
    document.body.appendChild(windowEl);

    // أحداث الفتح والإغلاق
    toggleBtn.addEventListener("click", () => {
        if (chatbotState.isOpen) {
            closeChatWindow();
        } else {
            openChatWindow();
        }
    });

    const closeBtn = document.getElementById("bisChatbotClose");
    if (closeBtn) {
        closeBtn.addEventListener("click", closeChatWindow);
    }

    // إرسال الرسالة بالفورم أو بالـ Enter
    const form = document.getElementById("bisChatbotForm");
    const input = document.getElementById("bisChatbotInput");

    if (form && input) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            if (!navigator.onLine) {
                return;
            }
            const val = input.value;
            if (val.trim()) {
                input.value = "";
                processUserMessage(val);
            }
        });

        // إرسال بالـ Enter (بدون Shift)
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                form.dispatchEvent(new Event("submit"));
            }
        });
    }

    // إخفاء التلميح بعد 8 ثوانٍ
    setTimeout(() => {
        if (hint) hint.classList.add("hidden");
    }, 8000);

    // مراقبة اتصال الإنترنت داخل الشات
    initChatbotNetworkMonitor();
}

/**
 * فتح نافذة الشات
 */
function openChatWindow() {
    const windowEl = document.getElementById("bisChatbotWindow");
    const toggleBtn = document.getElementById("bisChatbotToggle");
    const hint = document.getElementById("bisChatbotHint");
    const input = document.getElementById("bisChatbotInput");

    if (!windowEl) return;

    chatbotState.isOpen = true;
    windowEl.classList.add("open");
    if (toggleBtn) toggleBtn.classList.add("active");
    if (hint) hint.classList.add("hidden");

    // رسالة الترحيب لأول مرة تفتح فيها النافذة
    if (!chatbotState.hasWelcomed) {
        chatbotState.hasWelcomed = true;
        renderWelcomeMessage();
    }

    setTimeout(() => {
        if (input && window.innerWidth > 768) {
            input.focus();
        }
    }, 300);
}

/**
 * إغلاق نافذة الشات
 */
function closeChatWindow() {
    const windowEl = document.getElementById("bisChatbotWindow");
    const toggleBtn = document.getElementById("bisChatbotToggle");

    if (!windowEl) return;

    chatbotState.isOpen = false;
    windowEl.classList.remove("open");
    if (toggleBtn) toggleBtn.classList.remove("active");
}

/**
 * رسالة الترحيب التلقائية وبها 3 أمثلة أسئلة يمكن الضغط عليها
 */
function renderWelcomeMessage() {
    const container = createBotBubbleContainer();

    const welcomeText = document.createElement("div");
    welcomeText.className = "chatbot-bubble-text";
    welcomeText.textContent = "أقدر أساعدك في الوصول للمحاضرات والملخصات والكتب، أو الإجابة على استفسارات المواد فوريًا.";
    container.appendChild(welcomeText);

    // الأمثلة الثلاثة للضغط عليها
    const sampleQuestions = [
        "ملخص المحاضرة الأولى قواعد بيانات",
        "كتاب الاقتصاد الكلي",
        "ما هي نقطة التعادل؟"
    ];

    const chipsWrap = document.createElement("div");
    chipsWrap.className = "chatbot-chips";

    sampleQuestions.forEach(text => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "chatbot-chip-btn";

        const iconSpan = document.createElement("span");
        iconSpan.className = "chip-icon";
        iconSpan.textContent = "💬";

        const textSpan = document.createElement("span");
        textSpan.textContent = text; // 🛡️ textContent

        chip.appendChild(iconSpan);
        chip.appendChild(textSpan);

        chip.addEventListener("click", () => {
            if (!navigator.onLine) return;
            processUserMessage(text);
        });

        chipsWrap.appendChild(chip);
    });

    container.appendChild(chipsWrap);
    scrollToBottom();
}

/**
 * دالة مساعدة لإضافة فقاعة رسالة عادية
 */
function appendMessage(text, sender = "bot") {
    const messagesEl = document.getElementById("bisChatbotMessages");
    if (!messagesEl) return;

    const msg = document.createElement("div");
    msg.className = `chatbot-msg ${sender}`;

    const bubble = document.createElement("div");
    bubble.className = "chatbot-bubble";
    bubble.textContent = text; // 🛡️ textContent للأمان التام

    msg.appendChild(bubble);
    messagesEl.appendChild(msg);

    scrollToBottom();
}

/**
 * إنشاء حاوية لرسالة البوت المعقدة (التي تحتوي على أزرار أو روابط)
 */
function createBotBubbleContainer() {
    const messagesEl = document.getElementById("bisChatbotMessages");
    if (!messagesEl) return document.createElement("div");

    const msg = document.createElement("div");
    msg.className = "chatbot-msg bot";

    const bubble = document.createElement("div");
    bubble.className = "chatbot-bubble";

    msg.appendChild(bubble);
    messagesEl.appendChild(msg);

    return bubble;
}

/**
 * إظهار مؤشر الكتابة (Typing Indicator)
 */
function showTypingIndicator() {
    const messagesEl = document.getElementById("bisChatbotMessages");
    if (!messagesEl || document.getElementById("chatbotTyping")) return;

    const typing = document.createElement("div");
    typing.id = "chatbotTyping";
    typing.className = "chatbot-typing";
    typing.innerHTML = `
        <span class="chatbot-typing-dot"></span>
        <span class="chatbot-typing-dot"></span>
        <span class="chatbot-typing-dot"></span>
    `;

    messagesEl.appendChild(typing);
    scrollToBottom();
}

/**
 * إخفاء مؤشر الكتابة
 */
function hideTypingIndicator() {
    const typing = document.getElementById("chatbotTyping");
    if (typing) typing.remove();
}

/**
 * التمرير التلقائي لأسفل صندوق الرسائل
 */
function scrollToBottom() {
    const messagesEl = document.getElementById("bisChatbotMessages");
    if (messagesEl) {
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }
}

/**
 * 📡 مراقبة اتصال الإنترنت داخل الشات
 */
function initChatbotNetworkMonitor() {
    const input = document.getElementById("bisChatbotInput");
    const sendBtn = document.getElementById("bisChatbotSend");
    const windowEl = document.getElementById("bisChatbotWindow");

    function updateChatOnlineStatus(isOnline) {
        let notice = document.getElementById("bisChatbotOfflineNotice");
        if (!isOnline) {
            if (!notice && windowEl) {
                notice = document.createElement("div");
                notice.id = "bisChatbotOfflineNotice";
                notice.className = "chatbot-offline-notice";
                notice.setAttribute("role", "alert");
                notice.setAttribute("aria-live", "assertive");
                notice.innerHTML = `
                    <div class="cute-offline-icon-wrap">
                        <svg class="cute-offline-svg" width="34" height="34" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <g class="cute-cloud-body">
                                <path d="M18 46h28a12 12 0 0 0 4-23.3 14 14 0 0 0-26.6-4.2A11 11 0 0 0 18 46z" fill="#E0E7FF" stroke="#6366F1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M25 33c.8-1.5 2.5-1.5 3.3 0" stroke="#4338CA" stroke-width="2.2" stroke-linecap="round"/>
                                <path d="M37 33c.8-1.5 2.5-1.5 3.3 0" stroke="#4338CA" stroke-width="2.2" stroke-linecap="round"/>
                                <circle cx="23" cy="36" r="2.8" fill="#F472B6" opacity="0.8"/>
                                <circle cx="42" cy="36" r="2.8" fill="#F472B6" opacity="0.8"/>
                                <path d="M31 38c1.5-1 3.5-1 5 0" stroke="#4338CA" stroke-width="1.8" stroke-linecap="round"/>
                            </g>
                            <g class="cute-wifi-cross">
                                <path d="M22 13a17 17 0 0 1 20 0" stroke="#F59E0B" stroke-width="2.2" stroke-linecap="round" stroke-dasharray="2 3"/>
                                <path d="M27 18a10 10 0 0 1 10 0" stroke="#F59E0B" stroke-width="2.2" stroke-linecap="round"/>
                                <line x1="44" y1="10" x2="20" y2="24" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round"/>
                            </g>
                            <circle cx="48" cy="42" r="2" fill="#F59E0B" class="cute-sparkle"/>
                        </svg>
                    </div>
                    <div class="chatbot-offline-text">معلش، الموقع محتاج إنترنت عشان يشتغل. أول ما النت يرجع كمّل من مكانك.</div>
                `;
                const header = windowEl.querySelector(".chatbot-header");
                if (header && header.nextSibling) {
                    windowEl.insertBefore(notice, header.nextSibling);
                } else if (windowEl) {
                    windowEl.prepend(notice);
                }
            }
            if (notice) notice.style.display = "flex";
            if (input) {
                if (!input.hasAttribute("data-prev-ph")) {
                    input.setAttribute("data-prev-ph", input.placeholder || "");
                }
                input.placeholder = "الموقع محتاج إنترنت عشان يشتغل...";
                input.disabled = true;
            }
            if (sendBtn) {
                sendBtn.disabled = true;
            }
        } else {
            if (notice) notice.style.display = "none";
            if (input) {
                input.disabled = false;
                if (input.hasAttribute("data-prev-ph")) {
                    input.placeholder = input.getAttribute("data-prev-ph");
                }
            }
            if (sendBtn) {
                sendBtn.disabled = false;
            }
        }
    }

    window.addEventListener("offline", () => updateChatOnlineStatus(false));
    window.addEventListener("online", () => updateChatOnlineStatus(true));

    if (!navigator.onLine) {
        updateChatOnlineStatus(false);
    }
}



// ------------------------------------------------------------
// 🚀 بدء تشغيل الشات بوت عند تحميل الصفحة
// ------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    // 1. بناء فهرس المواد تلقائياً من data.js
    chatbotState.coursesCatalog = buildCoursesCatalog();

    // 2. إدراج هيكل الشات في الصفحة
    injectChatbotDOM();

    // 3. جلب بيانات Google Sheet CSV مرة واحدة
    fetchSheetQuestions();
});
