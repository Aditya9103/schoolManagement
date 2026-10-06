import mongoose from 'mongoose';
import User from '../auth/user.model.js';
import TeacherProfile from './models/teacherProfile.model.js';
import StaffProfile from './models/staffProfile.model.js';
import ParentProfile from './models/parentProfile.model.js';
import TeacherAssignment from './models/teacherAssignment.model.js';
import SubjectAssignment from './models/subjectAssignment.model.js';
import ParentStudentRelation from './models/parentStudentRelation.model.js';
import EmployeeAttendance from './models/employeeAttendance.model.js';
import StaffPayroll from './models/staffPayroll.model.js';
import PersonDocument from './models/personDocument.model.js';
import Class from '../academic/class.model.js';
import Section from '../academic/section.model.js';
import Subject from '../academic/subject.model.js';
import Student from '../student/student.model.js';
import Attendance from '../attendance/attendance.model.js';
import Assignment from '../homework/assignment.model.js';
import Timetable from '../academic/timetable.model.js';
import { eventBus, DOMAIN_EVENTS } from '../../events/eventBus.js';
import ApiError from '../../utils/ApiError.js';

// ============================================================================
// 1. SEEDING HELPERS (Ensures rich, realistic demo data on first load)
// ============================================================================

export const seedPeopleDemoData = async (schoolId) => {
    // 1. Seed Teachers if < 5
    const existingTeachersCount = await User.countDocuments({ schoolId, role: 'TEACHER' });
    if (existingTeachersCount < 5) {
        const demoTeachers = [
            {
                firstName: 'Priya', lastName: 'Sharma', email: `priya.sharma.${String(schoolId).slice(-4)}@school.com`,
                phone: '+91 98765 43210', employeeId: 'TCH001', department: 'Mathematics', designation: 'Mathematics Teacher',
                qualification: 'M.Sc. Mathematics, B.Ed.', experienceYears: 4, gender: 'FEMALE',
                profilePhotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
                specialization: ['Calculus', 'Algebra', 'Geometry']
            },
            {
                firstName: 'Amit', lastName: 'Kumar', email: `amit.kumar.${String(schoolId).slice(-4)}@school.com`,
                phone: '+91 98765 43211', employeeId: 'TCH002', department: 'Science', designation: 'Physics Faculty',
                qualification: 'M.Sc. Physics', experienceYears: 6, gender: 'MALE',
                profilePhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                specialization: ['Mechanics', 'Thermodynamics']
            },
            {
                firstName: 'Neha', lastName: 'Verma', email: `neha.verma.${String(schoolId).slice(-4)}@school.com`,
                phone: '+91 98765 43212', employeeId: 'TCH003', department: 'English', designation: 'English Literature Faculty',
                qualification: 'M.A. English Literature', experienceYears: 5, gender: 'FEMALE',
                profilePhotoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
                specialization: ['Creative Writing', 'Grammar']
            },
            {
                firstName: 'Rajesh', lastName: 'Singh', email: `rajesh.singh.${String(schoolId).slice(-4)}@school.com`,
                phone: '+91 98765 43213', employeeId: 'TCH004', department: 'Social Science', designation: 'History & Civics Teacher',
                qualification: 'M.A. History, B.Ed.', experienceYears: 8, gender: 'MALE',
                profilePhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
                specialization: ['World History', 'Political Science']
            },
            {
                firstName: 'Sunita', lastName: 'Patel', email: `sunita.patel.${String(schoolId).slice(-4)}@school.com`,
                phone: '+91 98765 43214', employeeId: 'TCH005', department: 'Hindi', designation: 'Hindi & Sanskrit Teacher',
                qualification: 'M.A. Hindi Literature', experienceYears: 7, gender: 'FEMALE',
                profilePhotoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
                specialization: ['Sanskrit', 'Classical Poetry'],
                status: 'ON_LEAVE'
            },
            {
                firstName: 'Vikram', lastName: 'Mehta', email: `vikram.mehta.${String(schoolId).slice(-4)}@school.com`,
                phone: '+91 98765 43215', employeeId: 'TCH006', department: 'Computer', designation: 'Computer Science Faculty',
                qualification: 'MCA, B.Tech', experienceYears: 3, gender: 'MALE',
                profilePhotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
                specialization: ['Python', 'Web Development', 'Robotics']
            },
            {
                firstName: 'Anjali', lastName: 'Gupta', email: `anjali.gupta.${String(schoolId).slice(-4)}@school.com`,
                phone: '+91 98765 43216', employeeId: 'TCH007', department: 'Physical Education', designation: 'Sports Director',
                qualification: 'B.P.Ed, M.P.Ed', experienceYears: 5, gender: 'FEMALE',
                profilePhotoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80',
                specialization: ['Athletics', 'Basketball', 'Yoga']
            }
        ];

        for (const t of demoTeachers) {
            let u = await User.findOne({ email: t.email });
            if (!u) {
                u = await User.create({
                    schoolId,
                    firstName: t.firstName,
                    lastName: t.lastName,
                    email: t.email,
                    phone: t.phone,
                    role: 'TEACHER',
                    gender: t.gender,
                    profilePhotoUrl: t.profilePhotoUrl,
                    isActive: t.status !== 'ON_LEAVE',
                    passwordHash: 'dummy-hashed-pwd'
                });
            }

            const tpExists = await TeacherProfile.findOne({ schoolId, userId: u._id });
            if (!tpExists) {
                await TeacherProfile.create({
                    schoolId,
                    userId: u._id,
                    employeeId: t.employeeId,
                    department: t.department,
                    designation: t.designation,
                    qualification: t.qualification,
                    experienceYears: t.experienceYears,
                    specialization: t.specialization,
                    status: t.status || 'ACTIVE',
                    workSchedule: {
                        workingHours: '8:00 AM - 3:30 PM',
                        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
                    }
                });
            }
        }
    }

    // 2. Seed Non-Teaching Staff if < 4
    const existingStaffCount = await StaffProfile.countDocuments({ schoolId });
    if (existingStaffCount < 4) {
        const demoStaff = [
            {
                firstName: 'Suresh', lastName: 'Kumar', email: `suresh.kumar.${String(schoolId).slice(-4)}@school.com`,
                phone: '+91 98765 43210', employeeId: 'STF001', department: 'Administration', designation: 'Accountant',
                role: 'ACCOUNTANT', qualification: 'B.Com', experienceYears: 5, salary: 35000, gender: 'MALE',
                profilePhotoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
                tasks: ['Manage fee records', 'Generate financial reports', 'Handle expense approvals', 'Maintain accounts & invoices']
            },
            {
                firstName: 'Manoj', lastName: 'Singh', email: `manoj.singh.${String(schoolId).slice(-4)}@school.com`,
                phone: '+91 98765 43211', employeeId: 'STF002', department: 'Library', designation: 'Librarian',
                role: 'LIBRARIAN', qualification: 'M.Lib', experienceYears: 4, salary: 28000, gender: 'MALE',
                profilePhotoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
                tasks: ['Catalogue new arrivals', 'Issue and return books', 'Maintain digital library catalog', 'Manage book fines']
            },
            {
                firstName: 'Ravi', lastName: 'Patel', email: `ravi.patel.${String(schoolId).slice(-4)}@school.com`,
                phone: '+91 98765 43212', employeeId: 'STF003', department: 'Science Lab', designation: 'Lab Assistant',
                role: 'FRONT_OFFICE', qualification: 'B.Sc. Chemistry', experienceYears: 3, salary: 22000, gender: 'MALE',
                profilePhotoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
                tasks: ['Prepare lab apparatus', 'Chemical inventory stock check', 'Ensure student safety protocols']
            },
            {
                firstName: 'Pooja', lastName: 'Verma', email: `pooja.verma.${String(schoolId).slice(-4)}@school.com`,
                phone: '+91 98765 43213', employeeId: 'STF004', department: 'Administration', designation: 'Receptionist',
                role: 'FRONT_OFFICE', qualification: 'B.A.', experienceYears: 2, salary: 20000, gender: 'FEMALE',
                profilePhotoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
                tasks: ['Welcome visitors', 'Answer incoming phone calls', 'Issue visitor gate passes', 'Assist admissions inquiries']
            },
            {
                firstName: 'Deepak', lastName: 'Yadav', email: `deepak.yadav.${String(schoolId).slice(-4)}@school.com`,
                phone: '+91 98765 43214', employeeId: 'STF005', department: 'Security', designation: 'Security Guard',
                role: 'FRONT_OFFICE', qualification: 'High School', experienceYears: 6, salary: 18000, gender: 'MALE',
                profilePhotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
                tasks: ['Main gate monitoring', 'Night patrol check', 'Verify student gate pass on departure']
            },
            {
                firstName: 'Kavita', lastName: 'Singh', email: `kavita.nurse.${String(schoolId).slice(-4)}@school.com`,
                phone: '+91 98765 43215', employeeId: 'STF006', department: 'Medical', designation: 'School Nurse',
                role: 'FRONT_OFFICE', qualification: 'B.Sc. Nursing', experienceYears: 7, salary: 26000, gender: 'FEMALE',
                profilePhotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
                tasks: ['Administer first aid', 'Maintain student health records', 'Emergency medical escalation'],
                status: 'ON_LEAVE'
            },
            {
                firstName: 'Arjun', lastName: 'Kumar', email: `arjun.transport.${String(schoolId).slice(-4)}@school.com`,
                phone: '+91 98765 43216', employeeId: 'STF007', department: 'Transport', designation: 'Transport Incharge',
                role: 'DRIVER', qualification: 'Diploma in Logistics', experienceYears: 8, salary: 30000, gender: 'MALE',
                profilePhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
                tasks: ['Bus route scheduling', 'Driver attendance check', 'Vehicle maintenance logs', 'GPS tracker verification']
            }
        ];

        for (const s of demoStaff) {
            let u = await User.findOne({ email: s.email });
            if (!u) {
                u = await User.create({
                    schoolId,
                    firstName: s.firstName,
                    lastName: s.lastName,
                    email: s.email,
                    phone: s.phone,
                    role: s.role,
                    gender: s.gender,
                    profilePhotoUrl: s.profilePhotoUrl,
                    isActive: s.status !== 'ON_LEAVE',
                    passwordHash: 'dummy-hashed-pwd'
                });
            }

            const spExists = await StaffProfile.findOne({ schoolId, userId: u._id });
            if (!spExists) {
                await StaffProfile.create({
                    schoolId,
                    userId: u._id,
                    employeeId: s.employeeId,
                    department: s.department,
                    designation: s.designation,
                    qualification: s.qualification,
                    experienceYears: s.experienceYears,
                    status: s.status || 'ACTIVE',
                    assignedTasks: s.tasks.map(t => ({ taskTitle: t, frequency: 'DAILY', isCompleted: false }))
                });

                // Create isolated payroll
                await StaffPayroll.create({
                    schoolId,
                    staffId: u._id,
                    bankDetails: {
                        accountHolderName: `${s.firstName} ${s.lastName}`,
                        bankName: 'HDFC Bank',
                        accountNumber: `9876543210${String(s.employeeId).slice(-2)}`,
                        ifscCode: 'HDFC0001234'
                    },
                    salaryStructure: {
                        basicSalary: Math.round(s.salary * 0.6),
                        hra: Math.round(s.salary * 0.25),
                        specialAllowance: Math.round(s.salary * 0.15),
                        pfDeduction: 1800,
                        netMonthlySalary: s.salary
                    }
                });
            }
        }
    }

    // 3. Seed Parents if < 4
    const existingParentsCount = await ParentProfile.countDocuments({ schoolId });
    if (existingParentsCount < 4) {
        // Link to existing students if available
        const sampleStudents = await Student.find({ schoolId }).limit(6).lean();

        const demoParents = [
            {
                parentId: 'PAR001', fullName: 'Rajesh Kumar', relationship: 'FATHER', title: 'Mr.',
                phone: '+91 98765 43210', email: 'rajesh.kumar@gmail.com', occupation: 'Business Owner',
                employer: 'Kumar Logistics Pvt Ltd', address: { street: '12-A Civil Lines', city: 'Noida', state: 'Uttar Pradesh', pincode: '201301' }
            },
            {
                parentId: 'PAR002', fullName: 'Neha Singh', relationship: 'MOTHER', title: 'Mrs.',
                phone: '+91 98765 43211', email: 'neha.singh@gmail.com', occupation: 'Software Architect',
                employer: 'TechCorp India', address: { street: 'Flat 402, Sunshine Heights', city: 'Noida', state: 'Uttar Pradesh', pincode: '201301' }
            },
            {
                parentId: 'PAR003', fullName: 'Vikram Patel', relationship: 'FATHER', title: 'Mr.',
                phone: '+91 98765 43212', email: 'vikram.patel@gmail.com', occupation: 'Chartered Accountant',
                employer: 'Patel & Associates', address: { street: 'Plot 45, Sector 62', city: 'Noida', state: 'Uttar Pradesh', pincode: '201301' }
            },
            {
                parentId: 'PAR004', fullName: 'Sunita Gupta', relationship: 'MOTHER', title: 'Mrs.',
                phone: '+91 98765 43213', email: 'sunita.gupta@gmail.com', occupation: 'Doctor / Pediatrician',
                employer: 'Max Healthcare', address: { street: 'Villa 18, Palm Meadows', city: 'Greater Noida', state: 'Uttar Pradesh', pincode: '201308' }
            },
            {
                parentId: 'PAR005', fullName: 'Amit Verma', relationship: 'FATHER', title: 'Mr.',
                phone: '+91 98765 43214', email: 'amit.verma@gmail.com', occupation: 'Civil Engineer',
                employer: 'L&T Construction', address: { street: 'C-24, Sector 15', city: 'Noida', state: 'Uttar Pradesh', pincode: '201301' }
            }
        ];

        for (let i = 0; i < demoParents.length; i++) {
            const p = demoParents[i];
            let parentDoc = await ParentProfile.findOne({ schoolId, parentId: p.parentId });
            if (!parentDoc) {
                parentDoc = await ParentProfile.create({
                    schoolId,
                    parentId: p.parentId,
                    title: p.title,
                    fullName: p.fullName,
                    phone: p.phone,
                    email: p.email,
                    occupation: p.occupation,
                    employer: p.employer,
                    address: p.address,
                    status: 'ACTIVE'
                });
            }

            // Link to a sample student if exists
            if (sampleStudents[i]) {
                const relExists = await ParentStudentRelation.findOne({
                    schoolId,
                    parentId: parentDoc._id,
                    studentId: sampleStudents[i]._id
                });
                if (!relExists) {
                    await ParentStudentRelation.create({
                        schoolId,
                        parentId: parentDoc._id,
                        studentId: sampleStudents[i]._id,
                        relationship: p.relationship,
                        isPrimaryContact: true
                    });
                }
            }
        }
    }
};

