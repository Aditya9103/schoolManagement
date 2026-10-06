import Notice from './notice.model.js';
import User from '../auth/user.model.js';
import Class from '../academic/class.model.js';
import Student from '../student/student.model.js';
import ParentProfile from '../people/models/parentProfile.model.js';
import ParentStudentRelation from '../people/models/parentStudentRelation.model.js';
import TeachingAssignment from '../people/models/teachingAssignment.model.js';
import ApiError from '../../utils/ApiError.js';
import { eventBus, DOMAIN_EVENTS } from '../../events/eventBus.js';

export const seedDemoNotices = async (schoolId, defaultAuthorId) => {
    const count = await Notice.countDocuments({ schoolId });
    if (count > 0) return;

    let authorId = defaultAuthorId;
    if (!authorId) {
        const adminUser = await User.findOne({ schoolId, role: { $in: ['SCHOOL_ADMIN', 'SUPER_ADMIN'] } });
        if (adminUser) authorId = adminUser._id;
    }
    if (!authorId) return;

    const demoNotices = [
        {
            schoolId,
            title: 'Annual Sports Day 2026-27 Schedule & House Team Selection',
            content: 'The Annual Sports Day will be held on 24th October 2026. All students from Class 5 to 12 are requested to report to the sports ground in complete sports uniform. House captains and vice-captains will organize the heats during zero periods this week. Parents are cordially invited to attend the grand finale from 9:00 AM onwards.',
            category: 'EVENT',
            priority: 'HIGH',
            targetAudience: 'ALL',
            isPinned: true,
            acknowledgmentRequired: true,
            publishedBy: authorId,
            publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            attachments: [
                {
                    fileName: 'Sports_Day_Schedule_2026.pdf',
                    fileUrl: 'https://example.com/docs/sports_day_schedule.pdf',
                    fileType: 'application/pdf',
                    fileSize: '1.4 MB',
                },
            ],
            status: 'PUBLISHED',
        },
        {
            schoolId,
            title: 'Term 1 Mid-Term Examination Datesheet & Syllabus Guidelines',
            content: 'The Term 1 examinations will commence from 15th November 2026 across all academic sections. The detailed subject-wise syllabus breakdown and question paper blueprint have been uploaded. Students must carry valid admit cards to the examination halls. Preparatory leaves will be announced shortly.',
            category: 'EXAMINATION',
            priority: 'URGENT',
            targetAudience: 'STUDENTS',
            isPinned: true,
            acknowledgmentRequired: true,
            publishedBy: authorId,
            publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            attachments: [
                {
                    fileName: 'Term1_Exam_Datesheet.pdf',
                    fileUrl: 'https://example.com/docs/term1_datesheet.pdf',
                    fileType: 'application/pdf',
                    fileSize: '2.1 MB',
                },
            ],
            status: 'PUBLISHED',
        },
        {
            schoolId,
            title: 'Parent-Teacher Conference (PTM) for Grades 6 to 10',
            content: 'The mandatory Term 1 progress review meeting will take place on Saturday, 18th October 2026 from 8:30 AM to 1:00 PM. Parents will receive individual 15-minute consultation slots with class and subject teachers. Please review the performance report on the Family Portal prior to the meeting.',
            category: 'ACADEMIC',
            priority: 'NORMAL',
            targetAudience: 'PARENTS',
            isPinned: false,
            acknowledgmentRequired: true,
            publishedBy: authorId,
            publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            attachments: [],
            status: 'PUBLISHED',
        },
        {
            schoolId,
            title: 'Dussehra and Autumn Break Holiday Notification',
            content: 'The school will remain closed for students and instructional faculty from 10th October to 14th October 2026 on account of Dussehra celebrations. The administrative office will function on working hours on 13th October. Normal classes will resume on Thursday, 15th October 2026.',
            category: 'HOLIDAY',
            priority: 'NORMAL',
            targetAudience: 'ALL',
            isPinned: false,
            acknowledgmentRequired: false,
            publishedBy: authorId,
            publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            attachments: [],
            status: 'PUBLISHED',
        },
        {
            schoolId,
            title: 'Winter Uniform Mandatory Guidelines from November 1st',
            content: 'In accordance with school uniform regulations, all students must transition to the official winter uniform starting Monday, 1st November 2026. This comprises navy blue blazers with school monogram, full-sleeve white shirts, and woolen trousers/skirts. The campus uniform store is open on weekdays from 2:00 PM to 4:30 PM.',
            category: 'ADMINISTRATIVE',
            priority: 'LOW',
            targetAudience: 'ALL',
            isPinned: false,
            acknowledgmentRequired: false,
            publishedBy: authorId,
            publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
            attachments: [],
            status: 'PUBLISHED',
        },
    ];

    await Notice.insertMany(demoNotices);
};

