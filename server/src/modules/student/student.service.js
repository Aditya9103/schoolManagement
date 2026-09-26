import Student from './student.model.js';
import User from '../auth/user.model.js';
import Class from '../academic/class.model.js';
import Section from '../academic/section.model.js';
import School from '../school/school.model.js';
import ApiError from '../../utils/ApiError.js';
import bcrypt from 'bcryptjs';

export const getStudents = async (schoolId, filters = {}) => {
    if (!schoolId) throw ApiError.badRequest('School ID is required');

    const query = { schoolId };

    if (filters.status) {
        query.status = filters.status.toUpperCase();
    }

    if (filters.classId) {
        query.classId = filters.classId;
    }

    if (filters.sectionId) {
        query.sectionId = filters.sectionId;
    }

    if (filters.search) {
        const escaped = filters.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const searchRegex = new RegExp(escaped, 'i');
        const rollNum = Number(filters.search.trim());
        const orClauses = [
            { firstName: searchRegex },
            { lastName: searchRegex },
            { admissionNo: searchRegex },
        ];
        if (!isNaN(rollNum)) {
            orClauses.push({ rollNo: rollNum });
        }
        query.$or = orClauses;
    }

    const page = Math.max(1, parseInt(filters.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(filters.limit, 10) || 50));
    const skip = (page - 1) * limit;

    let sort = { rollNo: 1, firstName: 1 };
    if (filters.sort === 'name') sort = { firstName: 1, lastName: 1 };
    if (filters.sort === 'recent') sort = { createdAt: -1 };
    if (filters.sort === 'admissionNo') sort = { admissionNo: 1 };

    const [students, total] = await Promise.all([
        Student.find(query)
            .populate('classId', 'name numericGrade stream')
            .populate('sectionId', 'name roomNumber')
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean(),
        Student.countDocuments(query),
    ]);

    return {
        students,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};

export const getStudentById = async (schoolId, studentId) => {
    const student = await Student.findOne({ _id: studentId, schoolId })
        .populate('classId', 'name numericGrade stream')
        .populate({
            path: 'sectionId',
            select: 'name roomNumber classTeacherId capacity',
            populate: {
                path: 'classTeacherId',
                select: 'firstName lastName email profilePhotoUrl',
            },
        })
        .populate('schoolId', 'name code logoUrl address contactPhone contactEmail')
        .lean();

    if (!student) throw ApiError.notFound('Student not found');
    return student;
};

export const createStudent = async (schoolId, data) => {
    if (!schoolId) throw ApiError.badRequest('School ID is required');

    // Verify class and section belong to this school
    const [targetClass, targetSection] = await Promise.all([
        Class.findOne({ _id: data.classId, schoolId }),
        Section.findOne({ _id: data.sectionId, schoolId, classId: data.classId }),
    ]);

    if (!targetClass) throw ApiError.notFound('Specified Class not found for this school');
    if (!targetSection) throw ApiError.notFound('Specified Section not found for this class');

    // Auto-generate admission number if missing
    let admissionNo = (data.admissionNo || '').trim().toUpperCase();
    if (!admissionNo) {
        const count = await Student.countDocuments({ schoolId });
        const year = new Date().getFullYear();
        admissionNo = `ADM-${year}-${String(count + 1).padStart(4, '0')}`;
    }

    const existingAdmission = await Student.findOne({ schoolId, admissionNo });
    if (existingAdmission) {
        throw ApiError.conflict(`Student with Admission No "${admissionNo}" already exists`);
    }

    // Auto-calculate next roll number if not provided
    let rollNo = Number(data.rollNo);
    if (!rollNo || isNaN(rollNo)) {
        const lastStudent = await Student.findOne({ schoolId, classId: data.classId, sectionId: data.sectionId })
            .sort({ rollNo: -1 })
            .lean();
        rollNo = lastStudent?.rollNo ? lastStudent.rollNo + 1 : 1;
    }

    // Create user login account for the student
    let userId = null;
    const studentEmail = data.email
        ? data.email.toLowerCase().trim()
        : `${admissionNo.toLowerCase().replace(/[^a-z0-9]/g, '')}@student.${schoolId}.edu`;

    let existingUser = await User.findOne({ email: studentEmail });
    if (!existingUser) {
        const passwordHash = await bcrypt.hash(data.password || 'Student@123', 10);
        existingUser = await User.create({
            schoolId,
            email: studentEmail,
            passwordHash,
            firstName: data.firstName.trim(),
            lastName: data.lastName.trim(),
            profilePhotoUrl: data.photoUrl || null,
            role: 'STUDENT',
            admissionNo,
            gender: data.gender || 'MALE',
            dateOfBirth: data.dateOfBirth,
            isActive: true,
            isEmailVerified: true,
        });
    }
    userId = existingUser._id;

    const student = await Student.create({
        schoolId,
        userId,
        admissionNo,
        rollNo,
        classId: data.classId,
        sectionId: data.sectionId,
        academicYear: data.academicYear || '2025-26',
        admissionDate: data.admissionDate || new Date(),
        status: data.status || 'ACTIVE',
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        photoUrl: data.photoUrl || null,
        dateOfBirth: data.dateOfBirth,
        bloodGroup: data.bloodGroup || null,
        gender: data.gender || 'MALE',
        fatherName: data.fatherName || '',
        fatherPhone: data.fatherPhone || '',
        fatherOccupation: data.fatherOccupation || '',
        motherName: data.motherName || '',
        motherPhone: data.motherPhone || '',
        motherOccupation: data.motherOccupation || '',
        guardianName: data.guardianName || '',
        guardianPhone: data.guardianPhone || '',
        address: data.address || '',
        emergencyContact: data.emergencyContact || '',
        busRouteNo: data.busRouteNo || '',
        busStop: data.busStop || '',
        documents: data.documents || [],
    });

    // Increment section and school counters
    await Promise.all([
        Section.findByIdAndUpdate(data.sectionId, { $inc: { studentCount: 1 } }),
        School.findByIdAndUpdate(schoolId, { $inc: { studentCount: 1 } }),
    ]);

    return getStudentById(schoolId, student._id);
};

export const updateStudent = async (schoolId, studentId, data) => {
    const existing = await Student.findOne({ _id: studentId, schoolId });
    if (!existing) throw ApiError.notFound('Student not found');

    // If section is changing, update section counts
    if (data.sectionId && data.sectionId.toString() !== existing.sectionId.toString()) {
        await Promise.all([
            Section.findByIdAndUpdate(existing.sectionId, { $inc: { studentCount: -1 } }),
            Section.findByIdAndUpdate(data.sectionId, { $inc: { studentCount: 1 } }),
        ]);
    }

    const updated = await Student.findOneAndUpdate(
        { _id: studentId, schoolId },
        { $set: data },
        { new: true, runValidators: true }
    );

    // Synchronize User profile photo and name if updated
    if (existing.userId && (data.firstName || data.lastName || data.photoUrl)) {
        const updateFields = {};
        if (data.firstName) updateFields.firstName = data.firstName;
        if (data.lastName) updateFields.lastName = data.lastName;
        if (data.photoUrl) updateFields.profilePhotoUrl = data.photoUrl;
        await User.findByIdAndUpdate(existing.userId, { $set: updateFields });
    }

    return getStudentById(schoolId, studentId);
};

export const deleteStudent = async (schoolId, studentId) => {
    const student = await Student.findOne({ _id: studentId, schoolId });
    if (!student) throw ApiError.notFound('Student not found');

    await Promise.all([
        Section.findByIdAndUpdate(student.sectionId, { $inc: { studentCount: -1 } }),
        School.findByIdAndUpdate(schoolId, { $inc: { studentCount: -1 } }),
        Student.findByIdAndDelete(studentId),
        student.userId ? User.findByIdAndDelete(student.userId) : Promise.resolve(),
    ]);

    return { success: true };
};

export const addDocument = async (schoolId, studentId, docData) => {
    const student = await Student.findOneAndUpdate(
        { _id: studentId, schoolId },
        { $push: { documents: docData } },
        { new: true }
    );
    if (!student) throw ApiError.notFound('Student not found');
    return student.documents;
};

export const removeDocument = async (schoolId, studentId, docId) => {
    const student = await Student.findOneAndUpdate(
        { _id: studentId, schoolId },
        { $pull: { documents: { _id: docId } } },
        { new: true }
    );
    if (!student) throw ApiError.notFound('Student not found');
    return student.documents;
};