// ============================================================================
// 2. TEACHERS SERVICE
// ============================================================================

export const getTeachers = async (schoolId, query = {}, scopeFilter = {}) => {
    await seedPeopleDemoData(schoolId);

    const {
        page = 1,
        limit = 10,
        search = '',
        department = '',
        status = '',
        subject = '',
    } = query;

    const skip = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);

    // Build matching criteria
    const userMatch = { schoolId, role: 'TEACHER', ...scopeFilter };

    if (status) {
        if (status === 'ACTIVE') userMatch.isActive = true;
        if (status === 'ON_LEAVE' || status === 'INACTIVE') userMatch.isActive = false;
    }

    if (search && search.trim()) {
        const rgx = new RegExp(search.trim(), 'i');
        userMatch.$or = [
            { firstName: rgx },
            { lastName: rgx },
            { email: rgx },
            { phone: rgx }
        ];
    }

    // Fetch teachers
    const users = await User.find(userMatch)
        .select('_id firstName lastName email phone profilePhotoUrl gender isActive createdAt')
        .sort({ firstName: 1 })
        .lean();

    const userIds = users.map(u => u._id);

    // Fetch Profiles
    const profiles = await TeacherProfile.find({
        schoolId,
        userId: { $in: userIds }
    }).lean();

    const profileMap = new Map();
    profiles.forEach(p => profileMap.set(String(p.userId), p));

    // Fetch Class Teacher Assignments
    const classAssignments = await TeacherAssignment.find({
        schoolId,
        teacherId: { $in: userIds },
        status: 'ACTIVE'
    })
        .populate('classId', 'name')
        .populate('sectionId', 'name')
        .lean();

    const classMap = new Map();
    classAssignments.forEach(a => {
        const tid = String(a.teacherId);
        if (!classMap.has(tid)) classMap.set(tid, []);
        const cName = a.classId?.name || 'Class';
        const sName = a.sectionId?.name || '';
        classMap.get(tid).push(`${cName}-${sName}`);
    });

    // Fetch Subject Assignments
    const subjectAssignments = await SubjectAssignment.find({
        schoolId,
        teacherId: { $in: userIds },
        status: 'ACTIVE'
    })
        .populate('subjectId', 'name code')
        .populate('classId', 'name')
        .lean();

    const subjectMap = new Map();
    subjectAssignments.forEach(s => {
        const tid = String(s.teacherId);
        if (!subjectMap.has(tid)) subjectMap.set(tid, []);
        const subName = s.subjectId?.name || 'Subject';
        if (!subjectMap.get(tid).includes(subName)) {
            subjectMap.get(tid).push(subName);
        }
    });

    // Merge and filter by department or subject if specified
    let combined = users.map((u, idx) => {
        const prof = profileMap.get(String(u._id)) || {};
        const classes = classMap.get(String(u._id)) || ['Class 6-10'];
        const subjects = subjectMap.get(String(u._id)) || [prof.department || 'General'];

        return {
            id: u._id,
            _id: u._id,
            name: `${u.firstName} ${u.lastName}`,
            firstName: u.firstName,
            lastName: u.lastName,
            email: u.email,
            phone: u.phone || '+91 98765 43210',
            avatar: u.profilePhotoUrl,
            employeeId: prof.employeeId || `TCH00${idx + 1}`,
            department: prof.department || 'Mathematics',
            designation: prof.designation || 'Teacher',
            qualification: prof.qualification || 'B.Sc., B.Ed.',
            experience: `${prof.experienceYears || 4}+ Years`,
            experienceYears: prof.experienceYears || 4,
            status: prof.status === 'ON_LEAVE' || !u.isActive ? 'On Leave' : 'Active',
            classes: classes.join(', '),
            classesList: classes,
            subjects: subjects.join(', '),
            subjectsList: subjects,
            rating: prof.metrics?.feedbackRating || 4.8,
            attendanceRate: prof.metrics?.attendanceRate || 96,
            passRate: prof.metrics?.studentPassRate || 92,
            joiningDate: prof.joiningDate || u.createdAt
        };
    });

    if (department && department !== 'All') {
        combined = combined.filter(t => t.department.toLowerCase() === department.toLowerCase());
    }

    if (subject && subject !== 'All') {
        combined = combined.filter(t => t.subjects.toLowerCase().includes(subject.toLowerCase()));
    }

    // KPI Summary Calculations
    const allProfiles = await TeacherProfile.find({ schoolId }).lean();
    const totalTeachers = users.length;
    const activeTeachers = combined.filter(t => t.status === 'Active').length;
    const onLeaveTeachers = combined.filter(t => t.status === 'On Leave').length;
    const uniqueDepartments = new Set(allProfiles.map(p => p.department).filter(Boolean));

    const total = combined.length;
    const paginated = combined.slice(skip, skip + parseInt(limit));

    return {
        teachers: paginated,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages: Math.ceil(total / parseInt(limit)) || 1
        },
        kpis: {
            totalTeachers,
            activeTeachers,
            onLeaveTeachers,
            subjectExperts: Math.round(totalTeachers * 0.25),
            departmentsCount: uniqueDepartments.size
        }
    };
};

