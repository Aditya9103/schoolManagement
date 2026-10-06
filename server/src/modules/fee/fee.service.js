import mongoose from 'mongoose';
import FeeCategory from './models/feeCategory.model.js';
import FeeStructure from './models/feeStructure.model.js';
import FeeAllocation from './models/feeAllocation.model.js';
import FeeTransaction from './models/feeTransaction.model.js';
import Student from '../student/student.model.js';
import Class from '../academic/class.model.js';
import Section from '../academic/section.model.js';
import User from '../auth/user.model.js';
import { eventBus, DOMAIN_EVENTS } from '../../events/eventBus.js';
import ApiError from '../../utils/ApiError.js';

/**
 * Ensures baseline fee categories, structures, and student allocations exist for the school.
 */
export const seedFeeDemoData = async (schoolId) => {
    const existingCats = await FeeCategory.countDocuments({ schoolId });
    if (existingCats > 0) return;

    // 1. Create standard Indian/Global School Fee Categories
    const categoriesData = [
        { name: 'Tuition Fee', code: 'TUIT', description: 'Core academic instruction and curriculum delivery', isTaxable: false },
        { name: 'Laboratory & Computers', code: 'LAB', description: 'STEM, Robotics, and Computer Lab infrastructure', isTaxable: false },
        { name: 'Library & Digital Resources', code: 'LIB', description: 'Digital e-books, physical library circulation, periodicals', isTaxable: false },
        { name: 'Sports & Extracurricular', code: 'SPRT', description: 'Athletic facilities, physical training, clubs', isTaxable: false },
        { name: 'Annual Development', code: 'DEV', description: 'Campus development, air conditioning, smartboards', isTaxable: false },
        { name: 'Examination & Assessment', code: 'EXAM', description: 'Mid-term and term end assessment stationery and portals', isTaxable: false },
    ];

    const createdCats = await FeeCategory.insertMany(
        categoriesData.map((c) => ({ ...c, schoolId }))
    );

    const catMap = new Map();
    createdCats.forEach((c) => catMap.set(c.code, c._id));

    // 2. Fetch classes in this school
    const classes = await Class.find({ schoolId }).lean();
    if (!classes.length) return;

    // Group into Primary, Middle, Senior
    const primaryClassIds = classes.slice(0, 5).map((c) => c._id);
    const middleClassIds = classes.slice(5, 8).map((c) => c._id);
    const seniorClassIds = classes.slice(8).map((c) => c._id);

    const structures = [];

    if (primaryClassIds.length) {
        structures.push({
            schoolId,
            academicYear: '2026-27',
            name: 'Primary Wing Standard Fee (Class 1 - 5)',
            classIds: primaryClassIds,
            components: [
                { categoryId: catMap.get('TUIT'), name: 'Tuition Fee (Q1)', amount: 12000, frequency: 'QUARTERLY' },
                { categoryId: catMap.get('LAB'), name: 'Computer Lab Fee', amount: 2000, frequency: 'QUARTERLY' },
                { categoryId: catMap.get('LIB'), name: 'Library & Digital Hub', amount: 1500, frequency: 'ANNUAL' },
                { categoryId: catMap.get('SPRT'), name: 'Sports & Wellness', amount: 1500, frequency: 'ANNUAL' },
            ],
            totalAmount: 17000,
            status: 'ACTIVE',
        });
    }

    if (middleClassIds.length) {
        structures.push({
            schoolId,
            academicYear: '2026-27',
            name: 'Middle Wing Standard Fee (Class 6 - 8)',
            classIds: middleClassIds,
            components: [
                { categoryId: catMap.get('TUIT'), name: 'Tuition Fee (Q1)', amount: 15000, frequency: 'QUARTERLY' },
                { categoryId: catMap.get('LAB'), name: 'Science & Computer Labs', amount: 3500, frequency: 'QUARTERLY' },
                { categoryId: catMap.get('LIB'), name: 'Library & Online Journals', amount: 2000, frequency: 'ANNUAL' },
                { categoryId: catMap.get('SPRT'), name: 'Sports Complex Fee', amount: 1500, frequency: 'ANNUAL' },
            ],
            totalAmount: 22000,
            status: 'ACTIVE',
        });
    }

    if (seniorClassIds.length) {
        structures.push({
            schoolId,
            academicYear: '2026-27',
            name: 'Senior Secondary Wing (Class 9 - 12)',
            classIds: seniorClassIds,
            components: [
                { categoryId: catMap.get('TUIT'), name: 'Tuition Fee (Q1)', amount: 18000, frequency: 'QUARTERLY' },
                { categoryId: catMap.get('LAB'), name: 'Advanced Science Practicals', amount: 4500, frequency: 'QUARTERLY' },
                { categoryId: catMap.get('EXAM'), name: 'CBSE / Board Assessment Fee', amount: 3500, frequency: 'ANNUAL' },
                { categoryId: catMap.get('DEV'), name: 'Campus Technology & AC', amount: 2000, frequency: 'ANNUAL' },
            ],
            totalAmount: 28000,
            status: 'ACTIVE',
        });
    }

    if (!structures.length) {
        // Fallback: all classes
        structures.push({
            schoolId,
            academicYear: '2026-27',
            name: 'General Academic Standard Fee',
            classIds: classes.map((c) => c._id),
            components: [
                { categoryId: catMap.get('TUIT'), name: 'Tuition Fee (Q1)', amount: 15000, frequency: 'QUARTERLY' },
                { categoryId: catMap.get('LAB'), name: 'Lab & STEM', amount: 3000, frequency: 'QUARTERLY' },
                { categoryId: catMap.get('LIB'), name: 'Library Resources', amount: 2000, frequency: 'ANNUAL' },
            ],
            totalAmount: 20000,
            status: 'ACTIVE',
        });
    }

    const createdStructures = await FeeStructure.insertMany(structures);

    // 3. Automatically allocate fees to active students
    const students = await Student.find({ schoolId, status: 'ACTIVE' }).lean();
    if (!students.length) return;

    const allocations = [];
    for (const student of students) {
        // Find matching structure for student's class
        const matchedStructure = createdStructures.find((st) =>
            st.classIds.some((cid) => cid.toString() === student.classId?.toString())
        ) || createdStructures[0];

        if (!matchedStructure) continue;

        const totalPayable = matchedStructure.totalAmount;
        // Seed realistic variations (some fully paid, some partial, some unpaid)
        const rand = Math.random();
        let paidAmount = 0;
        let status = 'UNPAID';

        if (rand > 0.6) {
            paidAmount = totalPayable;
            status = 'PAID';
        } else if (rand > 0.3) {
            paidAmount = Math.round(totalPayable * 0.5);
            status = 'PARTIALLY_PAID';
        }

        const balanceAmount = totalPayable - paidAmount;
        if (balanceAmount > 0 && rand < 0.2) {
            status = 'OVERDUE';
        }

        const lineItems = matchedStructure.components.map((comp) => ({
            categoryId: comp.categoryId,
            name: comp.name,
            amount: comp.amount,
            paidAmount: status === 'PAID' ? comp.amount : status === 'PARTIALLY_PAID' ? Math.round(comp.amount * 0.5) : 0,
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            status: status === 'PAID' ? 'PAID' : status === 'PARTIALLY_PAID' ? 'PARTIALLY_PAID' : 'UNPAID',
        }));

        allocations.push({
            schoolId,
            academicYear: '2026-27',
            studentId: student._id,
            feeStructureId: matchedStructure._id,
            classId: student.classId,
            sectionId: student.sectionId,
            lineItems,
            totalPayable,
            discountAmount: 0,
            netPayable: totalPayable,
            paidAmount,
            balanceAmount,
            status,
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });
    }

    if (allocations.length) {
        const createdAllocations = await FeeAllocation.insertMany(allocations);

        // 4. Create sample receipts/transactions for paid portions
        const transactions = [];
        let receiptCounter = 1001;

        for (const alloc of createdAllocations) {
            if (alloc.paidAmount > 0) {
                transactions.push({
                    schoolId,
                    receiptNumber: `REC-2026-${String(receiptCounter++).padStart(5, '0')}`,
                    allocationId: alloc._id,
                    studentId: alloc.studentId,
                    amount: alloc.paidAmount,
                    paymentMethod: receiptCounter % 2 === 0 ? 'UPI' : 'CASH',
                    transactionReference: receiptCounter % 2 === 0 ? `UPI${Date.now().toString().slice(-8)}` : 'CH-OFFLINE',
                    collectedByName: 'Accounts Desk',
                    remarks: 'Quarter 1 Tuition & Laboratory Fee payment verified',
                    paymentDate: new Date(Date.now() - Math.floor(Math.random() * 20) * 86400000),
                    status: 'SUCCESS',
                    breakdown: alloc.lineItems.map((li) => ({
                        name: li.name,
                        amountPaid: li.paidAmount,
                    })),
                });
            }
        }

        if (transactions.length) {
            await FeeTransaction.insertMany(transactions);
        }
    }
};

