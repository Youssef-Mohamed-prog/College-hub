// ==========================================
// ⚙️ إعدادات الموقع — Site Configuration
// غيّر أي قيمة هنا وستنعكس على كل الصفحات
// ==========================================
const siteConfig = {
    name: "مجمع طلاب BIS",
    tagline: "تعلّم بلا حدود",
    description: "منصة لطلاب BIS محاضرات مرتبة وملخصات لكل مادة في مكان واحد.",
    email: "dev.youssef.moham3d@gmail.com",
    phone: "01030748981",
    address: "",
    social: {
        whatsapp: "https://whatsapp.com/channel/0029Vb8AcJy4SpkPpRb16o00",
        telegram: "https://t.me/kVKL9JUTn9w2NzY0",
        whatsappGroup: "https://chat.whatsapp.com/Cik6yIWYevkLx48Q7GIbG8?s=cl&p=a&mlu=4&ilr=4"
    },
    footerText: "جميع الحقوق محفوظة © 2026 مجمع طلاب BIS",
    // إحصائيات تظهر في الصفحة الرئيسية
    stats: {
        courses: 6,
        lectures: 24,
        students: "١٬٢٠٠+",
        hours: "٤٨+"
    }
};

// ==========================================
// 📚 بيانات المواد — Courses Data
// أضف مادة جديدة بنسخ أي عنصر وتعديله
// ==========================================
const courses = [
    {
        id: 1,
        title: "قواعد البيانات 2",
        titleEn: "Databases 2",
        subject: "نظم المعلومات",
        formSubject: "قواعد البيانات 2",
        creator: "طلاب الدفعة",
        creatorImage: "",
        image: "assets/images/course-db.jpg",
        imageAlt: "سيرفرات وداتا سنتر",
        color: "#6366F1",
        description: "محاضرات قواعد البيانات 2 مرتبة، ولكل محاضرة ملخص تقدر تحمّله.",
        lectures: [
            {
                id: 1,
                title: "المحاضرة الأولى",
                summaryBy: "يوسف محمد محمد",
                description: "تعريف بالمادة وأهدافها، مراجعة سريعة لقواعد البيانات 1 والمتطلبات الأساسية.",
                video:"https://youtu.be/tzqadCOoVhk?si=UimqJV6VNZBPRj_q",
                lectureFile: "assets/files/lecture-01.pdf",
                summaryFile: "assets/files/lecture-01-summary.pdf",
                sectionUrl: "assets/files/lecture-01-section.pdf",
                bookUrl: "assets/files/database/bookdatebase.pdf",
                quizUrl: "9"
            },
        ]
    },
    {
        id: 2,
        title: "إحصاء وحزم بحوث العمليات",
        titleEn: "Statistics & Operations Research Software Packages",
        subject: "إحصاء",
        formSubject: "إحصاء وحزم بحوث العمليات",
        creator: "طلاب الدفعة",
        creatorImage: "",
        image: "assets/images/course-stats.jpg",
        imageAlt: "رسوم بيانية وتحليل بيانات",
        color: "#6366F1",
        description: "محاضرات حزم الإحصاء وبحوث العمليات مرتبة، ولكل محاضرة ملخص.",
        lectures: [
        {
                id: 1,
                title: "المحاضرة الأولى",
                summaryBy: "صباح عامر",
                description: "في المحاضرة دي هنتعرف على أساسيات الاحتمالات ومفاهيمها الرئيسية، وإزاي نحسب احتمال حدوث الأحداث المختلفة، مع فهم الفرق بين الأحداث المستقلة والتابعة، والتطبيق على أمثلة عملية تساعدنا نستخدم الاحتمالات في تحليل البيانات واتخاذ القرارات.",
                video:"https://youtu.be/KvaBFDr3UiA?si=GNrFpF_xE96yuf5t",
                lectureFile: "المحاضرة الاولة احصاء وحزم بحوث العمليات.pdf",
                summaryFile: "ملخص المحاضرة الاولى احصاء.pdf",
                sectionUrl: "سكشن 1 احصاء وحزم بحوث العمليات.pdf",
                bookUrl: "كتاب ( احصاء وحزم البحوث ).pdf",
                quizUrl: "9"
            },     
        ]
    },
    {
        id: 3,
        title: "دراسات إدارية بالإنجليزية",
        titleEn: "Management Studies in English",
        subject: "إدارة",
        formSubject: "دراسات إدارية بالإنجليزية",
        creator: "طلاب الدفعة",
        creatorImage: "",
        image: "assets/images/course-mgmt.jpg",
        imageAlt: "اجتماع عمل وفريق",
        color: "#6366F1",
        description: "محاضرات دراسات الإدارة بالإنجليزي مرتبة، ولكل محاضرة ملخص.",
        lectures: [
            {
                id: 1,
                title: "المحاضرة الأولى",
                summaryBy: "",
                description: "",
                video:"",
                lectureFile: "",
                summaryFile: "",
                sectionUrl: "",
                bookUrl: "",
                quizUrl: ""
            }
        ]
    },
    {
        id: 4,
        title: "اقتصاد كلي",
        titleEn: "Macroeconomics",
        subject: "اقتصاد",
        formSubject: "اقتصاد كلي",
        creator: "طلاب الدفعة",
        creatorImage: "",
        image: "assets/images/course-econ.jpg",
        imageAlt: "مؤشرات وأسواق مالية",
        color: "#6366F1",
        description: "محاضرات الاقتصاد الكلي مرتبة، ولكل محاضرة ملخص.",
        lectures: [
            {
                id: 1,
                title: "المحاضرة الأولى",
                summaryBy: "",
                description: "",
                video:"",
                lectureFile: "",
                summaryFile: "",
                sectionUrl: "",
                bookUrl: "",
                quizUrl: ""
            }
        ]
    },
    {
        id: 5,
        title: "محاسبة ضرائب",
        titleEn: "Tax Accounting",
        subject: "محاسبة",
        formSubject: "محاسبة ضرائب",
        creator: "طلاب الدفعة",
        creatorImage: "",
        image: "assets/images/course-tax.jpg",
        imageAlt: "نماذج ضريبية وآلة حاسبة",
        color: "#6366F1",
        description: "محاضرات المحاسبة الضريبية مرتبة، ولكل محاضرة ملخص.",
        lectures: [
            {
                id: 1,
                title: "المحاضرة الأولى",
                summaryBy: "",
                description: "",
                video:"",
                lectureFile: "",
                summaryFile: "",
                sectionUrl: "",
                bookUrl: "",
                quizUrl: ""
            }
        ]
    },
    {
        id: 6,
        title: "محاسبة تكاليف",
        titleEn: "Cost Accounting",
        subject: "محاسبة",
        formSubject: "محاسبة تكاليف",
        creator: "طلاب الدفعة",
        creatorImage: "",
        image: "assets/images/course-cost.jpg",
        imageAlt: "آلة حاسبة وتقارير مالية",
        color: "#6366F1",
        description: "محاضرات محاسبة التكاليف مرتبة، ولكل محاضرة ملخص.",
        lectures: [
            {
                id: 1,
                title: "المحاضرة الأولى",
                summaryBy: "",
                description: "",
                video:"",
                lectureFile: "",
                summaryFile: "",
                sectionUrl: "",
                bookUrl: "",
                quizUrl: ""
            }
        ]
    }
];

