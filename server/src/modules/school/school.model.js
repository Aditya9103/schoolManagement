import mongoose from "mongoose";

const schoolSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        code: { type: String, required: true, unique: true, uppercase: true, trim: true },
        tagline: { type: String, trim: true, default: '' },
        schoolType: {
            type: String,
            enum: ['K-12 School', 'Primary School', 'High School', 'Play School / Pre-K', 'Higher Secondary', 'Other'],
            default: 'K-12 School',
        },
        logoUrl: { type: String, default: null },
        coverImageUrl: { type: String, default: null },
        faviconUrl: { type: String, default: null },
        address: {
            line1: { type: String, trim: true },
            line2: { type: String, trim: true },
            city: { type: String, trim: true },
            state: { type: String, trim: true },
            pincode: { type: String, trim: true },
            country: { type: String, default: 'India' },
        },
        contactEmail: { type: String, lowercase: true, trim: true },
        contactPhone: { type: String, trim: true },
        website: { type: String, trim: true, default: null },
        board: {
            type: String,
            enum: ['CBSE', 'ICSE', 'STATE', 'IB', 'CAMBRIDGE', 'OTHER'],
            default: 'CBSE',
        },
        affiliationNo: { type: String, trim: true, default: null },
        principalName: { type: String, trim: true, default: null },
        establishedYear: { type: Number, default: null },
        studentCount: { type: Number, default: 0 },
        staffCount: { type: Number, default: 0 },
        // Subscription
        plan: {
            type: String,
            enum: ['BASIC', 'STANDARD', 'PRO', 'PREMIUM', 'ENTERPRISE'],
            default: 'STANDARD',
        },
        subscriptionStatus: {
            type: String,
            enum: ['ACTIVE', 'TRIAL', 'EXPIRING_SOON', 'EXPIRED', 'SUSPENDED'],
            default: 'ACTIVE',
        },
        subscriptionStartDate: { type: Date, default: () => new Date() },
        subscriptionEndDate: { type: Date, default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) },
        trialEndsAt: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
        // Enabled modules
        modulesEnabled: {
            type: [String],
            default: [
                'STUDENT_MANAGEMENT', 'TEACHER_MANAGEMENT', 'CLASSES_SECTIONS', 'TIMETABLE',
                'ASSIGNMENTS', 'ONLINE_EXAMS', 'STUDY_MATERIAL', 'LIVE_CLASSES',
                'ANNOUNCEMENTS', 'MESSAGES', 'PARENT_PORTAL', 'EMAIL_SMS',
            ],
        },
        // Branding / Theme
        primaryColor: { type: String, default: '#2563EB' },
        secondaryColor: { type: String, default: '#10B981' },
        accentColor: { type: String, default: '#F59E0B' },
        theme: {
            type: String,
            enum: ['MODERN', 'ACADEMIC', 'VIBRANT', 'MINIMAL'],
            default: 'MODERN',
        },
        onboardingStatus: {
            type: String,
            enum: ['PENDING_SETUP', 'AWAITING_INVITE', 'ACTIVE', 'COMPLETED'],
            default: 'ACTIVE',
        },
        // Admin user ref
        adminUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
        isActive: { type: Boolean, default: true },
        // Location for map
        coordinates: {
            lat: { type: Number, default: null },
            lng: { type: Number, default: null },
        },
        metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
        slug: { type: String, lowercase: true, trim: true, unique: true, sparse: true },
    },
    { timestamps: true }
);

schoolSchema.pre('validate', function () {
    if (!this.slug && this.name) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    }
});

schoolSchema.index({ subscriptionStatus: 1 });
schoolSchema.index({ plan: 1 });
schoolSchema.index({ isActive: 1 });

export default mongoose.model('School', schoolSchema);
