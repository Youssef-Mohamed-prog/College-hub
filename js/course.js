// ==========================================
// 📋 Course Details Page — تفاصيل المادة
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    renderCoursePage();
});

// ============================================================
// ⚠️ احذف هذه الكتلة بالكامل قبل النشر الفعلي ⚠️
// DEMO_STUDENT_QA — بيانات تجريبية لأسئلة الزملاء لكل مادة
// تُعرض فقط عندما يكون STUDENT_CSV_URL فارغاً
// ============================================================
const DEMO_STUDENT_QA = {
    "قواعد البيانات": [
        {
            question: "ازاي أعمل Foreign Key في SQL بدون ما يحصل خطأ في العلاقات؟",
            answer: "لازم الجدول المرجعي (الأساسي) يكون العمود فيه Primary Key أو Unique، ونوع البيانات والطول يكونوا متطابقين تماماً في الجدولين."
        },
        {
            question: "إيه الفرق العملي بين Left Join و Inner Join؟",
            answer: "الـ Inner Join بيرجع السجلات المشتركة فقط بين الجدولين، بينما Left Join بيرجع كل سجلات الجدول الأيسر حتى لو مفيش مقابل ليها في الجدول التاني (بتظهر بـ NULL)."
        },
        {
            question: "هل لازم كل جدول في قاعدة البيانات يكون فيه Primary Key؟",
            answer: "نظرياً وتطبيقياً في التصميم السليم نعم، لتحديد كل صف بشكل فريد وضمان سرعة الفهرسة وصحة العلاقات وعدم تكرار البيانات."
        }
    ],
    "إحصاء وحزم بحوث العمليات": [
        {
            question: "إمتى نستخدم نموذج النقل Transportation Model ونموذج التعيين Assignment Model؟",
            answer: "نموذج النقل يُستخدم لتوزيع كميات من عدة مصادر لعدة مراكز طلب بأقل تكلفة، بينما نموذج التعيين حالة خاصة يكون التخصيص فيها بنسبة 1 إلى 1 (مهمة واحدة لعامل واحد)."
        },
        {
            question: "إيه الشرط الأساسي لتطبيق طريقة السمبلكس (Simplex)؟",
            answer: "أن تكون جميع الدوال الخطية والمتغيرات غير سالبة، وتحويل المتباينات إلى معادلات متساوية بإضافة متغيرات راكدة (Slack) أو اصطناعية (Artificial)."
        },
        {
            question: "ما الفرق بين دالة الهدف في التعظيم (Maximize) والتدنية (Minimize)؟",
            answer: "التعظيم يُستخدم للأرباح والإنتاجية، والتدنية تُستخدم للتكاليف والوقت والمسافات، وتختلف طريقة اختيار المتغير الداخل في جدول السمبلكس بناءً على ذلك."
        }
    ],
    "دراسات إدارة بالإنجليزية": [
        {
            question: "What is the primary role of SWOT analysis in strategic management?",
            answer: "SWOT analysis evaluates internal Strengths and Weaknesses along with external Opportunities and Threats to formulate effective strategic decisions."
        },
        {
            question: "What distinguishes autocratic leadership from democratic leadership?",
            answer: "Autocratic leaders make decisions unilaterally without consulting the team, whereas democratic leaders encourage team participation and consensus in decision-making."
        },
        {
            question: "Why is organizational culture considered a competitive advantage?",
            answer: "A strong culture fosters employee engagement, reduces turnover, and aligns organizational values with core business goals, making it difficult for competitors to replicate."
        }
    ],
    "اقتصاد كلي": [
        {
            question: "ما هو الفرق بين الناتج المحلي الإجمالي الاسمي (Nominal GDP) والحقيقي (Real GDP)؟",
            answer: "الاسمي يحسب قيمة السلع والخدمات بأسعار السوق الجارية (متأثراً بالتضخم)، بينما الحقيقي يحسبها بأسعار سنة أساس ثابتة ليعكس حجم الإنتاج الفعلي فقط."
        },
        {
            question: "كيف تؤثر السياسة المالية التوسعية على الاقتصاد القومي؟",
            answer: "تتم بزيادة الإنفاق الحكومي أو خفض الضرائب لزيادة الطلب الكلي وتحفيز النمو وتقليل البطالة في فترات الركود الاقتصادي."
        },
        {
            question: "ما هي فجوة التضخم (Inflationary Gap) ومتى تحدث؟",
            answer: "تحدث عندما يتجاوز الطلب الكلي مستوى الإنتاج عند التوظيف الكامل، مما يؤدي لارتفاع المستوى العام للأسعار دون زيادة في الناتج الحقيقي."
        }
    ],
    "محاسبة ضرائب": [
        {
            question: "ما هو الفرق بين التهرب الضريبي والتجنب الضريبي في القانون؟",
            answer: "التهرب الضريبي جريمة غير قانونية لإخفاء الدخل أو تزوير المستندات، بينما التجنب الضريبي هو استغلال الثغرات والحوافز القانونية لتقليل العبء الضريبي بشكل مشروع."
        },
        {
            question: "كيف يتم حساب وعاء الضريبة على أرباح الأشخاص الاعتبارية (الشركات)؟",
            answer: "يبدأ من صافي الربح المحاسبي في قائمة الدخل ثم تُجرى التعديلات الضريبية (إضافة التكاليف غير واجبة الخصم واستبعاد الإيرادات المعفاة) للوصول للربح الضريبي الخاضع للضريبة."
        },
        {
            question: "ما هي شروط خصم ضريبة القيمة المضافة المدفوعة على المدخلات؟",
            answer: "أن تكون السلع والخدمات مرتبطة بالنشاط الخاضع للضريبة، ومؤيدة بفواتير ضريبية إلكترونية قانونية، ومسجلة في دفاتر المنشأة."
        }
    ],
    "محاسبة تكاليف": [
        {
            question: "ما هو الفرق بين التكاليف المباشرة والتكاليف غير المباشرة؟",
            answer: "التكاليف المباشرة يمكن تتبعها وتخصيصها بسهولة وبدقة لوحدة المنتج (مثل المواد الخام وأجور عمال الإنتاج)، بينما غير المباشرة يصعب تتبعها مباشرة وتحتاج لأسس توزيع (مثل إيجار المصنع والكهرباء)."
        },
        {
            question: "كيف يساعد هامش المساهمة (Contribution Margin) في اتخاذ القرارات؟",
            answer: "هامش المساهمة = سعر البيع - التكلفة المتغيرة. يوضح مدى مساهمة كل وحدة في تغطية التكاليف الثابتة وتحقيق الأرباح، ويُستخدم في قرارات التسعير وقبول الطلبيات الخاصة."
        },
        {
            question: "ما هو نظام تكاليف الأوامر الإنتاجية (Job Order Costing) ومجالات استخدامه؟",
            answer: "يُستخدم في الصناعات التي تنتج وفقاً لطلبات ومواصفات خاصة ومحددة لكل عميل وتختلف من أمر لآخر (مثل المطابع وورش النجارة والمقاولات)."
        }
    ]
};
// ============================================================

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
                        
                        <div class="course-instructor-card">
                            ${getInstructorImageHTML(course, 52)}
                            <div class="instructor-info">
                                <span class="instructor-label">المدرس</span>
                                <span class="instructor-name">${course.creator}</span>
                            </div>
                        </div>

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

                        <!-- زر اسأل عن المادة دي تحت صف المحاضرات والمادة وقبل قائمة المحاضرات -->
                        <div class="course-ask-action" style="margin-top: var(--space-lg);">
                            <button type="button" class="btn btn-cta" id="askSubjectBtn" style="display: inline-flex; align-items: center; gap: 8px;">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                </svg>
                                <span>اسأل عن المادة دي</span>
                            </button>
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
                            <span class="lecture-arrow">←</span>
                        </a>
                    `).join('')}
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

    // إعداد زر "اسأل عن المادة دي"
    const askSubjectBtn = container.querySelector('#askSubjectBtn');
    if (askSubjectBtn) {
        askSubjectBtn.addEventListener('click', () => {
            handleStudentAskClick(course.formSubject || course.title);
        });
    }

    // تحميل وعرض أسئلة الزمايل
    const qaContainer = container.querySelector('#studentQaContainer');
    if (qaContainer) {
        loadStudentQuestions(course, qaContainer);
    }
}

/**
 * دالة جلب وعرض أسئلة الزمايل من CSV أو الوضع التجريبي
 * @param {object} course
 * @param {HTMLElement} container
 */
async function loadStudentQuestions(course, container) {
    const csvUrl = (typeof STUDENT_CSV_URL !== "undefined" ? STUDENT_CSV_URL : (window.STUDENT_CSV_URL || "")).trim();

    // إذا كان الرابط فارغاً، نعرض 3 أسئلة تجريبية للمادة الحالية مع علامة "تجريبي"
    if (!csvUrl) {
        renderDemoQuestions(course, container);
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
        const response = await fetch(csvUrl);
        if (!response.ok) {
            throw new Error(`خطأ في استجابة الخادم: ${response.status}`);
        }

        const csvText = await response.text();
        const records = parseCSV(csvText);

        const targetSubject = (course.formSubject || course.title).trim();
        const normTarget = normalizeArabicText(targetSubject);

        const matchingRows = [];
        records.forEach((row) => {
            const subject = findCSVColumn(row, "المادة");
            const question = findCSVColumn(row, "السؤال");
            const answer = findCSVColumn(row, "الإجابة");

            if (question) {
                const normSubj = normalizeArabicText(subject);
                if (normSubj === normTarget || normSubj === normalizeArabicText(course.title)) {
                    matchingRows.push({
                        subject: subject || course.title,
                        question: question,
                        answer: answer
                    });
                }
            }
        });

        // إذا لم توجد صفوف للمادة
        if (matchingRows.length === 0) {
            container.innerHTML = `
                <div class="student-qa-msg student-qa-empty" style="text-align: center; padding: var(--space-2xl) var(--space-md); background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-subtle);">
                    <span style="font-size: 2.2rem; display: block; margin-bottom: 8px;">📭</span>
                    <p style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin-bottom: 6px;">لسه مفيش أسئلة اتجاوب عليها</p>
                    <p style="font-size: 0.92rem; color: var(--text-secondary);">كن أول من يسأل زملائه عن هذه المادة!</p>
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
        container.innerHTML = `
            <div class="student-qa-msg student-qa-error" style="text-align: center; padding: var(--space-xl); background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-light);">
                <span style="font-size: 2rem; display: block; margin-bottom: 8px;">⚠️</span>
                <p style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">تعذر تحميل أسئلة الزملاء في الوقت الحالي</p>
                <p style="color: var(--text-secondary); font-size: 0.9rem;">يُرجى التحقق من الاتصال بالإنترنت أو المحاولة لاحقاً.</p>
            </div>
        `;
    }
}

