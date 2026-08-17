import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import { useAuth } from '../../hooks/useAuth';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8 space-y-6 text-left">
          <div className="border-b border-neutral-800 pb-4">
            <h1 className="text-2xl font-bold text-white">Student Dashboard</h1>
            <p className="text-sm text-neutral-400">Welcome, {user?.full_name}</p>
          </div>

          <div className="bg-black border border-neutral-800 rounded-lg p-6 space-y-3">
            <h2 className="text-lg font-semibold text-white">Academic Overview</h2>
            <p className="text-sm text-neutral-400">
              Track your exam results, attendance records, school announcements, and admissions.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
