import React from 'react';
import {
    Shield,
    Grid,
    Users,
    Copy,
    Download,
    Upload,
    RotateCcw,
    BookOpen,
    Lightbulb
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function RoleSummaryPanel({
    role,
    moduleDefinitions = [],
    onCopyRole,
    onResetRole,
}) {
    if (!role) return null;

    const permissions = role.permissions instanceof Map
        ? Object.fromEntries(role.permissions)
        : (role.permissions || {});

    // Compute metrics
    let totalFeatures = 0;
    let enabledCount = 0;
    let enabledModulesCount = 0;

    moduleDefinitions.forEach((mod) => {
        let hasActiveInMod = false;
        mod.features.forEach((feat) => {
            totalFeatures += 1;
            const p = permissions[feat.id];
            if (p?.pageAccess || p?.view) {
                enabledCount += 1;
                hasActiveInMod = true;
            }
        });
        if (hasActiveInMod) enabledModulesCount += 1;
    });

    const disabledCount = Math.max(0, totalFeatures - enabledCount);
    const enabledPercentage = totalFeatures > 0 ? Math.round((enabledCount / totalFeatures) * 100) : 0;
    const disabledPercentage = 100 - enabledPercentage;

    const chartSize = 92;
    const strokeWidth = 10;
    const radius = (chartSize - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const enabledDash = totalFeatures > 0 ? (enabledCount / totalFeatures) * circumference : 0;

    // Export permissions as JSON
    const handleExportJson = () => {
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(role, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', dataStr);
        downloadAnchor.setAttribute('download', `${role.name.toLowerCase().replace(/\s+/g, '_')}_permissions.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    };

    return (
        <div className="space-y-4 min-w-0">
            {/* Card 1: Role Summary & Access Donut */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-4.5 overflow-hidden">
                <div className="flex items-center justify-between mb-3.5 gap-2">
                    <div className="min-w-0">
                        <span className="text-[10px] font-extrabold text-amber-800 font-bold uppercase tracking-wider block">
                            👑 Role Summary
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 font-display truncate">
                            {role.name}
                        </h3>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border shrink-0 ${role.isSystemRole
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                        {role.badge || (role.isSystemRole ? 'System' : 'Custom')}
                    </span>
                </div>

                {/* 3 Metric Chips */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                    <div
                        className="p-2 sm:p-2.5 bg-blue-50/80 border border-blue-200/80 rounded-xl text-center flex flex-col items-center justify-between min-w-0 shadow-2xs"
                        title="Total Active Permissions"
                    >
                        <Shield className="w-4 h-4 text-blue-600 mb-1 shrink-0" />
                        <span className="text-base sm:text-lg font-black text-slate-900 leading-none font-display">
                            {enabledCount}
                        </span>
                        <div className="mt-1 leading-tight text-center w-full">
                            <span className="text-[9px] text-slate-700 font-semibold block leading-none truncate">
                                Total
                            </span>
                            <span className="text-[9.5px] text-slate-800 font-bold block leading-tight mt-0.5 truncate">
                                Permissions
                            </span>
                        </div>
                    </div>

                    <div
                        className="p-2 sm:p-2.5 bg-emerald-50/80 border border-emerald-200/80 rounded-xl text-center flex flex-col items-center justify-between min-w-0 shadow-2xs"
                        title="Modules with Active Permissions"
                    >
                        <Grid className="w-4 h-4 text-emerald-700 font-bold mb-1 shrink-0" />
                        <span className="text-base sm:text-lg font-black text-slate-900 leading-none font-display">
                            {enabledModulesCount}
                        </span>
                        <div className="mt-1 leading-tight text-center w-full">
                            <span className="text-[9px] text-slate-700 font-semibold block leading-none truncate">
                                Modules
                            </span>
                            <span className="text-[9.5px] text-slate-800 font-bold block leading-tight mt-0.5 truncate">
                                Enabled
                            </span>
                        </div>
                    </div>

                    <div
                        className="p-2 sm:p-2.5 bg-purple-50/80 border border-purple-200/80 rounded-xl text-center flex flex-col items-center justify-between min-w-0 shadow-2xs"
                        title="Assigned Staff Count"
                    >
                        <Users className="w-4 h-4 text-purple-700 font-bold mb-1 shrink-0" />
                        <span className="text-base sm:text-lg font-black text-slate-900 leading-none font-display">
                            {role.assignedUsersCount || role.userCount || 0}
                        </span>
                        <div className="mt-1 leading-tight text-center w-full">
                            <span className="text-[9px] text-slate-700 font-semibold block leading-none truncate">
                                Assigned
                            </span>
                            <span className="text-[9.5px] text-slate-800 font-bold block leading-tight mt-0.5 truncate">
                                Users
                            </span>
                        </div>
                    </div>
                </div>

                {/* Module Access Donut Overview */}
                <div className="pt-3.5 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-bold text-slate-800 tracking-tight">
                            Module Access Overview
                        </h4>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            {enabledPercentage}% Active
                        </span>
                    </div>

                    {/* Centered Vector Donut */}
                    <div className="flex flex-col items-center justify-center my-2">
                        <div className="relative w-[104px] h-[104px] flex items-center justify-center">
                            <svg width={104} height={104} className="transform -rotate-90">
                                {/* Background Ring (Total) */}
                                <circle
                                    cx={52}
                                    cy={52}
                                    r={42}
                                    stroke="#E2E8F0"
                                    strokeWidth={10}
                                    fill="transparent"
                                />
                                {/* Foreground Arc (Enabled) */}
                                {enabledCount > 0 && (
                                    <circle
                                        cx={52}
                                        cy={52}
                                        r={42}
                                        stroke="#10B981"
                                        strokeWidth={10}
                                        fill="transparent"
                                        strokeDasharray={`${(enabledCount / totalFeatures) * (2 * Math.PI * 42)} ${2 * Math.PI * 42}`}
                                        strokeLinecap={enabledCount === totalFeatures ? 'butt' : 'round'}
                                        className="transition-all duration-500 ease-out"
                                    />
                                )}
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                                <span className="text-base font-black text-slate-900 leading-none font-display">
                                    {enabledCount}/{totalFeatures}
                                </span>
                                <span className="text-[9px] text-slate-700 font-extrabold font-bold uppercase tracking-wider mt-1">
                                    Permissions
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Donut Legend (Full Width Below Donut - Zero Truncation) */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                        <div className="flex items-center justify-between text-xs py-0.5">
                            <span className="flex items-center gap-2 text-slate-700 font-semibold text-[11px]">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                                Enabled
                            </span>
                            <span className="font-bold text-slate-900 text-xs">
                                {enabledCount} <span className="text-slate-700 font-semibold font-normal text-[10px]">({enabledPercentage}%)</span>
                            </span>
                        </div>

                        <div className="flex items-center justify-between text-xs py-0.5">
                            <span className="flex items-center gap-2 text-slate-700 font-semibold text-[11px]">
                                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 shrink-0" />
                                Disabled
                            </span>
                            <span className="font-bold text-slate-900 text-xs">
                                {disabledCount} <span className="text-slate-700 font-semibold font-normal text-[10px]">({disabledPercentage}%)</span>
                            </span>
                        </div>

                        <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-xs py-0.5">
                            <span className="flex items-center gap-2 text-slate-800 font-bold text-[11px]">
                                <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0" />
                                Total
                            </span>
                            <span className="font-black text-slate-900 text-xs">
                                {totalFeatures} <span className="text-slate-700 font-semibold font-normal text-[10px]">(100%)</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Card 2: Quick Actions */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-4.5">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
                    Quick Actions
                </h4>
                <div className="space-y-1.5">
                    <button
                        type="button"
                        onClick={() => onCopyRole(role)}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-100 text-left transition-colors group cursor-pointer"
                    >
                        <div className="flex items-center gap-2.5 min-w-0">
                            <Copy size={15} className="text-blue-600 shrink-0" />
                            <div className="min-w-0">
                                <span className="text-xs font-bold text-slate-900 block leading-tight truncate">
                                    Copy from Existing Role
                                </span>
                                <span className="text-[10px] text-slate-700 font-semibold block leading-none mt-0.5 truncate">
                                    Create a new role by copying permissions
                                </span>
                            </div>
                        </div>
                        <span className="text-slate-600 font-semibold group-hover:text-slate-600 font-bold text-xs shrink-0">›</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => alert('Select a valid role JSON export file to import.')}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-100 text-left transition-colors group cursor-pointer"
                    >
                        <div className="flex items-center gap-2.5 min-w-0">
                            <Upload size={15} className="text-teal-600 shrink-0" />
                            <div className="min-w-0">
                                <span className="text-xs font-bold text-slate-900 block leading-tight truncate">
                                    Import Permissions
                                </span>
                                <span className="text-[10px] text-slate-700 font-semibold block leading-none mt-0.5 truncate">
                                    Import permissions from a template
                                </span>
                            </div>
                        </div>
                        <span className="text-slate-600 font-semibold group-hover:text-slate-600 font-bold text-xs shrink-0">›</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleExportJson}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-100 text-left transition-colors group cursor-pointer"
                    >
                        <div className="flex items-center gap-2.5 min-w-0">
                            <Download size={15} className="text-emerald-700 font-bold shrink-0" />
                            <div className="min-w-0">
                                <span className="text-xs font-bold text-slate-900 block leading-tight truncate">
                                    Export Permissions
                                </span>
                                <span className="text-[10px] text-slate-700 font-semibold block leading-none mt-0.5 truncate">
                                    Download permissions as JSON/CSV
                                </span>
                            </div>
                        </div>
                        <span className="text-slate-600 font-semibold group-hover:text-slate-600 font-bold text-xs shrink-0">›</span>
                    </button>

                    {role.isSystemRole && (
                        <button
                            type="button"
                            onClick={() => onResetRole(role)}
                            className="w-full flex items-center justify-between p-2.5 rounded-xl border border-rose-100 bg-rose-50/50 hover:bg-rose-100/70 text-left transition-colors group cursor-pointer"
                        >
                            <div className="flex items-center gap-2.5 min-w-0">
                                <RotateCcw size={15} className="text-rose-700 font-bold shrink-0" />
                                <div className="min-w-0">
                                    <span className="text-xs font-bold text-rose-900 block leading-tight truncate">
                                        Reset to Default
                                    </span>
                                    <span className="text-[10px] text-rose-700 font-bold/80 block leading-none mt-0.5 truncate font-medium">
                                        Restore system default permissions
                                    </span>
                                </div>
                            </div>
                            <span className="text-rose-400 group-hover:text-rose-600 font-bold text-xs shrink-0">›</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Card 3: Need Help */}
            <div className="bg-gradient-to-br from-blue-50/90 to-indigo-50/90 rounded-2xl border border-blue-200/80 p-4 flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2 rounded-xl bg-blue-600 text-white shrink-0 shadow-xs">
                        <BookOpen size={16} />
                    </div>
                    <div className="min-w-0">
                        <h5 className="text-xs font-bold text-slate-900 leading-tight">
                            Need Help?
                        </h5>
                        <p className="text-[11px] text-slate-600 font-medium leading-tight mt-0.5 truncate">
                            Learn about roles and permissions
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => { }}
                    className="px-2.5 py-1 rounded-lg bg-white border border-blue-200 text-xs font-bold text-blue-700 hover:bg-blue-50 transition-colors shadow-2xs shrink-0 cursor-pointer"
                >
                    Open Guide
                </button>
            </div>

            {/* Card 4: Permission Tips */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-4.5">
                <div className="flex items-center gap-2 text-amber-800 font-bold mb-2.5">
                    <Lightbulb size={16} className="text-amber-800 font-bold" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                        Permission Tips
                    </span>
                </div>
                <ul className="space-y-2 text-xs text-slate-700 font-medium">
                    <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                        <span>Page Access must be enabled for staff to access any features.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                        <span>View permission is required for Create, Edit and Delete.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                        <span>Use role templates for quick setup and cloning.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                        <span>You can restrict data access by class, section or department.</span>
                    </li>
                    <li className="flex items-start gap-2 pt-1 border-t border-slate-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                        <span className="font-bold text-slate-900">Changes are applied immediately to all assigned staff.</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}
