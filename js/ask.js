// ============================================================
// 🔗 روابط وثوابت الإعداد — تُقرأ تلقائياً من ملف js/config.js المشترك
// ============================================================
const getFormUrl = () => (typeof FORM_URL !== "undefined" ? FORM_URL : (window.FORM_URL || "ضع_رابط_الفورم_هنا"));
const getCsvUrl = () => (typeof CSV_URL !== "undefined" ? CSV_URL : (window.CSV_URL || "ضع_رابط_الشيت_CSV_هنا"));
const getEntrySubject = () => (typeof ENTRY_SUBJECT !== "undefined" ? ENTRY_SUBJECT : (window.ENTRY_SUBJECT || "entry.XXXXXXXXX"));
const getEntryQuestion = () => (typeof ENTRY_QUESTION !== "undefined" ? ENTRY_QUESTION : (window.ENTRY_QUESTION || "entry.YYYYYYYYY"));


// ============================================================
// 📚 قائمة المواد الدراسية المعتمدة
// مأخوذة بنفس الأسماء والترتيب الموجود في data.js
// ============================================================
const DEFAULT_COURSES = [
    "قواعد البيانات 2",
    "إحصاء وحزم بحوث العمليات",
    "دراسات إدارة بالإنجليزية",
    "اقتصاد كلي",
    "محاسبة ضرائب",
    "محاسبة تكاليف"
];

// دمج مصفوفة المواد من data.js إن وجدت، أو الاعتماد على القائمة الافتراضية
const COURSE_LIST = (typeof courses !== 'undefined' && Array.isArray(courses) && courses.length > 0)
    ? courses.map(c => {
        const title = c.title;
        return (title === "دراسات إدارية بالإنجليزية") ? "دراسات إدارة بالإنجليزية" : title;
    })
    : DEFAULT_COURSES;


// ============================================================
// 🗃️ بيانات تجريبية (Sample Data)
// تظهر فقط للتجربة والمعاينة إذا لم يتم استبدال الرابط الافتراضي بعد
// ============================================================
const DEMO_QUESTIONS = [
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


// ============================================================
// 🧠 الحالة العامة للتطبيق (State Management)
// ============================================================
const state = {
    allQuestions: [],     // جميع الأسئلة المستلمة من الشيت
    filteredQuestions: [],// الأسئلة بعد تطبيق الفلترة والبحث
    selectedSubject: "الكل", // المادة المختارة حالياً
    searchQuery: "",      // النص المكتوب في خانة البحث
    isLoading: true,      // هل جاري جلب البيانات؟
    hasError: false,      // هل حدث خطأ أثناء الجلب؟
    isDemo: false         // هل نحن في وضع المعاينة التجريبية؟
};


// ============================================================
// 🚀 بدء التشغيل عند اكتمال تحميل الصفحة (Initialization)
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
    setupAskForm();
    checkAndApplyPrefill();
    renderFilterChips();
    setupSearchEvents();
    loadQuestionsData();
});


// ============================================================
// 1️⃣ إعداد نموذج طرح السؤال داخل الصفحة والتحقق ومكافحة السبام
// ============================================================
const COOLDOWN_STORAGE_KEY = "bis_ask_cooldown_timestamp";
let cooldownTimerInterval = null;

