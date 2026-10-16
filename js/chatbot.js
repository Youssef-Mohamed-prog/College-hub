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
        subject: "قواعد البيانات 2",
        question: "ما الفرق بين Transaction و Deadlock وكيف يتم معالجته في SQL Server؟",
        answer: "الـ Transaction هي وحدة عمل منطقية إما أن تُنفذ بالكامل (Commit) أو تُلغى بالكامل (Rollback) وفق خصائص ACID.\nأما الـ Deadlock فيحدث عندما تنتظر عمليتان أو أكثر موارد يقفلها الطرف الآخر، ويقوم الـ SQL Server تلقائياً بإنهاء إحدى العمليات (Deadlock Victim) لفك التعليق."
    },
    {
        subject: "إحصاء وحزم بحوث العمليات",
        question: "كيف نفرق بين استخدام اختبار T-Test وتحليل التباين ANOVA؟",
        answer: "نستخدم اختبار T-Test عند مقارنة متوسطين فقط (عينتين مستقلتين أو مرتبطتين)، بينما نستخدم ANOVA (Analysis of Variance) عندما نريد مقارنة متوسطات 3 مجموعات أو أكثر لتجنب زيادة خطأ من النوع الأول (Type I Error)."
    },
    {
        subject: "دراسات إدارة بالإنجليزية",
        question: "What is the key difference between Leadership and Management in modern organizations?",
        answer: "Management focuses on planning, organizing, coordinating, and maintaining order and efficiency within current processes.\nLeadership focuses on inspiring, aligning people, creating a shared vision, and driving strategic change and innovation."
    },
    {
        subject: "اقتصاد كلي",
        question: "ما هو أثر رفع سعر الفائدة من قبل البنك المركزي على معدل التضخم والاستثمار؟",
        answer: "رفع سعر الفائدة يقلل من المعروض النقدي ويزيد تكلفة الاقتراض، مما يؤدي إلى انخفاض الطلب الكلي وتباطؤ معدل التضخم. ولكن في المقابل، يؤدي ذلك إلى تراجع وتيرة الاستثمار وتكلفة تمويل المشروعات في المدى القصير."
    },
    {
        subject: "محاسبة ضرائب",
        question: "متى تعتبر المصروفات واجبة الخصم ضريبياً وفق قانون الضريبة على الدخل؟",
        answer: "لكي يعتبر المصروف واجب الخصم يجب:\n1. أن يكون مرتبطاً بطبيعة نشاط المنشأة ولازماً لتحقيق الإيراد.\n2. أن يكون مصروفاً حقيقياً ومؤيداً بمستندات أو فواتير إلكترونية.\n3. أن يخص الفترة الضريبية نفسها (مبدأ الاستحقاق)."
    },
    {
        subject: "محاسبة تكاليف",
        question: "ما هي نقطة التعادل (Break-even Point) وكيف يتم حسابها بالوحدات وبالقيمة؟",
        answer: "نقطة التعادل هي النقطة التي يتساوى عندها إجمالي الإيرادات مع إجمالي التكاليف (الربح = صفر).\n- بالوحدات = التكاليف الثابتة ÷ (سعر بيع الوحدة - التكلفة المتغيرة للوحدة).\n- بالقيمة (المبيعات) = التكاليف الثابتة ÷ نسبة هامش المساهمة."
    }
];


// ------------------------------------------------------------
// 🧠 الحالة العامة للبوت (Chatbot State)
// ------------------------------------------------------------
const chatbotState = {
    isOpen: false,           // هل نافذة الشات مفتوحة؟
    hasWelcomed: false,      // هل تم إرسال رسالة الترحيب؟
    sheetQuestions: [],      // الأسئلة المحملة من Google Sheet
    coursesCatalog: [],      // فهرس المواد والمحاضرات المنشأ تلقائياً من data.js
    isCsvLoading: true,      // هل جاري تحميل الشيت؟
    csvFetchFailed: false,   // هل فشل تحميل الشيت؟
    isTyping: false          // هل البوت يكتب الآن؟
};


