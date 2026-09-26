import admissionService from './admission.service.js';
import ApiResponse from '../../utils/ApiResponse.js';
import asyncHandler from '../../utils/asyncHandler.js';
import ApiError from '../../utils/ApiError.js';

class AdmissionController {
    // ── PUBLIC ADMISSIONS (Multi-Tenant by Slug) ────────────────────────────────

    getPublicSchoolBySlug = asyncHandler(async (req, res) => {
        const { schoolSlug } = req.params;
        const result = await admissionService.getPublicSchoolBySlug(schoolSlug);
        return res.status(200).json(new ApiResponse(200, result, 'School profile and admission settings retrieved'));
    });

    getPublicSchoolsDirectory = asyncHandler(async (req, res) => {
        const schools = await admissionService.getPublicSchoolsDirectory(req.query);
        return res.status(200).json(new ApiResponse(200, schools, 'Active schools directory retrieved'));
    });

    submitPublicApplication = asyncHandler(async (req, res) => {
        const { schoolSlug } = req.params;
        const application = await admissionService.submitApplication(schoolSlug, req.body, false);
        return res.status(201).json(
            new ApiResponse(
                201,
                {
                    applicationNo: application.applicationNo,
                    studentName: `${application.student.firstName} ${application.student.lastName}`,
                    student: application.student,
                    classApplied: application.targetClassName,
                    targetClassName: application.targetClassName,
                    academicYear: application.academicYear,
                    status: application.status,
                    appliedDate: application.createdAt,
                    appliedOn: application.createdAt,
                    applicationFee: application.applicationFee,
                },
                'Admission application submitted successfully'
            )
        );
    });

    trackPublicApplication = asyncHandler(async (req, res) => {
        const { applicationNo, phoneOrDob } = req.query;
        if (!applicationNo) throw ApiError.badRequest('Application number is required');
        const trackingData = await admissionService.trackApplication(applicationNo, phoneOrDob);
        return res.status(200).json(new ApiResponse(200, trackingData, 'Application tracking status retrieved'));
    });

    // ── SCHOOL ERP ADMISSIONS (Authenticated Staff/Admin) ────────────────────────

    getApplications = asyncHandler(async (req, res) => {
        const schoolId = req.user.schoolId;
        const result = await admissionService.getApplications(schoolId, req.query);
        return res.status(200).json(new ApiResponse(200, result, 'Applications retrieved successfully'));
    });

    getAdmissionStats = asyncHandler(async (req, res) => {
        const schoolId = req.user.schoolId;
        const stats = await admissionService.getAdmissionStats(schoolId, req.query.academicYear);
        return res.status(200).json(new ApiResponse(200, stats, 'Admission statistics retrieved successfully'));
    });

    getApplicationById = asyncHandler(async (req, res) => {
        const schoolId = req.user.schoolId;
        const application = await admissionService.getApplicationById(schoolId, req.params.id);
        return res.status(200).json(new ApiResponse(200, application, 'Application details retrieved'));
    });

    updateApplicationStatus = asyncHandler(async (req, res) => {
        const schoolId = req.user.schoolId;
        const { status, remarks } = req.body;
        if (!status) throw ApiError.badRequest('Status is required');
        const updated = await admissionService.updateStatus(schoolId, req.params.id, status, remarks, req.user);
        return res.status(200).json(new ApiResponse(200, updated, `Status updated to ${status}`));
    });

    verifyDocument = asyncHandler(async (req, res) => {
        const schoolId = req.user.schoolId;
        const { docId, status, remarks } = req.body;
        if (!docId || !status) throw ApiError.badRequest('docId and status are required');
        const updated = await admissionService.verifyDocument(schoolId, req.params.id, { docId, status, remarks }, req.user);
        return res.status(200).json(new ApiResponse(200, updated, 'Document verification updated'));
    });

    scheduleTest = asyncHandler(async (req, res) => {
        const schoolId = req.user.schoolId;
        const updated = await admissionService.scheduleTest(schoolId, req.params.id, req.body, req.user);
        return res.status(200).json(new ApiResponse(200, updated, 'Entrance test scheduled successfully'));
    });

    recordTestResult = asyncHandler(async (req, res) => {
        const schoolId = req.user.schoolId;
        const updated = await admissionService.recordTestResult(schoolId, req.params.id, req.body, req.user);
        return res.status(200).json(new ApiResponse(200, updated, 'Test result recorded successfully'));
    });

    enrollStudent = asyncHandler(async (req, res) => {
        const schoolId = req.user.schoolId;
        const result = await admissionService.enrollStudent(schoolId, req.params.id, req.body, req.user);
        return res.status(200).json(new ApiResponse(200, result, 'Student enrolled successfully and credentials dispatched'));
    });

    // ── ENQUIRY DESK ─────────────────────────────────────────────────────────────

    getEnquiries = asyncHandler(async (req, res) => {
        const schoolId = req.user.schoolId;
        const enquiries = await admissionService.getEnquiries(schoolId, req.query);
        return res.status(200).json(new ApiResponse(200, enquiries, 'Enquiries retrieved successfully'));
    });

    createEnquiry = asyncHandler(async (req, res) => {
        const schoolId = req.user.schoolId;
        const enquiry = await admissionService.createEnquiry(schoolId, req.body);
        return res.status(201).json(new ApiResponse(201, enquiry, 'Enquiry recorded successfully'));
    });

    convertEnquiry = asyncHandler(async (req, res) => {
        const schoolId = req.user.schoolId;
        const result = await admissionService.convertEnquiryToApplication(schoolId, req.params.id, req.user);
        return res.status(200).json(new ApiResponse(200, result, 'Enquiry converted to application successfully'));
    });

    createWalkInApplication = asyncHandler(async (req, res) => {
        const schoolId = req.user.schoolId;
        const application = await admissionService.submitApplication(schoolId.toString(), req.body, true);
        return res.status(201).json(new ApiResponse(201, application, 'Walk-in application created successfully'));
    });
}

export default new AdmissionController();