function setupAskForm() {
    const form = document.getElementById("askQuestionForm");
    const subjectSelect = document.getElementById("subjectSelect");
    const questionInput = document.getElementById("questionInput");
    const charCounter = document.getElementById("charCounter");
    const subjectError = document.getElementById("subjectError");
    const questionError = document.getElementById("questionError");
    const alertBox = document.getElementById("formAlertBox");
    const submitBtn = document.getElementById("submitQuestionBtn");
    const submitBtnText = document.getElementById("submitBtnText");

    if (!form || !subjectSelect || !questionInput || !submitBtn) return;

    // تهيئة مؤقت الانتظار إذا كان مفعّلاً في التخزين المحلي
    initCooldown(submitBtn, submitBtnText);

    // عداد الأحرف ومسح خطأ السؤال عند الكتابة
    questionInput.addEventListener("input", () => {
        const len = questionInput.value.length;
        if (charCounter) charCounter.textContent = `${len} / 1000`;

        if (questionInput.classList.contains("has-error")) {
            questionInput.classList.remove("has-error");
            if (questionError) {
                questionError.textContent = "";
                questionError.classList.remove("visible");
            }
        }
    });

    // مسح خطأ المادة عند الاختيار
    subjectSelect.addEventListener("change", () => {
        if (subjectSelect.classList.contains("has-error")) {
            subjectSelect.classList.remove("has-error");
            if (subjectError) {
                subjectError.textContent = "";
                subjectError.classList.remove("visible");
            }
        }
    });

    // إرسال النموذج
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // إخفاء رسالة التنبيه السابقة
        if (alertBox) {
            alertBox.style.display = "none";
            alertBox.className = "ask-form-alert";
            alertBox.innerHTML = "";
        }

        // فحص مؤقت الـ 30 ثانية لتجنب التكرار (Cooldown)
        const remainingCooldown = getRemainingCooldownSeconds();
        if (remainingCooldown > 0) {
            showFormAlert(alertBox, "error", `يرجى الانتظار ${remainingCooldown} ثانية قبل إرسال سؤال جديد.`);
            return;
        }

        // 1. التحقق من صحة المدخلات
        let isValid = true;
        const subjectVal = (subjectSelect.value || "").trim();
        const questionVal = (questionInput.value || "").trim();

        // التحقق من المادة
        if (!subjectVal) {
            isValid = false;
            subjectSelect.classList.add("has-error");
            if (subjectError) {
                subjectError.textContent = "يرجى اختيار المقرر الدراسي.";
                subjectError.classList.add("visible");
            }
        } else {
            subjectSelect.classList.remove("has-error");
            if (subjectError) {
                subjectError.textContent = "";
                subjectError.classList.remove("visible");
            }
        }

        // التحقق من السؤال (5 أحرف على الأقل، بحد أقصى 1000 حرف)
        if (!questionVal || questionVal.length < 5) {
            isValid = false;
            questionInput.classList.add("has-error");
            if (questionError) {
                questionError.textContent = "يجب أن يحتوي السؤال على 5 أحرف على الأقل.";
                questionError.classList.add("visible");
            }
        } else if (questionVal.length > 1000) {
            isValid = false;
            questionInput.classList.add("has-error");
            if (questionError) {
                questionError.textContent = "الحد الأقصى للسؤال هو 1000 حرف.";
                questionError.classList.add("visible");
            }
        } else {
            questionInput.classList.remove("has-error");
            if (questionError) {
                questionError.textContent = "";
                questionError.classList.remove("visible");
            }
        }

        if (!isValid) return;

        // 2. تجهيز الإرسال إلى Google Form
        const rawFormUrl = getFormUrl();
        const postUrl = rawFormUrl.replace("/viewform", "/formResponse");
        const entrySubject = getEntrySubject();
        const entryQuestion = getEntryQuestion();

        const bodyParams = new URLSearchParams();
        bodyParams.append(entrySubject, subjectVal);
        bodyParams.append(entryQuestion, questionVal);

        // تعطيل الزر أثناء الإرسال
        submitBtn.disabled = true;
        if (submitBtnText) submitBtnText.textContent = "جاري إرسال السؤال...";

        try {
            await fetch(postUrl, {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: bodyParams
            });

            // مع وضع no-cors نعتبر عدم حدوث استثناء شبكة نجاحاً
            subjectSelect.value = "";
            questionInput.value = "";
            if (charCounter) charCounter.textContent = "0 / 1000";

            showFormAlert(alertBox, "success", "تم إرسال سؤالك. هيظهر هنا بعد ما الدكتور يجاوب.");

            // بدء مؤقت الـ 30 ثانية
            startCooldown(30, submitBtn, submitBtnText);

        } catch (error) {
            console.error("فشل إرسال السؤال:", error);
            submitBtn.disabled = false;
            if (submitBtnText) submitBtnText.textContent = "إرسال السؤال";

            showFormAlert(
                alertBox,
                "error",
                `حدث خطأ أثناء إرسال السؤال. تأكد من اتصالك بالإنترنت.
                <span class="ask-fallback-link">
                    يمكنك إرسال سؤالك مباشرة عبر <a href="${rawFormUrl}" target="_blank" rel="noopener noreferrer">نموذج Google Form</a>
                </span>`
            );
        }
    });
}