/**
 * عرض الأسئلة التجريبية للمادة الحالية مع علامة "تجريبي"
 */
function renderDemoQuestions(course, container) {
    container.innerHTML = "";

    const key = course.formSubject || course.title;
    const questions = DEMO_STUDENT_QA[key] || [
        {
            question: "كيف أستعد لمذاكرة هذه المادة والامتحانات؟",
            answer: "ابدأ بمتابعة المحاضرات والملخصات المرفقة أولاً بأول، وركز على حل الأسئلة العملية ونماذج الامتحانات السابقة."
        },
        {
            question: "أين أجد ملخصات وتمارين إضافية للمادة؟",
            answer: "الملخصات متوفرة للتحميل في صفحة كل محاضرة، ويمكنك أيضاً مراجعة بنك الأسئلة والمراجع المقترحة."
        },
        {
            question: "هل المادة تعتمد على الفهم أكثر أم الحفظ؟",
            answer: "تعتمد على الفهم العميق للمفاهيم والتطبيق العملي، مع حفظ المصطلحات الأساسية والقواعد العامة."
        }
    ];

    const list = document.createElement("div");
    list.className = "ask-list";

    questions.forEach((item, index) => {
        const cardItem = {
            subject: course.title,
            question: item.question,
            answer: item.answer
        };
        const card = createStudentQuestionCard(cardItem, index, true); // علامة تجريبي
        list.appendChild(card);
    });

    container.appendChild(list);
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
 * دالة فتح فورم "اسأل زميلك" أو إظهار رسالة النسخة التجريبية
 */
function handleStudentAskClick(formSubject) {
    const studentFormUrl = (typeof STUDENT_FORM_URL !== "undefined" ? STUDENT_FORM_URL : (window.STUDENT_FORM_URL || "")).trim();
    if (!studentFormUrl) {
        showStudentToast("الفورم لسه مش متوصل (نسخة تجريبية)");
        return;
    }
    const entryKey = (typeof STUDENT_FORM_ENTRY !== "undefined" ? STUDENT_FORM_ENTRY : (window.STUDENT_FORM_ENTRY || "")).trim();
    let targetUrl = studentFormUrl;
    if (entryKey && formSubject) {
        const paramKey = entryKey.startsWith("entry.") ? entryKey : `entry.${entryKey}`;
        const sep = targetUrl.includes("?") ? "&" : "?";
        targetUrl = `${targetUrl}${sep}usp=pp_url&${paramKey}=${encodeURIComponent(formSubject)}`;
    }
    window.open(targetUrl, "_blank", "noopener,noreferrer");
}

/**
 * إظهار رسالة صغيرة (Toast)
 */
function showStudentToast(message) {
    let toast = document.getElementById('studentToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'studentToast';
        toast.className = 'student-toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    if (toast._hideTimeout) clearTimeout(toast._hideTimeout);
    toast._hideTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
}

/**
 * دالة تحليل نصوص CSV مع مراعاة الفواصل والأسطر الجديدة والاقتباسات (معيار RFC 4180)
 * @param {string} text
 * @returns {Array<Object>}
 */
function parseCSV(text) {
    if (!text || typeof text !== "string") return [];
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

    if (rows.length < 2) return [];

    const headers = rows[0].map(h => (h || '').trim());
    const result = [];

    for (let i = 1; i < rows.length; i++) {
        const rowValues = rows[i];
        if (rowValues.length === 1 && rowValues[0].trim() === "") continue;

        const record = {};
        headers.forEach((header, index) => {
            record[header] = rowValues[index] !== undefined ? rowValues[index].trim() : "";
        });
        result.push(record);
    }

    return result;
}

/**
 * البحث عن قيمة عمود معين في كائن الصف
 */
function findCSVColumn(row, colName) {
    if (!row) return "";
    let key = Object.keys(row).find(k => k && k.trim() === colName);
    if (key && row[key] !== undefined && row[key] !== null) return String(row[key]).trim();

    const norm = normalizeArabicText(colName);
    key = Object.keys(row).find(k => k && normalizeArabicText(k) === norm);
    return (key && row[key] !== undefined && row[key] !== null) ? String(row[key]).trim() : "";
}

/**
 * توحيد الحروف العربية لمطابقة أكثر دقة
 */
function normalizeArabicText(str) {
    if (!str || typeof str !== "string") return "";
    return str
        .trim()
        .replace(/[إأآا]/g, "ا")
        .replace(/ة/g, "ه")
        .replace(/ى/g, "ي")
        .replace(/[\u064B-\u065F\u0670]/g, "")
        .toLowerCase();
}
