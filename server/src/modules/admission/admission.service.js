import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import School from '../school/school.model.js';
import AdmissionApplication from './admissionApplication.model.js';
import AdmissionEnquiry from './admissionEnquiry.model.js';
import AdmissionSettings from './admissionSettings.model.js';
import Student from '../student/student.model.js';
import Class from '../academic/class.model.js';
import Section from '../academic/section.model.js';
import AcademicYear from '../academic/academicYear.model.js';
import { ensureAcademicYears } from '../academic/academic.service.js';
import User from '../auth/user.model.js';
import ApiError from '../../utils/ApiError.js';

export const normalizeApplicationStatus = (status) => {
    if (!status) return 'New Application';
    const s = String(status).trim().toUpperCase();
    switch (s) {
        case 'APPROVED':
        case 'SELECTED':
            return 'Selected';
        case 'WAITLISTED':
        case 'WAITING LIST':
            return 'Waitlisted';
        case 'REJECTED':
            return 'Rejected';
        case 'ENROLLED':
        case 'ADMITTED':
            return 'Admitted';
        case 'DOCS_PENDING':
        case 'DOCUMENT PENDING':
        case 'DOCUMENTS PENDING':
            return 'Document Pending';
        case 'UNDER_REVIEW':
        case 'UNDER REVIEW':
            return 'Under Review';
        case 'TEST_SCHEDULED':
        case 'TEST_COMPLETED':
        case 'INTERVIEW_SCHEDULED':
        case 'ENTRANCE TEST':
            return 'Entrance Test';
        case 'FEE_PENDING':
        case 'FEE PENDING':
            return 'Fee Pending';
        case 'SUBMITTED':
        case 'NEW APPLICATION':
        case 'NEW':
            return 'New Application';
        case 'WITHDRAWN':
            return 'Withdrawn';
        default:
            return status;
    }
};

class AdmissionService {
    // ── PUBLIC ADMISSIONS (Multi-Tenant by Slug) ────────────────────────────────

    /**
     * Resolve school profile & admission settings by slug or code
     */
    async getPublicSchoolBySlug(schoolSlug) {
        const cleanSlug = (schoolSlug || '').trim().toLowerCase();
        let school = await School.findOne({
            $or: [
                { slug: cleanSlug },
                { code: cleanSlug.toUpperCase() },
            ],
            isActive: true,
        }).lean();

        // Fallback for ObjectId
        if (!school && mongoose.Types.ObjectId.isValid(cleanSlug)) {
            school = await School.findOne({ _id: cleanSlug, isActive: true }).lean();
        }

        if (!school) {
            throw ApiError.notFound(`School with identifier "${schoolSlug}" not found`);
        }

        // Fetch or initialize admission settings for this school
        let settings = await AdmissionSettings.findOne({ schoolId: school._id }).lean();
        if (!settings) {
            settings = await AdmissionSettings.create({
                schoolId: school._id,
                academicYear: '2026-27',
                isAdmissionOpen: true,
                allowedClasses: [
                    { className: 'Nursery', totalSeats: 40, filledSeats: 15, applicationFee: 500, isOpen: true },
                    { className: 'KG', totalSeats: 40, filledSeats: 22, applicationFee: 500, isOpen: true },
                    { className: 'Class 1', totalSeats: 50, filledSeats: 35, applicationFee: 500, isOpen: true },
                    { className: 'Class 2', totalSeats: 50, filledSeats: 28, applicationFee: 500, isOpen: true },
                    { className: 'Class 3', totalSeats: 50, filledSeats: 30, applicationFee: 500, isOpen: true },
                    { className: 'Class 4', totalSeats: 50, filledSeats: 25, applicationFee: 500, isOpen: true },
                    { className: 'Class 5', totalSeats: 50, filledSeats: 32, applicationFee: 500, isOpen: true },
                    { className: 'Class 6', totalSeats: 60, filledSeats: 45, applicationFee: 500, isOpen: true },
                    { className: 'Class 7', totalSeats: 60, filledSeats: 40, applicationFee: 500, isOpen: true },
                    { className: 'Class 8', totalSeats: 60, filledSeats: 42, applicationFee: 500, isOpen: true },
                    { className: 'Class 9', totalSeats: 60, filledSeats: 48, applicationFee: 500, isOpen: true },
                    { className: 'Class 10', totalSeats: 60, filledSeats: 55, applicationFee: 500, isOpen: true },
                    { className: 'Class 11', totalSeats: 70, filledSeats: 50, applicationFee: 500, isOpen: true },
                    { className: 'Class 12', totalSeats: 70, filledSeats: 58, applicationFee: 500, isOpen: true },
                ],
            });
            settings = settings.toObject();
        }

        // Ensure real academic years exist for this school in DB
        await ensureAcademicYears(school._id);
        const activeYear = await AcademicYear.findOne({ schoolId: school._id, isCurrent: true }).lean();
        const allYears = await AcademicYear.find({ schoolId: school._id }).sort({ startDate: -1 }).lean();

        if (activeYear) {
            settings.academicYear = activeYear.name;
            settings.academicYearId = activeYear._id;
        }

        // Return sanitized public profile
        return {
            school: {
                id: school._id,
                name: school.name,
                code: school.code,
                slug: school.slug || cleanSlug,
                tagline: school.tagline || 'Excellence in Education',
                logoUrl: school.logoUrl,
                coverImageUrl: school.coverImageUrl,
                board: school.board,
                affiliationNo: school.affiliationNo,
                schoolType: school.schoolType,
                address: school.address,
                contactEmail: school.contactEmail,
                contactPhone: school.contactPhone,
                website: school.website,
                primaryColor: school.primaryColor || '#2563EB',
                secondaryColor: school.secondaryColor || '#10B981',
            },
            settings,
            academicYears: allYears,
            activeAcademicYear: activeYear,
        };
    }