/**
 * إظهار رسالة التنبيه في النموذج
 */
function showFormAlert(alertBox, type, messageHtml) {
    if (!alertBox) return;
    alertBox.className = `ask-form-alert ${type}`;
    alertBox.innerHTML = messageHtml;
    alertBox.style.display = "block";
}

/**
 * حساب الوقت المتبقي لمؤقت الحظر (Cooldown)
 */
function getRemainingCooldownSeconds() {
    try {
        const stored = localStorage.getItem(COOLDOWN_STORAGE_KEY);
        if (!stored) return 0;
        const expiry = parseInt(stored, 10);
        const now = Date.now();
        if (expiry > now) {
            return Math.ceil((expiry - now) / 1000);
        }
    } catch (e) {}
    return 0;
}

/**
 * بدء مؤقت 30 ثانية وتعطيل زر الإرسال
 */
function startCooldown(seconds, submitBtn, submitBtnText) {
    const expiry = Date.now() + (seconds * 1000);
    try {
        localStorage.setItem(COOLDOWN_STORAGE_KEY, String(expiry));
    } catch (e) {}
    initCooldown(submitBtn, submitBtnText);
}

/**
 * تشغيل العد التنازلي وتحديث الزر
 */
function initCooldown(submitBtn, submitBtnText) {
    if (!submitBtn) return;
    if (cooldownTimerInterval) {
        clearInterval(cooldownTimerInterval);
        cooldownTimerInterval = null;
    }

    const updateTimer = () => {
        const remaining = getRemainingCooldownSeconds();
        if (remaining > 0) {
            submitBtn.disabled = true;
            if (submitBtnText) {
                submitBtnText.textContent = `يرجى الانتظار (${remaining} ثانية)...`;
            }
        } else {
            submitBtn.disabled = false;
            if (submitBtnText) {
                submitBtnText.textContent = "إرسال السؤال";
            }
            if (cooldownTimerInterval) {
                clearInterval(cooldownTimerInterval);
                cooldownTimerInterval = null;
            }
            try {
                localStorage.removeItem(COOLDOWN_STORAGE_KEY);
            } catch (e) {}
        }
    };

    updateTimer();
    if (getRemainingCooldownSeconds() > 0) {
        cooldownTimerInterval = setInterval(updateTimer, 1000);
    }
}

/**
 * دالة ملء السؤال والانتقال للنموذج (تستخدم محلياً ومن الشات بوت)
 */
window.prefillAskForm = function(questionText) {
    const formCard = document.getElementById("ask-form");
    const textarea = document.getElementById("questionInput");
    if (!formCard || !textarea) return;

    if (questionText) {
        textarea.value = questionText;
        textarea.dispatchEvent(new Event("input"));
    }

    setTimeout(() => {
        formCard.scrollIntoView({ behavior: "smooth", block: "center" });
        textarea.focus();
    }, 150);
};

/**
 * فحص sessionStorage للأسئلة القادمة من صفحات أخرى أو من الشات بوت
 */