export const getNotices = async (schoolId, query = {}, user = null) => {
    await seedDemoNotices(schoolId, user?._id);

    const {
        page = 1,
        limit = 10,
        search = '',
        category = 'ALL',
        priority = 'ALL',
        targetAudience = 'ALL',
        isPinned,
    } = query;

    const skip = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);

    const filter = { schoolId, status: { $ne: 'ARCHIVED' } };

    if (category && category !== 'ALL') {
        filter.category = category.toUpperCase();
    }

    if (priority && priority !== 'ALL') {
        filter.priority = priority.toUpperCase();
    }

    if (targetAudience && targetAudience !== 'ALL') {
        filter.targetAudience = targetAudience.toUpperCase();
    }

    if (isPinned !== undefined) {
        filter.isPinned = isPinned === 'true' || isPinned === true;
    }

    if (search && search.trim()) {
        const rgx = new RegExp(search.trim(), 'i');
        filter.$or = [
            { title: rgx },
            { content: rgx },
        ];
    }

    // Role-specific scoping for viewers
    const userId = user?.sub || user?._id || user?.id;
    const userRole = user?.role;
    const isAdmin = ['SCHOOL_ADMIN', 'SUPER_ADMIN', 'ADMIN'].includes(userRole);

    let audienceConditions = [];

    if (!isAdmin) {
        if (userRole === 'STUDENT') {
            const student = await Student.findOne({ schoolId, userId }).select('classId').lean();
            const studentClassId = student?.classId;

            audienceConditions = [
                { targetAudience: 'ALL' },
                { targetAudience: 'STUDENTS' },
            ];
            if (studentClassId) {
                audienceConditions.push({
                    targetAudience: 'SPECIFIC_CLASSES',
                    targetClassIds: studentClassId,
                });
            }
        } else if (userRole === 'PARENT') {
            const parentProfile = await ParentProfile.findOne({ schoolId, userId }).select('_id').lean();
            let parentClassIds = [];
            if (parentProfile) {
                const relations = await ParentStudentRelation.find({ schoolId, parentId: parentProfile._id, status: 'ACTIVE' }).select('studentId').lean();
                const studentIds = relations.map((r) => r.studentId);
                if (studentIds.length > 0) {
                    const students = await Student.find({ _id: { $in: studentIds } }).select('classId').lean();
                    parentClassIds = students.map((s) => s.classId).filter(Boolean);
                }
            }

            audienceConditions = [
                { targetAudience: 'ALL' },
                { targetAudience: 'PARENTS' },
                { targetAudience: 'STUDENTS' },
            ];
            if (parentClassIds.length > 0) {
                audienceConditions.push({
                    targetAudience: 'SPECIFIC_CLASSES',
                    targetClassIds: { $in: parentClassIds },
                });
            }
        } else if (userRole === 'TEACHER') {
            const assignments = await TeachingAssignment.find({ schoolId, teacherId: userId, status: 'ACTIVE' }).select('classId').lean();
            const teacherClassIds = assignments.map((a) => a.classId).filter(Boolean);

            audienceConditions = [
                { targetAudience: 'ALL' },
                { targetAudience: 'TEACHERS' },
                { targetAudience: 'STAFF' },
                { publishedBy: userId },
            ];
            if (teacherClassIds.length > 0) {
                audienceConditions.push({
                    targetAudience: 'SPECIFIC_CLASSES',
                    targetClassIds: { $in: teacherClassIds },
                });
            }
        } else {
            // Other staff (Accountant, Librarian, Driver, etc.)
            audienceConditions = [
                { targetAudience: 'ALL' },
                { targetAudience: 'STAFF' },
                { publishedBy: userId },
            ];
        }

        filter.$and = filter.$and || [];
        filter.$and.push({ $or: audienceConditions });

        if (targetAudience && targetAudience !== 'ALL') {
            filter.$and.push({ targetAudience: targetAudience.toUpperCase() });
        }
    } else {
        // Admin can view all and optionally filter by target audience
        if (targetAudience && targetAudience !== 'ALL') {
            filter.targetAudience = targetAudience.toUpperCase();
        }
    }

    const [notices, total] = await Promise.all([
        Notice.find(filter)
            .populate('publishedBy', 'firstName lastName email role profilePhotoUrl')
            .populate('targetClassIds', 'name')
            .sort({ isPinned: -1, publishedAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean(),
        Notice.countDocuments(filter),
    ]);

    // Compute live scoped KPI stats
    const kpiFilter = { schoolId, status: { $ne: 'ARCHIVED' } };
    if (!isAdmin && audienceConditions.length > 0) {
        kpiFilter.$and = [{ $or: audienceConditions }];
    }
    const allNotices = await Notice.find(kpiFilter).lean();
    const urgentCount = allNotices.filter((n) => n.priority === 'URGENT' || n.priority === 'HIGH').length;
    const pinnedCount = allNotices.filter((n) => n.isPinned).length;
    const acknowledgedCount = allNotices.reduce((acc, curr) => acc + (curr.acknowledgedBy?.length || 0), 0);

    return {
        notices,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages: Math.ceil(total / parseInt(limit)) || 1,
        },
        kpis: {
            totalNotices: allNotices.length,
            urgentNotices: urgentCount,
            pinnedNotices: pinnedCount,
            totalAcknowledgements: acknowledgedCount,
        },
    };
};