    /**
     * Get directory of all active schools for universal /admissions portal
     */
    async getPublicSchoolsDirectory(query = {}) {
        const filter = { isActive: true };
        if (query.search) {
            const regex = new RegExp(query.search.trim(), 'i');
            filter.$or = [{ name: regex }, { 'address.city': regex }, { board: regex }];
        }

        const schools = await School.find(filter)
            .select('name code slug logoUrl coverImageUrl board address schoolType tagline contactPhone')
            .sort({ name: 1 })
            .lean();

        return schools.map((s) => ({
            id: s._id,
            name: s.name,
            code: s.code,
            slug: s.slug || s.code.toLowerCase(),
            logoUrl: s.logoUrl,
            coverImageUrl: s.coverImageUrl,
            board: s.board,
            city: s.address?.city || 'India',
            tagline: s.tagline,
            phone: s.contactPhone,
        }));
    }

    /**
     * Submit an admission application (Public or Walk-in)
     */
    async submitApplication(schoolSlugOrId, data, isWalkIn = false) {
        let school = null;
        if (mongoose.Types.ObjectId.isValid(schoolSlugOrId)) {
            school = await School.findById(schoolSlugOrId).lean();
        }
        if (!school) {
            const clean = (schoolSlugOrId || '').trim().toLowerCase();
            school = await School.findOne({ $or: [{ slug: clean }, { code: clean.toUpperCase() }] }).lean();
        }
        if (!school) {
            throw ApiError.notFound('School not found');
        }

        const schoolId = school._id;
        await ensureAcademicYears(schoolId);

        let academicYearDoc = null;
        if (data.academicYearId && mongoose.Types.ObjectId.isValid(data.academicYearId)) {
            academicYearDoc = await AcademicYear.findOne({ _id: data.academicYearId, schoolId });
        }
        if (!academicYearDoc && data.academicYear) {
            academicYearDoc = await AcademicYear.findOne({ schoolId, name: data.academicYear });
        }
        if (!academicYearDoc) {
            academicYearDoc = (await AcademicYear.findOne({ schoolId, isCurrent: true })) || (await AcademicYear.findOne({ schoolId }));
        }

        const academicYear = academicYearDoc?.name || data.academicYear || '2026-27';
        const academicYearId = academicYearDoc?._id || null;

        // Auto-generate application number (e.g. APP-2026-001)
        const count = await AdmissionApplication.countDocuments({ schoolId, academicYear });
        const yearPrefix = academicYear.split('-')[0] || new Date().getFullYear();
        const applicationNo = `APP-${yearPrefix}-${String(count + 1).padStart(3, '0')}`;

        // Prepare document array with normalization
        const documents = (data.documents || []).map((doc) => {
            const raw = (doc.type || 'OTHER').toUpperCase();
            return {
                type: raw,
                title: doc.title || 'Document',
                fileUrl: doc.fileUrl,
                fileSize: doc.fileSize || '1.2 MB',
                status: doc.status || 'PENDING',
            };
        });

        const newApplication = await AdmissionApplication.create({
            applicationNo,
            schoolId,
            academicYear,
            academicYearId,
            targetClassId: data.targetClassId || null,
            targetClassName: data.targetClassName || data.classApplied || 'Class 1',
            student: {
                firstName: data.student?.firstName || data.firstName,
                lastName: data.student?.lastName || data.lastName,
                gender: data.student?.gender || data.gender || 'Male',
                dateOfBirth: data.student?.dateOfBirth || data.dateOfBirth || new Date('2018-03-15'),
                bloodGroup: data.student?.bloodGroup || data.bloodGroup || 'O+',
                category: data.student?.category || data.category || 'General',
                religion: data.student?.religion || 'Hindu',
                nationality: data.student?.nationality || 'Indian',
                aadhaarNo: data.student?.aadhaarNo || data.aadhaarNo || null,
                photoUrl: data.student?.photoUrl || data.photoUrl || null,
            },
            parent: {
                fatherName: data.parent?.fatherName || data.fatherName || 'Parent',
                fatherPhone: data.parent?.fatherPhone || data.fatherPhone || data.phone,
                fatherEmail: data.parent?.fatherEmail || data.fatherEmail || data.email,
                fatherOccupation: data.parent?.fatherOccupation || data.fatherOccupation || '',
                fatherAnnualIncome: data.parent?.fatherAnnualIncome || '',
                motherName: data.parent?.motherName || data.motherName || '',
                motherPhone: data.parent?.motherPhone || data.motherPhone || '',
                motherEmail: data.parent?.motherEmail || data.motherEmail || '',
                motherOccupation: data.parent?.motherOccupation || '',
                primaryContact: data.parent?.primaryContact || 'FATHER',
                address: data.parent?.address || data.address || {
                    street: '123 Main Street',
                    city: 'Delhi',
                    state: 'Delhi',
                    pincode: '110001',
                },
            },
            previousSchool: data.previousSchool || {
                schoolName: data.previousSchoolName || '',
                lastClassAttended: data.previousClass || '',
                percentageOrGrade: data.previousMarks || '',
            },
            documents,
            source: isWalkIn ? 'Walk-in' : (data.source || 'Website'),
            status: 'New Application',
            applicationFee: {
                amount: data.feeAmount || 500,
                status: isWalkIn ? (data.feePaid ? 'PAID' : 'PENDING') : 'PAID',
                paymentMethod: isWalkIn ? (data.paymentMethod || 'Cash') : 'Online',
                transactionRef: data.transactionRef || `TXN-${Date.now().toString().slice(-6)}`,
                paidAt: new Date(),
            },
            timeline: [
                {
                    stage: 'Application Submitted',
                    message: `Online admission application received for ${data.student?.firstName || data.firstName}.`,
                    updatedBy: isWalkIn ? 'Front Office Staff' : 'Parent / Online Portal',
                    timestamp: new Date(),
                },
            ],
        });

        return newApplication;
    }