function checkAndApplyPrefill() {
    try {
        const prefillVal = sessionStorage.getItem("bis_prefill_question");
        if (prefillVal) {
            sessionStorage.removeItem("bis_prefill_question");
            window.prefillAskForm(prefillVal);
            return;
        }
    } catch (e) {}

    // لو الصفحة فُتحت بـ #ask-form
    if (window.location.hash === "#ask-form") {
        window.prefillAskForm("");
    }
}



// ============================================================
// 2️⃣ بناء أزرار فلاتر المواد (الكل + المواد الستة)
// ============================================================
function renderFilterChips() {
    const filtersContainer = document.getElementById("filterChips");
    if (!filtersContainer) return;

    // قائمة التبويبات: "الكل" أولاً ثم المواد الستة
    const subjects = ["الكل", ...COURSE_LIST];

    // تفريغ الحاوية
    filtersContainer.innerHTML = "";

    subjects.forEach((subject) => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = `filter-chip ${subject === state.selectedSubject ? "active" : ""}`;
        chip.setAttribute("data-subject", subject);

        // وضع اسم المادة بأمان بواسطة textContent
        const titleSpan = document.createElement("span");
        titleSpan.textContent = subject;
        chip.appendChild(titleSpan);

        // عند النقر على الفلتر
        chip.addEventListener("click", () => {
            if (state.selectedSubject === subject) return;
            state.selectedSubject = subject;

            // تحديث الشكل النشط
            filtersContainer.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
            chip.classList.add("active");

            // تطبيق الفلترة
            applyFilters();
        });

        filtersContainer.appendChild(chip);
    });
}


// ============================================================
// 3️⃣ إعداد أحداث البحث والمسح
// ============================================================
function setupSearchEvents() {
    const searchInput = document.getElementById("searchInput");
    const clearBtn = document.getElementById("searchClear");
    const expandAllBtn = document.getElementById("expandAllBtn");
    const collapseAllBtn = document.getElementById("collapseAllBtn");

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            state.searchQuery = e.target.value.trim();
            if (clearBtn) {
                clearBtn.classList.toggle("visible", state.searchQuery.length > 0);
            }
            applyFilters();
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            if (searchInput) {
                searchInput.value = "";
                state.searchQuery = "";
                clearBtn.classList.remove("visible");
                searchInput.focus();
                applyFilters();
            }
        });
    }

    // زر فتح جميع الأكورديونات
    if (expandAllBtn) {
        expandAllBtn.addEventListener("click", () => {
            document.querySelectorAll(".ask-card").forEach(card => card.classList.add("open"));
        });
    }

    // زر إغلاق جميع الأكورديونات
    if (collapseAllBtn) {
        collapseAllBtn.addEventListener("click", () => {
            document.querySelectorAll(".ask-card").forEach(card => card.classList.remove("open"));
        });
    }
}