export const getNoticeById = async (schoolId, noticeId) => {
    const notice = await Notice.findOne({ _id: noticeId, schoolId })
        .populate('publishedBy', 'firstName lastName email role profilePhotoUrl')
        .populate('targetClassIds', 'name')
        .populate('acknowledgedBy.userId', 'firstName lastName email role')
        .lean();

    if (!notice) throw ApiError.notFound('Notice circular not found');
    return notice;
};

export const createNotice = async (schoolId, data, authorUserId) => {
    const {
        title,
        content,
        category = 'ACADEMIC',
        priority = 'NORMAL',
        targetAudience = 'ALL',
        targetClassIds = [],
        attachments = [],
        expiresAt = null,
        isPinned = false,
        acknowledgmentRequired = false,
    } = data;

    if (!title || !title.trim()) {
        throw ApiError.badRequest('Notice title is required');
    }
    if (!content || !content.trim()) {
        throw ApiError.badRequest('Notice content is required');
    }

    let authorId = authorUserId;
    if (!authorId) {
        const adminUser = await User.findOne({ schoolId, role: { $in: ['SCHOOL_ADMIN', 'SUPER_ADMIN'] } });
        if (adminUser) authorId = adminUser._id;
    }

    const notice = await Notice.create({
        schoolId,
        title: title.trim(),
        content: content.trim(),
        category,
        priority,
        targetAudience,
        targetClassIds,
        attachments,
        expiresAt,
        isPinned: Boolean(isPinned),
        acknowledgmentRequired: Boolean(acknowledgmentRequired),
        publishedBy: authorId,
        publishedAt: new Date(),
        status: 'PUBLISHED',
    });

    const populated = await Notice.findById(notice._id)
        .populate('publishedBy', 'firstName lastName email role profilePhotoUrl')
        .populate('targetClassIds', 'name')
        .lean();

    eventBus.publish(DOMAIN_EVENTS.NOTICE_PUBLISHED, {
        schoolId,
        noticeId: notice._id,
        title: notice.title,
        priority: notice.priority,
        targetAudience: notice.targetAudience,
    });

    return populated;
};

export const updateNotice = async (schoolId, noticeId, updates) => {
    const notice = await Notice.findOne({ _id: noticeId, schoolId });
    if (!notice) throw ApiError.notFound('Notice not found');

    const allowedFields = [
        'title',
        'content',
        'category',
        'priority',
        'targetAudience',
        'targetClassIds',
        'attachments',
        'expiresAt',
        'isPinned',
        'acknowledgmentRequired',
        'status',
    ];

    allowedFields.forEach((field) => {
        if (updates[field] !== undefined) {
            notice[field] = updates[field];
        }
    });

    await notice.save();

    const populated = await Notice.findById(notice._id)
        .populate('publishedBy', 'firstName lastName email role profilePhotoUrl')
        .populate('targetClassIds', 'name')
        .lean();

    eventBus.publish(DOMAIN_EVENTS.NOTICE_UPDATED, {
        schoolId,
        noticeId: notice._id,
        title: notice.title,
    });

    return populated;
};

export const togglePinNotice = async (schoolId, noticeId) => {
    const notice = await Notice.findOne({ _id: noticeId, schoolId });
    if (!notice) throw ApiError.notFound('Notice not found');

    notice.isPinned = !notice.isPinned;
    await notice.save();

    return { noticeId, isPinned: notice.isPinned };
};

export const acknowledgeNotice = async (schoolId, noticeId, userId) => {
    const notice = await Notice.findOne({ _id: noticeId, schoolId });
    if (!notice) throw ApiError.notFound('Notice not found');

    const alreadyAck = notice.acknowledgedBy.some((a) => String(a.userId) === String(userId));
    if (!alreadyAck) {
        notice.acknowledgedBy.push({ userId, acknowledgedAt: new Date() });
        await notice.save();
    }

    return { message: 'Notice acknowledged successfully', count: notice.acknowledgedBy.length };
};

export const deleteNotice = async (schoolId, noticeId) => {
    const notice = await Notice.findOne({ _id: noticeId, schoolId });
    if (!notice) throw ApiError.notFound('Notice not found');

    await Notice.deleteOne({ _id: noticeId, schoolId });
    return { message: 'Notice circular deleted successfully' };
};