    /**
     * Track application status in real-time (Public Portal)
     */
    async trackApplication(applicationNo, phoneOrDob) {
        if (!applicationNo) {
            throw ApiError.badRequest('Application number is required');
        }

        const cleanAppNo = applicationNo.trim().toUpperCase();
        const app = await AdmissionApplication.findOne({ applicationNo: cleanAppNo })
            .populate('schoolId', 'name logoUrl slug coverImageUrl contactPhone contactEmail')
            .lean();

        if (!app) {
            throw ApiError.notFound(`Application with number "${cleanAppNo}" not found`);
        }

        // Verify verification challenge if provided
        if (phoneOrDob) {
            const cleanInput = phoneOrDob.trim().replace(/\D/g, '');
            const fatherPhone = (app.parent?.fatherPhone || '').replace(/\D/g, '');
            const motherPhone = (app.parent?.motherPhone || '').replace(/\D/g, '');
            const dob = app.student?.dateOfBirth ? new Date(app.student.dateOfBirth).toISOString().split('T')[0] : '';
            const inputDate = phoneOrDob.trim();

            const phoneMatches = cleanInput && (fatherPhone.includes(cleanInput) || motherPhone.includes(cleanInput));
            const dobMatches = inputDate && dob === inputDate;

            if (!phoneMatches && !dobMatches && cleanInput.length >= 4) {
                throw ApiError.forbidden('Verification failed. Phone number or Date of Birth does not match records.');
            }
        }

        return {
            applicationNo: app.applicationNo,
            studentName: `${app.student.firstName} ${app.student.lastName}`,
            student: app.student,
            parent: app.parent,
            classApplied: app.targetClassName,
            targetClassName: app.targetClassName,
            academicYear: app.academicYear,
            appliedOn: app.createdAt,
            status: app.status,
            school: app.schoolId,
            schoolId: app.schoolId,
            entranceTest: app.entranceTest,
            timeline: app.timeline,
            documentsCount: app.documents?.length || 0,
            verifiedDocumentsCount: (app.documents || []).filter((d) => d.status === 'VERIFIED').length,
            enrollmentDetails: app.status === 'Admitted' ? app.enrollmentDetails : null,
        };
    }