// ============================================================
// 4️⃣ جلب البيانات وتفكيك CSV باستخدام fetch ومكتبة PapaParse
// ============================================================
async function loadQuestionsData() {
    renderLoadingState();

    const csvUrl = getCsvUrl();
    // فحص ما إذا كان الرابط لا يزال القيمة الافتراضية التجريبية
    const isPlaceholder = !csvUrl || csvUrl === "ضع_رابط_الشيت_CSV_هنا";

    if (isPlaceholder) {
        // استخدام البيانات التجريبية للمعاينة
        setTimeout(() => {
            state.isDemo = true;
            state.isLoading = false;
            state.hasError = false;
            // عكس الترتيب: الأحدث يظهر أولاً
            state.allQuestions = DEMO_QUESTIONS.slice().reverse();
            showNoticeBanner();
            applyFilters();
        }, 300);
        return;
    }

    // إذا كان هناك رابط فعلي، نقوم بسحبه بواسطة fetch
    try {
        const response = await fetch(csvUrl);
        if (!response.ok) {
            throw new Error(`خطأ في استجابة الخادم: ${response.status}`);
        }

        const csvText = await response.text();

        // استخدام PapaParse لمعالجة الـ CSV مع دعم الأسطر الجديدة والفواصل داخل النصوص
        if (typeof Papa === 'undefined') {
            throw new Error("تعذر تحميل مكتبة معالجة CSV (PapaParse)");
        }

        Papa.parse(csvText, {
            header: false,           // 1. قراءة الأعمدة بالترتيب وليس بالاسم
            skipEmptyLines: "greedy",// تجاهل الأسطر الفارغة
            complete: (results) => {
                const allRows = results.data || [];
                // 1. تجاهل صف العناوين (الصف الأول)
                const dataRows = allRows.slice(1);

                // 2. طباعة أول صف بعد الـ parse كما هو
                console.log("📄 [ask.js] أول صف بعد الـ parse:", dataRows[0]);

                const formatted = [];
                dataRows.forEach((row) => {
                    // 1. قراءة الأعمدة بالترتيب: العمود الأول (0) = المادة، التاني (1) = السؤال، التالت (2) = الإجابة
                    const rawSubject = (row[0] !== undefined && row[0] !== null) ? String(row[0]).trim() : "عام";
                    const question = (row[1] !== undefined && row[1] !== null) ? String(row[1]).trim() : "";
                    const answer = (row[2] !== undefined && row[2] !== null) ? String(row[2]).trim() : "";

                    // 3. تجاهل أي صف عمود السؤال فيه فاضي، أو عمود الإجابة فاضي
                    if (!question || !answer) {
                        return;
                    }

                    const cleanSubject = (rawSubject === "دراسات إدارية بالإنجليزية") ? "دراسات إدارة بالإنجليزية" : (rawSubject || "عام");
                    formatted.push({
                        subject: cleanSubject,
                        question: question,
                        answer: answer
                    });
                });

                // شرط رقم 5: الأحدث يظهر أولاً (عكس ترتيب الصفوف)
                state.allQuestions = formatted.reverse();
                state.isLoading = false;
                state.hasError = false;
                applyFilters();
            },
            error: (err) => {
                console.error("خطأ أثناء تحليل ملف CSV:", err);
                renderErrorState();
            }
        });

    } catch (error) {
        console.error("فشل جلب بيانات الأسئلة:", error);
        renderErrorState();
    }
}


/**
 * دالة مساعدة لقراءة قيمة العمود مع تجاهل أي مسافات زائدة واختلافات الهمزات
 */
function findColumnValue(row, targetName) {
    if (!row) return "";
    // محاولة أولى: تطابق تام مع حذف المسافات
    let key = Object.keys(row).find(k => k && k.trim() === targetName);
    if (key && row[key] !== undefined && row[key] !== null) return String(row[key]).trim();

    // محاولة ثانية: تطابق مرن بعد توحيد الحروف
    const normTarget = normalize(targetName, false);
    key = Object.keys(row).find(k => k && normalize(k, false) === normTarget);
    if (key && row[key] !== undefined && row[key] !== null) return String(row[key]).trim();

    if (normTarget.includes("اجاب") || normTarget.includes("رد")) {
        key = Object.keys(row).find(k => k && (normalize(k, false).includes("اجاب") || normalize(k, false).includes("رد")));
        if (key && row[key] !== undefined && row[key] !== null) return String(row[key]).trim();
    }
    if (normTarget.includes("سؤال")) {
        key = Object.keys(row).find(k => k && normalize(k, false).includes("سؤال"));
        if (key && row[key] !== undefined && row[key] !== null) return String(row[key]).trim();
    }
    if (normTarget.includes("ماد")) {
        key = Object.keys(row).find(k => k && normalize(k, false).includes("ماد"));
        if (key && row[key] !== undefined && row[key] !== null) return String(row[key]).trim();
    }

    return "";
}


/**
 * إظهار شريط تنبيهي أن الصفحة تعمل بالبيانات التجريبية
 */
function showNoticeBanner() {
    const banner = document.getElementById("demoNoticeBanner");
    if (banner) banner.style.display = "flex";
}