/**
 * 1. Fee Management Executive Overview (KPIs, Collections, Trends, Defaulters)
 */
export const getFeeOverview = async (schoolId) => {
    await seedFeeDemoData(schoolId);

    const allocations = await FeeAllocation.find({ schoolId }).lean();
    const transactions = await FeeTransaction.find({ schoolId, status: 'SUCCESS' })
        .sort({ paymentDate: -1 })
        .limit(10)
        .populate('studentId', 'admissionNo firstName lastName personalInfo')
        .lean();

    const totalProjected = allocations.reduce((acc, curr) => acc + (curr.netPayable || 0), 0);
    const totalCollected = allocations.reduce((acc, curr) => acc + (curr.paidAmount || 0), 0);
    const totalPending = allocations.reduce((acc, curr) => acc + (curr.balanceAmount || 0), 0);
    const defaultersCount = allocations.filter((a) => a.status === 'OVERDUE' || (a.balanceAmount > 0 && a.dueDate && new Date(a.dueDate) < new Date())).length;
    const collectionRate = totalProjected > 0 ? Math.round((totalCollected / totalProjected) * 100) : 0;

    // Monthly Collection Trend (last 6 months)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const trendMap = {};

    for (let i = 5; i >= 0; i--) {
        const mIdx = (currentMonth - i + 12) % 12;
        trendMap[monthNames[mIdx]] = 0;
    }

    const allTxns = await FeeTransaction.find({ schoolId, status: 'SUCCESS' }).lean();
    allTxns.forEach((tx) => {
        const m = monthNames[new Date(tx.paymentDate).getMonth()];
        if (trendMap[m] !== undefined) {
            trendMap[m] += tx.amount || 0;
        }
    });

    const monthlyTrend = Object.keys(trendMap).map((m) => ({
        month: m,
        collected: trendMap[m],
    }));

    return {
        kpis: {
            totalProjected,
            totalCollected,
            totalPending,
            defaultersCount,
            collectionRate,
            activeAllocationsCount: allocations.length,
            fullyPaidCount: allocations.filter((a) => a.status === 'PAID').length,
            unpaidCount: allocations.filter((a) => a.status === 'UNPAID').length,
            partialCount: allocations.filter((a) => a.status === 'PARTIALLY_PAID').length,
        },
        monthlyTrend,
        recentTransactions: transactions.map((tx) => ({
            _id: tx._id,
            receiptNumber: tx.receiptNumber,
            amount: tx.amount,
            paymentMethod: tx.paymentMethod,
            paymentDate: tx.paymentDate,
            transactionReference: tx.transactionReference,
            collectedByName: tx.collectedByName,
            student: tx.studentId ? {
                id: tx.studentId._id,
                admissionNo: tx.studentId.admissionNo,
                name: `${tx.studentId.firstName || tx.studentId.personalInfo?.firstName || ''} ${tx.studentId.lastName || tx.studentId.personalInfo?.lastName || ''}`.trim(),
            } : null,
        })),
    };
};

