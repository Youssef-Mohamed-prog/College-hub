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
    if (bookFile) {
        downloadButtons.push(`
            <a href="${bookFile}" 
               download 
               class="btn btn-ghost btn-sm"
               onclick="handleDownload(event, '${bookFile}')">
                📚 تحميل الكتاب
            </a>
        `);
    }

    const actionsHTML = downloadButtons.length > 0 ? `
        <div class="lecture-actions">
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
                        <p>${lecture.description}</p>
                    </div>

                    <!-- Download Buttons -->
                    ${actionsHTML}

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