// ============================================================
// 5️⃣ الفلترة والبحث النصي في السؤال والإجابة
// ============================================================
function applyFilters() {
    const query = normalize(state.searchQuery, false);
    const selected = state.selectedSubject;
    const normSelected = normalize(selected, true);

    state.filteredQuestions = state.allQuestions.filter((item) => {
        // 1. فلتر المادة بعد توحيد الحروف وحذف اللواحق والعلامات المخفية
        const normItemSubject = normalize(item.subject, true);
        const matchesSubject = (selected === "الكل") || 
            (normItemSubject === normSelected) ||
            (normSelected && (normItemSubject.includes(normSelected) || normSelected.includes(normItemSubject)));

        // 2. فلتر البحث (في نص السؤال أو الإجابة)
        let matchesSearch = true;
        if (query) {
            const qNorm = normalize(item.question, false);
            const aNorm = normalize(item.answer, false);
            matchesSearch = qNorm.includes(query) || aNorm.includes(query);
        }

        return matchesSubject && matchesSearch;
    });

    renderQuestionsList();
    updateResultsCount();
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

/**
 * دالة متوافقة مع الاستدعاءات السابقة لـ normalizeArabic
 */
function normalizeArabic(text, stripTrailing = false) {
    return normalize(text, stripTrailing);
}



// ============================================================
// 6️⃣ رندر كروت الأسئلة باستخدام textContent للحماية من XSS
// ============================================================
function renderQuestionsList() {
    const container = document.getElementById("questionsContainer");
    if (!container) return;

    container.innerHTML = "";

    // حالة: لا توجد أسئلة تطابق الفلتر أو البحث
    if (state.filteredQuestions.length === 0) {
        renderEmptyState(container);
        return;
    }

    // بناء قائمة الكروت
    const list = document.createElement("div");
    list.className = "ask-list";

    state.filteredQuestions.forEach((item, index) => {
        const card = createQuestionCard(item, index);
        list.appendChild(card);
    });

    container.appendChild(list);
}


/**
 * بناء كارت السؤال والأكورديون
 * هام جداً: جميع النصوص تُعرض عبر textContent منعاً لأي كود ضار
 */
function createQuestionCard(item, index) {
    const card = document.createElement("article");
    card.className = "ask-card animate-fade-in-up";
    card.style.animationDelay = `${Math.min(index * 0.05, 0.4)}s`;

    // 1. رأس الكارت (مفتاح فتح وإغلاق الأكورديون)
    const header = document.createElement("div");
    header.className = "ask-card-header";
    header.setAttribute("role", "button");
    header.setAttribute("tabindex", "0");
    header.setAttribute("aria-expanded", "false");
    header.setAttribute("aria-label", "عرض أو إخفاء إجابة السؤال");

    // الصف العلوي: شارة اسم المادة ورقم السؤال وسهم الفتح
    const topRow = document.createElement("div");
    topRow.className = "ask-card-top";

    // شارة اسم المادة (تُعرض بـ textContent)
    const badge = document.createElement("span");
    badge.className = "ask-badge";
    badge.textContent = item.subject || "عام"; // 🛡️ آمن تماماً

    const headerEnd = document.createElement("div");
    headerEnd.className = "ask-header-end";

    const indexSpan = document.createElement("span");
    indexSpan.className = "ask-index";
    indexSpan.textContent = `#${index + 1}`;

    const toggleIcon = document.createElement("span");
    toggleIcon.className = "ask-toggle-icon";
    toggleIcon.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
    `;

    headerEnd.appendChild(indexSpan);
    headerEnd.appendChild(toggleIcon);

    topRow.appendChild(badge);
    topRow.appendChild(headerEnd);

    // نص السؤال (يُعرض بـ textContent)
    const questionTitle = document.createElement("div");
    questionTitle.className = "ask-question-title";

    const qIcon = document.createElement("span");
    qIcon.className = "ask-question-icon";
    qIcon.textContent = "❓";

    const qText = document.createElement("div");
    qText.className = "ask-question-text";
    qText.textContent = item.question; // 🛡️ آمن تماماً ضد أي كود برمجي

    questionTitle.appendChild(qIcon);
    questionTitle.appendChild(qText);

    header.appendChild(topRow);
    header.appendChild(questionTitle);

    // 2. جسم الكارت (الأكورديون القابل للطي)
    const body = document.createElement("div");
    body.className = "ask-card-body";

    const bodyInner = document.createElement("div");
    bodyInner.className = "ask-card-body-inner";

    const answerWrapper = document.createElement("div");
    answerWrapper.className = "ask-answer-wrapper";

    // ترويسة الإجابة (شارة الدكتور وزر النسخ)
    const answerHeader = document.createElement("div");
    answerHeader.className = "ask-answer-header";

    const doctorBadge = document.createElement("div");
    doctorBadge.className = "ask-answer-badge";
    doctorBadge.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2L1 7l11 5 9-4.09V17h2V7L12 2zm0 13l-7-3.18v4.54l7 3.18 7-3.18V11.82L12 15z"/>
        </svg>
        <span>إجابة الدكتور</span>
    `;

    // زر نسخ السؤال والإجابة
    const copyBtn = document.createElement("button");
    copyBtn.type = "button";
    copyBtn.className = "ask-copy-btn";
    copyBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        <span>نسخ</span>
    `;

    copyBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // منع إغلاق الأكورديون عند الضغط على النسخ
        const textToCopy = `المادة: ${item.subject}\nالسؤال: ${item.question}\n\nالإجابة:\n${item.answer}`;
        navigator.clipboard.writeText(textToCopy).then(() => {
            copyBtn.classList.add("copied");
            copyBtn.querySelector("span").textContent = "تم النسخ!";
            setTimeout(() => {
                copyBtn.classList.remove("copied");
                copyBtn.querySelector("span").textContent = "نسخ";
            }, 2000);
        }).catch(() => {});
    });

    answerHeader.appendChild(doctorBadge);
    answerHeader.appendChild(copyBtn);

    // نص الإجابة (يُعرض بـ textContent لحماية 100%)
    const answerText = document.createElement("div");
    answerText.className = "ask-answer-text";
    answerText.textContent = item.answer; // 🛡️ آمن تماماً

    answerWrapper.appendChild(answerHeader);
    answerWrapper.appendChild(answerText);
    bodyInner.appendChild(answerWrapper);
    body.appendChild(bodyInner);

    // تجميع الكارت
    card.appendChild(header);
    card.appendChild(body);

    // حدث النقر لتبديل حالة الأكورديون (فتح / إغلاق)
    function toggleCard() {
        const isOpen = card.classList.toggle("open");
        header.setAttribute("aria-expanded", isOpen ? "true" : "false");
    }

    header.addEventListener("click", toggleCard);

    // دعم لوحة المفاتيح للتنقل الميسر (Accessibility)
    header.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleCard();
        }
    });

    return card;
}


// ============================================================
// 7️⃣ إدارة الحالات (التحميل، الفشل، لا توجد أسئلة)
// ============================================================

/**
 * حالة جاري التحميل (عرض Skeleton شيمر لطيف)
 */
function renderLoadingState() {
    const container = document.getElementById("questionsContainer");
    if (!container) return;

    container.innerHTML = `
        <div class="ask-loading-container" aria-live="polite" aria-busy="true">
            <div class="ask-skeleton-card">
                <div class="skeleton-line skeleton-badge"></div>
                <div class="skeleton-line skeleton-title"></div>
                <div class="skeleton-line skeleton-sub"></div>
            </div>
            <div class="ask-skeleton-card">
                <div class="skeleton-line skeleton-badge"></div>
                <div class="skeleton-line skeleton-title"></div>
                <div class="skeleton-line skeleton-sub"></div>
            </div>
            <div class="ask-skeleton-card">
                <div class="skeleton-line skeleton-badge"></div>
                <div class="skeleton-line skeleton-title"></div>
                <div class="skeleton-line skeleton-sub"></div>
            </div>
        </div>
    `;
}


/**
 * حالة فشل التحميل (رسالة بسيطة وزر إعادة المحاولة)
 */
function renderErrorState() {
    state.isLoading = false;
    state.hasError = true;

    const container = document.getElementById("questionsContainer");
    if (!container) return;

    container.innerHTML = `
        <div class="ask-state-card" role="alert">
            <div class="ask-state-icon">⚠️</div>
            <h3>تعذر تحميل الأسئلة في الوقت الحالي</h3>
            <p>يرجى التأكد من اتصالك بالإنترنت وصحة رابط ملف Google Sheet المنشور كـ CSV.</p>
            <button type="button" class="btn btn-primary btn-sm" id="retryLoadBtn" style="margin-top: 8px;">
                إعادة المحاولة 🔄
            </button>
        </div>
    `;

    const retryBtn = document.getElementById("retryLoadBtn");
    if (retryBtn) {
        retryBtn.addEventListener("click", () => {
            loadQuestionsData();
        });
    }
}


/**
 * حالة لا توجد أسئلة بعد
 */
function renderEmptyState(container) {
    const isFiltered = state.selectedSubject !== "الكل" || state.searchQuery.length > 0;

    const emptyBox = document.createElement("div");
    emptyBox.className = "ask-state-card";

    const icon = document.createElement("div");
    icon.className = "ask-state-icon";
    icon.textContent = isFiltered ? "🔍" : "💬";

    const title = document.createElement("h3");
    title.textContent = isFiltered ? "لا توجد نتائج تطابق بحثك" : "لا توجد أسئلة منشورة بعد";

    const desc = document.createElement("p");
    desc.textContent = isFiltered
        ? "جرّب البحث بكلمات أخرى أو اختر مادة دراسية مختلفة."
        : "كن أول من يطرح سؤاله الأكاديمي، وسيتم نشر الإجابة هنا فور اعتمادها.";

    emptyBox.appendChild(icon);
    emptyBox.appendChild(title);
    emptyBox.appendChild(desc);

    if (isFiltered) {
        const resetBtn = document.createElement("button");
        resetBtn.type = "button";
        resetBtn.className = "btn btn-outline btn-sm";
        resetBtn.textContent = "إعادة ضبط البحث والتصنيفات";
        resetBtn.addEventListener("click", () => {
            state.selectedSubject = "الكل";
            state.searchQuery = "";
            const searchInput = document.getElementById("searchInput");
            if (searchInput) searchInput.value = "";
            const clearBtn = document.getElementById("searchClear");
            if (clearBtn) clearBtn.classList.remove("visible");

            renderFilterChips();
            applyFilters();
        });
        emptyBox.appendChild(resetBtn);
    } else {
        const askNowBtn = document.createElement("a");
        askNowBtn.className = "btn btn-cta btn-sm";
        askNowBtn.textContent = "اطرح سؤالك الآن ←";
        askNowBtn.href = "#ask-form";
        askNowBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (typeof window.prefillAskForm === "function") {
                window.prefillAskForm("");
            }
        });
        emptyBox.appendChild(askNowBtn);
    }

    container.appendChild(emptyBox);
}


/**
 * تحديث شريط عدد النتائج
 */
function updateResultsCount() {
    const countEl = document.getElementById("resultsCount");
    if (!countEl) return;

    const total = state.allQuestions.length;
    const current = state.filteredQuestions.length;

    if (total === 0) {
        countEl.textContent = "لا توجد أسئلة";
    } else if (state.selectedSubject === "الكل" && !state.searchQuery) {
        countEl.textContent = `إجمالي الأسئلة: ${total}`;
    } else {
        countEl.textContent = `تم العثور على ${current} من أصل ${total}`;
    }
}
