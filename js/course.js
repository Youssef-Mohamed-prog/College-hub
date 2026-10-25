// ==========================================
// 📋 Course Details Page — تفاصيل المادة
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    renderCoursePage();
});



function renderCoursePage() {
    const courseId = getUrlParam('id');
    const course = getCourseById(courseId);
    const container = document.getElementById('courseContent');

    if (!course || !container) {
        if (container) {
            container.innerHTML = `
                <div class="text-center" style="padding: var(--space-4xl) 0;">
                    <h2>المادة غير موجودة</h2>
                    <p style="color: var(--text-secondary); margin: var(--space-md) 0;">لم نتمكن من العثور على هذه المادة.</p>
                    <a href="courses.html" class="btn btn-primary">عودة للمواد</a>
                </div>
            `;
        }
        return;
    }

    // Update page title
    document.title = "مجمع طلاب BIS";

    container.innerHTML = `
        <!-- Course Hero -->
        <section class="course-hero">
            <div class="course-hero-bg" style="background: linear-gradient(135deg, ${course.color}44, ${course.color}11);"></div>
            <div class="container">
                <div class="course-hero-content">
                    <div class="course-hero-info animate-fade-in-up">
                        <span class="course-subject-tag">📂 ${course.subject}</span>
                        <h1 style="margin-bottom: 5px;">${course.title}</h1>
                        <p style="font-size: 1.2rem; color: var(--text-secondary); margin-bottom: var(--space-md); font-weight: 500;">${course.titleEn}</p>
                        <p class="course-desc">${course.description}</p>

                        <!-- صف المحاضرات والمادة -->
                        <div class="course-meta-grid">
                            <div class="course-meta-item">
                                <div class="meta-icon">📹</div>
                                <div class="meta-text">
                                    <span class="meta-label">المحاضرات</span>
                                    <span class="meta-value">${course.lectures.length} محاضرات</span>
                                </div>
                            </div>
                            <div class="course-meta-item">
                                <div class="meta-icon">📂</div>
                                <div class="meta-text">
                                    <span class="meta-label">المادة</span>
                                    <span class="meta-value">${course.subject}</span>
                                </div>
                            </div>
                        </div>

                        <!-- زر سؤال عام عن المادة تحت صف المحاضرات والمادة وقبل قائمة المحاضرات -->
                        <div class="course-ask-action" style="margin-top: var(--space-lg);">
                            <button type="button" class="btn btn-cta" id="askSubjectBtn" style="display: inline-flex; align-items: center; gap: 8px;">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                </svg>
                                <span>سؤال عام عن المادة</span>
                            </button>

                            <!-- صندوق طرح السؤال داخل الصفحة -->
                            <div class="student-ask-panel" id="studentAskPanel" style="display: none;"></div>
                        </div>
                    </div>
                    <div class="course-hero-cover animate-fade-in">
                        ${getCourseImageHTML(course)}
                    </div>
                </div>
            </div>
        </section>

        <!-- Lectures List -->
        <section class="lectures-section">
            <div class="container">
                <div class="section-header" style="text-align: right;">
                    <h2>📋 قائمة المحاضرات</h2>
                    <p>اختر محاضرة للبدء بالمشاهدة</p>
                    <div class="section-line" style="margin-right: 0;"></div>
                </div>
                <div class="lectures-list">
                    ${course.lectures.map((lecture, index) => `
                        <a href="lecture.html?course=${course.id}&lecture=${lecture.id}" 
                           class="lecture-card" 
                           style="animation-delay: ${index * 0.1}s" 
                           data-animate="fadeInUp">
                            <div class="lecture-number">${String(lecture.id).padStart(2, '0')}</div>
                            <div class="lecture-info">
                                <h3>${lecture.title}</h3>
                                <p>${lecture.description}</p>
                            </div>
                            <span class="lecture-arrow"><svg class="arrow-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="17" y1="17" x2="7" y2="7"></line><polyline points="7 17 7 7 17 7"></polyline></svg></span>
                        </a>
                    `).join('')}
                    <div class="lecture-card-upcoming" aria-hidden="true">
                        <div class="upcoming-icon">⏳</div>
                        <span class="upcoming-text">المحاضرة التالية قريبًا</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- قسم أسئلة وإجابات الزمايل تحت قائمة المحاضرات -->
        <section class="student-qa-section" style="padding-bottom: var(--space-4xl);">
            <div class="container">
                <div class="section-header" style="text-align: right; margin-bottom: var(--space-xl);">
                    <h2>💬 أسئلة وإجابات الزمايل</h2>
                    <p>استفسارات طلاب الدفعة وإجاباتها في مادة ${course.title}</p>
                    <div class="section-line" style="margin-right: 0;"></div>
                </div>

                <div id="studentQaContainer" aria-live="polite">
                    <!-- يُملأ بواسطة loadStudentQuestions -->
                </div>
            </div>
        </section>
    `;

    // إعداد صندوق "اسأل عن المادة دي" المضمن
    setupStudentAskBox({
        triggerBtn: container.querySelector('#askSubjectBtn'),
        panel: container.querySelector('#studentAskPanel'),
        subjectName: course.formSubject || course.title,
        lectureTitle: null
    });

    // تحميل وعرض أسئلة الزمايل
    const qaContainer = container.querySelector('#studentQaContainer');
    if (qaContainer) {
        loadStudentQuestions(course, qaContainer);
    }
}