export const getTeacherById = async (schoolId, teacherId) => {
    const user = await User.findOne({ _id: teacherId, schoolId }).lean();
    if (!user) throw ApiError.notFound('Teacher not found');

    const profile = await TeacherProfile.findOne({ schoolId, userId: teacherId }).lean() || {};

    const classAssignments = await TeacherAssignment.find({ schoolId, teacherId, status: 'ACTIVE' })
        .populate('classId', 'name')
        .populate('sectionId', 'name roomNumber')
        .lean();

    const subjectAssignments = await SubjectAssignment.find({ schoolId, teacherId, status: 'ACTIVE' })
        .populate('subjectId', 'name code category color')
        .populate('classId', 'name')
        .populate('sectionId', 'name')
        .lean();

    // Compile timetable periods if exists
    const timetables = await Timetable.find({ schoolId, 'slots.teacherId': teacherId })
        .populate('classId', 'name')
        .populate('sectionId', 'name')
        .lean();

    const scheduleSlots = [];
    timetables.forEach(tt => {
        tt.slots?.forEach(slot => {
            if (String(slot.teacherId) === String(teacherId)) {
                scheduleSlots.push({
                    day: slot.day,
                    periodNumber: slot.periodNumber,
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    subjectName: slot.subjectName,
                    className: `${tt.classId?.name || ''} - ${tt.sectionId?.name || ''}`,
                    roomNumber: slot.roomNumber || tt.sectionId?.roomNumber || 'Room 101',
                    color: slot.color || '#3B82F6'
                });
            }
        });
    });

    return {
        user,
        profile,
        classAssignments,
        subjectAssignments,
        scheduleSlots,
        metrics: profile.metrics || { feedbackRating: 4.8, attendanceRate: 96, studentPassRate: 92, reviewCount: 120 }
    };
};

