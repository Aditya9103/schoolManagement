import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ExamsModuleLayout from './ExamsModuleLayout';
import ExamsOverviewPage from './ExamsOverviewPage';
import ExamManagementPage from './ExamManagementPage';
import CreateExamPage from './CreateExamPage';
import MarkEntryPage from './MarkEntryPage';
import QuestionPapersPage from './QuestionPapersPage';
import ResultProcessingPage from './ResultProcessingPage';
import ViewResultsPage from './ViewResultsPage';
import StudentResultDetailPage from './StudentResultDetailPage';
import ReportCardsPage from './ReportCardsPage';
import ExamAnalyticsPage from './ExamAnalyticsPage';
import ResultSettingsPage from './ResultSettingsPage';

export default function ExamsPage() {
    return (
        <Routes>
            <Route element={<ExamsModuleLayout />}>
                <Route index element={<ExamsOverviewPage />} />
                <Route path="overview" element={<ExamsOverviewPage />} />
                <Route path="manage" element={<ExamManagementPage />} />
                <Route path="create" element={<CreateExamPage />} />
                <Route path="marks" element={<MarkEntryPage />} />
                <Route path="question-papers" element={<QuestionPapersPage />} />
                <Route path="process" element={<ResultProcessingPage />} />
                <Route path="results" element={<ViewResultsPage />} />
                <Route path="results/student/:id" element={<StudentResultDetailPage />} />
                <Route path="report-cards" element={<ReportCardsPage />} />
                <Route path="analytics" element={<ExamAnalyticsPage />} />
                <Route path="settings" element={<ResultSettingsPage />} />
            </Route>
        </Routes>
    );
}
