import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../hooks/useAuth';
import { Users, CheckSquare, GraduationCap } from 'lucide-react';

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();

  const cards = [
    { label: 'My Students', desc: 'View all students', to: '/teacher/students', icon: <Users className="w-5 h-5" /> },
    { label: 'Attendance', desc: 'Record and update attendance', to: '/teacher/attendance', icon: <CheckSquare className="w-5 h-5" /> },
    { label: 'Grades', desc: 'Add and manage grades', to: '/teacher/grades', icon: <GraduationCap className="w-5 h-5" /> },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div className="border-b border-neutral-800 pb-4">
          <h1 className="text-xl font-bold text-white">Dashboard</h1>
          <p className="text-neutral-500 text-sm mt-0.5">Welcome back, {user?.full_name}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

export default TeacherDashboard;