export const createTeacher = async (schoolId, data, currentUserId) => {
    const {
        firstName, lastName, email, phone, employeeId, department, designation,
        qualification, experienceYears, specialization, gender, address
    } = data;

    if (!firstName || !lastName || !email) {
        throw ApiError.badRequest('First name, last name, and email are required');
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
        throw ApiError.conflict('A user with this email already exists.');
    }

    const user = await User.create({
        schoolId,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        phone: phone || null,
        role: 'TEACHER',
        gender: gender || 'MALE',
        isActive: true,
        passwordHash: 'default-dummy-hash'
    });

    const profile = await TeacherProfile.create({
        schoolId,
        userId: user._id,
        employeeId: employeeId || `TCH0${Date.now().toString().slice(-3)}`,
        department: department || 'General',
        designation: designation || 'Teacher',
        qualification: qualification || '',
        experienceYears: Number(experienceYears) || 0,
        specialization: specialization ? (Array.isArray(specialization) ? specialization : [specialization]) : [],
        address: address || {}
    });

    eventBus.emit(DOMAIN_EVENTS.TEACHER_UPDATED, { schoolId, teacherId: user._id });
    return { user, profile };
};

export const updateTeacher = async (schoolId, teacherId, updates) => {
    const user = await User.findOne({ _id: teacherId, schoolId });
    if (!user) throw ApiError.notFound('Teacher not found');

    const profile = await TeacherProfile.findOne({ schoolId, userId: teacherId });

    if (updates.firstName !== undefined) user.firstName = updates.firstName.trim();
    if (updates.lastName !== undefined) user.lastName = updates.lastName.trim();
    if (updates.phone !== undefined) user.phone = updates.phone;
    if (updates.gender !== undefined) user.gender = updates.gender;
    if (updates.profilePhotoUrl !== undefined) user.profilePhotoUrl = updates.profilePhotoUrl;
    if (updates.status !== undefined) {
        user.isActive = updates.status !== 'ON_LEAVE' && updates.status !== 'INACTIVE';
    } else if (updates.isActive !== undefined) {
        user.isActive = Boolean(updates.isActive);
    }
    await user.save();

    if (profile) {
        if (updates.employeeId !== undefined) profile.employeeId = updates.employeeId;
        if (updates.department !== undefined) profile.department = updates.department;
        if (updates.designation !== undefined) profile.designation = updates.designation;
        if (updates.qualification !== undefined) profile.qualification = updates.qualification;
        if (updates.experienceYears !== undefined) profile.experienceYears = Number(updates.experienceYears) || 0;
        if (updates.specialization !== undefined) {
            profile.specialization = Array.isArray(updates.specialization) ? updates.specialization : [updates.specialization];
        }
        if (updates.status !== undefined) profile.status = updates.status;
        if (updates.joiningDate !== undefined) profile.joiningDate = updates.joiningDate;
        if (updates.address) profile.address = { ...profile.address, ...updates.address };
        await profile.save();
    }

    eventBus.emit(DOMAIN_EVENTS.TEACHER_UPDATED, { schoolId, teacherId });
    return { user, profile };
};

