import React from 'react';
import {
    Search,
    ChevronDown,
    Calendar,
    List,
    RotateCcw,
    FileText,
    BookOpen,
    CheckCircle2,
    Clock,
    FileEdit
} from 'lucide-react';

export default function HomeworkFilterToolbar({
    activeTab = 'ALL',
    onSelectTab,
    activeView = 'list',
    onSelectView,
    searchQuery = '',
    onSearchChange,
    selectedClass = 'all',
    onClassChange,
    selectedSubject = 'all',
    onSubjectChange,
    selectedType = 'all',
    onTypeChange,
    selectedStatus = 'all',
    onStatusChange,
    onResetFilters,
    counts = {
        all: 124,
        active: 28,
        upcoming: 16,
        past: 80,
        drafts: 5,
    },
}) {
    const tabs = [
        { id: 'ALL', label: 'All Assignments', count: counts.all, Icon: FileText },
        { id: 'ACTIVE', label: 'Active', count: counts.active, Icon: CheckCircle2 },
        { id: 'UPCOMING', label: 'Upcoming', count: counts.upcoming, Icon: Clock },
        { id: 'PAST', label: 'Past', count: counts.past, Icon: BookOpen },
        { id: 'DRAFTS', label: 'Drafts', count: counts.drafts, Icon: FileEdit },
    ];

    return (
        <div className="space-y-4">
            {/* Top Tabs & View Toggle Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-1">
                {/* Tabs */}
                <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-1">
                    {tabs.map((tab) => {
                        const Icon = tab.Icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => onSelectTab(tab.id)}
                                type="button"
                                className={`inline-flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                                    isActive
                                        ? 'bg-blue-50 text-blue-700 shadow-2xs'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                                }`}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                                <span>{tab.label}</span>
                                <span
                                    className={`px-1.5 py-0.2 rounded-full text-[11px] font-bold ${
                                        isActive ? 'bg-blue-200/60 text-blue-800' : 'bg-slate-200/60 text-slate-600'
                                    }`}
                                >
                                    {tab.count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* View Switcher: List vs Calendar */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-auto shrink-0">
                    <button
                        type="button"
                        onClick={() => onSelectView('list')}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            activeView === 'list'
                                ? 'bg-white text-blue-700 shadow-xs'
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
                                ? 'bg-white text-blue-700 shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Calendar</span>
                    </button>
                </div>
            </div>

            {/* Filter Toolbar Row */}
            <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
                {/* Search Input */}
                <div className="relative flex-1 min-w-[240px]">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search assignments by title, subject or class..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium rounded-xl pl-9 pr-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                    />
                </div>

                {/* Dropdowns */}
                <div className="flex items-center gap-2 flex-wrap">
                    {/* All Classes */}
                    <div className="relative">
                        <select
                            value={selectedClass}
                            onChange={(e) => onClassChange(e.target.value)}
                            className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-3 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                        >
                            <option value="all">All Classes</option>
                            <option value="Class 6">Class 6</option>
                            <option value="Class 7">Class 7</option>
                            <option value="Class 8">Class 8</option>
                            <option value="Class 9">Class 9</option>
                            <option value="Class 10">Class 10</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    {/* All Subjects */}
                    <div className="relative">
                        <select
                            value={selectedSubject}
                            onChange={(e) => onSubjectChange(e.target.value)}
                            className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-3 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                        >
                            <option value="all">All Subjects</option>
                            <option value="Mathematics">Mathematics</option>
                            <option value="English">English</option>
                            <option value="Science">Science</option>
                            <option value="Social Science">Social Science</option>
                            <option value="Computer">Computer</option>
                            <option value="Arts">Arts</option>
                            <option value="Physical Education">Physical Education</option>
                            <option value="Life Skills">Life Skills</option>
                            <option value="Music">Music</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    {/* All Types */}
                    <div className="relative">
                        <select
                            value={selectedType}
                            onChange={(e) => onTypeChange(e.target.value)}
                            className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-3 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                        >
                            <option value="all">All Types</option>
                            <option value="HOMEWORK">Homework</option>
                            <option value="ASSIGNMENT">Assignment</option>
                            <option value="PROJECT">Project</option>
                            <option value="PRACTICAL">Practical</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    {/* All Status */}
                    <div className="relative">
                        <select
                            value={selectedStatus}
                            onChange={(e) => onStatusChange(e.target.value)}
                            className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-3 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                        >
                            <option value="all">All Status</option>
                            <option value="ACTIVE">Active</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="GRADED">Graded</option>
                            <option value="DRAFT">Draft</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    {/* Reset Button */}
                    <button
                        type="button"
                        onClick={onResetFilters}
                        className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-semibold transition-colors cursor-pointer"
                        title="Reset all filters"
                    >
                        <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                        <span>Reset</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