// ------------------------------------------------------------
// 🔤 كلمات الوصل والزوائد الشائعة في العربية (Stop Words)
// يتم استبعادها للتركيز على الكلمات المفتاحية المهمة
// ------------------------------------------------------------
const ARABIC_STOP_WORDS = new Set([
    "في", "من", "على", "إلى", "الى", "عن", "حتى", "مع", "بين",
    "هو", "هي", "هما", "هم", "هن", "انا", "نحن", "انت", "انتم",
    "هذا", "هذه", "هذان", "هاتان", "هؤلاء", "ذلك", "تلك", "هناك",
    "ما", "ماذا", "هل", "كيف", "اين", "متى", "كم", "لماذا", "ليه", "ايه",
    "الذي", "التي", "اللذين", "اللتين", "الذين", "اللاتي", "اللواتي", "اللي",
    "لو", "ان", "أن", "إن", "كان", "كانت", "يكون", "تكون",
    "عايز", "عاوز", "محتاج", "ممكن", "بدي", "لو_سمحت", "من_فضلك",
    "يا", "و", "ثم", "أو", "او", "بل", "لكن", "لا", "لم", "لن", "ليس",
    "كل", "بعض", "غير", "فقط", "بدون", "دا", "دي", "دول"
]);

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
 * تنظيف النص وتوحيد الحروف وإزالة علامات الترقيم والتشكيل
 */