export const deleteTeacher = async (schoolId, teacherId) => {
    const user = await User.findOne({ _id: teacherId, schoolId });
    if (!user) throw ApiError.notFound('Teacher not found');

    user.isActive = false;
    await user.save();

    await TeacherProfile.updateOne({ schoolId, userId: teacherId }, { $set: { status: 'INACTIVE' } });
    await TeacherAssignment.updateMany({ schoolId, teacherId }, { $set: { status: 'COMPLETED' } });
    await SubjectAssignment.updateMany({ schoolId, teacherId }, { $set: { status: 'INACTIVE' } });

    eventBus.emit(DOMAIN_EVENTS.TEACHER_UPDATED, { schoolId, teacherId });
    return { message: 'Teacher deactivated successfully' };
};

export const assignTeacherClass = async (schoolId, teacherId, data) => {
    const { classId, sectionId, academicYear = '2026-27', assignmentType = 'CLASS_TEACHER' } = data;
    if (!classId || !sectionId) throw ApiError.badRequest('Class ID and Section ID are required');

    const teacher = await User.findOne({ _id: teacherId, schoolId, role: 'TEACHER' });
    if (!teacher) throw ApiError.notFound('Teacher not found');

    const assignment = await TeacherAssignment.findOneAndUpdate(
        { schoolId, teacherId, classId, sectionId },
        {
            $set: {
                academicYear,
                assignmentType,
                status: 'ACTIVE',
                startDate: new Date()
            }
        },
        { upsert: true, new: true }
    ).populate('classId', 'name').populate('sectionId', 'name');

    eventBus.emit(DOMAIN_EVENTS.TEACHER_UPDATED, { schoolId, teacherId });
    return assignment;
};

export const assignTeacherSubject = async (schoolId, teacherId, data) => {
    const { subjectId, classId, sectionId, periodsPerWeek = 5, academicYear = '2026-27' } = data;
    if (!subjectId || !classId || !sectionId) throw ApiError.badRequest('Subject, Class, and Section are required');

    const teacher = await User.findOne({ _id: teacherId, schoolId, role: 'TEACHER' });
    if (!teacher) throw ApiError.notFound('Teacher not found');

    const assignment = await SubjectAssignment.findOneAndUpdate(
        { schoolId, teacherId, subjectId, classId, sectionId },
        {
            $set: {
                academicYear,
                periodsPerWeek: Number(periodsPerWeek) || 5,
                status: 'ACTIVE'
            }
        },
        { upsert: true, new: true }
    ).populate('subjectId', 'name code').populate('classId', 'name').populate('sectionId', 'name');

    eventBus.emit(DOMAIN_EVENTS.TEACHER_UPDATED, { schoolId, teacherId });
    return assignment;
};

export const removeTeacherAssignment = async (schoolId, teacherId, assignmentId, type = 'class') => {
    if (type === 'subject') {
        await SubjectAssignment.deleteOne({ _id: assignmentId, schoolId, teacherId });
    } else {
        await TeacherAssignment.deleteOne({ _id: assignmentId, schoolId, teacherId });
    }
    eventBus.emit(DOMAIN_EVENTS.TEACHER_UPDATED, { schoolId, teacherId });
    return { message: 'Assignment removed successfully' };
};

// ============================================================================
// 3. STAFF SERVICE
// ============================================================================

export const getStaffList = async (schoolId, query = {}, scopeFilter = {}) => {
    await seedPeopleDemoData(schoolId);

    const {
        page = 1,
        limit = 10,
        search = '',
        department = '',
        role = '',
        status = ''
    } = query;

    const skip = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);

    const staffMatch = {
        schoolId,
        role: { $in: ['ACCOUNTANT', 'LIBRARIAN', 'FRONT_OFFICE', 'DRIVER', 'STAFF'] },
        ...scopeFilter
    };

    if (status) {
        if (status === 'ACTIVE') staffMatch.isActive = true;
        if (status === 'ON_LEAVE' || status === 'INACTIVE') staffMatch.isActive = false;
    }

    if (search && search.trim()) {
        const rgx = new RegExp(search.trim(), 'i');
        staffMatch.$or = [{ firstName: rgx }, { lastName: rgx }, { email: rgx }, { phone: rgx }];
    }

    const users = await User.find(staffMatch)
        .select('_id firstName lastName email phone profilePhotoUrl gender isActive role createdAt')
        .sort({ firstName: 1 })
        .lean();

    const userIds = users.map(u => u._id);
    const profiles = await StaffProfile.find({ schoolId, userId: { $in: userIds } }).lean();
    const profileMap = new Map();
    profiles.forEach(p => profileMap.set(String(p.userId), p));

    let combined = users.map((u, idx) => {
        const prof = profileMap.get(String(u._id)) || {};
        return {
            id: u._id,
            _id: u._id,
            name: `${u.firstName} ${u.lastName}`,
            firstName: u.firstName,
            lastName: u.lastName,
            email: u.email,
            phone: u.phone || '—',
            avatar: u.profilePhotoUrl,
            employeeId: prof.employeeId || `STF00${idx + 1}`,
            role: prof.designation || u.role.replace(/_/g, ' '),
            department: prof.department || 'Administration',
            status: prof.status === 'ON_LEAVE' || !u.isActive ? 'On Leave' : 'Active',
            joiningDate: prof.joiningDate || u.createdAt,
            qualification: prof.qualification || '—',
            tasksCount: prof.assignedTasks?.length || 0
        };
    });

    if (department && department !== 'All') {
        combined = combined.filter(s => s.department.toLowerCase() === department.toLowerCase());
    }

    if (role && role !== 'All') {
        combined = combined.filter(s => s.role.toLowerCase().includes(role.toLowerCase()));
    }

    const total = combined.length;
    const paginated = combined.slice(skip, skip + parseInt(limit));
    const allProfiles = await StaffProfile.find({ schoolId }).lean();
    const uniqueDepts = new Set(allProfiles.map(p => p.department).filter(Boolean));

    return {
        staff: paginated,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages: Math.ceil(total / parseInt(limit)) || 1
        },
        kpis: {
            totalStaff: total,
            activeStaff: combined.filter(s => s.status === 'Active').length,
            onLeaveStaff: combined.filter(s => s.status === 'On Leave').length,
            departmentsCount: uniqueDepts.size
        }
    };
};

