import React, { useState, useEffect } from 'react';
import {
    Search,
    ChevronDown,
    ChevronUp,
    Copy,
    Save,
    CheckSquare,
    Square,
    LayoutDashboard,
    Users,
    UserCheck,
    BookOpen,
    Wallet,
    Megaphone,
    Bus,
    Settings,
    Check,
    X
} from 'lucide-react';

const MODULE_ICON_MAP = {
    LayoutDashboard: LayoutDashboard,
    Users: Users,
    UserCheck: UserCheck,
    BookOpen: BookOpen,
    Wallet: Wallet,
    Megaphone: Megaphone,
    Bus: Bus,
    Settings: Settings,
};

const MODULE_COLOR_MAP = {
    rose: 'bg-rose-50 text-rose-600 border-rose-200',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
    sky: 'bg-sky-50 text-sky-600 border-sky-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    violet: 'bg-violet-50 text-violet-600 border-violet-200',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200',
};

export default function EditRoleMatrixPanel({
    role,
    moduleDefinitions = [],
    onSaveChanges,
    onCopyRole,
    isSaving,
}) {
    const [roleName, setRoleName] = useState('');
    const [roleDescription, setRoleDescription] = useState('');
    const [permissions, setPermissions] = useState({});
    const [expandedModules, setExpandedModules] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Sync state when role changes
    useEffect(() => {
        if (role) {
            setRoleName(role.name || '');
            setRoleDescription(role.description || '');
            // Convert Map or object to regular JS object
            const perms = role.permissions instanceof Map
                ? Object.fromEntries(role.permissions)
                : { ...(role.permissions || {}) };
            setPermissions(perms);
            setHasUnsavedChanges(false);

            // Expand all by default
            const initialExpanded = {};
            moduleDefinitions.forEach((mod) => {
                initialExpanded[mod.id] = true;
            });
            setExpandedModules(initialExpanded);
        }
    }, [role, moduleDefinitions]);

    // Handle single checkbox toggle
    const handleCheckboxToggle = (featureId, field, otherKey = null) => {
        setPermissions((prev) => {
            const currentFeature = prev[featureId] || {
                pageAccess: false,
                view: false,
                create: false,
                edit: false,
                delete: false,
                export: false,
                other: {},
            };

            let updatedFeature = { ...currentFeature };

            if (otherKey) {
                const currentOther = { ...(currentFeature.other || {}) };
                currentOther[otherKey] = !currentOther[otherKey];
                updatedFeature.other = currentOther;
            } else {
                const newVal = !currentFeature[field];
                updatedFeature[field] = newVal;

                // Smart propagation:
                // 1. If unchecking pageAccess, turn off all actions
                if (field === 'pageAccess' && !newVal) {
                    updatedFeature.view = false;
                    updatedFeature.create = false;
                    updatedFeature.edit = false;
                    updatedFeature.delete = false;
                    updatedFeature.export = false;
                }

                // 2. If checking create/edit/delete/export, auto-enable pageAccess and view
                if (['create', 'edit', 'delete', 'export'].includes(field) && newVal) {
                    updatedFeature.pageAccess = true;
                    updatedFeature.view = true;
                }

                // 3. If checking view, ensure pageAccess is enabled
                if (field === 'view' && newVal) {
                    updatedFeature.pageAccess = true;
                }
            }

            setHasUnsavedChanges(true);
            return {
                ...prev,
                [featureId]: updatedFeature,
            };
        });
    };

    // Scope selection change
    const handleScopeChange = (featureId, newScope) => {
        setPermissions((prev) => {
            const existing = prev[featureId] || {};
            return {
                ...prev,
                [featureId]: {
                    ...existing,
                    dataScope: newScope,
                },
            };
        });
        setHasUnsavedChanges(true);
    };

    // Master module toggle: turn all features in module ON or OFF
    const handleModuleToggle = (moduleDef) => {
        const anyActive = moduleDef.features.some((f) => permissions[f.id]?.pageAccess);
        const shouldEnable = !anyActive;

        setPermissions((prev) => {
            const updated = { ...prev };
            moduleDef.features.forEach((feat) => {
                updated[feat.id] = {
                    pageAccess: shouldEnable,
                    view: shouldEnable,
                    create: shouldEnable,
                    edit: shouldEnable,
                    delete: false,
                    export: shouldEnable,
                    other: feat.otherLabel ? { [feat.otherLabel]: shouldEnable } : {},
                };
            });
            setHasUnsavedChanges(true);
            return updated;
        });
    };

    // Toolbar: Select All
    const handleSelectAll = () => {
        setPermissions((prev) => {
            const updated = { ...prev };
            moduleDefinitions.forEach((mod) => {
                mod.features.forEach((feat) => {
                    updated[feat.id] = {
                        pageAccess: true,
                        view: true,
                        create: true,
                        edit: true,
                        delete: true,
                        export: true,
                        other: feat.otherLabel ? { [feat.otherLabel]: true } : {},
                    };
                });
            });
            setHasUnsavedChanges(true);
            return updated;
        });
    };

    // Toolbar: Clear All
    const handleClearAll = () => {
        setPermissions((prev) => {
            const updated = { ...prev };
            moduleDefinitions.forEach((mod) => {
                mod.features.forEach((feat) => {
                    updated[feat.id] = {
                        pageAccess: false,
                        view: false,
                        create: false,
                        edit: false,
                        delete: false,
                        export: false,
                        other: {},
                    };
                });
            });
            setHasUnsavedChanges(true);
            return updated;
        });
    };

    // Toolbar: Expand / Collapse All
    const handleExpandAll = () => {
        const exp = {};
        moduleDefinitions.forEach((mod) => (exp[mod.id] = true));
        setExpandedModules(exp);
    };

    const handleCollapseAll = () => {
        const col = {};
        moduleDefinitions.forEach((mod) => (col[mod.id] = false));
        setExpandedModules(col);
    };

    const handleSave = () => {
        onSaveChanges({
            name: roleName,
            description: roleDescription,
            permissions,
        });
        setHasUnsavedChanges(false);
    };

    if (!role) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-8 text-center text-slate-600 font-medium">
                Select a role to configure permissions.
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col h-full overflow-hidden">
            {/* Header: Title + Role Badge + Save Button */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight font-display">
                            Edit Role
                        </h2>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                            role.isSystemRole
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                            {role.isSystemRole ? 'System Role' : 'Custom Role'}
                        </span>
                        {hasUnsavedChanges && (
                            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" title="Unsaved changes" />
                        )}
                    </div>
                    <p className="text-xs text-slate-700 font-medium mt-0.5">
                        Configure permissions for the <span className="font-bold text-slate-800">{role.name}</span> role
                    </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <button
                        type="button"
                        onClick={() => onCopyRole(role)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-2xs"
                    >
                        <Copy size={13} /> Copy Role
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95"
                    >
                        {isSaving ? (
                            <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Save size={13} />
                        )}
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Form Fields: Role Name + Description */}
            <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-1">
                        Role Name
                    </label>
                    <input
                        type="text"
                        value={roleName}
                        disabled={role.isSystemRole}
                        onChange={(e) => {
                            setRoleName(e.target.value);
                            setHasUnsavedChanges(true);
                        }}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-700 font-bold text-slate-900 shadow-2xs"
                    />
                </div>
                <div>
                    <label className="block text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-1">
                        Description
                    </label>
                    <input
                        type="text"
                        value={roleDescription}
                        onChange={(e) => {
                            setRoleDescription(e.target.value);
                            setHasUnsavedChanges(true);
                        }}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-slate-900 shadow-2xs"
                    />
                </div>
            </div>

            {/* Matrix Toolbar: Search, View Mode, Bulk Actions */}
            <div className="p-3 border-b border-slate-100 bg-white flex flex-wrap items-center justify-between gap-2.5">
                <div className="relative flex-1 min-w-[200px] max-w-xs">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 font-medium" />
                    <input
                        type="text"
                        placeholder="Search modules or permissions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 placeholder:text-slate-500 font-medium"
                    />
                </div>

                <div className="flex items-center gap-2 flex-wrap text-xs">
                    <button
                        type="button"
                        onClick={handleExpandAll}
                        className="text-[11px] font-bold text-slate-700 hover:text-slate-900 px-2 py-1 rounded-lg hover:bg-slate-100 cursor-pointer"
                    >
                        Expand All
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                        type="button"
                        onClick={handleCollapseAll}
                        className="text-[11px] font-bold text-slate-700 hover:text-slate-900 px-2 py-1 rounded-lg hover:bg-slate-100 cursor-pointer"
                    >
                        Collapse All
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                        type="button"
                        onClick={handleSelectAll}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 px-2 py-1 rounded-lg hover:bg-blue-50 cursor-pointer"
                    >
                        <CheckSquare size={13} /> Select All
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                        type="button"
                        onClick={handleClearAll}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 hover:text-rose-700 px-2 py-1 rounded-lg hover:bg-rose-50 cursor-pointer"
                    >
                        <Square size={13} /> Clear All
                    </button>
                </div>
            </div>

            {/* Permission Accordions */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200">
                {moduleDefinitions.map((modDef) => {
                    const isExpanded = expandedModules[modDef.id] !== false;
                    const IconComponent = MODULE_ICON_MAP[modDef.icon] || LayoutDashboard;
                    const colorStyle = MODULE_COLOR_MAP[modDef.color] || MODULE_COLOR_MAP.blue;
                    const isModuleActive = modDef.features.some((f) => permissions[f.id]?.pageAccess);

                    // Filter features by search query
                    const filteredFeatures = modDef.features.filter((f) =>
                        f.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        f.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        modDef.name.toLowerCase().includes(searchQuery.toLowerCase())
                    );

                    if (searchQuery && filteredFeatures.length === 0) {
                        return null;
                    }

                    return (
                        <div
                            key={modDef.id}
                            className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-2xs"
                        >
                            {/* Module Header Bar */}
                            <div className="p-3 sm:p-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className={`p-2 rounded-xl border shrink-0 ${colorStyle}`}>
                                        <IconComponent size={16} />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate font-display">
                                            {modDef.name}
                                        </h3>
                                        <p className="text-[11px] text-slate-700 font-semibold truncate leading-tight">
                                            {modDef.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                    {/* Master Enable/Disable Toggle */}
                                    <button
                                        type="button"
                                        onClick={() => handleModuleToggle(modDef)}
                                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                            isModuleActive ? 'bg-blue-600' : 'bg-slate-300'
                                        }`}
                                    >
                                        <span
                                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                                isModuleActive ? 'translate-x-4' : 'translate-x-0'
                                            }`}
                                        />
                                    </button>
                                    <span className="text-[11px] font-bold text-slate-600 hidden sm:inline">
                                        {isModuleActive ? 'Enabled' : 'Disabled'}
                                    </span>

                                    {/* Collapse / Expand Toggle */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setExpandedModules((prev) => ({
                                                ...prev,
                                                [modDef.id]: !isExpanded,
                                            }))
                                        }
                                        className="p-1 text-slate-600 font-medium hover:text-slate-600 rounded-lg hover:bg-slate-200/50"
                                    >
                                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* Features Table */}
                            {isExpanded && (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse text-xs">
                                        <thead>
                                            <tr className="border-b border-slate-200 bg-slate-100/80 text-slate-800 font-bold text-xs">
                                                <th className="py-2.5 px-4 min-w-[200px]">Page / Feature</th>
                                                <th className="py-2.5 px-2 text-center">Page Access</th>
                                                <th className="py-2.5 px-2 text-center">View</th>
                                                <th className="py-2.5 px-2 text-center">Create</th>
                                                <th className="py-2.5 px-2 text-center">Edit</th>
                                                <th className="py-2.5 px-2 text-center">Delete</th>
                                                <th className="py-2.5 px-2 text-center">Export</th>
                                                <th className="py-2.5 px-3 text-center">Data Scope</th>
                                                <th className="py-2.5 px-4 text-center">Other</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredFeatures.map((feat) => {
                                                const featurePerms = permissions[feat.id] || {};
                                                const isPageAccessible = Boolean(featurePerms.pageAccess);

                                                return (
                                                    <tr
                                                        key={feat.id}
                                                        className="hover:bg-blue-50/40 transition-colors"
                                                    >
                                                        {/* Feature Name & Description */}
                                                        <td className="py-2.5 px-4">
                                                            <p className="font-bold text-slate-900 text-xs">
                                                                {feat.label}
                                                            </p>
                                                            <p className="text-[11px] text-slate-600 font-medium leading-tight mt-0.5">
                                                                {feat.desc}
                                                            </p>
                                                        </td>

                                                        {/* Page Access Master Checkbox */}
                                                        <td className="py-2.5 px-2 text-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={isPageAccessible}
                                                                onChange={() =>
                                                                    handleCheckboxToggle(feat.id, 'pageAccess')
                                                                }
                                                                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                                                            />
                                                        </td>

                                                        {/* View */}
                                                        <td className="py-2.5 px-2 text-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={Boolean(featurePerms.view)}
                                                                onChange={() =>
                                                                    handleCheckboxToggle(feat.id, 'view')
                                                                }
                                                                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                                                            />
                                                        </td>

                                                        {/* Create */}
                                                        <td className="py-2.5 px-2 text-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={Boolean(featurePerms.create)}
                                                                onChange={() =>
                                                                    handleCheckboxToggle(feat.id, 'create')
                                                                }
                                                                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                                                            />
                                                        </td>

                                                        {/* Edit */}
                                                        <td className="py-2.5 px-2 text-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={Boolean(featurePerms.edit)}
                                                                onChange={() =>
                                                                    handleCheckboxToggle(feat.id, 'edit')
                                                                }
                                                                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                                                            />
                                                        </td>

                                                        {/* Delete */}
                                                        <td className="py-2.5 px-2 text-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={Boolean(featurePerms.delete)}
                                                                onChange={() =>
                                                                    handleCheckboxToggle(feat.id, 'delete')
                                                                }
                                                                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                                                            />
                                                        </td>

                                                        {/* Export */}
                                                        <td className="py-2.5 px-2 text-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={Boolean(featurePerms.export)}
                                                                onChange={() =>
                                                                    handleCheckboxToggle(feat.id, 'export')
                                                                }
                                                                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                                                            />
                                                        </td>

                                                        {/* Data Scope Dropdown */}
                                                        <td className="py-2.5 px-3 text-center">
                                                            {feat.supportedScopes && feat.supportedScopes.length > 0 ? (
                                                                <select
                                                                    value={featurePerms.dataScope || feat.defaultScope || 'ALL_SCHOOL'}
                                                                    onChange={(e) => handleScopeChange(feat.id, e.target.value)}
                                                                    className="text-[11px] font-semibold bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                                                                >
                                                                    {feat.supportedScopes.map((scopeVal) => (
                                                                        <option key={scopeVal} value={scopeVal}>
                                                                            {scopeVal.replace(/_/g, ' ')}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            ) : (
                                                                <span className="text-[11px] font-medium text-slate-500">
                                                                    {featurePerms.dataScope ? featurePerms.dataScope.replace(/_/g, ' ') : 'All School'}
                                                                </span>
                                                            )}
                                                        </td>

                                                        {/* Other Granular Action */}
                                                        <td className="py-2.5 px-4 text-center">
                                                            {feat.otherLabel ? (
                                                                <label className="inline-flex items-center gap-1.5 cursor-pointer bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-800 transition-colors">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={Boolean(
                                                                            featurePerms.other?.[feat.otherLabel]
                                                                        )}
                                                                        onChange={() =>
                                                                            handleCheckboxToggle(
                                                                                feat.id,
                                                                                null,
                                                                                feat.otherLabel
                                                                            )
                                                                        }
                                                                        className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                                                                    />
                                                                    <span className="whitespace-nowrap">
                                                                        {feat.otherLabel}
                                                                    </span>
                                                                </label>
                                                            ) : (
                                                                <span className="text-slate-600 font-medium font-bold">-</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
