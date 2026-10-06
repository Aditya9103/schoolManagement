import Role from './role.model.js';
import User from '../auth/user.model.js';
import ApiError from '../../utils/ApiError.js';
import { MODULE_DEFINITIONS, DEFAULT_SYSTEM_ROLES } from './role.defaultPermissions.js';

export const getModuleDefinitions = () => {
    return MODULE_DEFINITIONS;
};

/**
 * Seed default system roles for a school if they don't already exist.
 */
export const seedDefaultRolesForSchool = async (schoolId) => {
    const existingCount = await Role.countDocuments({ schoolId });
    if (existingCount > 0) return;

    const rolesToCreate = DEFAULT_SYSTEM_ROLES.map((role) => ({
        schoolId,
        name: role.name,
        description: role.description,
        isSystemRole: true,
        badge: 'System',
        color: role.color,
        icon: role.icon,
        assignedUsersCount: role.assignedUsersCount || 0,
        permissions: role.permissions,
    }));

    await Role.insertMany(rolesToCreate);
};

/**
 * Get all roles for a school. Automatically seeds if empty.
 */
export const getRoles = async (schoolId) => {
    if (!schoolId) {
        throw ApiError.badRequest('School ID is required');
    }

    // Auto-seed if first time
    await seedDefaultRolesForSchool(schoolId);

    const roles = await Role.find({ schoolId }).sort({ isSystemRole: -1, createdAt: 1 });

    // Sync any newly added features (e.g. people module) to existing role documents
    for (const role of roles) {
        let changed = false;
        const defaultPreset = DEFAULT_SYSTEM_ROLES.find(r => r.name.toLowerCase() === role.name.toLowerCase());
        
        MODULE_DEFINITIONS.forEach(mod => {
            mod.features.forEach(feat => {
                const current = role.permissions.get ? role.permissions.get(feat.id) : role.permissions[feat.id];
                if (!current) {
                    const presetVal = defaultPreset?.permissions?.[feat.id] || {
                        pageAccess: false,
                        view: false,
                        create: false,
                        edit: false,
                        delete: false,
                        export: false,
                        other: {},
                        dataScope: feat.defaultScope || 'OWN_RECORDS'
                    };
                    if (role.permissions.set) {
                        role.permissions.set(feat.id, presetVal);
                    } else {
                        role.permissions[feat.id] = presetVal;
                    }
                    changed = true;
                } else if (!current.dataScope) {
                    current.dataScope = feat.defaultScope || 'ALL_SCHOOL';
                    if (role.permissions.set) {
                        role.permissions.set(feat.id, current);
                    }
                    changed = true;
                }
            });
        });

        if (changed) {
            role.markModified('permissions');
            await role.save();
        }
    }

    // Dynamically calculate assigned users count
    const enrichedRoles = await Promise.all(
        roles.map(async (role) => {
            const roleObj = role.toObject({ flattenMaps: true });
            const userCount = await User.countDocuments({
                schoolId,
                $or: [
                    { roleId: role._id },
                    { role: role.name.toUpperCase().replace(/\s+/g, '_') }
                ]
            });
            roleObj.assignedUsersCount = userCount || role.assignedUsersCount;
            return roleObj;
        })
    );

    return enrichedRoles;
};

/**
 * Get specific role by ID.
 */
export const getRoleById = async (roleId, schoolId) => {
    const role = await Role.findOne({ _id: roleId, schoolId });
    if (!role) {
        throw ApiError.notFound('Role not found');
    }
    return role.toObject ? role.toObject({ flattenMaps: true }) : role;
};

/**
 * Create a new custom role.
 */
export const createRole = async (schoolId, data) => {
    const { name, description, color, icon, permissions } = data;

    if (!name || !name.trim()) {
        throw ApiError.badRequest('Role name is required');
    }

    const existing = await Role.findOne({ schoolId, name: name.trim() });
    if (existing) {
        throw ApiError.conflict(`A role named "${name.trim()}" already exists in this school.`);
    }

    // Default permissions if not provided
    const rolePermissions = permissions || {};

    const newRole = await Role.create({
        schoolId,
        name: name.trim(),
        description: description?.trim() || '',
        isSystemRole: false,
        badge: 'Custom',
        color: color || 'blue',
        icon: icon || 'User',
        permissions: rolePermissions,
        assignedUsersCount: 0,
    });

    return newRole.toObject ? newRole.toObject({ flattenMaps: true }) : newRole;
};

/**
 * Update role permissions, name, or description.
 */