export const getStaffById = async (schoolId, staffId) => {
    const user = await User.findOne({ _id: staffId, schoolId }).lean();
    if (!user) throw ApiError.notFound('Staff member not found');

    const profile = await StaffProfile.findOne({ schoolId, userId: staffId }).lean() || {};

    return {
        user,
        profile,
        assignedTasks: profile.assignedTasks || [
            { taskTitle: 'Manage fee records', frequency: 'DAILY', isCompleted: true },
            { taskTitle: 'Generate financial reports', frequency: 'DAILY', isCompleted: true },
            { taskTitle: 'Handle expense approvals', frequency: 'WEEKLY', isCompleted: false },
            { taskTitle: 'Maintain accounts & invoices', frequency: 'DAILY', isCompleted: false }
        ]
    };
};

export const getStaffPayroll = async (schoolId, staffId) => {
    let payroll = await StaffPayroll.findOne({ schoolId, staffId }).lean();
    if (!payroll) {
        payroll = await StaffPayroll.create({
            schoolId,
            staffId,
            bankDetails: {
                accountHolderName: 'Employee',
                bankName: 'HDFC Bank',
                accountNumber: '987654321000',
                ifscCode: 'HDFC0001234'
            },
            salaryStructure: {
                basicSalary: 21000,
                hra: 8750,
                specialAllowance: 5250,
                pfDeduction: 1800,
                taxDeduction: 0,
                netMonthlySalary: 35000
            }
        });
    }
    return payroll;
};

export const createStaff = async (schoolId, data, currentUserId) => {
    const {
        firstName, lastName, email, phone, employeeId, department, designation,
        qualification, experienceYears, gender, shiftTiming, monthlySalary
    } = data;

    if (!firstName || !lastName || !email) {
        throw ApiError.badRequest('First name, last name, and email are required');
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
        throw ApiError.conflict('A user with this email already exists.');
    }

    // Map designation to system role if possible, else default to 'STAFF'
    let assignedRole = 'STAFF';
    const desLower = (designation || '').toLowerCase();
    if (desLower.includes('account')) assignedRole = 'ACCOUNTANT';
    else if (desLower.includes('librar')) assignedRole = 'LIBRARIAN';
    else if (desLower.includes('front') || desLower.includes('reception')) assignedRole = 'FRONT_OFFICE';
    else if (desLower.includes('driver')) assignedRole = 'DRIVER';

    const user = await User.create({
        schoolId,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        phone: phone || null,
        role: assignedRole,
        gender: gender || 'MALE',
        isActive: true,
        passwordHash: 'default-dummy-hash'
    });

    const empId = employeeId || `STF0${Date.now().toString().slice(-3)}`;

    const profile = await StaffProfile.create({
        schoolId,
        userId: user._id,
        employeeId: empId,
        department: department || 'Administration',
        designation: designation || 'Staff Member',
        qualification: qualification || '',
        experienceYears: Number(experienceYears) || 0,
        shiftTiming: shiftTiming || '9:00 AM - 5:00 PM',
        assignedTasks: [
            { taskTitle: 'Daily operational tasks', frequency: 'DAILY', isCompleted: false }
        ]
    });

    // Create isolated payroll record if salary provided
    if (monthlySalary) {
        const salaryNum = Number(monthlySalary) || 30000;
        await StaffPayroll.create({
            schoolId,
            staffId: user._id,
            bankDetails: {
                accountHolderName: `${firstName} ${lastName}`,
                bankName: 'HDFC Bank',
                accountNumber: `9876543210${String(empId).slice(-2)}`,
                ifscCode: 'HDFC0001234'
            },
            salaryStructure: {
                basicSalary: Math.round(salaryNum * 0.6),
                hra: Math.round(salaryNum * 0.25),
                specialAllowance: Math.round(salaryNum * 0.15),
                pfDeduction: 1800,
                taxDeduction: 0,
                netMonthlySalary: salaryNum
            }
        });
    }

    return { user, profile };
};

// ============================================================================
// 4. EMPLOYEE ATTENDANCE SERVICE
// ============================================================================