// ==========================================
// 📄 محتوى صفحة "من نحن" — About Page Content
// ==========================================
const aboutContent = {
    hero: {
        title: "من نحن",
        subtitle: "نؤمن بأن التعليم الجيد حق للجميع"
    },
    mission: {
        title: "رسالتنا",
        text: "نحن فريق يسعى لتيسير رحلة التعلم الأكاديمي وتذليل عقباتها. رسالتنا هي تقديم محتوى تعليمي متكامل يجمع بين الشرح المرئي الوافي والملخصات المكتوبة (PDF) الدقيقة، لتكون المعرفة رفيقة الطالب، واضحة وميسرة وقابلة للاستيعاب في أي وقت."
    },
    offering: {
        title: "ماذا نقدّم",
        items: [
            { icon: "📹", title: "محاضرات مرئية", text: "فيديوهات تعليمية مسجّلة بجودة عالية يمكنك مشاهدتها في أي وقت ومن أي مكان." },
            { icon: "📄", title: "ملخصات وملفات", text: "ملخصات PDF لكل محاضرة تساعدك على المراجعة السريعة قبل الاختبارات." },
            { icon: "🎯", title: "تطبيقات عملية", text: "أمثلة ومشاريع حقيقية تربط النظرية بالتطبيق الفعلي." },
            { icon: "📱", title: "تعلّم من أي جهاز", text: "المنصة متجاوبة بالكامل وتعمل على الكمبيوتر والتابلت والجوال." }
        ]
    },
    why: {
        title: "لماذا أنشئ هذا الموقع",
        text: "تأسس هذا الموقع ليكون منصة تعليمية متكاملة تهدف إلى تسهيل الدراسة على الطلاب، من خلال توفير ملخصات مركزة وجاهزة بصيغة (PDF) مع فيديوهات شرح مبسطة للمواد الأكاديمية، مما يوفر الوقت والجهد ويساعد على تحقيق التفوق."
    },
    philosophy: {
        title: "فلسفة التعلّم",
        text: "نؤمن بأن إتقان أي مادة يبدأ بالفهم العميق وينتهي بالمراجعة الذكية. تعتمد منهجيتنا على مسارين متكاملين: بناء الاستيعاب خطوة بخطوة عبر \"فيديوهات الشرح\"، ثم تثبيت المعلومة وسهولة استرجاعها من خلال \"ملخصات PDF\" الشاملة، مما يصنع تجربة تعليمية متوازنة تضمن استدامة المعرفة."
    }
};