export const updateRole = async (roleId, schoolId, data) => {
    const role = await Role.findOne({ _id: roleId, schoolId });
    if (!role) {
        throw ApiError.notFound('Role not found');
    }

    // System role names cannot be renamed to prevent system desync
    if (data.name && role.isSystemRole && data.name !== role.name) {
        throw ApiError.badRequest('System role names cannot be modified');
    }

    if (data.name && data.name.trim() !== role.name) {
        const existing = await Role.findOne({
            schoolId,
            name: data.name.trim(),
            _id: { $ne: roleId }
        });
        if (existing) {
            throw ApiError.conflict(`A role named "${data.name.trim()}" already exists.`);
        }
        role.name = data.name.trim();
    }

    if (data.description !== undefined) role.description = data.description;
    if (data.color) role.color = data.color;
    if (data.icon) role.icon = data.icon;
    if (data.permissions) {
        role.permissions = data.permissions;
    }

    await role.save();
    return role.toObject ? role.toObject({ flattenMaps: true }) : role;
};

/**
 * Delete a custom role.
 */
export const deleteRole = async (roleId, schoolId) => {
    const role = await Role.findOne({ _id: roleId, schoolId });
    if (!role) {
        throw ApiError.notFound('Role not found');
    }

    if (role.isSystemRole) {
        throw ApiError.badRequest('System roles are essential and cannot be deleted.');
    }

    // Reassign any users who had this role to TEACHER or null
    await User.updateMany({ schoolId, roleId: role._id }, { $unset: { roleId: '' } });

    await role.deleteOne();
    return { success: true, message: `Role "${role.name}" deleted successfully.` };
};

/**
 * Copy an existing role into a new custom role.
 */
export const copyRole = async (roleId, schoolId, newName) => {
    const sourceRole = await Role.findOne({ _id: roleId, schoolId });
    if (!sourceRole) {
        throw ApiError.notFound('Source role not found');
    }

    const name = newName?.trim() || `${sourceRole.name} (Copy)`;
    const existing = await Role.findOne({ schoolId, name });
    if (existing) {
        throw ApiError.conflict(`A role named "${name}" already exists.`);
    }

    const clonedRole = await Role.create({
        schoolId,
        name,
        description: `Cloned from ${sourceRole.name}. ${sourceRole.description}`,
        isSystemRole: false,
        badge: 'Custom',
        color: sourceRole.color,
        icon: sourceRole.icon,
        permissions: sourceRole.permissions,
        assignedUsersCount: 0,
    });

    return clonedRole.toObject ? clonedRole.toObject({ flattenMaps: true }) : clonedRole;
};

/**
 * Reset role permissions to system default.
 */
export const resetToDefault = async (roleId, schoolId) => {
    const role = await Role.findOne({ _id: roleId, schoolId });
    if (!role) {
        throw ApiError.notFound('Role not found');
    }

    const defaultPreset = DEFAULT_SYSTEM_ROLES.find(r => r.name === role.name);
    if (!defaultPreset) {
        throw ApiError.badRequest('No default preset found for this custom role.');
    }

    role.permissions = defaultPreset.permissions;
    await role.save();
    return role.toObject ? role.toObject({ flattenMaps: true }) : role;
};

/**
 * Compute the dynamic permissions of the current logged-in user.
 */
export const getMyPermissions = async (user) => {
    if (!user) {
        throw ApiError.unauthorized('User context required');
    }

    // Super Admin and School Admin have full permissions
    if (user.role === 'SUPER_ADMIN' || user.role === 'SCHOOL_ADMIN') {
        const fullPerms = {};
        MODULE_DEFINITIONS.forEach(mod => {
            mod.features.forEach(feat => {
                fullPerms[feat.id] = {
                    pageAccess: true,
                    view: true,
                    create: true,
                    edit: true,
                    delete: true,
                    export: true,
                    other: feat.otherLabel ? { [feat.otherLabel]: true } : {},
                    dataScope: 'ALL_SCHOOL'
                };
            });
        });
        return {
            role: user.role,
            isSuperAdmin: user.role === 'SUPER_ADMIN',
            isSchoolAdmin: user.role === 'SCHOOL_ADMIN',
            permissions: fullPerms,
        };
    }

    const schoolId = user.schoolId || user.societyId;
    if (!schoolId) {
        return { role: user.role, permissions: {} };
    }

    // Look up assigned role in DB
    let roleDoc = null;
    if (user.roleId) {
        roleDoc = await Role.findById(user.roleId);
    }

    if (!roleDoc) {
        // Fallback match by role name (e.g. 'TEACHER' -> 'Teacher')
        const normalizedRoleName = user.role.replace(/_/g, ' ').toLowerCase();
        roleDoc = await Role.findOne({
            schoolId,
            name: { $regex: new RegExp(`^${normalizedRoleName}$`, 'i') }
        });
    }

    const perms = roleDoc?.toObject
        ? roleDoc.toObject({ flattenMaps: true }).permissions
        : (roleDoc?.permissions || {});

    return {
        role: user.role,
        roleName: roleDoc?.name || user.role,
        permissions: perms,
    };
};