export const getEmployeeAttendance = async (schoolId, query = {}, scopeFilter = {}) => {
    const {
        date,
        month,
        year = new Date().getFullYear(),
        department = '',
        role = '',
        status = ''
    } = query;

    // Fetch all active staff & teachers
    const users = await User.find({
        schoolId,
        role: { $in: ['TEACHER', 'ACCOUNTANT', 'LIBRARIAN', 'FRONT_OFFICE', 'DRIVER', 'STAFF'] },
        isActive: true,
        ...scopeFilter
    }).select('_id firstName lastName email phone profilePhotoUrl role department employeeId').lean();

    const userIds = users.map(u => u._id);
    const staffProfiles = await StaffProfile.find({ schoolId, userId: { $in: userIds } }).lean();
    const teacherProfiles = await TeacherProfile.find({ schoolId, userId: { $in: userIds } }).lean();

    const metaMap = new Map();
    staffProfiles.forEach(sp => metaMap.set(String(sp.userId), { dept: sp.department, role: sp.designation }));
    teacherProfiles.forEach(tp => metaMap.set(String(tp.userId), { dept: tp.department, role: tp.designation || 'Teacher' }));

    // Target query date (today by default)
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setUTCHours(0, 0, 0, 0);

    const attendances = await EmployeeAttendance.find({
        schoolId,
        employeeId: { $in: userIds },
        date: targetDate
    }).lean();

    const attMap = new Map();
    attendances.forEach(a => attMap.set(String(a.employeeId), a));

    let rows = users.map((u, idx) => {
        const meta = metaMap.get(String(u._id)) || { dept: u.department || 'Administration', role: u.role.replace(/_/g, ' ') };
        const att = attMap.get(String(u._id));
        const currentStatus = att ? att.status : 'NOT_MARKED';

        return {
            id: u._id,
            employeeId: u.employeeId || `EMP00${idx + 1}`,
            name: `${u.firstName} ${u.lastName}`.trim(),
            avatar: u.profilePhotoUrl,
            role: meta.role,
            department: meta.dept,
            presentDays: att?.presentDays || (currentStatus === 'PRESENT' ? 1 : 0),
            absentDays: currentStatus === 'ABSENT' ? 1 : 0,
            lateDays: currentStatus === 'LATE' ? 1 : 0,
            status: currentStatus,
            checkInTime: att?.checkInTime || null,
            checkOutTime: att?.checkOutTime || null
        };
    });

    if (department && department !== 'All') {
        rows = rows.filter(r => r.department.toLowerCase() === department.toLowerCase());
    }
    if (role && role !== 'All') {
        rows = rows.filter(r => r.role.toLowerCase().includes(role.toLowerCase()));
    }
    if (status && status !== 'All') {
        rows = rows.filter(r => r.status.toLowerCase() === status.toLowerCase());
    }

    const presentCount = rows.filter(r => r.status === 'PRESENT').length;
    const absentCount = rows.filter(r => r.status === 'ABSENT').length;
    const lateCount = rows.filter(r => r.status === 'LATE').length;
    const onLeaveCount = rows.filter(r => r.status === 'ON_LEAVE').length;
    const notMarkedCount = rows.filter(r => r.status === 'NOT_MARKED').length;
    const markedTotal = presentCount + absentCount + lateCount;
    const attendanceRate = markedTotal > 0 ? Math.round(((presentCount + lateCount * 0.5) / markedTotal) * 1000) / 10 : 0;

    return {
        records: rows,
        summary: {
            present: presentCount,
            absent: absentCount,
            late: lateCount,
            onLeave: onLeaveCount,
            notMarked: notMarkedCount,
            totalEmployees: rows.length,
            total: rows.length,
            attendanceRate
        }
    };
};

export const markEmployeeAttendance = async (schoolId, data, markedBy) => {
    const { employeeId, date, status, checkInTime, checkOutTime, remarks } = data;

    const normalizedDate = date ? new Date(date) : new Date();
    normalizedDate.setUTCHours(0, 0, 0, 0);

    const record = await EmployeeAttendance.findOneAndUpdate(
        { schoolId, employeeId, date: normalizedDate },
        {
            $set: {
                status: status || 'PRESENT',
                checkInTime: checkInTime || '09:00 AM',
                checkOutTime: checkOutTime || '05:00 PM',
                remarks: remarks || '',
                markedBy
            }
        },
        { upsert: true, new: true }
    );

    // Emit domain event for real-time live sync across school users
    eventBus.publish(DOMAIN_EVENTS.ATTENDANCE_MARKED, {
        schoolId,
        employeeId,
        date: normalizedDate,
        status: record.status,
        markedBy
    });

    return record;
};

// ============================================================================
// 5. PARENTS SERVICE
// ============================================================================

export const getParentsList = async (schoolId, query = {}, scopeFilter = {}) => {
    const {
        page = 1,
        limit = 10,
        search = '',
        status = ''
    } = query;

    const skip = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);

    const match = { schoolId, ...scopeFilter };
    if (status) {
        match.status = status.toUpperCase();
    }
    if (search && search.trim()) {
        const rgx = new RegExp(search.trim(), 'i');
        match.$or = [{ fullName: rgx }, { phone: rgx }, { email: rgx }, { parentId: rgx }];
    }

    const parents = await ParentProfile.find(match)
        .sort({ fullName: 1 })
        .lean();

    const parentIds = parents.map(p => p._id);

    // Fetch relations to students
    const relations = await ParentStudentRelation.find({
        schoolId,
        parentId: { $in: parentIds },
        status: 'ACTIVE'
    })
        .populate({
            path: 'studentId',
            select: 'firstName lastName admissionNo rollNo classId sectionId photoUrl',
            populate: [
                { path: 'classId', select: 'name' },
                { path: 'sectionId', select: 'name' }
            ]
        })
        .lean();

    const relationMap = new Map();
    relations.forEach(rel => {
        const pid = String(rel.parentId);
        if (!relationMap.has(pid)) relationMap.set(pid, []);
        relationMap.get(pid).push(rel);
    });

    const combined = parents.map(p => {
        const rels = relationMap.get(String(p._id)) || [];
        const primaryStudent = rels[0]?.studentId;
        const studentName = primaryStudent ? `${primaryStudent.firstName} ${primaryStudent.lastName}`.trim() : 'No student assigned';
        const className = primaryStudent ? `${primaryStudent.classId?.name || 'Class'} - ${primaryStudent.sectionId?.name || 'Section'}` : '—';
        const relationship = rels[0]?.relationship || p.relationship || 'Guardian';

        return {
            id: p._id,
            _id: p._id,
            parentId: p.parentId,
            fullName: p.fullName,
            parentName: p.fullName,
            studentName,
            relationship,
            className,
            phone: p.phone,
            email: p.email || '',
            status: p.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE',
            occupation: p.occupation || '—',
            employer: p.employer || '—',
            canPickupStudent: p.canPickupStudent !== false,
            canReceiveNotifications: p.canReceiveNotifications !== false,
            address: p.address,
            childrenCount: rels.length,
            children: rels.map(r => ({
                id: r.studentId?._id,
                name: r.studentId ? `${r.studentId.firstName} ${r.studentId.lastName}`.trim() : 'Student',
                class: r.studentId?.classId ? `${r.studentId.classId.name || ''} - ${r.studentId.sectionId?.name || ''}` : '—',
                admissionNo: r.studentId?.admissionNo || '—',
                relationship: r.relationship
            }))
        };
    });

    const total = combined.length;
    const paginated = combined.slice(skip, skip + parseInt(limit));

    const activeCount = combined.filter(p => p.status === 'ACTIVE').length;
    const multiChildCount = combined.filter(p => p.childrenCount > 1).length;

    return {
        parents: paginated,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages: Math.ceil(total / parseInt(limit)) || 1
        },
        kpis: {
            totalParents: total,
            activeParents: activeCount,
            activeGuardians: activeCount,
            multiChildFamilies: multiChildCount,
            portalActiveRate: total > 0 ? Math.round((activeCount / total) * 100) : 0
        }
    };
};