/**
 * 2. Get All Fee Categories
 */
export const getFeeCategories = async (schoolId) => {
    await seedFeeDemoData(schoolId);
    return await FeeCategory.find({ schoolId }).sort({ name: 1 }).lean();
};

/**
 * 3. Create a Fee Category
 */
export const createFeeCategory = async (schoolId, data) => {
    const { name, code, description, isTaxable, taxRate } = data;
    if (!name || !code) throw ApiError.badRequest('Category name and code are required');

    const existing = await FeeCategory.findOne({ schoolId, code: code.toUpperCase().trim() });
    if (existing) throw ApiError.conflict('Category with this code already exists');

    return await FeeCategory.create({
        schoolId,
        name: name.trim(),
        code: code.toUpperCase().trim(),
        description: description || '',
        isTaxable: Boolean(isTaxable),
        taxRate: Number(taxRate) || 0,
    });
};

/**
 * 4. Get Fee Structures with Class Population
 */
export const getFeeStructures = async (schoolId) => {
    await seedFeeDemoData(schoolId);
    return await FeeStructure.find({ schoolId })
        .populate('classIds', 'name grade level')
        .populate('components.categoryId', 'name code')
        .sort({ createdAt: -1 })
        .lean();
};

/**
 * 5. Create Fee Structure
 */
