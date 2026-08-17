import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  GraduationCap,
  Megaphone,
  FileText,
  ClipboardList,
  UserCircle,
  LogOut,
  Clock,
  BookOpen,
} from 'lucide-react';

interface SidebarItem {
  label: string;
  to: string;
  icon: React.ReactNode;
}

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const adminItems: SidebarItem[] = [
    { label: 'Dashboard', to: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Pending Users', to: '/admin/pending-users', icon: <Clock className="w-4 h-4" /> },
    { label: 'Students', to: '/admin/students', icon: <Users className="w-4 h-4" /> },
    { label: 'Teachers', to: '/admin/teachers', icon: <BookOpen className="w-4 h-4" /> },
    { label: 'Announcements', to: '/admin/announcements', icon: <Megaphone className="w-4 h-4" /> },
    { label: 'Admissions', to: '/admin/admissions', icon: <FileText className="w-4 h-4" /> },
    { label: 'Profile', to: '/admin/profile', icon: <UserCircle className="w-4 h-4" /> },
  ];

  const teacherItems: SidebarItem[] = [
    { label: 'Dashboard', to: '/teacher/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Students', to: '/teacher/students', icon: <Users className="w-4 h-4" /> },
    { label: 'Attendance', to: '/teacher/attendance', icon: <CheckSquare className="w-4 h-4" /> },
    { label: 'Grades', to: '/teacher/grades', icon: <GraduationCap className="w-4 h-4" /> },
    { label: 'Profile', to: '/teacher/profile', icon: <UserCircle className="w-4 h-4" /> },
  ];

  const studentItems: SidebarItem[] = [
    { label: 'Dashboard', to: '/student/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Results', to: '/student/results', icon: <GraduationCap className="w-4 h-4" /> },
    { label: 'Attendance', to: '/student/attendance', icon: <CheckSquare className="w-4 h-4" /> },
    { label: 'Announcements', to: '/student/announcements', icon: <Megaphone className="w-4 h-4" /> },
    { label: 'Admissions', to: '/student/admissions', icon: <FileText className="w-4 h-4" /> },
    { label: 'Report', to: '/student/report', icon: <ClipboardList className="w-4 h-4" /> },
    { label: 'Profile', to: '/student/profile', icon: <UserCircle className="w-4 h-4" /> },
  ];

  let items: SidebarItem[] = [];
  if (user?.role === 'admin') items = adminItems;
  if (user?.role === 'teacher') items = teacherItems;
  if (user?.role === 'student') items = studentItems;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-56 bg-black border-r border-neutral-800 flex flex-col min-h-[calc(100vh-4rem)] shrink-0">
      <nav className="flex-1 p-3 space-y-0.5">
        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-3 mt-1">
          Navigation
        </p>
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2.5 rounded text-xs font-medium transition-colors duration-150 ${
                isActive
                  ? 'bg-[#1b2d53] text-white'
                  : 'text-neutral-400 hover:bg-[#1b2d53]/40 hover:text-white'
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-neutral-800">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-3 py-2.5 rounded text-xs font-medium text-neutral-400 hover:bg-red-950/50 hover:text-red-300 transition-colors duration-150 w-full"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
