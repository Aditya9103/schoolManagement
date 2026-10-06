import React from 'react';
import {
    Search,
    RotateCcw,
    Layers,
    Clock,
    CheckCircle2,
    Calendar as CalendarIcon,
    BarChart3,
    List,
    ChevronDown,
} from 'lucide-react';

export default function ExamsFilterToolbar({
    activeTab = 'ALL',
    onSelectTab,
    activeView = 'list',
    onSelectView,
    searchQuery = '',
    onSearchChange,
    selectedClass = 'all',
    onClassChange,
    selectedTerm = 'all',
    onTermChange,
    selectedType = 'all',
    onTypeChange,
    selectedStatus = 'all',
    onStatusChange,
    onResetFilters,
    counts = {
        all: 12,
        ongoing: 2,
        upcoming: 3,
        completed: 7,
    },
}) {
    const tabs = [
        { id: 'ALL', label: 'All Exams', count: counts.all, Icon: Layers },
        { id: 'ONGOING', label: 'Ongoing', count: counts.ongoing, Icon: Clock },
        { id: 'UPCOMING', label: 'Upcoming', count: counts.upcoming, Icon: CalendarIcon },
        { id: 'COMPLETED', label: 'Completed', count: counts.completed, Icon: CheckCircle2 },
    ];

    const classesList = [
        'All Classes',
        'Class 1',
        'Class 2',
        'Class 3',
        'Class 4',
        'Class 5',
        'Class 6',
        'Class 7',
        'Class 8',
        'Class 9',
        'Class 10',
        'Class 11',
        'Class 12',
    ];

    return (
        <div className="space-y-3">
            {/* Top Row: Tabs on Left, View Switcher on Right (Image 2) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
                    {tabs.map((tab) => {
                        const Icon = tab.Icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => onSelectTab(tab.id)}
                                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                                    isActive
                                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                                        : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-slate-200/80'
                                }`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                <span>{tab.label}</span>
                                <span
                                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                                        isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                                    }`}
                                >
                                    {tab.count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* List / Calendar / Analytics Switcher */}
                <div className="flex items-center gap-1 bg-white border border-slate-200/80 rounded-xl p-1 shadow-2xs self-start sm:self-auto">
                    <button
                        type="button"
                        onClick={() => onSelectView('list')}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            activeView === 'list'
                                ? 'bg-blue-600 text-white shadow-2xs'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <List className="w-3.5 h-3.5" />
                        <span>List</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => onSelectView('calendar')}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            activeView === 'calendar'
                                ? 'bg-blue-600 text-white shadow-2xs'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <CalendarIcon className="w-3.5 h-3.5" />
                        <span>Calendar</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => onSelectView('analytics')}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            activeView === 'analytics'
                                ? 'bg-blue-600 text-white shadow-2xs'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <BarChart3 className="w-3.5 h-3.5" />
                        <span>Analytics</span>
                    </button>
                </div>
            </div>

            {/* Bottom Row: Search, Dropdown Filters, Academic Year, Reset */}
            <div className="bg-white rounded-2xl p-3 sm:p-3.5 border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-2.5">
                {/* Search */}
                <div className="relative flex-1 min-w-[220px]">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search exams by name, class, term..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200/90 text-xs rounded-xl pl-9 pr-3.5 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                </div>

                {/* Class dropdown */}
                <div className="relative min-w-[130px]">
                    <select
                        value={selectedClass}
                        onChange={(e) => onClassChange(e.target.value)}
                        className="w-full appearance-none bg-slate-50 border border-slate-200/90 text-xs font-semibold rounded-xl px-3 py-2 pr-8 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                    >
                        {classesList.map((c) => (
                            <option key={c} value={c === 'All Classes' ? 'all' : c}>
                                {c}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Term dropdown */}
                <div className="relative min-w-[110px]">
                    <select
                        value={selectedTerm}
                        onChange={(e) => onTermChange(e.target.value)}
                        className="w-full appearance-none bg-slate-50 border border-slate-200/90 text-xs font-semibold rounded-xl px-3 py-2 pr-8 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                    >
                        <option value="all">All Terms</option>
                        <option value="Term 1">Term 1</option>
                        <option value="Term 2">Term 2</option>
                        <option value="Annual">Annual</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Type dropdown */}
                <div className="relative min-w-[130px]">
                    <select
                        value={selectedType}
                        onChange={(e) => onTypeChange(e.target.value)}
                        className="w-full appearance-none bg-slate-50 border border-slate-200/90 text-xs font-semibold rounded-xl px-3 py-2 pr-8 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                    >
                        <option value="all">All Exam Types</option>
                        <option value="PERIODIC_TEST">Periodic Test</option>
                        <option value="TERM_EXAM">Term Exam</option>
                        <option value="BOARD_PATTERN">Board Pattern</option>
                        <option value="MOCK_EXAM">Mock Exam</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Status dropdown */}
                <div className="relative min-w-[115px]">
                    <select
                        value={selectedStatus}
                        onChange={(e) => onStatusChange(e.target.value)}
                        className="w-full appearance-none bg-slate-50 border border-slate-200/90 text-xs font-semibold rounded-xl px-3 py-2 pr-8 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                    >
                        <option value="all">All Status</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="ONGOING">Ongoing</option>
                        <option value="UPCOMING">Upcoming</option>
                        <option value="DRAFT">Draft</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Academic Year pill badge */}
                <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/90 text-xs font-semibold text-slate-600">
                    <span>Academic Year:</span>
                    <span className="font-extrabold text-blue-600">2026 - 27</span>
                </div>

                {/* Reset button */}
                <button
                    type="button"
                    onClick={onResetFilters}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200/80 cursor-pointer"
                >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                </button>
            </div>
        </div>
    );
}
