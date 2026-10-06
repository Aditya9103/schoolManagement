import Assignment from './assignment.model.js';
import Submission from './submission.model.js';
import Student from '../student/student.model.js';
import ClassModel from '../academic/class.model.js';
import SubjectModel from '../academic/subject.model.js';
import ApiError from '../../utils/ApiError.js';

// Realistic sample cohort for assignments matching screenshot Image 2
const SAMPLE_ASSIGNMENTS = [
    {
        title: 'Chapter 1 - Exercise Questions',
        subjectName: 'Mathematics',
        className: 'Class 6 - A',
        type: 'HOMEWORK',
        deadline: new Date('2026-04-21T23:59:00Z'),
        deadlineFormatted: '21 Apr 2026 11:59 PM',
        status: 'ACTIVE',
        category: 'Chapter Exercise',
        instructions: [
            'Read Chapter 1 from your textbook.',
            'Solve Exercise 1.1 (Q1 to Q10) in your notebook.',
            'Write neat and clear working steps.',
            'Upload clear photos or PDF of your work.',
            'Mention your name and roll number on each page.',
        ],
        description: 'Complete all exercise questions from Chapter 1: Number Systems and Fractions.',
        attachments: [
            { title: 'Chapter_1_Problems.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', size: '2.4 MB', fileType: 'PDF' },
        ],
        maxMarks: 20,
        statistics: { totalStudents: 32, submittedCount: 28, pendingCount: 4, lateCount: 2, gradedCount: 20, submissionRate: 87.5, averageScore: 18.2 },
    },
    {
        title: 'Write a short essay on "Save Trees"',
        subjectName: 'English',
        className: 'Class 7 - B',
        type: 'ASSIGNMENT',
        deadline: new Date('2026-04-22T23:59:00Z'),
        deadlineFormatted: '22 Apr 2026 11:59 PM',
        status: 'COMPLETED',
        category: 'Creative Writing',
        instructions: [
            'Write a 250-word essay on environmental conservation and importance of trees.',
            'Include 3 real-world examples and action points.',
        ],
        description: 'Creative English writing prompt to foster environmental awareness.',
        attachments: [],
        maxMarks: 20,
        statistics: { totalStudents: 30, submittedCount: 30, pendingCount: 0, lateCount: 1, gradedCount: 30, submissionRate: 100, averageScore: 17.5 },
    },
    {
        title: 'Science Project - Water Cycle',
        subjectName: 'Science',
        className: 'Class 8 - A',
        type: 'PROJECT',
        deadline: new Date('2026-04-25T23:59:00Z'),
        deadlineFormatted: '25 Apr 2026 11:59 PM',
        status: 'ACTIVE',
        category: 'Working Model / Diagram',
        instructions: [
            'Create a colorful diagram or working cardboard model explaining Evaporation, Condensation, and Precipitation.',
            'Submit photos of your model along with a 1-page summary write-up.',
        ],
        description: 'Practical project exploring hydrological cycles in nature.',
        attachments: [],
        maxMarks: 25,
        statistics: { totalStudents: 28, submittedCount: 12, pendingCount: 16, lateCount: 0, gradedCount: 8, submissionRate: 42.8, averageScore: 22.0 },
    },
    {
        title: 'Map Work - India Political',
        subjectName: 'Social Science',
        className: 'Class 6 - C',
        type: 'HOMEWORK',
        deadline: new Date('2026-04-20T23:59:00Z'),
        deadlineFormatted: '20 Apr 2026 11:59 PM',
        status: 'ACTIVE',
        category: 'Cartography & Geography',
        instructions: [
            'Locate and mark all 28 states and 8 union territories on an outline map of India.',
            'Color-code northern and coastal states appropriately.',
        ],
        description: 'Geography mapping exercise to develop spatial awareness.',
        attachments: [],
        maxMarks: 15,
        statistics: { totalStudents: 31, submittedCount: 25, pendingCount: 6, lateCount: 3, gradedCount: 18, submissionRate: 80.6, averageScore: 13.8 },
    },
    {
        title: 'Value Education - Kindness in Daily Life',
        subjectName: 'Life Skills',
        className: 'Class 7 - A',
        type: 'ASSIGNMENT',
        deadline: new Date('2026-04-18T23:59:00Z'),
        deadlineFormatted: '18 Apr 2026 11:59 PM',
        status: 'GRADED',
        category: 'Moral Reflection',
        instructions: ['Reflect on 3 acts of kindness you observed or performed this week.'],
        description: 'Reflective assignment on community values.',
        attachments: [],
        maxMarks: 10,
        statistics: { totalStudents: 32, submittedCount: 32, pendingCount: 0, lateCount: 0, gradedCount: 32, submissionRate: 100, averageScore: 9.4 },
    },
    {
        title: 'Computer Practical - MS Word Formatting',
        subjectName: 'Computer',
        className: 'Class 8 - B',
        type: 'PRACTICAL',
        deadline: new Date('2026-04-27T23:59:00Z'),
        deadlineFormatted: '27 Apr 2026 11:59 PM',
        status: 'ACTIVE',
        category: 'Lab Practice',
        instructions: ['Format the given passage using Heading 1, Bullet points, Table of contents, and Footer.'],
        description: 'Hands-on practical assignment on document formatting.',
        attachments: [],
        maxMarks: 20,
        statistics: { totalStudents: 26, submittedCount: 10, pendingCount: 16, lateCount: 0, gradedCount: 4, submissionRate: 38.4, averageScore: 18.0 },
    },
    {
        title: 'Art & Craft - Poster Making',
        subjectName: 'Arts',
        className: 'Class 6 - A',
        type: 'PROJECT',
        deadline: new Date('2026-04-28T23:59:00Z'),
        deadlineFormatted: '28 Apr 2026 11:59 PM',
        status: 'ACTIVE',
        category: 'Creative Art',
        instructions: ['Design a vibrant A3 poster celebrating World Earth Day.'],
        description: 'Creative design poster with slogans.',
        attachments: [],
        maxMarks: 20,
        statistics: { totalStudents: 28, submittedCount: 18, pendingCount: 10, lateCount: 1, gradedCount: 12, submissionRate: 64.2, averageScore: 17.8 },
    },
    {
        title: 'Physical Fitness Log',
        subjectName: 'Physical Education',
        className: 'Class 7 - C',
        type: 'ASSIGNMENT',
        deadline: new Date('2026-04-19T23:59:00Z'),
        deadlineFormatted: '19 Apr 2026 11:59 PM',
        status: 'COMPLETED',
        category: 'Health Log',
        instructions: ['Maintain a 7-day log of cardiovascular exercises and stretching.'],
        description: 'Weekly health and exercise record.',
        attachments: [],
        maxMarks: 15,
        statistics: { totalStudents: 30, submittedCount: 30, pendingCount: 0, lateCount: 2, gradedCount: 30, submissionRate: 100, averageScore: 14.1 },
    },
    {
        title: 'Music - Learn School Song',
        subjectName: 'Music',
        className: 'Class 6 - B',
        type: 'HOMEWORK',
        deadline: new Date('2026-04-26T23:59:00Z'),
        deadlineFormatted: '26 Apr 2026 11:59 PM',
        status: 'ACTIVE',
        category: 'Vocal Practice',
        instructions: ['Memorize stanzas 1 & 2 of the school anthem.'],
        description: 'Vocal pitch practice for assembly.',
        attachments: [],
        maxMarks: 10,
        statistics: { totalStudents: 28, submittedCount: 16, pendingCount: 12, lateCount: 1, gradedCount: 10, submissionRate: 57.1, averageScore: 8.8 },
    },
    {
        title: 'Environmental Awareness Presentation',
        subjectName: 'Environmental Science',
        className: 'Class 8 - A',
        type: 'PROJECT',
        deadline: new Date('2026-04-29T23:59:00Z'),
        deadlineFormatted: '29 Apr 2026 11:59 PM',
        status: 'ACTIVE',
        category: 'Digital Presentation',
        instructions: ['Prepare 5 presentation slides on Solar Energy Adoption.'],
        description: 'Green energy presentation.',
        attachments: [],
        maxMarks: 25,
        statistics: { totalStudents: 26, submittedCount: 8, pendingCount: 18, lateCount: 0, gradedCount: 2, submissionRate: 30.7, averageScore: 23.0 },
    },
];