// ==========================================
// 🔧 دوال مساعدة — Helper Functions
// ==========================================

/**
 * الحصول على مادة بواسطة الـ ID
 * @param {number} id
 * @returns {object|undefined}
 */
function getCourseById(id) {
    return courses.find(course => course.id === parseInt(id));
}

/**
 * الحصول على محاضرة بواسطة ID المادة و ID المحاضرة
 * @param {number} courseId
 * @param {number} lectureId
 * @returns {object|undefined}
 */
function getLectureById(courseId, lectureId) {
    const course = getCourseById(courseId);
    if (!course) return undefined;
    return course.lectures.find(lecture => lecture.id === parseInt(lectureId));
}

/**
 * الحصول على عدد محاضرات مادة
 * @param {number} courseId
 * @returns {number}
 */
function getLectureCount(courseId) {
    const course = getCourseById(courseId);
    return course ? course.lectures.length : 0;
}

/**
 * الحصول على المحاضرة السابقة
 * @param {number} courseId
 * @param {number} lectureId
 * @returns {object|null}
 */
function getPreviousLecture(courseId, lectureId) {
    const course = getCourseById(courseId);
    if (!course) return null;
    const currentIndex = course.lectures.findIndex(l => l.id === parseInt(lectureId));
    if (currentIndex <= 0) return null;
    return course.lectures[currentIndex - 1];
}

/**
 * الحصول على المحاضرة التالية
 * @param {number} courseId
 * @param {number} lectureId
 * @returns {object|null}
 */
function getNextLecture(courseId, lectureId) {
    const course = getCourseById(courseId);
    if (!course) return null;
    const currentIndex = course.lectures.findIndex(l => l.id === parseInt(lectureId));
    if (currentIndex === -1 || currentIndex >= course.lectures.length - 1) return null;
    return course.lectures[currentIndex + 1];
}

/**
 * قراءة URL Parameters
 * @param {string} param
 * @returns {string|null}
 */
function getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

/**
 * إنشاء badge المستوى
 * @param {string} level
 * @returns {string} CSS class name
 */
function getLevelClass(level) {
    switch (level) {
        case 'مبتدئ': return 'level-beginner';
        case 'متوسط': return 'level-intermediate';
        case 'متقدم': return 'level-advanced';
        default: return 'level-beginner';
    }
}

// ==========================================
// 📡 مراقبة حالة الاتصال بالإنترنت وإلغاء الأوفلاين
// ==========================================

// 1. إلغاء أي Service Worker قديم ومسح الكاش المخزن لضمان العمل بالإنترنت فقط
if (typeof window !== "undefined") {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
            registrations.forEach(reg => reg.unregister());
        }).catch(() => {});
    }
    if ('caches' in window) {
        caches.keys().then(keys => {
            keys.forEach(key => caches.delete(key));
        }).catch(() => {});
    }
}

/**
 * عرض رسالة واضحة في أعلى الصفحة عند انقطاع الإنترنت مع أيقونة أنيميشن كيوت
 */
function initNetworkStatusMonitor() {
    if (typeof document === "undefined") return;

    let banner = document.getElementById('siteOfflineBanner');
    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'siteOfflineBanner';
        banner.className = 'site-offline-banner';
        banner.setAttribute('role', 'alert');
        banner.setAttribute('aria-live', 'assertive');
        banner.style.display = 'none';
        banner.innerHTML = `
            <div class="site-offline-content">
                <div class="cute-offline-icon-wrap">
                    <svg class="cute-offline-svg" width="38" height="38" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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
                <p class="site-offline-text">معلش، الموقع محتاج إنترنت عشان يشتغل. أول ما النت يرجع كمّل من مكانك.</p>
            </div>
        `;
        document.body.prepend(banner);
    }

    function updateStatus() {
        const isOnline = navigator.onLine;
        if (!isOnline) {
            banner.style.display = 'block';
            document.body.classList.add('is-offline');
        } else {
            banner.style.display = 'none';
            document.body.classList.remove('is-offline');
        }
    }

    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    updateStatus();
}

if (typeof document !== "undefined") {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNetworkStatusMonitor);
    } else {
        initNetworkStatusMonitor();
    }
}
