import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import StudentRegister from '../pages/auth/StudentRegister';
import TeacherRegister from '../pages/auth/TeacherRegister';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import PendingUsers from '../pages/admin/PendingUsers';
import AdminStudents from '../pages/admin/Students';
import AdminTeachers from '../pages/admin/Teachers';
import AdminAnnouncements from '../pages/admin/Announcements';
import AdminAdmissions from '../pages/admin/Admissions';

// Teacher Pages
import TeacherDashboard from '../pages/teacher/Dashboard';
import TeacherStudents from '../pages/teacher/Students';
import TeacherAttendance from '../pages/teacher/Attendance';
import TeacherGrades from '../pages/teacher/Grades';

// Student Pages
import StudentDashboard from '../pages/student/Dashboard';
import StudentResults from '../pages/student/Results';
import StudentAttendance from '../pages/student/Attendance';
import StudentAnnouncements from '../pages/student/Announcements';
import StudentAdmissions from '../pages/student/Admissions';
import StudentReport from '../pages/student/Report';

// Shared Pages
import Profile from '../pages/shared/Profile';

import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../hooks/useAuth';

const RootRedirect: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'teacher') return <Navigate to="/teacher/dashboard" replace />;
  return <Navigate to="/student/dashboard" replace />;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Root & Public Auth Routes */}
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register/student" element={<StudentRegister />} />
      <Route path="/register/teacher" element={<TeacherRegister />} />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/pending-users"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <PendingUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/students"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminStudents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/teachers"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminTeachers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/announcements"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminAnnouncements />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/admissions"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminAdmissions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

      {/* Teacher Routes */}
      <Route
        path="/teacher/dashboard"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/students"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherStudents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/attendance"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherAttendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/grades"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherGrades />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/profile"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path="/teacher" element={<Navigate to="/teacher/dashboard" replace />} />

      {/* Student Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/results"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentResults />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/attendance"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentAttendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/announcements"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentAnnouncements />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/admissions"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentAdmissions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/report"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentReport />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/profile"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