export const createFeeStructure = async (schoolId, data) => {
    const { name, classIds, components, description, academicYear } = data;
    if (!name || !Array.isArray(classIds) || !classIds.length || !Array.isArray(components) || !components.length) {
        throw ApiError.badRequest('Structure name, target classes, and at least one fee component are required');
    }

    const totalAmount = components.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);

    const structure = await FeeStructure.create({
        schoolId,
        academicYear: academicYear || '2026-27',
        name: name.trim(),
        description: description || '',
        classIds,
        components: components.map((c) => ({
            categoryId: c.categoryId,
            name: c.name,
            amount: Number(c.amount),
            dueDate: c.dueDate || null,
            frequency: c.frequency || 'QUARTERLY',
        })),
        totalAmount,
        status: 'ACTIVE',
    });

    eventBus.publish(DOMAIN_EVENTS.FEE_ASSIGNED, {
        schoolId,
        structureId: structure._id,
        name: structure.name,
    });

    return structure;
};

/**
 * 6. Get Fee Allocations (Filterable by Class, Status, Search)
 */
export const getFeeAllocations = async (schoolId, query = {}) => {
    await seedFeeDemoData(schoolId);

    const { classId, sectionId, status, search, page = 1, limit = 15 } = query;
    const filter = { schoolId };

    if (classId && classId !== 'All') filter.classId = classId;
    if (sectionId && sectionId !== 'All') filter.sectionId = sectionId;
    if (status && status !== 'All') filter.status = status;

    const skip = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);

    let allocations = await FeeAllocation.find(filter)
        .populate('studentId', 'admissionNo rollNo firstName lastName personalInfo classId sectionId')
        .populate('feeStructureId', 'name totalAmount')
        .populate('classId', 'name')
        .populate('sectionId', 'name')
        .sort({ createdAt: -1 })
        .lean();

    if (search && search.trim()) {
        const q = search.toLowerCase().trim();
        allocations = allocations.filter((a) => {
            const s = a.studentId;
            if (!s) return false;
            const fullName = `${s.firstName || s.personalInfo?.firstName || ''} ${s.lastName || s.personalInfo?.lastName || ''}`.toLowerCase();
            const adm = (s.admissionNo || '').toLowerCase();
            return fullName.includes(q) || adm.includes(q);
        });
    }

    const total = allocations.length;
    const paginated = allocations.slice(skip, skip + parseInt(limit));

    return {
        allocations: paginated,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages: Math.ceil(total / parseInt(limit)) || 1,
        },
    };
};

/**
 * 7. Get Single Student Fee Account Ledger
 */
export const getStudentFeeAccount = async (schoolId, studentId) => {
    const student = await Student.findOne({ _id: studentId, schoolId })
        .populate('classId', 'name')
        .populate('sectionId', 'name')
        .lean();

    if (!student) throw ApiError.notFound('Student record not found');

    const allocations = await FeeAllocation.find({ schoolId, studentId })
        .populate('feeStructureId', 'name components')
        .lean();

    const transactions = await FeeTransaction.find({ schoolId, studentId, status: 'SUCCESS' })
        .sort({ paymentDate: -1 })
        .lean();

    const totalPayable = allocations.reduce((sum, a) => sum + (a.netPayable || 0), 0);
    const totalPaid = allocations.reduce((sum, a) => sum + (a.paidAmount || 0), 0);
    const balanceDue = totalPayable - totalPaid;

    return {
        student: {
            id: student._id,
            admissionNo: student.admissionNo,
            rollNo: student.rollNo,
            name: `${student.firstName || student.personalInfo?.firstName || ''} ${student.lastName || student.personalInfo?.lastName || ''}`.trim(),
            className: student.classId?.name || '',
            sectionName: student.sectionId?.name || '',
            fatherName: student.fatherName || student.guardianInfo?.fatherName || '',
            phone: student.emergencyContact || student.fatherPhone || student.guardianInfo?.emergencyPhone || '',
        },
        summary: {
            totalPayable,
            totalPaid,
            balanceDue,
            status: balanceDue === 0 ? 'CLEAR' : 'OUTSTANDING',
        },
        allocations,
        transactions,
    };
};

/**
 * 8. Collect Fee Payment (Atomic Transaction & Receipt Generation)
 */
