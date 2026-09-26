import React, { useState, useEffect } from 'react';
import {
    useGetSchoolRolesQuery,
    useGetModuleDefinitionsQuery,
    useUpdateRolePermissionsMutation,
    useCreateRoleMutation,
    useDeleteRoleMutation,
    useCopyRoleMutation,
    useResetRoleMutation,
} from '../../../../store/api/rolesApi';

import RolesListPanel from './components/RolesListPanel';
import EditRoleMatrixPanel from './components/EditRoleMatrixPanel';
import RoleSummaryPanel from './components/RoleSummaryPanel';
import CreateRoleModal from './components/CreateRoleModal';
import CopyRoleModal from './components/CopyRoleModal';
import { CheckCircle2, ChevronRight, ShieldCheck, Sparkles } from 'lucide-react';

const TABS = [
    { id: 'roles', label: 'Roles' },
    { id: 'matrix', label: 'Permission Matrix' },
    { id: 'users', label: 'User Assignment' },
    { id: 'data_access', label: 'Data Access Rules' },
    { id: 'logs', label: 'Access Logs' },
];

export default function RolesAndPermissionsPage() {
    const [activeTab, setActiveTab] = useState('roles');
    const [selectedRoleId, setSelectedRoleId] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [copyModalData, setCopyModalData] = useState(null);
    const [toastMessage, setToastMessage] = useState(null);

    // RTK Query hooks
    const { data: rolesRes, isLoading: rolesLoading } = useGetSchoolRolesQuery();
    const { data: modulesRes, isLoading: modulesLoading } = useGetModuleDefinitionsQuery();

    const [updateRole, { isLoading: isUpdating }] = useUpdateRolePermissionsMutation();
    const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
    const [deleteRole] = useDeleteRoleMutation();
    const [copyRole, { isLoading: isCopying }] = useCopyRoleMutation();
    const [resetRole] = useResetRoleMutation();

    const roles = rolesRes?.data || [];
    const moduleDefinitions = modulesRes?.data || [];

    // Automatically select the first role (School Admin) if none selected
    useEffect(() => {
        if (roles.length > 0 && !selectedRoleId) {
            setSelectedRoleId(roles[0]._id);
        }
    }, [roles, selectedRoleId]);

    const selectedRole = roles.find((r) => r._id === selectedRoleId) || roles[0];

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3500);
    };

    // Save changes to permissions
    const handleSaveChanges = async (updatedData) => {
        try {
            await updateRole({
                id: selectedRole._id,
                ...updatedData,
            }).unwrap();
            showToast(`Permissions for "${selectedRole.name}" updated successfully! Changes applied immediately.`);
        } catch (err) {
            showToast(err?.data?.message || 'Failed to update permissions');
        }
    };

    // Create custom role
    const handleCreateRole = async (data) => {
        try {
            const res = await createRole(data).unwrap();
            setIsCreateModalOpen(false);
            if (res?.data?._id) {
                setSelectedRoleId(res.data._id);
            }
            showToast(`Role "${data.name}" created successfully.`);
        } catch (err) {
            showToast(err?.data?.message || 'Failed to create role');
        }
    };

    // Copy role
    const handleCopyRole = async ({ id, name }) => {
        try {
            const res = await copyRole({ id, name }).unwrap();
            setCopyModalData(null);
            if (res?.data?._id) {
                setSelectedRoleId(res.data._id);
            }
            showToast(`Role cloned as "${name}" successfully.`);
        } catch (err) {
            showToast(err?.data?.message || 'Failed to clone role');
        }
    };

    // Reset role to default
    const handleResetRole = async (role) => {
        if (window.confirm(`Reset permissions for "${role.name}" back to system defaults?`)) {
            try {
                await resetRole(role._id).unwrap();
                showToast(`Role "${role.name}" reset to system defaults.`);
            } catch (err) {
                showToast(err?.data?.message || 'Failed to reset role');
            }
        }
    };

    // Delete custom role
    const handleDeleteRole = async (role) => {
        if (window.confirm(`Are you sure you want to delete role "${role.name}"?`)) {
            try {
                await deleteRole(role._id).unwrap();
                setSelectedRoleId(null);
                showToast(`Role "${role.name}" deleted successfully.`);
            } catch (err) {
                showToast(err?.data?.message || 'Failed to delete role');
            }
        }
    };

    if (rolesLoading || modulesLoading) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-7 space-y-5 max-w-[1720px] mx-auto min-h-screen bg-[#f8fafc]">
            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-2xl border border-slate-700 animate-in slide-in-from-top-3">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Breadcrumbs */}
            <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                <span>Staff Management</span>
                <ChevronRight size={13} className="text-slate-600 font-medium" />
                <span className="text-slate-900 font-bold">Roles &amp; Permissions</span>
            </div>

            {/* Header + Campus Art Banner */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-r from-[#0a192f] via-[#0f274a] to-[#061122] text-white p-5 sm:p-6 lg:p-7 shadow-lg border border-slate-800/80">
                {/* Background Campus Image with Overlay */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <img
                        src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=1400&auto=format&fit=crop&q=80"
                        alt="Campus"
                        className="w-full h-full object-cover opacity-20 transform scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#061122]/95 via-[#0a192f]/85 to-transparent" />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="max-w-xl space-y-1.5">
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-bold tracking-wide uppercase">
                                <ShieldCheck size={12} className="text-emerald-400" />
                                Access Control &amp; RBAC
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-display text-white">
                            Roles &amp; Permissions
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-300 font-medium">
                            Create custom roles and control exactly what each staff member can access and do.
                        </p>
                    </div>

                    {/* Slogan Graphic Right */}
                    <div className="hidden lg:flex flex-col items-end text-right">
                        <span className="font-serif italic text-lg text-amber-300 tracking-wide font-semibold drop-shadow-sm">
                            Secure Access, Stronger Schools
                        </span>
                        <p className="text-[11px] text-slate-300 font-medium mt-0.5">
                            Give the Right Access to the Right People.
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-slate-200">
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
                    {TABS.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${isActive
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 3-Panel Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* Left Panel: All Roles (3 cols) */}
                <div className="lg:col-span-3 xl:col-span-3 h-[820px] min-w-0">
                    <RolesListPanel
                        roles={roles}
                        selectedRoleId={selectedRole?._id}
                        onSelectRole={(id) => setSelectedRoleId(id)}
                        onCreateRole={() => setIsCreateModalOpen(true)}
                        onCopyRole={(role) => setCopyModalData(role)}
                        onResetRole={handleResetRole}
                        onDeleteRole={handleDeleteRole}
                    />
                </div>

                {/* Center Panel: Edit Role & Permission Matrix (5 cols on lg, 6 on xl) */}
                <div className="lg:col-span-5 xl:col-span-6 h-[820px] min-w-0">
                    <EditRoleMatrixPanel
                        role={selectedRole}
                        moduleDefinitions={moduleDefinitions}
                        onSaveChanges={handleSaveChanges}
                        onCopyRole={(role) => setCopyModalData(role)}
                        isSaving={isUpdating}
                    />
                </div>

                {/* Right Panel: Role Summary & Quick Tools (4 cols on lg, 3 on xl) */}
                <div className="lg:col-span-4 xl:col-span-3 space-y-4 min-w-0">
                    <RoleSummaryPanel
                        role={selectedRole}
                        moduleDefinitions={moduleDefinitions}
                        onCopyRole={(role) => setCopyModalData(role)}
                        onResetRole={handleResetRole}
                    />
                </div>
            </div>

            {/* Modals */}
            <CreateRoleModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreateRole={handleCreateRole}
                isCreating={isCreating}
            />

            <CopyRoleModal
                isOpen={Boolean(copyModalData)}
                sourceRole={copyModalData}
                onClose={() => setCopyModalData(null)}
                onCopyRole={handleCopyRole}
                isCopying={isCopying}
            />
        </div>
    );
}
