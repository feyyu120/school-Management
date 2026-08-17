import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import StudentRegister from '../pages/auth/StudentRegister';
import TeacherRegister from '../pages/auth/TeacherRegister';
import AdminDashboard from '../pages/admin/AdminDashboard';
import TeacherDashboard from '../pages/teacher/TeacherDashboard';
import StudentDashboard from '../pages/student/StudentDashboard';
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

      {/* Protected Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Protected Teacher Routes */}
      <Route
        path="/teacher/*"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />

      {/* Protected Student Routes */}
      <Route
        path="/student/*"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
