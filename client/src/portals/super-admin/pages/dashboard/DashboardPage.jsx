import React from 'react';
import HeroBanner from './components/HeroBanner';
import StatsSummary from './components/StatsSummary';
import SchoolsMapIndia from './components/SchoolsMapIndia';
import SchoolsGrowthChart from './components/SchoolsGrowthChart';
import SubscriptionDonut from './components/SubscriptionDonut';
import RevenueAreaChart from './components/RevenueAreaChart';
import RecentActivities from './components/RecentActivities';
import QuickActions from './components/QuickActions';
import RecentSchoolsTable from './components/RecentSchoolsTable';

export default function DashboardPage() {
    return (
        <div className="p-4 sm:p-6 lg:p-7 space-y-6 max-w-[1600px] mx-auto min-h-full pb-20">
            {/* 1. Hero Greeting Banner matching Image 1 */}
            <HeroBanner />

            {/* 2. 5 KPI Metric Cards */}
            <StatsSummary />

            {/* 3. Main Dashboard Analytics & Operations Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
                {/* Left Column (8 cols on large screens): Maps & Charts */}
                <div className="xl:col-span-8 space-y-5">
                    {/* Interactive Pan-India Presence Map */}
                    <SchoolsMapIndia />

                    {/* Growth Bar Chart & Subscription Donut Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <SchoolsGrowthChart />
                        <SubscriptionDonut />
                    </div>

                    {/* Revenue Spline Area Chart */}
                    <RevenueAreaChart />
                </div>

                {/* Right Column (4 cols on large screens): Operations & Activities */}
                <div className="xl:col-span-4 space-y-5">
                    {/* Recent Activities Timeline */}
                    <RecentActivities />

                    {/* Quick Actions & Grow Impact Card */}
                    <QuickActions />
                </div>
            </div>

            {/* 4. Recent Schools Data Table */}
            <RecentSchoolsTable />
        </div>
    );
}
