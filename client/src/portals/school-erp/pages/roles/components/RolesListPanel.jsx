import React, { useState } from 'react';
import {
    Search,
    Plus,
    Crown,
    Award,
    Users,
    BookOpen,
    Wallet,
    UserCheck,
    BookMarked,
    Bus,
    Building,
    Briefcase,
    MoreVertical,
    Copy,
    RotateCcw,
    Trash2
} from 'lucide-react';

const ICON_MAP = {
    Crown: Crown,
    Award: Award,
    Users: Users,
    BookOpen: BookOpen,
    Wallet: Wallet,
    UserCheck: UserCheck,
    BookMarked: BookMarked,
    Bus: Bus,
    Building: Building,
    Briefcase: Briefcase,
};

const COLOR_MAP = {
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    cyan: 'bg-cyan-50 text-cyan-600 border-cyan-200',
    pink: 'bg-pink-50 text-pink-600 border-pink-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    rose: 'bg-rose-50 text-rose-600 border-rose-200',
    violet: 'bg-violet-50 text-violet-600 border-violet-200',
};

export default function RolesListPanel({
    roles = [],
    selectedRoleId,
    onSelectRole,
    onCreateRole,
    onCopyRole,
    onResetRole,
    onDeleteRole,
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('ALL');
    const [menuOpenId, setMenuOpenId] = useState(null);

    const filteredRoles = roles.filter((role) => {
        const matchesSearch = role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            role.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter =
            filterType === 'ALL' ||
            (filterType === 'SYSTEM' && role.isSystemRole) ||
            (filterType === 'CUSTOM' && !role.isSystemRole);
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col h-full overflow-hidden">
            {/* Header: Title + Create Role Button */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-2">
                <div>
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight font-display">
                        All Roles <span className="text-slate-600 font-medium font-normal">({roles.length})</span>
                    </h3>
                </div>
                <button
                    type="button"
                    onClick={onCreateRole}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
                >
                    <Plus size={14} /> Create Role
                </button>
            </div>

            {/* Search & Filter Toolbar */}
            <div className="p-3 border-b border-slate-100 space-y-2 bg-slate-50/50">
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 font-medium" />
                    <input
                        type="text"
                        placeholder="Search roles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 placeholder:text-slate-500 font-medium"
                    />
                </div>
                <div className="flex items-center justify-between text-xs">
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="w-full text-xs bg-white border border-slate-200 text-slate-700 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium cursor-pointer"
                    >
                        <option value="ALL">All Roles</option>
                        <option value="SYSTEM">System Roles Only</option>
                        <option value="CUSTOM">Custom Roles Only</option>
                    </select>
                </div>
            </div>

            {/* Roles List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-200">
                {filteredRoles.map((role) => {
                    const isSelected = role._id === selectedRoleId;
                    const IconComponent = ICON_MAP[role.icon] || Users;
                    const colorStyle = COLOR_MAP[role.color] || COLOR_MAP.blue;

                    return (
                        <div
                            key={role._id}
                            onClick={() => onSelectRole(role._id)}
                            className={`group relative flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                                isSelected
                                    ? 'bg-blue-50/80 border-blue-400/80 shadow-xs'
                                    : 'bg-white border-slate-100 hover:bg-slate-50/80 hover:border-slate-200'
                            }`}
                        >
                            {/* Role Icon */}
                            <div className={`p-2 rounded-xl border shrink-0 mt-0.5 ${colorStyle}`}>
                                <IconComponent size={16} />
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0 pr-6">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    <h4 className="text-xs font-bold text-slate-900 truncate">
                                        {role.name}
                                    </h4>
                                    <span className={`px-1.5 py-0.2 rounded-md text-[9px] font-bold border ${
                                        role.isSystemRole
                                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                                            : 'bg-blue-50 text-blue-700 border-blue-200'
                                    }`}>
                                        {role.badge || (role.isSystemRole ? 'System' : 'Custom')}
                                    </span>
                                </div>
                                <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5 leading-tight font-normal">
                                    {role.description}
                                </p>
                                <span className="text-[11px] font-semibold text-slate-700 mt-1 block">
                                    {role.assignedUsersCount || role.userCount || 0} {(role.assignedUsersCount || role.userCount) === 1 ? 'user' : 'users'}
                                </span>
                            </div>

                            {/* Action Menu (3-dots) */}
                            <div className="absolute right-2 top-3">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setMenuOpenId(menuOpenId === role._id ? null : role._id);
                                    }}
                                    className="p-1 rounded-lg text-slate-600 font-medium hover:text-slate-600 hover:bg-slate-100"
                                >
                                    <MoreVertical size={14} />
                                </button>

                                {menuOpenId === role._id && (
                                    <div
                                        onClick={(e) => e.stopPropagation()}
                                        className="absolute right-0 mt-1 w-38 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-30 text-xs"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setMenuOpenId(null);
                                                onCopyRole(role);
                                            }}
                                            className="w-full text-left px-3 py-1.5 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                        >
                                            <Copy size={13} /> Copy Role
                                        </button>
                                        {role.isSystemRole ? (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setMenuOpenId(null);
                                                    onResetRole(role);
                                                }}
                                                className="w-full text-left px-3 py-1.5 text-amber-700 hover:bg-amber-50 flex items-center gap-2"
                                            >
                                                <RotateCcw size={13} /> Reset to Default
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setMenuOpenId(null);
                                                    onDeleteRole(role);
                                                }}
                                                className="w-full text-left px-3 py-1.5 text-rose-700 font-bold hover:bg-rose-50 flex items-center gap-2"
                                            >
                                                <Trash2 size={13} /> Delete Role
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}

                {filteredRoles.length === 0 && (
                    <div className="p-6 text-center text-slate-600 font-semibold text-xs">
                        No roles match your search.
                    </div>
                )}
            </div>
        </div>
    );
}