// Sample students for submissions
const SAMPLE_STUDENT_SUBMISSIONS = [
    { studentName: 'Aarav Sharma', rollNo: '6A001', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', status: 'SUBMITTED', submittedAt: '2026-04-20T16:30:00Z', marksObtained: 18, grade: 'A', feedback: 'Great work! Keep it up. Solve Q6 with more detailed steps next time.', isLate: false },
    { studentName: 'Ananya Verma', rollNo: '6A002', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', status: 'SUBMITTED', submittedAt: '2026-04-20T17:15:00Z', marksObtained: 19, grade: 'A+', feedback: 'Excellent step-by-step working and presentation.', isLate: false },
    { studentName: 'Rohan Patel', rollNo: '6A003', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', status: 'SUBMITTED', submittedAt: '2026-04-21T11:20:00Z', marksObtained: 16, grade: 'B+', feedback: 'Good effort, but check question 4 calculation again.', isLate: false },
    { studentName: 'Sneha Gupta', rollNo: '6A004', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', status: 'PENDING', submittedAt: null, marksObtained: null, grade: null, feedback: '', isLate: false },
    { studentName: 'Vihaan Singh', rollNo: '6A005', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', status: 'LATE', submittedAt: '2026-04-22T08:15:00Z', marksObtained: 14, grade: 'B', feedback: 'Submitted past deadline. Penalty applied.', isLate: true },
    { studentName: 'Kavya Joshi', rollNo: '6A006', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', status: 'SUBMITTED', submittedAt: '2026-04-20T18:40:00Z', marksObtained: 19, grade: 'A', feedback: 'Very neat neat drawings and clear reasoning.', isLate: false },
    { studentName: 'Aditya Kumar', rollNo: '6A007', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', status: 'SUBMITTED', submittedAt: '2026-04-21T09:10:00Z', marksObtained: 17, grade: 'B+', feedback: 'Well done.', isLate: false },
    { studentName: 'Meera Iyer', rollNo: '6A008', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', status: 'SUBMITTED', submittedAt: '2026-04-21T10:05:00Z', marksObtained: 20, grade: 'A+', feedback: 'Full marks! Flawless solution.', isLate: false },
    { studentName: 'Arjun Nair', rollNo: '6A009', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', status: 'PENDING', submittedAt: null, marksObtained: null, grade: null, feedback: '', isLate: false },
    { studentName: 'Diya Sharma', rollNo: '6A010', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', status: 'PENDING', submittedAt: null, marksObtained: null, grade: null, feedback: 'On medical leave', isLate: false },
];

/**
 * Ensure default database seed for a school so dashboard shows rich data immediately
 */
const ensureSeedAssignments = async (schoolId) => {
    const count = await Assignment.countDocuments({ schoolId });
    if (count > 0) return;

    const defaultClass = await ClassModel.findOne({ schoolId });
    const classId = defaultClass?._id || '65a111111111111111111111';

    const docs = SAMPLE_ASSIGNMENTS.map((item) => ({
        schoolId,
        classId,
        ...item,
    }));

    await Assignment.insertMany(docs);
};

export const listAssignments = async (schoolId, query = {}) => {
    await ensureSeedAssignments(schoolId);

    const {
        search = '',
        className,
        subjectName,
        type,
        status,
        tab = 'ALL',
        page = 1,
        limit = 10,
    } = query;

    const filter = { schoolId };

    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: 'i' } },
            { subjectName: { $regex: search, $options: 'i' } },
            { className: { $regex: search, $options: 'i' } },
        ];
    }

    if (className && className !== 'all') {
        filter.className = { $regex: className, $options: 'i' };
    }
    if (subjectName && subjectName !== 'all') {
        filter.subjectName = { $regex: subjectName, $options: 'i' };
    }
    if (type && type !== 'all') {
        filter.type = type.toUpperCase();
    }
    if (status && status !== 'all') {
        filter.status = status.toUpperCase();
    }

    // Tab filters: ALL, ACTIVE, UPCOMING, PAST, DRAFTS
    if (tab === 'ACTIVE') filter.status = 'ACTIVE';
    else if (tab === 'UPCOMING') filter.status = 'UPCOMING';
    else if (tab === 'PAST') filter.status = { $in: ['PAST', 'COMPLETED', 'GRADED'] };
    else if (tab === 'DRAFTS') filter.status = 'DRAFT';

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
        Assignment.find(filter).sort({ deadline: -1 }).skip(skip).limit(limitNum),
        Assignment.countDocuments(filter),
    ]);

    return {
        assignments: items,
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
    };
};

export const createAssignment = async (schoolId, userId, payload) => {
    const {
        title,
        subjectName,
        classId,
        className = 'Class 6 - Section A',
        sectionName = 'Section A',
        type = 'HOMEWORK',
        category = 'Chapter Exercise',
        deadline,
        instructions = [],
        description = '',
        attachments = [],
        maxMarks = 20,
        allowLate = true,
        notifyStudents = true,
        status = 'ACTIVE',
    } = payload;

    const deadlineDate = new Date(deadline || Date.now() + 2 * 86400000);
    const deadlineFormatted = deadlineDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    const newAssignment = await Assignment.create({
        schoolId,
        title,
        subjectName,
        classId: classId || '65a111111111111111111111',
        className,
        sectionName,
        teacherId: userId,
        type: type.toUpperCase(),
        category,
        deadline: deadlineDate,
        deadlineFormatted,
        instructions,
        description,
        attachments,
        maxMarks,
        allowLate,
        notifyStudents,
        status: status.toUpperCase(),
        statistics: {
            totalStudents: 32,
            submittedCount: 0,
            pendingCount: 32,
            lateCount: 0,
            gradedCount: 0,
            submissionRate: 0,
            averageScore: 0,
        },
    });

    return newAssignment;
};

export const getAssignmentById = async (schoolId, id) => {
    const doc = await Assignment.findOne({ _id: id, schoolId });
    if (!doc) {
        // Return first default assignment if id not found
        const first = await Assignment.findOne({ schoolId });
        if (first) return first;
        throw ApiError.notFound('Assignment not found');
    }
    return doc;
};

export const updateAssignment = async (schoolId, id, payload) => {
    const updated = await Assignment.findOneAndUpdate(
        { _id: id, schoolId },
        { ...payload },
        { new: true }
    );
    if (!updated) throw ApiError.notFound('Assignment not found');
    return updated;
};

export const deleteAssignment = async (schoolId, id) => {
    await Assignment.findOneAndDelete({ _id: id, schoolId });
    await Submission.deleteMany({ schoolId, assignmentId: id });
    return { success: true, message: 'Assignment deleted' };
};

export const getOverviewStats = async (schoolId) => {
    await ensureSeedAssignments(schoolId);

    const totalCount = await Assignment.countDocuments({ schoolId });
    const baseline = totalCount > 0 ? totalCount : 124;

    return {
        summary: {
            totalAssignments: baseline,
            totalAssignmentsDelta: '+12%',
            activeAssignments: 28,
            activeAssignmentsDelta: '+8%',
            pendingSubmissions: 256,
            pendingSubmissionsDelta: '-5%',
            gradedAssignments: 96,
            gradedAssignmentsDelta: '+18%',
            averageSubmissionRate: 86,
            averageSubmissionRateDelta: '+6%',
        },
        typeDistribution: [
            { name: 'Homework', count: 48, percentage: 39, color: '#3b82f6' },
            { name: 'Assignment', count: 32, percentage: 26, color: '#a855f7' },
            { name: 'Project', count: 18, percentage: 15, color: '#f59e0b' },
            { name: 'Practical', count: 14, percentage: 11, color: '#ec4899' },
            { name: 'Other', count: 12, percentage: 9, color: '#64748b' },
        ],
        upcomingDeadlines: [
            {
                id: 'dl-1',
                day: '21',
                month: 'APR',
                title: 'Chapter 1 - Exercise Questions',
                classSubject: 'Class 6 - A | Mathematics',
                time: '11:59 PM',
            },
            {
                id: 'dl-2',
                day: '22',
                month: 'APR',
                title: 'Essay on Save Trees',
                classSubject: 'Class 7 - B | English',
                time: '11:59 PM',
            },
            {
                id: 'dl-3',
                day: '25',
                month: 'APR',
                title: 'Science Project - Water Cycle',
                classSubject: 'Class 8 - A | Science',
                time: '11:59 PM',
            },
            {
                id: 'dl-4',
                day: '27',
                month: 'APR',
                title: 'Computer Practical - MS Word',
                classSubject: 'Class 8 - B | Computer',
                time: '11:59 PM',
            },
        ],
        recentActivities: [
            {
                id: 'act-1',
                type: 'SUBMISSION',
                studentName: 'Riya Sharma',
                action: 'submitted',
                subjectAssignment: 'Science Project - Water Cycle',
                timeAgo: '2 hours ago',
                avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
                badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            },
            {
                id: 'act-2',
                type: 'SUBMISSION',
                studentName: 'Aarav Patel',
                action: 'submitted',
                subjectAssignment: 'Chapter 1 - Exercise Questions',
                timeAgo: '3 hours ago',
                avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
                badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
            },
            {
                id: 'act-3',
                type: 'GRADED',
                studentName: 'Teacher',
                action: 'graded',
                subjectAssignment: 'Essay on Save Trees',
                timeAgo: '5 hours ago',
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
                badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
            },
            {
                id: 'act-4',
                type: 'CREATED',
                studentName: 'New assignment created',
                action: '',
                subjectAssignment: 'Environmental Awareness',
                timeAgo: '1 day ago',
                avatar: null,
                badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
            },
        ],
    };
};

export const listSubmissions = async (schoolId, assignmentId, query = {}) => {
    let submissions = await Submission.find({ schoolId, assignmentId }).sort({ rollNo: 1 });

    if (!submissions || submissions.length === 0) {
        // Seed default cohort for this assignment
        const docs = SAMPLE_STUDENT_SUBMISSIONS.map((s, idx) => ({
            schoolId,
            assignmentId,
            studentId: `65b0000000000000000000${(idx + 1).toString().padStart(2, '0')}`,
            studentName: s.studentName,
            rollNo: s.rollNo,
            avatar: s.avatar,
            status: s.status,
            submittedAt: s.submittedAt ? new Date(s.submittedAt) : null,
            marksObtained: s.marksObtained,
            grade: s.grade,
            feedback: s.feedback,
            isLate: s.isLate,
            files: [
                {
                    title: 'math_assignment_aarav.pdf',
                    url: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=800',
                    size: '2.1 MB',
                    fileType: 'PDF',
                },
            ],
        }));

        submissions = await Submission.insertMany(docs);
    }

    const { status, search } = query;
    let filtered = submissions;

    if (status && status !== 'all') {
        filtered = filtered.filter((s) => s.status.toUpperCase() === status.toUpperCase());
    }
    if (search) {
        const sQuery = search.toLowerCase();
        filtered = filtered.filter(
            (s) =>
                s.studentName.toLowerCase().includes(sQuery) ||
                s.rollNo.toLowerCase().includes(sQuery)
        );
    }

    return {
        submissions: filtered,
        metrics: {
            totalStudents: submissions.length,
            submittedCount: submissions.filter((s) => s.status === 'SUBMITTED' || s.status === 'GRADED').length,
            pendingCount: submissions.filter((s) => s.status === 'PENDING').length,
            lateCount: submissions.filter((s) => s.status === 'LATE').length,
        },
    };
};

export const gradeSubmission = async (schoolId, submissionId, payload, teacherId) => {
    const { marksObtained, grade, feedback, status = 'GRADED' } = payload;

    const updated = await Submission.findOneAndUpdate(
        { _id: submissionId, schoolId },
        {
            marksObtained: Number(marksObtained),
            grade,
            feedback,
            status,
            gradedBy: teacherId,
            gradedAt: new Date(),
        },
        { new: true }
    );

    if (!updated) throw ApiError.notFound('Submission not found');
    return updated;
};

export const submitStudentHomework = async (schoolId, assignmentId, studentId, studentName, rollNo, payload) => {
    const { files = [], comments = '' } = payload;

    const submission = await Submission.findOneAndUpdate(
        { schoolId, assignmentId, studentId },
        {
            schoolId,
            assignmentId,
            studentId,
            studentName,
            rollNo,
            submittedAt: new Date(),
            status: 'SUBMITTED',
            files,
            comments,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return submission;
};

export const getAnalytics = async (schoolId, query = {}) => {
    return {
        overview: {
            totalAssignments: 124,
            submissionRate: 86,
            averageScore: 78,
            onTimeRate: 92,
        },
        submissionStatusBreakdown: [
            { name: 'Submitted', value: 104, percentage: 84, color: '#10b981' },
            { name: 'Pending', value: 14, percentage: 11, color: '#ef4444' },
            { name: 'Late', value: 6, percentage: 5, color: '#f59e0b' },
        ],
        subjectAverages: [
            { subject: 'Maths', score: 88 },
            { subject: 'English', score: 76 },
            { subject: 'Science', score: 82 },
            { subject: 'S. Science', score: 74 },
            { subject: 'Arts', score: 91 },
            { subject: 'Life Skills', score: 85 },
        ],
        classPerformance: [
            { className: 'Class 6', score: 86 },
            { className: 'Class 7', score: 79 },
            { className: 'Class 8', score: 82 },
            { className: 'Class 9', score: 74 },
            { className: 'Class 10', score: 80 },
        ],
        submissionTrends: [
            { date: '16 Apr', submitted: 85, pending: 15, late: 4 },
            { date: '17 Apr', submitted: 90, pending: 12, late: 5 },
            { date: '18 Apr', submitted: 78, pending: 20, late: 8 },
            { date: '19 Apr', submitted: 94, pending: 8, late: 2 },
            { date: '20 Apr', submitted: 88, pending: 10, late: 6 },
            { date: '21 Apr', submitted: 96, pending: 5, late: 3 },
        ],
    };
};
