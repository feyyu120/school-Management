import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../hooks/useAuth';
import { GraduationCap, CheckSquare, Megaphone, FileText, ClipboardList } from 'lucide-react';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();

  const cards = [
    { label: 'My Results', desc: 'View your grades', to: '/student/results', icon: <GraduationCap className="w-5 h-5" /> },
    { label: 'Attendance', desc: 'Your attendance record', to: '/student/attendance', icon: <CheckSquare className="w-5 h-5" /> },
    { label: 'Announcements', desc: 'School news and updates', to: '/student/announcements', icon: <Megaphone className="w-5 h-5" /> },
    { label: 'Admissions', desc: 'Admission information', to: '/student/admissions', icon: <FileText className="w-5 h-5" /> },
    { label: 'My Report', desc: 'Full academic report', to: '/student/report', icon: <ClipboardList className="w-5 h-5" /> },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div className="border-b border-neutral-800 pb-4">
          <h1 className="text-xl font-bold text-white">Dashboard</h1>
          <p className="text-neutral-500 text-sm mt-0.5">Welcome back, {user?.full_name}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className="bg-neutral-950 border border-neutral-800 rounded-lg p-5 hover:border-neutral-600 hover:bg-neutral-900/50 transition-colors duration-150 block"
            >
              <div className="text-neutral-400 mb-3">{c.icon}</div>
              <p className="text-white font-semibold text-sm">{c.label}</p>
              <p className="text-neutral-500 text-xs mt-1">{c.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
