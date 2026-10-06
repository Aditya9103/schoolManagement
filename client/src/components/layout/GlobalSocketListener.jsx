/**
 * GlobalSocketListener.jsx
 * Connects to Socket.IO for real-time domain events across PrimeSchoolOS.
 * Automatically invalidates RTK Query caches so all dashboards and lists
 * sync live with real database state without manual page refresh.
 */
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSocket, initSocket } from '../../socket/socketClient';
import { classApi } from '../../store/api/classApi';
import { attendanceApi } from '../../store/api/attendanceApi';
import { homeworkApi } from '../../store/api/homeworkApi';
import { examApi } from '../../store/api/examApi';
import { peopleApi } from '../../store/api/peopleApi';
import { studentApi } from '../../store/api/studentApi';
import { notificationApi } from '../../store/api/notificationApi';
import toast from 'react-hot-toast';

export default function GlobalSocketListener() {
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((s) => s.auth);

    useEffect(() => {
        if (!isAuthenticated || !user) return;

        const socket = initSocket() || getSocket();
        if (!socket) return;

        // 1. Attendance events
        const onAttendanceMarked = (data) => {
            dispatch(attendanceApi.util.invalidateTags(['AttendanceRegister', 'AttendanceStats', 'AttendanceActivities']));
            dispatch(classApi.util.invalidateTags(['TeacherDashboard']));
            dispatch(peopleApi.util.invalidateTags(['Attendance']));
        };

        // 2. Homework / Assignment events
        const onHomeworkUpdated = (data) => {
            dispatch(homeworkApi.util.invalidateTags(['Assignments', 'Assignment', 'AssignmentStats', 'Submissions']));
            dispatch(classApi.util.invalidateTags(['TeacherDashboard']));
        };

        // 3. Timetable & Schedule events
        const onTimetableUpdated = (data) => {
            dispatch(classApi.util.invalidateTags(['Timetables', 'TeacherDashboard', 'Classes']));
        };

        // 4. Teaching Assignment events
        const onAssignmentCreated = (data) => {
            dispatch(classApi.util.invalidateTags(['Classes', 'ClassTeachers', 'TeacherDashboard']));
            dispatch(peopleApi.util.invalidateTags(['Teachers']));
        };

        // 5. Exam & Results events
        const onExamUpdated = (data) => {
            dispatch(examApi.util.invalidateTags(['Exams', 'Exam', 'ExamStats', 'ExamResults']));
            dispatch(classApi.util.invalidateTags(['TeacherDashboard']));
        };

        // 6. Student & Placement events
        const onStudentUpdated = (data) => {
            dispatch(studentApi.util.invalidateTags(['Students', 'Student']));
            dispatch(classApi.util.invalidateTags(['Classes', 'ClassStudents', 'TeacherDashboard']));
            dispatch(peopleApi.util.invalidateTags(['Parents']));
        };

        // 7. Communication events
        const onCommunicationLogged = (data) => {
            dispatch(classApi.util.invalidateTags(['TeacherDashboard']));
        };

        // 8. General Notifications
        const onNotification = (data) => {
            dispatch(notificationApi.util.invalidateTags(['Notifications']));
            if (data?.title) {
                toast(data.title, { icon: '🔔' });
            }
        };

        // Subscribe to domain event names
        socket.on('attendance:marked', onAttendanceMarked);
        socket.on('attendance:correction_resolved', onAttendanceMarked);
        socket.on('homework:published', onHomeworkUpdated);
        socket.on('homework:submitted', onHomeworkUpdated);
        socket.on('homework:evaluated', onHomeworkUpdated);
        socket.on('timetable:updated', onTimetableUpdated);
        socket.on('teaching_assignment:created', onAssignmentCreated);
        socket.on('teaching_assignment:deleted', onAssignmentCreated);
        socket.on('exam:scheduled', onExamUpdated);
        socket.on('marks:entered', onExamUpdated);
        socket.on('marks:submitted', onExamUpdated);
        socket.on('marks:published', onExamUpdated);
        socket.on('student:enrolled', onStudentUpdated);
        socket.on('student:promoted', onStudentUpdated);
        socket.on('communication:logged', onCommunicationLogged);
        socket.on('NEW_NOTIFICATION', onNotification);
        socket.on('URGENT_NOTICE', onNotification);

        return () => {
            socket.off('attendance:marked', onAttendanceMarked);
            socket.off('attendance:correction_resolved', onAttendanceMarked);
            socket.off('homework:published', onHomeworkUpdated);
            socket.off('homework:submitted', onHomeworkUpdated);
            socket.off('homework:evaluated', onHomeworkUpdated);
            socket.off('timetable:updated', onTimetableUpdated);
            socket.off('teaching_assignment:created', onAssignmentCreated);
            socket.off('teaching_assignment:deleted', onAssignmentCreated);
            socket.off('exam:scheduled', onExamUpdated);
            socket.off('marks:entered', onExamUpdated);
            socket.off('marks:submitted', onExamUpdated);
            socket.off('marks:published', onExamUpdated);
            socket.off('student:enrolled', onStudentUpdated);
            socket.off('student:promoted', onStudentUpdated);
            socket.off('communication:logged', onCommunicationLogged);
            socket.off('NEW_NOTIFICATION', onNotification);
            socket.off('URGENT_NOTICE', onNotification);
        };
    }, [dispatch, isAuthenticated, user]);

    return null;
}