export const collectFeePayment = async (schoolId, data, cashierUser) => {
    const { allocationId, amount, paymentMethod = 'CASH', transactionReference = '', remarks = '' } = data;

    if (!allocationId) throw ApiError.badRequest('Allocation ID is required');
    const payAmount = Number(amount);
    if (!payAmount || payAmount <= 0) throw ApiError.badRequest('Valid payment amount is required');

    const allocation = await FeeAllocation.findOne({ _id: allocationId, schoolId });
    if (!allocation) throw ApiError.notFound('Fee allocation record not found');

    if (payAmount > allocation.balanceAmount) {
        throw ApiError.badRequest(`Payment amount cannot exceed outstanding balance of ₹${allocation.balanceAmount.toLocaleString('en-IN')}`);
    }

    // Auto-generate unique receipt number
    const txnCount = await FeeTransaction.countDocuments({ schoolId });
    const receiptNumber = `REC-${new Date().getFullYear()}-${String(txnCount + 1001).padStart(5, '0')}`;

    // Update Allocation
    allocation.paidAmount += payAmount;
    allocation.balanceAmount = Math.max(0, allocation.netPayable - allocation.paidAmount);
    allocation.status = allocation.balanceAmount === 0 ? 'PAID' : 'PARTIALLY_PAID';

    // Distribute paidAmount across unpaid line items
    let remainingToDistribute = payAmount;
    const breakdown = [];

    for (const item of allocation.lineItems) {
        const itemBal = item.amount - (item.paidAmount || 0);
        if (itemBal > 0 && remainingToDistribute > 0) {
            const take = Math.min(itemBal, remainingToDistribute);
            item.paidAmount = (item.paidAmount || 0) + take;
            item.status = item.paidAmount >= item.amount ? 'PAID' : 'PARTIALLY_PAID';
            remainingToDistribute -= take;
            breakdown.push({ name: item.name, amountPaid: take });
        }
    }

    await allocation.save();

    // Create Transaction Record
    const transaction = await FeeTransaction.create({
        schoolId,
        receiptNumber,
        allocationId: allocation._id,
        studentId: allocation.studentId,
        amount: payAmount,
        paymentMethod,
        transactionReference: transactionReference.trim(),
        collectedBy: cashierUser?._id || null,
        collectedByName: cashierUser ? `${cashierUser.firstName || ''} ${cashierUser.lastName || ''}`.trim() : 'Fee Cashier',
        remarks: remarks.trim(),
        paymentDate: new Date(),
        breakdown,
        status: 'SUCCESS',
    });

    eventBus.publish(DOMAIN_EVENTS.PAYMENT_CAPTURED, {
        schoolId,
        receiptNumber,
        amount: payAmount,
        studentId: allocation.studentId,
        allocationId: allocation._id,
    });

    return {
        transaction,
        allocation,
        receiptNumber,
    };
};

/**
 * 9. Get Transaction Register / Receipts
 */
export const getFeeTransactions = async (schoolId, query = {}) => {
    await seedFeeDemoData(schoolId);

    const { search, paymentMethod, page = 1, limit = 20 } = query;
    const filter = { schoolId, status: 'SUCCESS' };

    if (paymentMethod && paymentMethod !== 'All') filter.paymentMethod = paymentMethod;

    const skip = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);

    let transactions = await FeeTransaction.find(filter)
        .populate('studentId', 'admissionNo firstName lastName personalInfo classId')
        .sort({ paymentDate: -1 })
        .lean();

    if (search && search.trim()) {
        const q = search.toLowerCase().trim();
        transactions = transactions.filter((t) => {
            const rec = (t.receiptNumber || '').toLowerCase();
            const ref = (t.transactionReference || '').toLowerCase();
            const s = t.studentId;
            const sName = s ? `${s.firstName || s.personalInfo?.firstName || ''} ${s.lastName || s.personalInfo?.lastName || ''}`.toLowerCase() : '';
            return rec.includes(q) || ref.includes(q) || sName.includes(q);
        });
    }

    const total = transactions.length;
    const paginated = transactions.slice(skip, skip + parseInt(limit));

    return {
        transactions: paginated,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages: Math.ceil(total / parseInt(limit)) || 1,
        },
    };
};

/**
 * 10. Get Defaulters / Overdue Accounts
 */
export const getFeeDefaulters = async (schoolId, query = {}) => {
    await seedFeeDemoData(schoolId);

    const { classId } = query;
    const filter = {
        schoolId,
        balanceAmount: { $gt: 0 },
        $or: [
            { status: 'OVERDUE' },
            { dueDate: { $lt: new Date() } }
        ]
    };

    if (classId && classId !== 'All') filter.classId = classId;

    const defaulters = await FeeAllocation.find(filter)
        .populate('studentId', 'admissionNo rollNo firstName lastName fatherName fatherPhone emergencyContact personalInfo guardianInfo')
        .populate('classId', 'name')
        .populate('sectionId', 'name')
        .populate('feeStructureId', 'name')
        .sort({ balanceAmount: -1 })
        .lean();

    return defaulters;
};
