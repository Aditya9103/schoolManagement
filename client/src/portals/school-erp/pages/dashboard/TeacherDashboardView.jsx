import React from 'react';
import { useSelector } from 'react-redux';
import { useGetTeacherDashboardQuery } from '../../../../store/api/classApi';
import TeacherHeroBanner from './components/TeacherHeroBanner';
import TeacherKpiRow from './components/TeacherKpiRow';
import TeacherTasksCard from './components/TeacherTasksCard';
import TeacherScheduleCard from './components/TeacherScheduleCard';
import TeacherQuickActions from './components/TeacherQuickActions';
import TeacherWorkloadCard from './components/TeacherWorkloadCard';
import TeacherCurriculumProgress from './components/TeacherCurriculumProgress';
import TeacherClassesGrid from './components/TeacherClassesGrid';
import TeacherParentCommFeed from './components/TeacherParentCommFeed';

export default function TeacherDashboardView() {
    const { user } = useSelector((s) => s.auth);
    const { data: dashRes, isLoading } = useGetTeacherDashboardQuery();
    const data = dashRes?.data;

    const teacherName = user?.firstName
        ? `${user.firstName} ${user.lastName || ''}`.trim()
        : (user?.name || 'Teacher');

    return (
        <div className="p-3 sm:p-5 lg:p-6 space-y-5 max-w-[1720px] mx-auto min-h-screen bg-[#f8fafc]">
            {/* 1. Greeting & Wisdom Hero Banner */}
            <TeacherHeroBanner teacherName={teacherName} />

            {/* 2. 6 Dynamic KPI Cards */}
            <TeacherKpiRow kpis={data?.kpis} isLoading={isLoading} />

            {/* 3. My Tasks Action Command Center */}
            <TeacherTasksCard tasks={data?.myTasks} isLoading={isLoading} />

            {/* 4 & 5. Today's Live Schedule Timeline & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2">
                    <TeacherScheduleCard schedule={data?.todaySchedule} isLoading={isLoading} />
                </div>
                <div>
                    <TeacherQuickActions />
                </div>
            </div>

            {/* 6 & 7. Teacher Workload & Curriculum Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <TeacherWorkloadCard workload={data?.workload} isLoading={isLoading} />
                <TeacherCurriculumProgress
                    units={data?.curriculumUnits}
                    className={data?.workload?.classTeacherOf}
                    isLoading={isLoading}
                />
            </div>

            {/* 8 & 9. My Classes & Parent Communication Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2">
                    <TeacherClassesGrid classesList={data?.myClasses} isLoading={isLoading} />
                </div>
                <div>
                    <TeacherParentCommFeed communications={data?.recentCommunications} isLoading={isLoading} />
                </div>
            </div>
        </div>
    );
}
