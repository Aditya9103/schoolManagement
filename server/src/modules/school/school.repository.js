/**
 * school.repository.js — Data access layer for School (Tenant) documents.
 * Controllers → Service → Repository → Model.
 * Never import the Model directly in Service; always go through Repository.
 */
import School from './school.model.js';
import { PAGINATION } from '../../config/constants.js';

// ── Create ─────────────────────────────────────────────────────────────────
export const create = async (data) => School.create(data);

// ── Find All (with pagination + filters) ──────────────────────────────────
export const findAll = async ({ page = 1, limit = 20, filter = {}, sort = { createdAt: -1 } } = {}) => {
    const safeLimit = Math.min(Number(limit), PAGINATION.MAX_LIMIT);
    const skip = (Number(page) - 1) * safeLimit;
    const [schools, total] = await Promise.all([
        School.find(filter).sort(sort).skip(skip).limit(safeLimit).lean(),
        School.countDocuments(filter),
    ]);
    return { schools, total, page: Number(page), limit: safeLimit, totalPages: Math.ceil(total / safeLimit) };
};

// ── Find by ID ─────────────────────────────────────────────────────────────
export const findById = async (id) => School.findById(id).lean();

// ── Find by Code ───────────────────────────────────────────────────────────
export const findByCode = async (code) => School.findOne({ code: code.toUpperCase() }).lean();

// ── Update ─────────────────────────────────────────────────────────────────
export const update = async (id, updates) =>
    School.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

// ── Toggle Active ──────────────────────────────────────────────────────────
export const toggleActive = async (id) => {
    const school = await School.findById(id);
    if (!school) return null;
    school.isActive = !school.isActive;
    return school.save();
};

// ── Aggregations ───────────────────────────────────────────────────────────
export const countByStatus = async (status) => School.countDocuments({ subscriptionStatus: status });

export const countAll = async () => School.countDocuments({});

export const getRecentSchools = async (limit = 5) =>
    School.find({}).sort({ createdAt: -1 }).limit(limit).lean();

export const getPlanBreakdown = async () =>
    School.aggregate([{ $group: { _id: '$plan', count: { $sum: 1 } } }]);

export const getMonthlyGrowth = async (fromDate) =>
    School.aggregate([
        { $match: { createdAt: { $gte: fromDate } } },
        { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);