export const getParentById = async (schoolId, parentId) => {
    const parent = await ParentProfile.findOne({ _id: parentId, schoolId }).lean();
    if (!parent) throw ApiError.notFound('Parent profile not found');

    const relations = await ParentStudentRelation.find({ schoolId, parentId, status: 'ACTIVE' })
        .populate({
            path: 'studentId',
            select: 'firstName lastName admissionNo rollNo classId sectionId photoUrl dateOfBirth',
            populate: [
                { path: 'classId', select: 'name' },
                { path: 'sectionId', select: 'name' }
            ]
        })
        .lean();

    return {
        parent,
        relations,
        recentCommunications: [
            { id: '1', title: 'Fee Payment Confirmation', time: '10:30 AM', date: 'Today', type: 'PAYMENT' },
            { id: '2', title: 'Parent Teacher Meeting Scheduled', time: '2:15 PM', date: 'Yesterday', type: 'MEETING' },
            { id: '3', title: 'Homework Reminder - Mathematics', time: '4:45 PM', date: '3 Oct 2026', type: 'HOMEWORK' }
        ]
    };
};

export const createParent = async (schoolId, data, currentUserId) => {
    const {
        fullName, relationship, title, phone, email, occupation,
        employer, annualIncome, address, studentId, canPickupStudent, canReceiveNotifications
    } = data;

    if (!fullName || !phone) {
        throw ApiError.badRequest('Full Name and Phone Number are required.');
    }

    const parentId = `PAR0${Date.now().toString().slice(-3)}`;

    const parent = await ParentProfile.create({
        schoolId,
        parentId,
        title: title || 'Mr.',
        fullName: fullName.trim(),
        relationship: relationship || 'FATHER',
        phone: phone.trim(),
        email: email ? email.toLowerCase().trim() : undefined,
        occupation: occupation || '',
        employer: employer || '',
        annualIncome: annualIncome ? Number(annualIncome) : undefined,
        address: address || {},
        canPickupStudent: canPickupStudent !== false,
        canReceiveNotifications: canReceiveNotifications !== false,
        status: 'ACTIVE'
    });

    // If studentId provided, create relationship
    if (studentId) {
        await ParentStudentRelation.create({
            schoolId,
            parentId: parent._id,
            studentId,
            relationship: relationship || 'FATHER',
            isPrimaryContact: true,
            canPickupStudent: canPickupStudent !== false,
            canReceiveNotifications: canReceiveNotifications !== false,
            status: 'ACTIVE'
        });
    }

    return parent;
};

export const getMyChildren = async (schoolId, user) => {
    if (!schoolId || !user) return [];

    let students = [];

    if (user.role === 'STUDENT') {
        const stu = await Student.findOne({
            schoolId,
            $or: [{ userId: user._id || user.id }, { email: user.email }]
        }).populate('classId', 'name').populate('sectionId', 'name').lean();

        if (stu) students = [stu];
    } else {
        // Parent role: look up parent profile
        let parentProfile = await ParentProfile.findOne({
            schoolId,
            $or: [
                { userId: user._id || user.id },
                { email: user.email },
                ...(user.phone ? [{ phone: user.phone }] : [])
            ]
        }).lean();

        let parentIds = [];
        if (parentProfile) parentIds.push(parentProfile._id);
        if (user._id) parentIds.push(user._id);

        const relations = await ParentStudentRelation.find({
            schoolId,
            parentId: { $in: parentIds },
            status: 'ACTIVE'
        }).populate({
            path: 'studentId',
            select: 'firstName lastName admissionNo rollNo classId sectionId photoUrl',
            populate: [
                { path: 'classId', select: 'name' },
                { path: 'sectionId', select: 'name' }
            ]
        }).lean();

        students = relations.map(r => r.studentId).filter(Boolean);
    }

    // Enrich each student with real database metrics
    const enriched = [];
    for (const s of students) {
        const studentId = s._id;
        const sectionId = s.sectionId?._id || s.sectionId;

        // 1. Calculate real attendance rate from Attendance collection
        let attRateStr = 'N/A';
        const attDocs = await Attendance.find({
            schoolId,
            'records.studentId': studentId
        }).sort({ date: -1 }).limit(30).select('records').lean().catch(() => []);

        let totalDays = 0;
        let presentDays = 0;
        attDocs.forEach(doc => {
            const myRecord = (doc.records || []).find(r => r.studentId?.toString() === studentId.toString());
            if (myRecord) {
                totalDays++;
                if (['PRESENT', 'LATE'].includes(myRecord.status)) presentDays++;
            }
        });
        if (totalDays > 0) {
            attRateStr = `${Math.round((presentDays / totalDays) * 1000) / 10}%`;
        }

        // 2. Count real active homework pending for student's class/section
        let pendingHwCount = 0;
        if (sectionId) {
            const activeAssignments = await Assignment.find({
                schoolId,
                sectionId,
                status: 'PUBLISHED'
            }).select('_id').lean().catch(() => []);

            pendingHwCount = activeAssignments.length;
        }

        enriched.push({
            id: s._id,
            name: `${s.firstName} ${s.lastName}`.trim(),
            class: `${s.classId?.name || 'Class'} - ${s.sectionId?.name || 'A'}`,
            rollNo: s.rollNo || s.admissionNo || '—',
            admissionNo: s.admissionNo || '—',
            avatar: s.photoUrl || s.firstName?.charAt(0) || 'S',
            school: user.schoolName || 'PrimeSchoolOS Academy',
            attendance: attRateStr,
            pendingHomework: pendingHwCount,
            feesDue: '₹0'
        });
    }

    return enriched;
};