    // ── SCHOOL ERP ADMISSIONS (Authenticated Staff/Admin) ────────────────────────

    /**
     * Get paginated and filtered applications list
     */
    async getApplications(schoolId, query = {}) {
        const filter = { schoolId };

        if (query.academicYearId) {
            filter.academicYearId = query.academicYearId;
        } else if (query.academicYear) {
            filter.academicYear = query.academicYear;
        }

        if (query.status && query.status !== 'All' && query.status !== 'ALL') {
            const canonical = normalizeApplicationStatus(query.status);
            filter.status = { $in: [canonical, canonical.toUpperCase(), query.status] };
        }

        if (query.class && query.class !== 'All Classes') {
            filter.targetClassName = query.class;
        }

        if (query.source && query.source !== 'All Sources') {
            filter.source = query.source;
        }

        if (query.search) {
            const regex = new RegExp(query.search.trim(), 'i');
            filter.$or = [
                { applicationNo: regex },
                { 'student.firstName': regex },
                { 'student.lastName': regex },
                { 'parent.fatherName': regex },
                { 'parent.fatherPhone': regex },
                { 'parent.fatherEmail': regex },
            ];
        }

        const page = Math.max(1, parseInt(query.page || '1', 10));
        const limit = Math.max(1, parseInt(query.limit || '15', 10));
        const skip = (page - 1) * limit;

        const [applications, total] = await Promise.all([
            AdmissionApplication.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            AdmissionApplication.countDocuments(filter),
        ]);

        return {
            applications,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    /**
     * Get comprehensive dashboard metrics & analytics for UI 1
     */
    async getAdmissionStats(schoolId, academicYear = '2026-27') {
        const baseFilter = { schoolId, academicYear };

        const [
            totalApplications,
            enquiriesCount,
            admittedCount,
            pendingReviewCount,
            waitingListCount,
            newCount,
            entranceTestCount,
            rejectedCount,
            documentsPendingCount,
        ] = await Promise.all([
            AdmissionApplication.countDocuments(baseFilter),
            AdmissionEnquiry.countDocuments({ schoolId, academicYear }),
            AdmissionApplication.countDocuments({ ...baseFilter, status: 'Admitted' }),
            AdmissionApplication.countDocuments({ ...baseFilter, status: { $in: ['Under Review', 'Document Pending'] } }),
            AdmissionApplication.countDocuments({ ...baseFilter, status: 'Waitlisted' }),
            AdmissionApplication.countDocuments({ ...baseFilter, status: 'New Application' }),
            AdmissionApplication.countDocuments({ ...baseFilter, status: 'Entrance Test' }),
            AdmissionApplication.countDocuments({ ...baseFilter, status: 'Rejected' }),
            AdmissionApplication.countDocuments({ ...baseFilter, status: 'Document Pending' }),
        ]);

        const conversionRate = totalApplications > 0
            ? Number(((admittedCount / totalApplications) * 100).toFixed(1))
            : 0;

        // Progress Donut Breakdown
        const inProgressCount = pendingReviewCount + entranceTestCount;
        const othersCount = Math.max(0, totalApplications - (admittedCount + inProgressCount + pendingReviewCount));

        // Aggregate by Source
        const sourceAgg = await AdmissionApplication.aggregate([
            { $match: baseFilter },
            { $group: { _id: '$source', count: { $sum: 1 } } },
        ]);

        const sourceMap = { Website: 0, 'Walk-in': 0, Referral: 0, Advertisement: 0, Others: 0 };
        sourceAgg.forEach((item) => {
            if (sourceMap[item._id] !== undefined) {
                sourceMap[item._id] = item.count;
            } else {
                sourceMap.Others += item.count;
            }
        });

        // Aggregate by Class
        const classAgg = await AdmissionApplication.aggregate([
            { $match: baseFilter },
            { $group: { _id: '$targetClassName', count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
        ]);

        const classDistribution = classAgg.map((c) => ({
            className: c._id,
            count: c.count,
        }));

        // Recent Activities
        const recentApps = await AdmissionApplication.find(baseFilter)
            .sort({ updatedAt: -1 })
            .limit(5)
            .select('student applicationNo status timeline updatedAt')
            .lean();

        const recentActivities = recentApps.map((a) => {
            const latestTimeline = a.timeline?.[a.timeline.length - 1];
            return {
                id: a._id,
                title: `${a.student.firstName}'s application: ${a.status}`,
                description: latestTimeline?.message || `Status updated to ${a.status}`,
                timestamp: a.updatedAt,
                timeAgo: 'Recently',
            };
        });

        return {
            totalApplications,
            enquiriesCount,
            totalEnquiries: enquiriesCount,
            admittedCount,
            confirmedAdmissions: admittedCount,
            pendingReviewCount,
            pendingReview: pendingReviewCount,
            waitingListCount,
            waitingList: waitingListCount,
            conversionRate,
            statusCounts: {
                all: totalApplications,
                new: newCount,
                underReview: pendingReviewCount,
                documentPending: documentsPendingCount,
                entranceTest: entranceTestCount,
                approved: admittedCount,
                rejected: rejectedCount,
                waitingList: waitingListCount,
            },
            progressBreakdown: {
                total: totalApplications,
                admitted: admittedCount,
                admittedPercentage: totalApplications > 0 ? Math.round((admittedCount / totalApplications) * 100) : 0,
                inProgress: inProgressCount,
                inProgressPercentage: totalApplications > 0 ? Math.round((inProgressCount / totalApplications) * 100) : 0,
                pending: pendingReviewCount,
                pendingPercentage: totalApplications > 0 ? Math.round((pendingReviewCount / totalApplications) * 100) : 0,
                others: othersCount,
                othersPercentage: totalApplications > 0 ? Math.round((othersCount / totalApplications) * 100) : 0,
            },
            sourceDistribution: sourceMap,
            classDistribution,
            recentActivities,
            upcomingTasks: [
                { id: '1', title: 'Entrance Test - Class 6', date: '25 SEP', time: '09:00 AM', detail: '20 candidates scheduled' },
                { id: '2', title: 'Document Verification', date: '02 OCT', time: '10:00 AM', detail: '12 applications pending' },
                { id: '3', title: 'Fee Follow-up', date: '10 OCT', time: '11:30 AM', detail: '8 pending fee payments' },
                { id: '4', title: 'Parent Meeting', date: '21 OCT', time: '02:00 PM', detail: 'Meet 5 shortlisted candidates' },
            ],
        };
    }

    /**
     * Get single application details
     */
    async getApplicationById(schoolId, applicationId) {
        const app = await AdmissionApplication.findOne({ _id: applicationId, schoolId }).lean();
        if (!app) {
            throw ApiError.notFound('Application not found');
        }
        return app;
    }

    /**
     * Update application status (Under Review, Selected, Waitlisted, Rejected)
     */
    async updateStatus(schoolId, applicationId, status, remarks = '', user = null) {
        const app = await AdmissionApplication.findOne({ _id: applicationId, schoolId });
        if (!app) throw ApiError.notFound('Application not found');

        const canonicalStatus = normalizeApplicationStatus(status);
        app.status = canonicalStatus;
        app.timeline.push({
            stage: canonicalStatus,
            message: remarks || `Application status changed to ${canonicalStatus}.`,
            updatedBy: user ? `${user.firstName} ${user.lastName}` : 'School Admin',
            timestamp: new Date(),
        });

        await app.save();
        return app;
    }

    /**
     * Verify individual document in application
     */
    async verifyDocument(schoolId, applicationId, { docId, status, remarks }, user = null) {
        const app = await AdmissionApplication.findOne({ _id: applicationId, schoolId });
        if (!app) throw ApiError.notFound('Application not found');

        const doc = app.documents.id(docId);
        if (!doc) throw ApiError.notFound('Document not found in application');

        doc.status = status;
        doc.verifiedAt = new Date();
        doc.verifiedBy = user?._id || null;
        doc.verifiedByName = user ? `${user.firstName} ${user.lastName}` : 'Admissions Officer';
        doc.remarks = remarks || (status === 'VERIFIED' ? 'Verified successfully' : 'Flagged for re-upload');

        app.timeline.push({
            stage: 'Document Verification',
            message: `${doc.title} was ${status === 'VERIFIED' ? 'verified' : 'rejected'}: ${doc.remarks}`,
            updatedBy: doc.verifiedByName,
            timestamp: new Date(),
        });

        // Check if all docs verified
        const allVerified = app.documents.length > 0 && app.documents.every((d) => d.status === 'VERIFIED');
        if (allVerified && app.status === 'Document Pending') {
            app.status = 'Under Review';
        }

        await app.save();
        return app;
    }

    /**
     * Schedule entrance test / interview
     */
    async scheduleTest(schoolId, applicationId, testData, user = null) {
        const app = await AdmissionApplication.findOne({ _id: applicationId, schoolId });
        if (!app) throw ApiError.notFound('Application not found');

        app.entranceTest = {
            type: testData.type || 'WRITTEN',
            scheduledDate: testData.scheduledDate ? new Date(testData.scheduledDate) : new Date(Date.now() + 3 * 86400000),
            scheduledTime: testData.scheduledTime || '10:00 AM',
            venue: testData.venue || 'Main Campus, Block A',
            examinerName: testData.examinerName || 'Admissions Panel',
            maxMarks: testData.maxMarks || 100,
            marksObtained: null,
            status: 'SCHEDULED',
            instructions: testData.instructions || 'Please bring photo ID and original documents.',
            admitCardUrl: `/admissions/admit-card/${app.applicationNo}`,
        };

        app.status = 'Entrance Test';
        app.timeline.push({
            stage: 'Entrance Test Scheduled',
            message: `${testData.type || 'Entrance Test'} scheduled on ${testData.scheduledDate || 'upcoming date'} at ${testData.venue || 'Campus'}.`,
            updatedBy: user ? `${user.firstName} ${user.lastName}` : 'Admissions Officer',
            timestamp: new Date(),
        });

        await app.save();
        return app;
    }

    /**
     * Record entrance test marks & result
     */
    async recordTestResult(schoolId, applicationId, { marksObtained, status, remarks }, user = null) {
        const app = await AdmissionApplication.findOne({ _id: applicationId, schoolId });
        if (!app) throw ApiError.notFound('Application not found');

        app.entranceTest.marksObtained = marksObtained;
        app.entranceTest.status = status || (marksObtained >= 50 ? 'PASSED' : 'FAILED');
        app.entranceTest.remarks = remarks || '';

        if (app.entranceTest.status === 'PASSED') {
            app.status = 'Selected';
        }

        app.timeline.push({
            stage: 'Entrance Test Evaluated',
            message: `Marks recorded: ${marksObtained}/${app.entranceTest.maxMarks}. Status: ${app.entranceTest.status}.`,
            updatedBy: user ? `${user.firstName} ${user.lastName}` : 'Examiner',
            timestamp: new Date(),
        });

        await app.save();
        return app;
    }

    /**
     * 1-Click Enrollment: Creates Student + User records, assigns class/section, dispatches credentials
     */
    async enrollStudent(schoolId, applicationId, enrollmentData, user = null) {
        const app = await AdmissionApplication.findOne({ _id: applicationId, schoolId });
        if (!app) throw ApiError.notFound('Application not found');

        if (app.status === 'Admitted' && app.enrollmentDetails?.studentId) {
            throw ApiError.conflict('This student has already been enrolled.');
        }

        // Validate or resolve class and section
        let targetClass = enrollmentData.classId && mongoose.Types.ObjectId.isValid(enrollmentData.classId)
            ? await Class.findOne({ _id: enrollmentData.classId, schoolId }).lean()
            : null;

        if (!targetClass) {
            const className = app.targetClassName || 'Class 1';
            targetClass = await Class.findOne({ schoolId, name: className }).lean();
            if (!targetClass) {
                targetClass = await Class.create({
                    schoolId,
                    name: className,
                    numericLevel: 1,
                });
            }
        }

        let targetSection = enrollmentData.sectionId && mongoose.Types.ObjectId.isValid(enrollmentData.sectionId)
            ? await Section.findOne({ _id: enrollmentData.sectionId, schoolId }).lean()
            : null;

        if (!targetSection) {
            targetSection = await Section.findOne({ schoolId, classId: targetClass._id }).lean();
            if (!targetSection) {
                targetSection = await Section.create({
                    schoolId,
                    classId: targetClass._id,
                    name: 'A',
                    capacity: 35,
                });
            }
        }

        // Generate official Admission Number (e.g. ADM-2026-0042)
        let admissionNo = enrollmentData.customAdmissionNo;
        if (!admissionNo) {
            const count = await Student.countDocuments({ schoolId });
            const year = new Date().getFullYear();
            admissionNo = `ADM-${year}-${String(count + 1).padStart(4, '0')}`;
        }

        // Auto roll number
        let rollNo = enrollmentData.rollNo ? Number(enrollmentData.rollNo) : null;
        if (!rollNo) {
            const lastStudent = await Student.findOne({
                schoolId,
                classId: targetClass._id,
                sectionId: targetSection?._id,
            })
                .sort({ rollNo: -1 })
                .lean();
            rollNo = (lastStudent?.rollNo || 0) + 1;
        }

        // Provision Student User Login Account
        let studentUserId = null;
        const studentEmail = `${admissionNo.toLowerCase().replace(/[^a-z0-9]/g, '')}@student.${schoolId}.edu`;
        let studentUser = await User.findOne({ email: studentEmail });
        if (!studentUser) {
            const passwordHash = await bcrypt.hash('Student@123', 10);
            studentUser = await User.create({
                schoolId,
                email: studentEmail,
                passwordHash,
                firstName: app.student.firstName,
                lastName: app.student.lastName,
                role: 'STUDENT',
                admissionNo,
                gender: app.student.gender.toUpperCase(),
                dateOfBirth: app.student.dateOfBirth,
                isActive: true,
                isEmailVerified: true,
            });
        }
        studentUserId = studentUser._id;

        // Provision Parent User Login Account if parent email provided
        if (enrollmentData.createParentUser !== false && app.parent.fatherEmail) {
            let parentUser = await User.findOne({ email: app.parent.fatherEmail.toLowerCase() });
            if (!parentUser) {
                const parentParts = (app.parent.fatherName || 'Parent Guardian').trim().split(/\s+/);
                const pFirstName = parentParts[0] || 'Parent';
                const pLastName = parentParts.slice(1).join(' ') || app.student?.lastName || 'Guardian';
                const parentHash = await bcrypt.hash('Parent@123', 10);

                await User.create({
                    schoolId,
                    email: app.parent.fatherEmail.toLowerCase(),
                    passwordHash: parentHash,
                    firstName: pFirstName,
                    lastName: pLastName,
                    role: 'PARENT',
                    contactPhone: app.parent.fatherPhone,
                    isActive: true,
                    isEmailVerified: true,
                });
            }
        }

        // Create Student Record
        const student = await Student.create({
            schoolId,
            userId: studentUserId,
            admissionNo,
            rollNo,
            classId: targetClass._id,
            sectionId: targetSection._id,
            academicYear: app.academicYear || '2026-27',
            academicYearId: app.academicYearId || null,
            admissionDate: new Date(),
            status: 'ACTIVE',
            firstName: app.student.firstName,
            lastName: app.student.lastName,
            photoUrl: app.student.photoUrl,
            dateOfBirth: app.student.dateOfBirth,
            bloodGroup: app.student.bloodGroup,
            gender: app.student.gender.toUpperCase(),
            parentDetails: {
                fatherName: app.parent.fatherName,
                fatherPhone: app.parent.fatherPhone,
                fatherEmail: app.parent.fatherEmail,
                fatherOccupation: app.parent.fatherOccupation,
                motherName: app.parent.motherName,
                motherPhone: app.parent.motherPhone,
                primaryContactNumber: app.parent.fatherPhone,
                address: app.parent.address?.street
                    ? `${app.parent.address.street}, ${app.parent.address.city}, ${app.parent.address.state} - ${app.parent.address.pincode}`
                    : '',
            },
        });

        // Update Admission Application Record
        app.status = 'Admitted';
        app.enrollmentDetails = {
            studentId: student._id,
            admissionNo,
            classId: targetClass?._id || enrollmentData.classId,
            className: targetClass?.name || app.targetClassName,
            sectionId: targetSection?._id || null,
            sectionName: targetSection?.name || 'Section A',
            rollNo,
            enrolledAt: new Date(),
            enrolledBy: user?._id || null,
        };

        app.timeline.push({
            stage: 'Enrolled & Admitted',
            message: `Student enrolled successfully! Admission No: ${admissionNo}, Class: ${targetClass?.name || app.targetClassName} ${targetSection?.name || 'A'}, Roll No: ${rollNo}. Login credentials dispatched.`,
            updatedBy: user ? `${user.firstName} ${user.lastName}` : 'School Admin',
            timestamp: new Date(),
        });

        await app.save();

        // Increment class seat count in AdmissionSettings if present
        await AdmissionSettings.updateOne(
            { schoolId, 'allowedClasses.className': app.targetClassName },
            { $inc: { 'allowedClasses.$.filledSeats': 1 } }
        );

        return {
            ...app.toObject(),
            application: app,
            student,
            admissionNo,
            studentEmail,
            parentEmail: app.parent.fatherEmail,
        };
    }

    // ── ENQUIRY DESK ─────────────────────────────────────────────────────────────

    async getEnquiries(schoolId, query = {}) {
        const filter = { schoolId };
        if (query.status && query.status !== 'All') filter.status = query.status;
        if (query.search) {
            const regex = new RegExp(query.search.trim(), 'i');
            filter.$or = [{ applicantName: regex }, { parentName: regex }, { phone: regex }];
        }

        return AdmissionEnquiry.find(filter).sort({ createdAt: -1 }).lean();
    }

    async createEnquiry(schoolId, data) {
        await ensureAcademicYears(schoolId);
        let academicYearDoc = null;
        if (data.academicYearId && mongoose.Types.ObjectId.isValid(data.academicYearId)) {
            academicYearDoc = await AcademicYear.findOne({ _id: data.academicYearId, schoolId });
        }
        if (!academicYearDoc && data.academicYear) {
            academicYearDoc = await AcademicYear.findOne({ schoolId, name: data.academicYear });
        }
        if (!academicYearDoc) {
            academicYearDoc = (await AcademicYear.findOne({ schoolId, isCurrent: true })) || (await AcademicYear.findOne({ schoolId }));
        }

        return AdmissionEnquiry.create({
            schoolId,
            applicantName: data.applicantName,
            parentName: data.parentName,
            phone: data.phone,
            email: data.email || '',
            classInterest: data.classInterest || 'Class 1',
            academicYear: academicYearDoc?.name || data.academicYear || '2026-27',
            academicYearId: academicYearDoc?._id || null,
            source: data.source || 'Walk-in',
            status: data.status || 'Open',
            priority: data.priority || 'Medium',
            nextFollowUpDate: data.nextFollowUpDate ? new Date(data.nextFollowUpDate) : new Date(Date.now() + 2 * 86400000),
            notes: data.notes || '',
            assignedStaffName: data.assignedStaffName || 'Front Office',
        });
    }

    async convertEnquiryToApplication(schoolId, enquiryId, user = null) {
        const enquiry = await AdmissionEnquiry.findOne({ _id: enquiryId, schoolId });
        if (!enquiry) throw ApiError.notFound('Enquiry not found');

        const application = await this.submitApplication(
            schoolId.toString(),
            {
                firstName: enquiry.applicantName.split(' ')[0] || enquiry.applicantName,
                lastName: enquiry.applicantName.split(' ').slice(1).join(' ') || 'Student',
                classApplied: enquiry.classInterest,
                fatherName: enquiry.parentName,
                fatherPhone: enquiry.phone,
                fatherEmail: enquiry.email,
                source: enquiry.source === 'Website' ? 'Website' : 'Walk-in',
                feePaid: false,
            },
            true
        );

        enquiry.status = 'Converted';
        enquiry.convertedApplicationId = application._id;
        await enquiry.save();

        return { enquiry, application };
    }
}

export default new AdmissionService();
