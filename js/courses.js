// ==========================================
// 📚 Courses Page — عرض كل المواد
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    renderCoursesPage();
});

function renderCoursesPage() {
    const container = document.getElementById('coursesGrid');
    if (!container) return;

    container.innerHTML = courses.map((course, index) => `
        <div class="course-card animate-fade-in-up stagger-${index + 1}" data-animate="fadeInUp">
            <div class="course-card-image">
                ${getCourseImageHTML(course)}
                <span class="course-subject">${course.subject}</span>
            </div>
            <div class="course-card-body">
                <h3 class="course-card-title" style="margin-bottom: 2px;">${course.title}</h3>
                <p class="course-card-title-en" style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: var(--space-sm); font-weight: 500;">${course.titleEn}</p>
                <p class="course-card-description">${course.description}</p>
                <div class="course-card-meta">
                    <span class="meta-item">
                        <span class="meta-icon">📹</span>
                        ${course.lectures.length} محاضرات
                    </span>
                </div>
                <div class="course-card-instructor">
                    ${getInstructorImageHTML(course)}
                    <span class="instructor-name">${course.creator}</span>
                </div>
            </div>
            <div class="course-card-footer">
                <a href="course.html?id=${course.id}" class="btn btn-cta btn-sm">ابدأ المادة ←</a>
            </div>
        </div>
    `).join('');
}
