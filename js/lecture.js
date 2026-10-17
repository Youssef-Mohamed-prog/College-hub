// ==========================================
// 🎬 Lecture Page — صفحة المحاضرة
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    renderLecturePage();
});

function renderLecturePage() {
    const courseId = getUrlParam('course');
    const lectureId = getUrlParam('lecture');
    const course = getCourseById(courseId);
    const lecture = getLectureById(courseId, lectureId);
    const container = document.getElementById('lectureContent');

    if (!course || !lecture || !container) {
        if (container) {
            container.innerHTML = `
                <div class="text-center" style="padding: var(--space-4xl) 0;">
                    <h2>المحاضرة غير موجودة</h2>
                    <p style="color: var(--text-secondary); margin: var(--space-md) 0;">لم نتمكن من العثور على هذه المحاضرة.</p>
                    <a href="courses.html" class="btn btn-primary">عودة للمواد</a>
                </div>
            `;
        }
        return;
    }

    const prevLecture = getPreviousLecture(courseId, lectureId);
    const nextLecture = getNextLecture(courseId, lectureId);

    // Update page title
    document.title = "مجمع طلاب BIS";

    // Video section
    let videoHTML = '';
    if (lecture.video) {
        // Extract YouTube video ID and create facade
        const videoId = extractYouTubeId(lecture.video);
        if (videoId) {
            videoHTML = `
                <div class="video-facade" style="position:relative;width:100%;height:100%;cursor:pointer;touch-action:manipulation;" data-videoid="${videoId}">
                    <img src="https://i.ytimg.com/vi/${videoId}/hqdefault.jpg" alt="${lecture.title}" style="width:100%;height:100%;object-fit:cover;">
                    <button aria-label="تشغيل الفيديو" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:68px;height:48px;background:rgba(0,0,0,.75);border:none;border-radius:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
                    </button>
                </div>`;
        } else {
            videoHTML = `<iframe src="${lecture.video}" title="${lecture.title}" allowfullscreen></iframe>`;
        }
    } else {
        videoHTML = `
            <div class="video-placeholder">
                <div class="play-icon">▶</div>
                <p>سيتم إضافة الفيديو قريبًا</p>
            </div>
        `;
    }

    // Sidebar lectures
    const sidebarHTML = course.lectures.map(l => `
        <a href="lecture.html?course=${course.id}&lecture=${l.id}" 
           class="sidebar-lecture-item ${l.id === parseInt(lectureId) ? 'active' : ''}">
            <span class="sidebar-lecture-num">${String(l.id).padStart(2, '0')}</span>
            <span>${l.title}</span>
        </a>
    `).join('');

    // Download action buttons
    const lectureFile = (lecture.lectureUrl || lecture.lectureFile || '').trim();
    const summaryFile = (lecture.summaryUrl || lecture.summaryFile || '').trim();
    const sectionFile = (lecture.sectionUrl || lecture.sectionFile || '').trim();
    const bookFile = (lecture.bookUrl || lecture.bookFile || '').trim();

    let downloadButtons = [];
    if (lectureFile) {
        downloadButtons.push(`
            <a href="${lectureFile}" 
               download 
               class="btn btn-primary btn-sm"
               onclick="handleDownload(event, '${lectureFile}')">
                📥 تحميل المحاضرة
            </a>
        `);
    }
    if (summaryFile) {
        downloadButtons.push(`
            <a href="${summaryFile}" 
               download 
               class="btn btn-ghost btn-sm"
               onclick="handleDownload(event, '${summaryFile}')">
                📋 تحميل الملخص
            </a>
        `);
    }
    if (sectionFile) {
        downloadButtons.push(`
            <a href="${sectionFile}" 
               download 
               class="btn btn-ghost btn-sm"
               onclick="handleDownload(event, '${sectionFile}')">
                📄 تحميل السكشن
            </a>
        `);
    }
    const summaryByVal = (lecture.summaryBy || '').trim();
    if (bookFile) {
        const bookButtonHTML = `
            <a href="${bookFile}" 
               download 
               class="btn btn-ghost btn-sm"
               onclick="handleDownload(event, '${bookFile}')">
                📚 تحميل الكتاب
            </a>
        `;
        if (summaryByVal) {
            downloadButtons.push(`
                <div class="lecture-book-wrapper" style="display: inline-flex; flex-direction: column; gap: var(--space-xs); align-items: stretch;">
                    <div id="lectureSummaryByBox" class="btn btn-ghost btn-sm" style="cursor: default; pointer-events: none; text-align: center;"></div>
                    ${bookButtonHTML}
                </div>
            `);
        } else {
            downloadButtons.push(bookButtonHTML);
        }
    } else if (summaryByVal) {
        downloadButtons.push(`
            <div id="lectureSummaryByBox" class="btn btn-ghost btn-sm" style="cursor: default; pointer-events: none; text-align: center;"></div>
        `);
    }

    const actionsHTML = downloadButtons.length > 0 ? `
        <div class="lecture-actions" style="align-items: flex-end;">
            ${downloadButtons.join('')}
        </div>
    ` : '';

    container.innerHTML = `
        <!-- Breadcrumb -->
        <div class="lecture-page-header">
            <div class="container">
                <nav class="lecture-breadcrumb">
                    <a href="index.html">الرئيسية</a>
                    <span class="separator">/</span>
                    <a href="courses.html">المواد</a>
                    <span class="separator">/</span>
                    <a href="course.html?id=${course.id}">${course.title}</a>
                    <span class="separator">/</span>
                    <span>${lecture.title}</span>
                </nav>
            </div>
        </div>

        <!-- Lecture Content -->
        <div class="container">
            <div class="lecture-layout">
                <!-- Main Content -->
                <div class="lecture-main animate-fade-in-up">
                    <!-- Video -->
                    <div class="video-container">
                        ${videoHTML}
                    </div>

                    <!-- Title & Description -->
                    <div class="lecture-title-section">
                        <h1>${String(lecture.id).padStart(2, '0')} — ${lecture.title}</h1>
                        ${lecture.summaryBy ? `
                            <div class="lecture-summary-by">
                                <span class="summary-by-icon">✍️</span>
                                <span>الملخص بواسطة: <strong>${escapeHtml(lecture.summaryBy)}</strong></span>
                            </div>
                        ` : ''}
                        <p>${lecture.description}</p>
                    </div>

                    <!-- Download Buttons -->
                    ${actionsHTML}

                    <!-- Student Question Button and Inline Panel -->
                    <div class="lecture-student-ask-wrapper" style="margin-top: var(--space-md); margin-bottom: var(--space-lg);">
                        <button type="button" class="btn btn-outline btn-sm" id="askLectureQuestionBtn" style="display: inline-flex; align-items: center; gap: 8px;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                            <span>عندك سؤال في المحاضرة دي؟</span>
                        </button>

                        <!-- صندوق طرح السؤال داخل صفحة المحاضرة -->
                        <div class="student-ask-panel" id="studentLectureAskPanel" style="display: none;"></div>
                    </div>

                    <!-- Navigation -->
                    <div class="lecture-nav">
                        ${prevLecture ? `
                            <a href="lecture.html?course=${course.id}&lecture=${prevLecture.id}" class="btn btn-outline btn-sm">
                                → المحاضرة السابقة: ${prevLecture.title}
                            </a>
                        ` : `
                            <span class="btn btn-outline btn-sm btn-disabled">→ المحاضرة السابقة</span>
                        `}
                        ${nextLecture ? `
                            <a href="lecture.html?course=${course.id}&lecture=${nextLecture.id}" class="btn btn-cta btn-sm">
                                المحاضرة التالية: ${nextLecture.title} ←
                            </a>
                        ` : `
                            <a href="course.html?id=${course.id}" class="btn btn-cta btn-sm">
                                ✓ إنهاء المادة — عودة للمادة
                            </a>
                        `}
                    </div>
                </div>

                <!-- Sidebar -->
                <aside class="lecture-sidebar animate-fade-in">
                    <h3 class="sidebar-title">📋 قائمة المحاضرات</h3>
                    <div class="sidebar-lectures">
                        ${sidebarHTML}
                    </div>
                    <a href="course.html?id=${course.id}" class="btn btn-outline btn-sm mt-lg" style="width:100%;">
                        → عودة لصفحة المادة
                    </a>
                </aside>
            </div>
        </div>
    `;

    // عرض صاحب الملخص بـ textContent
    if (summaryByVal) {
        const summaryBox = container.querySelector('#lectureSummaryByBox');
        if (summaryBox) {
            summaryBox.textContent = `صاحب الملخص: ${summaryByVal}`;
        }
    }

    // Facade click → swap to real iframe
    const facade = container.querySelector('.video-facade');
    if (facade) {
        facade.addEventListener('click', () => {
            const vid = facade.dataset.videoid;
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube-nocookie.com/embed/${vid}?autoplay=1&rel=0`;
            iframe.title = lecture.title;
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;
            iframe.style.cssText = 'width:100%;height:100%;border:none;';
            facade.replaceWith(iframe);
        });
    }

    // إعداد صندوق طرح السؤال المضمن داخل صفحة المحاضرة
    setupStudentAskBox({
        triggerBtn: container.querySelector('#askLectureQuestionBtn'),
        panel: container.querySelector('#studentLectureAskPanel'),
        subjectName: course.formSubject || course.title,
        lectureTitle: lecture.title
    });
}

// ==========================================
// 🔗 روابط وثوابت اسأل زميلك (Fallback في حال كان الكاش قديماً)
// ==========================================
const DEFAULT_STUDENT_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdIIXiks6SOB4vPidFpHoicKakBhfUWtUwJZGQXOGX1ymeGTw/viewform";
const DEFAULT_STUDENT_ENTRY_SUBJECT = "entry.1349988251";
const DEFAULT_STUDENT_ENTRY_QUESTION = "entry.1862128244";

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
            ${studentFormUrl ? `
                <a href="${studentFormUrl}" target="_blank" rel="noopener noreferrer" class="student-ask-fallback-link">
                    لو في مشكلة افتح الفورم ↗
                </a>
            ` : ''}
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

        // في صفحة المحاضرة ابدأ نص السؤال بـ [عنوان المحاضرة] (شرط 4)
        const finalQuestion = lectureTitle ? `[${lectureTitle}] ${questionText}` : questionText;

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
 * Extract YouTube video ID from URL
 */
function extractYouTubeId(url) {
    if (!url) return null;
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?#]+)/,
        /^([a-zA-Z0-9_-]{11})$/
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}

/**
 * Handle download click — check if file exists
 */
function handleDownload(event, filePath) {
    // Allow the download to proceed normally
    // If the file doesn't exist, the browser will handle the 404
    console.log(`Downloading: ${filePath}`);
}

