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
                description: "تعريف بالمادة وأهدافها، مراجعة سريعة لقواعد البيانات 1 والمتطلبات الأساسية.",
                video:"https://youtu.be/tzqadCOoVhk?si=UimqJV6VNZBPRj_q",
                lectureFile: "assets/files/lecture-01.pdf",
                summaryFile: "assets/files/lecture-01-summary.pdf",
                sectionUrl: "assets/files/lecture-01-section.pdf",
                bookUrl: "assets/files/database/bookdatebase.pdf"
            },
        ]
    },
    {
        id: 2,
        title: "إحصاء وحزم بحوث العمليات",
        titleEn: "Statistics & Operations Research Software Packages",
        subject: "إحصاء",
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
                description: "",
                video:"",
                lectureFile: "",
                summaryFile: "",
                sectionUrl: "",
                bookUrl: ""
            },     
        ]
    },
    {
        id: 3,
        title: "دراسات إدارية بالإنجليزية",
        titleEn: "Management Studies in English",
        subject: "إدارة",
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
                description: "",
                video:"",
                lectureFile: "",
                summaryFile: "",
                sectionUrl: "",
                bookUrl: ""
            }
        ]
    },
    {
        id: 4,
        title: "اقتصاد كلي",
        titleEn: "Macroeconomics",
        subject: "اقتصاد",
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
                description: "",
                video:"",
                lectureFile: "",
                summaryFile: "",
                sectionUrl: "",
                bookUrl: ""
            }
        ]
    },
    {
        id: 5,
        title: "محاسبة ضرائب",
        titleEn: "Tax Accounting",
        subject: "محاسبة",
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
                description: "",
                video:"",
                lectureFile: "",
                summaryFile: "",
                sectionUrl: "",
                bookUrl: ""
            }
        ]
    },
    {
        id: 6,
        title: "محاسبة تكاليف",
        titleEn: "Cost Accounting",
        subject: "محاسبة",
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
                description: "",
                video:"",
                lectureFile: "",
                summaryFile: "",
                sectionUrl: "",
                bookUrl: ""
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
            { icon: "📱", title: "تعلّم من أي جهاز", text: "المنصة متجاوبة بالكامل — تعمل على الكمبيوتر والتابلت والجوال." }
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