function cleanText(text) {
    if (!text) return "";
    return String(text)
        // 1. إزالة التشكيل
        .replace(/[\u064B-\u065F\u0670]/g, "")
        // 2. توحيد الألف والهمزات والتاء والياء
        .replace(/[أإآ]/g, "ا")
        .replace(/ة/g, "ه")
        .replace(/ى/g, "ي")
        .replace(/ؤ/g, "و")
        .replace(/ئ/g, "ي")
        // 3. إزالة علامات الترقيم والأقواس
        .replace(/[!؟?.,،؛;:_()\[\]{}"'\\\/+\-*=<>#@$%^&~`|]/g, " ")
        // 4. حروف صغيرة ومسافات موحدة
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
}

/**
 * استخراج الكلمات المفتاحية من النص بعد استبعاد حروف الجر وكلمات الوصل
 */
function extractKeywords(text) {
    const cleaned = cleanText(text);
    if (!cleaned) return [];
    return cleaned
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
        const courseKeywords = extractKeywords(`${course.title} ${course.titleEn || ""} ${subjectText}`);

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
// 📑 المصدر 1: جلب بيانات Google Sheet CSV مرة واحدة
// ------------------------------------------------------------

/**
 * محلل نصوص CSV خفيف ومضمون يعمل محلياً بدون أي مكتبات خارجية
 * يتعامل مع الفواصل، علامات التنصيص، والأسطر الجديدة داخل النصوص
 */
function parseCsvSafely(csvText) {
    if (!csvText) return [];

    const rows = [];
    let currentRow = [];
    let currentField = "";
    let insideQuotes = false;

    for (let i = 0; i < csvText.length; i++) {
        const char = csvText[i];
        const nextChar = csvText[i + 1];

        if (char === '"') {
            if (insideQuotes && nextChar === '"') {
                currentField += '"';
                i++; // تخطي علامة التنصيص المزدوجة
            } else {
                insideQuotes = !insideQuotes;
            }
        } else if (char === ',' && !insideQuotes) {
            currentRow.push(currentField.trim());
            currentField = "";
        } else if ((char === '\r' || char === '\n') && !insideQuotes) {
            if (char === '\r' && nextChar === '\n') i++;
            currentRow.push(currentField.trim());
            if (currentRow.some(field => field.length > 0)) {
                rows.push(currentRow);
            }
            currentRow = [];
            currentField = "";
        } else {
            currentField += char;
        }
    }

    if (currentField.length > 0 || currentRow.length > 0) {
        currentRow.push(currentField.trim());
        if (currentRow.some(field => field.length > 0)) {
            rows.push(currentRow);
        }
    }

    if (rows.length < 2) return [];

    // الصف الأول يحتوي على أسماء الأعمدة: المادة، السؤال، الإجابة
    const headers = rows[0].map(h => cleanText(h));
    const subjectIdx = headers.findIndex(h => h.includes("ماده") || h.includes("مادة"));
    const questionIdx = headers.findIndex(h => h.includes("سؤال") || h.includes("السؤال"));
    const answerIdx = headers.findIndex(h => h.includes("اجابه") || h.includes("إجابة") || h.includes("الاجابة") || h.includes("الإجابة"));

    const parsedData = [];
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const subject = (subjectIdx !== -1 && row[subjectIdx]) ? row[subjectIdx] : "عام";
        const question = (questionIdx !== -1 && row[questionIdx]) ? row[questionIdx] : "";
        const answer = (answerIdx !== -1 && row[answerIdx]) ? row[answerIdx] : "";

        // شرط مهم: تجاهل الصفوف اللي إجابتها فاضية
        if (question && answer && answer.trim().length > 0) {
            parsedData.push({
                subject: subject.trim(),
                question: question.trim(),
                answer: answer.trim(),
                questionKeywords: extractKeywords(question),
                subjectKeywords: extractKeywords(subject)
            });
        }
    }

    return parsedData;
}

/**
 * جلب الـ CSV مرة واحدة عند تحميل الصفحة
 */
async function fetchSheetQuestions() {
    chatbotState.isCsvLoading = true;
    chatbotState.csvFetchFailed = false;

    const csvUrl = getBotCsvUrl();
    const isPlaceholder = !csvUrl || csvUrl === "ضع_رابط_الشيت_CSV_هنا";

    if (isPlaceholder) {
        // استخدام الأسئلة النموذجية عند غياب الرابط
        chatbotState.sheetQuestions = BOT_FALLBACK_QUESTIONS.map(q => ({
            ...q,
            questionKeywords: extractKeywords(q.question),
            subjectKeywords: extractKeywords(q.subject)
        }));
        chatbotState.isCsvLoading = false;
        return;
    }

    try {
        const response = await fetch(csvUrl);
        if (!response.ok) throw new Error("استجابة غير صحيحة من الشيت");
        const csvText = await response.text();

        // فك التشفير إما بـ PapaParse لو متاح أو بالمحلل الداخلي
        let parsed = [];
        if (typeof Papa !== "undefined") {
            const result = Papa.parse(csvText, { header: true, skipEmptyLines: "greedy" });
            const rawRows = result.data || [];
            rawRows.forEach(row => {
                const keys = Object.keys(row);
                const sKey = keys.find(k => cleanText(k).includes("ماده") || cleanText(k).includes("مادة"));
                const qKey = keys.find(k => cleanText(k).includes("سؤال"));
                const aKey = keys.find(k => cleanText(k).includes("اجابه") || cleanText(k).includes("إجابة"));

                const subject = (sKey && row[sKey]) ? String(row[sKey]).trim() : "عام";
                const question = (qKey && row[qKey]) ? String(row[qKey]).trim() : "";
                const answer = (aKey && row[aKey]) ? String(row[aKey]).trim() : "";

                // تجاهل الصفوف الخالية من الإجابة
                if (question && answer) {
                    parsed.push({
                        subject,
                        question,
                        answer,
                        questionKeywords: extractKeywords(question),
                        subjectKeywords: extractKeywords(subject)
                    });
                }
            });
        } else {
            parsed = parseCsvSafely(csvText);
        }

        chatbotState.sheetQuestions = parsed;
        chatbotState.isCsvLoading = false;
    } catch (err) {
        console.warn("تعذر جلب ملف الشيت CSV للشات بوت:", err);
        chatbotState.csvFetchFailed = true;
        chatbotState.isCsvLoading = false;
    }
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
 */
function searchSheetQuestions(userQuery) {
    if (chatbotState.sheetQuestions.length === 0) return { bestMatch: null, suggestions: [] };

    const userKeywords = extractKeywords(userQuery);
    if (userKeywords.length === 0) return { bestMatch: null, suggestions: [] };

    const scored = [];

    chatbotState.sheetQuestions.forEach((item) => {
        const qWords = item.questionKeywords;
        const sWords = item.subjectKeywords;

        // 1. حساب الكلمات المشتركة مع نص السؤال
        let matchCount = 0;
        userKeywords.forEach(uWord => {
            if (qWords.some(qWord => qWord === uWord || (qWord.length > 3 && (qWord.includes(uWord) || uWord.includes(qWord))))) {
                matchCount++;
            }
        });

        if (matchCount === 0) return;

        // نسبة الكلمات المشتركة
        let similarity = matchCount / Math.max(userKeywords.length, 1);

        // 2. إعطاء نقاط إضافية لو ذكر الطالب اسم المادة في سؤاله
        const mentionsSubject = userKeywords.some(uWord =>
            sWords.some(sWord => sWord === uWord || (sWord.length > 3 && sWord.includes(uWord)))
        );
        if (mentionsSubject) {
            similarity += 0.25; // بونص ذكر المادة
        }

        scored.push({
            item,
            score: similarity
        });
    });

    // الترتيب من الأعلى للأقل
    scored.sort((a, b) => b.score - a.score);

    if (scored.length === 0) return { bestMatch: null, suggestions: [] };

    const top = scored[0];
    const isAboveThreshold = top.score >= SIMILARITY_THRESHOLD;

    // أقرب 2 أسئلة تالية كاقتراحات
    const suggestions = scored.slice(1, 3)
        .filter(s => s.score >= 0.15)
        .map(s => s.item);

    return {
        bestMatch: isAboveThreshold ? top.item : null,
        bestScore: top.score,
        suggestions
    };
}


// ------------------------------------------------------------
// 💬 معالجة رسائل الطالب وتوليد الردود المناسبة
// ------------------------------------------------------------

/**
 * الدالة الرئيسية لتوليد رد البوت
 */
function processUserMessage(userText) {
    const trimmed = userText.trim();
    if (!trimmed) return;

    // 1. إضافة رسالة الطالب للشات
    appendMessage(trimmed, "user");

    // إظهار أنيميشن "جاري الكتابة..."
    showTypingIndicator();

    setTimeout(() => {
        hideTypingIndicator();

        // فحص حالة الخطأ في تحميل الشيت
        if (chatbotState.csvFetchFailed && chatbotState.sheetQuestions.length === 0) {
            appendMessage("في مشكلة مؤقتة، جرب بعد شوية", "bot");
            return;
        }

        // 2. فحص مصدري البحث:
        // - المصدر 1: الشيت (أسئلة علمية)
        const sheetResult = searchSheetQuestions(trimmed);
        // - المصدر 2: data.js (محاضرات، ملخصات، كتب، سكاشن)
        const catalogResult = searchCatalogIntent(trimmed);

        const hasSheetMatch = Boolean(sheetResult.bestMatch);
        const hasCatalogMatch = Boolean(catalogResult && catalogResult.course);

        // لو الكلمات تنفع للمصدرين: اعرض إجابة الشيت الأول وبعدها لينكات المحاضرات المرتبطة
        if (hasSheetMatch && hasCatalogMatch) {
            appendSheetAnswer(sheetResult.bestMatch, sheetResult.suggestions);
            appendCatalogResponse(catalogResult, "روابط ومحاضرات متعلقة بالمادة:");
            return;
        }

        // لو في تطابق مع أسئلة الشيت فقط
        if (hasSheetMatch) {
            appendSheetAnswer(sheetResult.bestMatch, sheetResult.suggestions);
            return;
        }

        // لو الطلب خاص بالمحاضرات والملخصات والكتب
        if (hasCatalogMatch) {
            appendCatalogResponse(catalogResult);
            return;
        }

        // لو مفيش أي تطابق في المصدرين: رد بـ "ملقيتش إجابة لسؤالك" مع زر "اسأل الدكتور"
        appendNoMatchResponse(trimmed);

    }, 380);
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
                    <span>إجابات فورية من المقررات والشيت</span>
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
    welcomeText.textContent = "أهلاً بك يا بطل! 🎓 أنا المساعد الذكي لمجمع طلاب BIS.\nأقدر أساعدك في الوصول للمحاضرات والملخصات والكتب، أو الإجابة على استفسارات المواد فورياً بدون إنترنت.\n\nجرّب تضغط على أي سؤال:";
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