// ==========================================
// 🔗 روابط وثوابت اسأل زميلك (Fallback في حال كان الكاش قديماً)
// ==========================================
const DEFAULT_STUDENT_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQKMg53WPGwBcquZmGAetNmjIwRPiPpS8120PrvIWX0_T5Lo180oQ4BcCW0OgSCtRoVGvjjas3t1Pys/pub?gid=1193762460&single=true&output=csv";
const DEFAULT_STUDENT_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdIIXiks6SOB4vPidFpHoicKakBhfUWtUwJZGQXOGX1ymeGTw/viewform";
const DEFAULT_STUDENT_ENTRY_SUBJECT = "entry.1349988251";
const DEFAULT_STUDENT_ENTRY_QUESTION = "entry.1862128244";

/**
 * دالة جلب وعرض أسئلة الزمايل من CSV أو الوضع التجريبي
 * @param {object} course
 * @param {HTMLElement} container
 */
async function loadStudentQuestions(course, container) {
    const rawCsv = (typeof STUDENT_CSV_URL !== "undefined" && STUDENT_CSV_URL) ? STUDENT_CSV_URL : (window.STUDENT_CSV_URL || "");
    const csvUrl = (rawCsv || DEFAULT_STUDENT_CSV_URL).trim();

    // 1. إذا كان الرابط فارغاً
    if (!csvUrl) {
        console.warn("⚠️ رابط STUDENT_CSV_URL غير محدد في config.js أو فارغ.");
        container.innerHTML = `
            <div class="student-qa-msg student-qa-empty" style="text-align: center; padding: var(--space-2xl) var(--space-md); background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-subtle);">
                <span style="font-size: 2.2rem; display: block; margin-bottom: 8px;">⚙️</span>
                <p style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin-bottom: 6px;">رابط الأسئلة غير محدد في ملف الإعدادات</p>
                <p style="font-size: 0.92rem; color: var(--text-secondary);">يُرجى التحقق من STUDENT_CSV_URL في js/config.js.</p>
            </div>
        `;
        return;
    }

    // إظهار حالة التحميل
    container.innerHTML = `
        <div class="text-center" style="padding: var(--space-2xl) 0; color: var(--text-secondary);">
            <div class="student-loading-spinner"></div>
            <p style="margin-top: var(--space-md); font-weight: 600;">جاري تحميل أسئلة الزملاء...</p>
        </div>
    `;

    try {
        const fetchUrl = csvUrl + (csvUrl.includes('?') ? '&' : '?') + '_t=' + Date.now();
        const response = await fetch(fetchUrl, { cache: 'no-cache' });

        // طباعة حالة الرد والرابط في الكونسول (مطلوب 2)
        console.log("🔗 الرابط المستخدم:", fetchUrl);
        console.log("📡 حالة الرد (status):", response.status);

        if (!response.ok) {
            throw new Error(`خطأ في استجابة الخادم: ${response.status}`);
        }

        const csvText = await response.text();
        const rawRows = parseCSV(csvText);

        console.log("📊 إجمالي عدد الصفوف المقروءة من الملف:", rawRows.length);

        if (!rawRows || rawRows.length < 2) {
            console.warn("⚠️ لا توجد صفوف كافية في ملف CSV.");
            container.innerHTML = `
                <div class="student-qa-msg student-qa-empty" style="text-align: center; padding: var(--space-2xl) var(--space-md); background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-subtle);">
                    <span style="font-size: 2.2rem; display: block; margin-bottom: 8px;">📭</span>
                    <p style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin-bottom: 6px;">لا توجد أسئلة منشورة حالياً في الشيت</p>
                </div>
            `;
            return;
        }

        // 1. تجاهل صف العناوين (الصف الأول)
        const dataRows = rawRows.slice(1);

        // 2. طباعة أول صف بعد الـ parse كما هو في الـ console
        console.log("📄 أول صف بعد الـ parse:", dataRows[0]);

        const targetSubject = (course.formSubject || course.title).trim();
        const normTarget = normalize(targetSubject, true);
        const normCourseTitle = normalize(course.title, true);

        const matchingRows = [];
        dataRows.forEach((row, index) => {
            // 1. قراءة الأعمدة بالترتيب: العمود الأول (0) = المادة، التاني (1) = السؤال، التالت (2) = الإجابة
            const rawSubject = (row[0] !== undefined && row[0] !== null) ? String(row[0]).trim() : "";
            const question = (row[1] !== undefined && row[1] !== null) ? String(row[1]).trim() : "";
            const answer = (row[2] !== undefined && row[2] !== null) ? String(row[2]).trim() : "";

            // 3. تجاهل أي صف عمود السؤال فيه فاضي، أو عمود الإجابة فاضي
            if (!question || !answer) {
                return;
            }

            const normSubj = normalize(rawSubject, true);

            // مطابقة اسم المادة بعد تنظيف الحروف المخفية والأرقام اللاحقة
            const isMatch = Boolean(
                normSubj && (
                    normSubj === normTarget ||
                    normSubj === normCourseTitle ||
                    (normTarget && (normSubj.includes(normTarget) || normTarget.includes(normSubj)))
                )
            );

            // 3. طباعة قيمة المادة مع charCodes وقيمة formSubject وهل اتطابقوا لكل صف
            const rawSubjectCharCodes = Array.from(rawSubject || "").map(c => c.charCodeAt(0));
            const formSubjectCharCodes = Array.from(targetSubject || "").map(c => c.charCodeAt(0));
            const subjectDetails = Array.from(rawSubject || "")
                .map(c => `${c} (U+${c.charCodeAt(0).toString(16).toUpperCase().padStart(4, "0")})`)
                .join(", ");

            console.log(
                `🔎 [صف ${index + 1}] المادة بالشيت: "${rawSubject}" (charCodes: [${rawSubjectCharCodes.join(",")}]) | formSubject: "${targetSubject}" (charCodes: [${formSubjectCharCodes.join(",")}]) | تطابق: ${isMatch ? "✅ تطابق" : "❌ لا يوجد تطابق"}`
            );
            console.log(`🔎 [فحص المادة - تفاصيل صف ${index + 1}]:`, {
                "قيمة المادة كما وصلت": rawSubject,
                "charCodes المادة": rawSubjectCharCodes,
                "تفاصيل الحروف (Hex)": subjectDetails || "(فارغ)",
                "قيمة formSubject": targetSubject,
                "charCodes formSubject": formSubjectCharCodes,
                "المادة بعد normalize": normSubj,
                "formSubject بعد normalize": normTarget,
                "هل اتطابقوا؟": isMatch,
                "يوجد سؤال؟": Boolean(question)
            });

            if (isMatch) {
                matchingRows.push({
                    subject: rawSubject || course.title,
                    question: question,
                    answer: answer
                });
            }
        });

        // طباعة عدد الصفوف بعد الفلتر
        console.log("✅ عدد الصفوف بعد الفلتر:", matchingRows.length, matchingRows);

        // إذا لم توجد صفوف للمادة بعد الفلتر
        if (matchingRows.length === 0) {
            container.innerHTML = `
                <div class="student-qa-msg student-qa-empty" style="text-align: center; padding: var(--space-2xl) var(--space-md); background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-subtle);">
                    <span style="font-size: 2.2rem; display: block; margin-bottom: 8px;">📭</span>
                    <p style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0;">لسه مفيش أسئلة اتجاوب عليها في مادة ${course.title}</p>
                </div>
            `;
            return;
        }

        // عرض الكروت (الأحدث يظهر أولاً)
        container.innerHTML = "";
        const list = document.createElement("div");
        list.className = "ask-list";

        matchingRows.reverse().forEach((item, index) => {
            const card = createStudentQuestionCard(item, index, false);
            list.appendChild(card);
        });

        container.appendChild(list);

    } catch (error) {
        console.error("فشل تحميل أسئلة الزملاء من CSV:", error);
        // رسالة عند فشل التحميل لتمييزها عن عدم وجود أسئلة (مطلوب 6)
        container.innerHTML = `
            <div class="student-qa-msg student-qa-error" style="text-align: center; padding: var(--space-xl); background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-light);">
                <span style="font-size: 2rem; display: block; margin-bottom: 8px;">⚠️</span>
                <p style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">تعذر تحميل الأسئلة، جرب بعد شوية</p>
                <p style="color: var(--text-secondary); font-size: 0.9rem;">${error.message || 'يُرجى التحقق من الاتصال بالإنترنت أو مراجعة الكونسول'}</p>
            </div>
        `;
    }
}


