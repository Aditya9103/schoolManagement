import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema(
    {
        schoolId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'School',
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: [true, 'Role name is required'],
            trim: true,
            maxlength: 50,
        },
        description: {
            type: String,
            trim: true,
            maxlength: 250,
            default: '',
        },
        isSystemRole: {
            type: Boolean,
            default: false,
        },
        badge: {
            type: String,
            enum: ['System', 'Custom'],
            default: 'Custom',
        },
        color: {
            type: String,
            default: 'blue',
        },
        icon: {
            type: String,
            default: 'User',
        },
        assignedUsersCount: {
            type: Number,
            default: 0,
        },
        // Granular permissions map
        // Key is featureId (e.g. 'dashboard_main', 'students_list', 'fees_collection')
        // Value is { pageAccess, view, create, edit, delete, export, other }
        permissions: {
            type: Map,
            of: new mongoose.Schema(
                {
                    pageAccess: { type: Boolean, default: false },
                    view: { type: Boolean, default: false },
                    create: { type: Boolean, default: false },
                    edit: { type: Boolean, default: false },
                    delete: { type: Boolean, default: false },
                    export: { type: Boolean, default: false },
                    other: { type: Map, of: Boolean, default: {} },
                },
                { _id: false }
            ),
            default: {},
        },
    },
    {
        timestamps: true,
        toJSON: { flattenMaps: true },
        toObject: { flattenMaps: true },
    }
);

roleSchema.index({ schoolId: 1, name: 1 }, { unique: true });

export default mongoose.model('Role', roleSchema);
