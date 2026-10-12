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
                        
                        <div class="course-instructor-card">
                            ${getInstructorImageHTML(course, 52)}
                            <div class="instructor-info">
                                <span class="instructor-label">المدرس</span>
                                <span class="instructor-name">${course.creator}</span>
                            </div>
                        </div>

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
    `;
}
