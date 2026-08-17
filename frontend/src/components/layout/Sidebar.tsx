import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  GraduationCap,
  Megaphone,
  FileText,
  ClipboardList,
} from 'lucide-react';

interface SidebarItem {
  label: string;
  to: string;
  icon: React.ReactNode;
}

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const adminItems: SidebarItem[] = [
    { label: 'Dashboard', to: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Users', to: '/admin/pending-users', icon: <Users className="w-4 h-4" /> },
    { label: 'Announcements', to: '/admin/announcements', icon: <Megaphone className="w-4 h-4" /> },
    { label: 'Admissions', to: '/admin/admissions', icon: <FileText className="w-4 h-4" /> },
  ];

  const teacherItems: SidebarItem[] = [
    { label: 'Dashboard', to: '/teacher/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Attendance', to: '/teacher/attendance', icon: <CheckSquare className="w-4 h-4" /> },
    { label: 'Grades', to: '/teacher/grades', icon: <GraduationCap className="w-4 h-4" /> },
    { label: 'Students', to: '/teacher/students', icon: <Users className="w-4 h-4" /> },
  ];

  const studentItems: SidebarItem[] = [
    { label: 'Dashboard', to: '/student/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Results', to: '/student/results', icon: <GraduationCap className="w-4 h-4" /> },
    { label: 'Attendance', to: '/student/attendance', icon: <CheckSquare className="w-4 h-4" /> },
    { label: 'Announcements', to: '/student/announcements', icon: <Megaphone className="w-4 h-4" /> },
    { label: 'Admissions', to: '/student/admissions', icon: <FileText className="w-4 h-4" /> },
    { label: 'Reports', to: '/student/reports', icon: <ClipboardList className="w-4 h-4" /> },
  ];

  let items: SidebarItem[] = [];
  if (user?.role === 'admin') items = adminItems;
  if (user?.role === 'teacher') items = teacherItems;
  if (user?.role === 'student') items = studentItems;

  return (
    <aside className="w-64 bg-black border-r border-neutral-800 flex flex-col p-4 text-white min-h-[calc(100vh-4rem)] shrink-0">
      <div className="space-y-1">
        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2">
          Navigation
        </p>
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2.5 rounded text-xs font-medium transition duration-150 ${
                isActive
                  ? 'bg-[#1b2d53] text-white'
                  : 'text-neutral-300 hover:bg-[#1b2d53]/50 hover:text-white'
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
