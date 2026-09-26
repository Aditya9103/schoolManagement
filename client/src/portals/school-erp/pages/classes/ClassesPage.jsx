import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ClassesModuleLayout from './ClassesModuleLayout';
import ClassesOverviewPage from './ClassesOverviewPage';
import ClassDetailPage from './ClassDetailPage';
import ClassSectionsPage from './ClassSectionsPage';
import ClassStudentsPage from './ClassStudentsPage';
import ClassTeachersPage from './ClassTeachersPage';
import ClassSubjectsPage from './ClassSubjectsPage';
import ClassTimetablePage from './ClassTimetablePage';
import ClassReportsPage from './ClassReportsPage';
import ClassSettingsPage from './ClassSettingsPage';

export default function ClassesPage() {
    return (
        <Routes>
            <Route element={<ClassesModuleLayout />}>
                <Route index element={<ClassesOverviewPage />} />
                <Route path="overview" element={<ClassesOverviewPage />} />
                <Route path="sections" element={<ClassSectionsPage />} />
                <Route path="teachers" element={<ClassTeachersPage />} />
                <Route path="subjects" element={<ClassSubjectsPage />} />
                <Route path="timetable" element={<ClassTimetablePage />} />
                <Route path="reports" element={<ClassReportsPage />} />
                <Route path="settings" element={<ClassSettingsPage />} />
                <Route path=":classId" element={<ClassDetailPage />} />
                <Route path=":classId/sections" element={<ClassSectionsPage />} />
                <Route path=":classId/students" element={<ClassStudentsPage />} />
                <Route path=":classId/subjects" element={<ClassSubjectsPage />} />
                <Route path=":classId/timetable" element={<ClassTimetablePage />} />
            </Route>
        </Routes>
    );
}