/**
 * بناء كارت السؤال وإجابة الزميل بتصميم متناسق مع ask.html
 * @param {object} item
 * @param {number} index
 * @param {boolean} isDemo
 * @returns {HTMLElement}
 */
function createStudentQuestionCard(item, index, isDemo) {
    const card = document.createElement("article");
    card.className = "ask-card animate-fade-in-up";
    card.style.animationDelay = `${Math.min(index * 0.05, 0.4)}s`;

    // رأس الكارت (مفتاح الأكورديون)
    const header = document.createElement("div");
    header.className = "ask-card-header";
    header.setAttribute("role", "button");
    header.setAttribute("tabindex", "0");
    header.setAttribute("aria-expanded", "false");
    header.setAttribute("aria-label", "عرض أو إخفاء الإجابة");

    // الصف العلوي
    const topRow = document.createElement("div");
    topRow.className = "ask-card-top";

    const badgesContainer = document.createElement("div");
    badgesContainer.style.display = "flex";
    badgesContainer.style.alignItems = "center";
    badgesContainer.style.gap = "8px";

    const badge = document.createElement("span");
    badge.className = "ask-badge";
    badge.textContent = item.subject || "اسأل زميلك";
    badgesContainer.appendChild(badge);

    // وسم "تجريبي" إذا كانت الأسئلة تجريبية
    if (isDemo) {
        const demoBadge = document.createElement("span");
        demoBadge.className = "ask-badge student-demo-badge";
        demoBadge.textContent = "تجريبي";
        badgesContainer.appendChild(demoBadge);
    }

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

    topRow.appendChild(badgesContainer);
    topRow.appendChild(headerEnd);

    // نص السؤال
    const questionTitle = document.createElement("div");
    questionTitle.className = "ask-question-title";

    const qIcon = document.createElement("span");
    qIcon.className = "ask-question-icon";
    qIcon.textContent = "❓";

    const qText = document.createElement("div");
    qText.className = "ask-question-text";
    qText.textContent = item.question;

    questionTitle.appendChild(qIcon);
    questionTitle.appendChild(qText);

    header.appendChild(topRow);
    header.appendChild(questionTitle);

    // جسم الكارت (الأكورديون)
    const body = document.createElement("div");
    body.className = "ask-card-body";

    const bodyInner = document.createElement("div");
    bodyInner.className = "ask-card-body-inner";

    const answerWrapper = document.createElement("div");
    answerWrapper.className = "ask-answer-wrapper";

    const answerHeader = document.createElement("div");
    answerHeader.className = "ask-answer-header";

    const peerBadge = document.createElement("div");
    peerBadge.className = "ask-answer-badge";
    peerBadge.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
        <span>إجابة الزملاء</span>
    `;

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
        e.stopPropagation();
        const textToCopy = `المادة: ${item.subject || ''}\nالسؤال: ${item.question}\n\nالإجابة:\n${item.answer}`;
        navigator.clipboard.writeText(textToCopy).then(() => {
            copyBtn.classList.add("copied");
            copyBtn.querySelector("span").textContent = "تم النسخ!";
            setTimeout(() => {
                copyBtn.classList.remove("copied");
                copyBtn.querySelector("span").textContent = "نسخ";
            }, 2000);
        }).catch(() => {});
    });

    answerHeader.appendChild(peerBadge);
    answerHeader.appendChild(copyBtn);

    const answerText = document.createElement("div");
    answerText.className = "ask-answer-text";
    answerText.textContent = item.answer || "لم تتم إضافة إجابة بعد.";

    answerWrapper.appendChild(answerHeader);
    answerWrapper.appendChild(answerText);
    bodyInner.appendChild(answerWrapper);
    body.appendChild(bodyInner);

    card.appendChild(header);
    card.appendChild(body);

    // تفعيل فتح وإغلاق الأكورديون
    const toggleCard = () => {
        const isOpen = card.classList.contains("open");
        card.classList.toggle("open", !isOpen);
        header.setAttribute("aria-expanded", String(!isOpen));
    };

    header.addEventListener("click", toggleCard);
    header.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleCard();
        }
    });

    return card;
}

/**
 * إعداد صندوق "اسأل زميلك" التفاعلي المضمن داخل الصفحة
 * @param {object} options
 * @param {HTMLElement} options.triggerBtn - الزر الرئيسي لفتح/إغلاق الصندوق
 * @param {HTMLElement} options.panel - حاوية الصندوق المضمن
 * @param {string} options.subjectName - اسم المادة (formSubject أو title)
 * @param {string|null} options.lectureTitle - عنوان المحاضرة إن وُجد (لإضافته كبادئة في نص السؤال)
 */
function setupStudentAskBox({ triggerBtn, panel, subjectName, lectureTitle = null }) {
    if (!triggerBtn || !panel) return;

    const rawForm = (typeof STUDENT_FORM_URL !== "undefined" && STUDENT_FORM_URL) ? STUDENT_FORM_URL : (window.STUDENT_FORM_URL || "");
    const studentFormUrl = (rawForm || DEFAULT_STUDENT_FORM_URL).trim();

    panel.innerHTML = `
        <div class="student-ask-panel-meta">
            <span class="student-ask-subject-tag">📂 المادة: ${escapeHtml(subjectName)}</span>
        </div>

        <!-- حقل الحماية من السبام (Honeypot) مخفي تماماً عن الطلاب -->
        <input type="text" name="student_hp" class="student-hp-input" style="position: absolute; opacity: 0; pointer-events: none; height: 0; width: 0; margin: 0; padding: 0;" tabindex="-1" autocomplete="off" aria-hidden="true">

        <div class="student-textarea-wrapper">
            <textarea class="student-ask-textarea" placeholder="اكتب سؤالك هنا" rows="4" maxlength="1000" aria-label="اكتب سؤالك هنا"></textarea>
        </div>

        <div class="student-counter-row">
            <div class="student-field-error" style="display: none;" role="alert">اكتب سؤالك الأول</div>
            <span class="student-char-count">0 / 1000</span>
        </div>

        <div class="student-ask-actions">
            <button type="button" class="btn btn-cta btn-sm student-submit-btn">إرسال</button>
            <button type="button" class="btn btn-ghost btn-sm student-cancel-btn">إلغاء</button>
        </div>

        <div class="student-alert-box" style="display: none;" role="status"></div>
    `;

    const textarea = panel.querySelector('.student-ask-textarea');
    const hpInput = panel.querySelector('.student-hp-input');
    const charCount = panel.querySelector('.student-char-count');
    const errorEl = panel.querySelector('.student-field-error');
    const submitBtn = panel.querySelector('.student-submit-btn');
    const cancelBtn = panel.querySelector('.student-cancel-btn');
    const alertBox = panel.querySelector('.student-alert-box');

    let isSubmitting = false;
    let autoCloseTimer = null;
    let cooldownTimer = null;

    // إلغاء مؤقت الإغلاق التلقائي
    function clearAutoClose() {
        if (autoCloseTimer) {
            clearTimeout(autoCloseTimer);
            autoCloseTimer = null;
        }
    }

    // بدء مؤقت الإغلاق التلقائي (5 ثواني) بشرط عدم وجود كتابة وعدم الإرسال (شرط 4 و 5)
    function scheduleAutoClose(seconds = 5) {
        clearAutoClose();
        autoCloseTimer = setTimeout(() => {
            if (isSubmitting) return;
            if (textarea.value.trim().length > 0) return;
            closePanel();
        }, seconds * 1000);
    }

    // فتح الصندوق دائماً فارغاً ومنظفاً (شرط 6)
    function openPanel() {
        panel.style.display = 'block';
        textarea.value = '';
        textarea.classList.remove('has-error');
        errorEl.textContent = '';
        errorEl.style.display = 'none';
        charCount.textContent = '0 / 1000';
        alertBox.textContent = '';
        alertBox.className = 'student-alert-box';
        alertBox.style.display = 'none';
        clearAutoClose();
        checkCooldownState();
        setTimeout(() => textarea.focus(), 50);
    }

    // إغلاق الصندوق
    function closePanel() {
        if (isSubmitting) return; // الصندوق ميتقفلش وهو بيبعت (شرط 5)
        panel.style.display = 'none';
        clearAutoClose();
    }

    // فحص وتحديث حالة العد التنازلي للـ 30 ثانية
    function checkCooldownState() {
        const cooldownUntil = parseInt(sessionStorage.getItem('bis_student_cooldown') || '0', 10);
        const remaining = Math.ceil((cooldownUntil - Date.now()) / 1000);
        if (remaining > 0) {
            startCooldown(remaining);
        } else {
            submitBtn.disabled = false;
            submitBtn.textContent = 'إرسال';
        }
    }

    function startCooldown(seconds) {
        if (cooldownTimer) clearInterval(cooldownTimer);
        const cooldownEndTime = Date.now() + seconds * 1000;
        sessionStorage.setItem('bis_student_cooldown', String(cooldownEndTime));

        submitBtn.disabled = true;
        submitBtn.textContent = `انتظر ${seconds} ث...`;

        cooldownTimer = setInterval(() => {
            const left = Math.ceil((cooldownEndTime - Date.now()) / 1000);
            if (left <= 0) {
                clearInterval(cooldownTimer);
                cooldownTimer = null;
                sessionStorage.removeItem('bis_student_cooldown');
                submitBtn.disabled = false;
                submitBtn.textContent = 'إرسال';
            } else {
                submitBtn.textContent = `انتظر ${left} ث...`;
            }
        }, 1000);
    }

    // أحداث خانة النص
    textarea.addEventListener('input', () => {
        clearAutoClose(); // الصندوق ميتقفلش وفيه كتابة (شرط 5)
        const len = textarea.value.length;
        charCount.textContent = `${len} / 1000`;
        if (len >= 5) {
            textarea.classList.remove('has-error');
            errorEl.style.display = 'none';
        }
    });

    // زر الإلغاء
    cancelBtn.addEventListener('click', () => {
        closePanel();
    });

    // النقر على زر الفتح الرئيسي
    triggerBtn.addEventListener('click', () => {
        if (panel.style.display === 'none' || !panel.style.display) {
            openPanel();
        } else {
            closePanel();
        }
    });

    // النقر على زر الإرسال
    submitBtn.addEventListener('click', async () => {
        if (isSubmitting) return;

        // فحص الـ Honeypot (شرط 3: حقل مخفي لو اتملى متبعتش حاجة)
        if (hpInput && hpInput.value.trim() !== '') {
            return;
        }

        // فحص طول النص (شرط 1: إذا فاضية أو أقل من 5 حروف اعرض خطأ "اكتب سؤالك الأول")
        const questionText = textarea.value.trim();
        if (!questionText || questionText.length < 5) {
            textarea.classList.add('has-error');
            errorEl.textContent = 'اكتب سؤالك الأول';
            errorEl.style.display = 'block';
            textarea.focus();
            return;
        }

        if (questionText.length > 1000) {
            textarea.classList.add('has-error');
            errorEl.textContent = 'الحد الأقصى هو 1000 حرف';
            errorEl.style.display = 'block';
            textarea.focus();
            return;
        }

        textarea.classList.remove('has-error');
        errorEl.style.display = 'none';

        // إضافة بادئة للسؤال: [عنوان المحاضرة] في صفحة المحاضرة، و [سؤال عام] للزرار الأخضر في صفحة المادة
        const finalQuestion = lectureTitle ? `[${lectureTitle}] ${questionText}` : `[سؤال عام] ${questionText}`;

        const rawForm = (typeof STUDENT_FORM_URL !== "undefined" && STUDENT_FORM_URL) ? STUDENT_FORM_URL : (window.STUDENT_FORM_URL || "");
        const currentFormUrl = (rawForm || DEFAULT_STUDENT_FORM_URL).trim();

        // 1. الوضع التجريبي: إذا كان STUDENT_FORM_URL فارغاً (شرط 4-أ)
        if (!currentFormUrl) {
            textarea.value = '';
            charCount.textContent = '0 / 1000';

            alertBox.textContent = 'تم إرسال سؤالك (تجريبي)';
            alertBox.className = 'student-alert-box success';
            alertBox.style.display = 'block';

            // سؤال واحد كل 30 ثانية
            startCooldown(30);

            // إغلاق الصندوق بعد 5 ثواني تلقائياً
            scheduleAutoClose(5);
            return;
        }

        // 2. الوضع الفعلي: إرسال POST fetch مع mode no-cors (شرط 4-ب)
        const postUrl = currentFormUrl.includes('/formResponse')
            ? currentFormUrl
            : currentFormUrl.replace('/viewform', '/formResponse');

        const rawEntrySubj = (typeof STUDENT_FORM_ENTRY_SUBJECT !== "undefined" && STUDENT_FORM_ENTRY_SUBJECT) ? STUDENT_FORM_ENTRY_SUBJECT : (window.STUDENT_FORM_ENTRY_SUBJECT || "");
        const entrySubject = (rawEntrySubj || DEFAULT_STUDENT_ENTRY_SUBJECT).trim();
        const rawEntryQ = (typeof STUDENT_FORM_ENTRY_QUESTION !== "undefined" && STUDENT_FORM_ENTRY_QUESTION) ? STUDENT_FORM_ENTRY_QUESTION : (window.STUDENT_FORM_ENTRY_QUESTION || "");
        const entryQuestion = (rawEntryQ || DEFAULT_STUDENT_ENTRY_QUESTION).trim();

        const bodyParams = new URLSearchParams();
        if (entrySubject) {
            const key = entrySubject.startsWith('entry.') ? entrySubject : `entry.${entrySubject}`;
            bodyParams.append(key, subjectName);
        }
        if (entryQuestion) {
            const key = entryQuestion.startsWith('entry.') ? entryQuestion : `entry.${entryQuestion}`;
            bodyParams.append(key, finalQuestion);
        }

        isSubmitting = true;
        submitBtn.disabled = true;
        submitBtn.textContent = 'جاري الإرسال...';
        alertBox.style.display = 'none';

        try {
            await fetch(postUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: bodyParams
            });

            isSubmitting = false;
            textarea.value = '';
            charCount.textContent = '0 / 1000';

            // "وصل سؤالك. هيظهر هنا لما حد يجاوب عليه." (شرط 4-ج)
            alertBox.textContent = 'وصل سؤالك. هيظهر هنا لما حد يجاوب عليه.';
            alertBox.className = 'student-alert-box success';
            alertBox.style.display = 'block';

            startCooldown(30);
            scheduleAutoClose(5);

        } catch (error) {
            console.error('فشل إرسال السؤال:', error);
            isSubmitting = false;
            submitBtn.disabled = false;
            submitBtn.textContent = 'إرسال';

            alertBox.textContent = 'حدث خطأ أثناء الإرسال. تأكد من اتصالك بالإنترنت.';
            alertBox.className = 'student-alert-box error';
            alertBox.style.display = 'block';
        }
    });
}

/**
 * دالة تنظيف وتأمين النصوص المعروضة
 */
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/**
 * دالة تحليل نصوص CSV مع مراعاة الفواصل والأسطر الجديدة والاقتباسات (معيار RFC 4180)
 * @param {string} text
 * @returns {Array<Object>}
 */
function parseCSV(text) {
    if (!text || typeof text !== "string") return [];
    if (text.charCodeAt(0) === 0xFEFF) {
        text = text.slice(1);
    }
    const rows = [];
    let currentRow = [""];
    let insideQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];

        if (insideQuotes) {
            if (char === '"') {
                if (nextChar === '"') {
                    currentRow[currentRow.length - 1] += '"';
                    i++;
                } else {
                    insideQuotes = false;
                }
            } else {
                currentRow[currentRow.length - 1] += char;
            }
        } else {
            if (char === '"') {
                insideQuotes = true;
            } else if (char === ',') {
                currentRow.push("");
            } else if (char === '\r') {
                if (nextChar === '\n') i++;
                rows.push(currentRow);
                currentRow = [""];
            } else if (char === '\n') {
                rows.push(currentRow);
                currentRow = [""];
            } else {
                currentRow[currentRow.length - 1] += char;
            }
        }
    }

    if (currentRow.length > 1 || currentRow[0] !== "") {
        rows.push(currentRow);
    }

    return rows;
}

/**
 * البحث عن قيمة عمود معين في كائن الصف
 */
function findCSVColumn(row, colName) {
    if (!row) return "";
    let key = Object.keys(row).find(k => k && k.trim() === colName);
    if (key && row[key] !== undefined && row[key] !== null) return String(row[key]).trim();

    const norm = normalize(colName, false);
    key = Object.keys(row).find(k => k && normalize(k, false) === norm);
    if (key && row[key] !== undefined && row[key] !== null) return String(row[key]).trim();

    // فحص إضافي للمرادفات الشائعة
    if (norm.includes("اجاب") || norm.includes("رد")) {
        key = Object.keys(row).find(k => k && (normalize(k, false).includes("اجاب") || normalize(k, false).includes("رد")));
        if (key && row[key] !== undefined && row[key] !== null) return String(row[key]).trim();
    }
    if (norm.includes("سؤال")) {
        key = Object.keys(row).find(k => k && normalize(k, false).includes("سؤال"));
        if (key && row[key] !== undefined && row[key] !== null) return String(row[key]).trim();
    }
    if (norm.includes("ماد")) {
        key = Object.keys(row).find(k => k && normalize(k, false).includes("ماد"));
        if (key && row[key] !== undefined && row[key] !== null) return String(row[key]).trim();
    }

    return "";
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
 * دالة متوافقة مع الاستدعاءات السابقة لـ normalizeArabicText
 */
function normalizeArabicText(str, stripTrailing = false) {
    return normalize(str, stripTrailing);
}

