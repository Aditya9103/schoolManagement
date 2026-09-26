import React from 'react';
import { useSelector } from 'react-redux';
import {
    useGetMySchoolQuery,
    useGetSchoolDashboardStatsQuery
} from '../../../../store/api/schoolErpApi';

import HeroBanner from './components/HeroBanner';
import StatsSummaryRow from './components/StatsSummaryRow';
import AttendanceOverviewChart from './components/AttendanceOverviewChart';
import StudentsByClassDonut from './components/StudentsByClassDonut';
import TodayScheduleCard from './components/TodayScheduleCard';
import UpcomingEventsCard from './components/UpcomingEventsCard';
import FeeCollectionCard from './components/FeeCollectionCard';
import SchoolAtAGlanceCard from './components/SchoolAtAGlanceCard';
import RecentAdmissionsTable from './components/RecentAdmissionsTable';
import QuickActionsGrid from './components/QuickActionsGrid';
import ClassPerformanceChart from './components/ClassPerformanceChart';
import TopPerformersCard from './components/TopPerformersCard';
import AnnouncementsCard from './components/AnnouncementsCard';

export default function DashboardPage() {
    const { user } = useSelector((state) => state.auth);
    const { data: schoolRes, isLoading: schoolLoading } = useGetMySchoolQuery();
    const { data: statsRes, isLoading: statsLoading } = useGetSchoolDashboardStatsQuery();

    const school = schoolRes?.data || null;
    const stats = statsRes?.data || null;

    return (
        <div className="p-3 sm:p-5 lg:p-6 space-y-4 sm:space-y-5 max-w-[1720px] mx-auto min-h-screen bg-[#f8fafc]">
            {/* Top Welcome / Hero Banner */}
            <HeroBanner
                school={school}
                user={user}
                adminUser={user}
                loading={schoolLoading}
            />

            {/* 6 Key Stat Cards */}
            <StatsSummaryRow
                stats={stats?.summary}
                loading={statsLoading}
            />

            {/* Section Row 1: Academic & Attendance (3 Columns, Dynamic Space: 1.25fr / 0.85fr / 0.95fr) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.25fr_0.85fr_0.95fr] gap-4 sm:gap-4.5 items-stretch">
                <div>
                    <AttendanceOverviewChart data={stats?.attendance} loading={statsLoading} />
                </div>
                <div>
                    <StudentsByClassDonut
                        data={stats?.classDistribution}
                        total={stats?.summary?.totalStudents}
                        loading={statsLoading}
                    />
                </div>
                <div className="md:col-span-2 lg:col-span-1">
                    <TodayScheduleCard data={stats?.schedule} schedule={stats?.schedule} loading={statsLoading} />
                </div>
            </div>

            {/* Section Row 2: Events, Finance & Campus (3 Columns, Dynamic Space: 0.95fr / 1.15fr / 0.95fr) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[0.95fr_1.15fr_0.95fr] gap-4 sm:gap-4.5 items-stretch">
                <div>
                    <UpcomingEventsCard data={stats?.upcomingEvents} events={stats?.upcomingEvents} loading={statsLoading} />
                </div>
                <div>
                    <FeeCollectionCard data={stats?.fees} loading={statsLoading} />
                </div>
                <div className="md:col-span-2 lg:col-span-1">
                    <SchoolAtAGlanceCard school={school} stats={stats} loading={schoolLoading || statsLoading} />
                </div>
            </div>

            {/* Section Row 3: Admissions & Quick Actions (STRICTLY 2 COLUMNS, Dynamic Space: 1.15fr / 1fr) */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-4 sm:gap-4.5 items-stretch">
                <div>
                    <RecentAdmissionsTable data={stats?.recentAdmissions} admissions={stats?.recentAdmissions} loading={statsLoading} />
                </div>
                <div>
                    <QuickActionsGrid />
                </div>
            </div>

            {/* Section Row 4: Performance & Announcements (3 Columns, Dynamic Space: 1.25fr / 0.85fr / 0.95fr) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.25fr_0.85fr_0.95fr] gap-4 sm:gap-4.5 items-stretch">
                <div>
                    <ClassPerformanceChart data={stats?.classPerformance} loading={statsLoading} />
                </div>
                <div>
                    <TopPerformersCard data={stats?.topPerformers} loading={statsLoading} />
                </div>
                <div className="md:col-span-2 lg:col-span-1">
                    <AnnouncementsCard data={stats?.announcements} loading={statsLoading} />
                </div>
            </div>
        </div>
    );
}
