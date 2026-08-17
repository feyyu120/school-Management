import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../hooks/useAuth';
import { adminApi } from '../../services/adminApi';
import { authApi } from '../../services/authApi';
import type { AdminDashboardStats } from '../../types/user';
import type { User } from '../../types/auth';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import { Users, BookOpen, Clock, Megaphone, UserCheck, UserX } from 'lucide-react';

const StatCard: React.FC<{ label: string; value: number; icon: React.ReactNode; to: string }> = ({ label, value, icon, to }) => (
  <Link to={to} className="bg-neutral-950 border border-neutral-800 rounded-lg p-5 hover:border-neutral-600 transition-colors duration-150 block">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-neutral-500 text-xs mb-1">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
      <div className="text-neutral-600">{icon}</div>
    </div>
  </Link>
);

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [pending, setPending] = useState<User[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [pendingLoading, setPendingLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  useEffect(() => {
    adminApi.getDashboardStats().then(res => {
      if (res.success && res.data) setStats(res.data);
      setStatsLoading(false);
    }).catch(() => setStatsLoading(false));

    authApi.getPendingUsers().then(res => {
      if (res.success && res.data) setPending(res.data);
      setPendingLoading(false);
    }).catch(() => setPendingLoading(false));
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await authApi.approveUser(id);
      setActionMsg('User approved.');
      setPending(prev => prev.filter(u => u.id !== id));
      setStats(prev => prev ? { ...prev, pending_users: prev.pending_users - 1 } : prev);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await authApi.rejectUser(id);
      setActionMsg('User rejected.');
      setPending(prev => prev.filter(u => u.id !== id));
      setStats(prev => prev ? { ...prev, pending_users: prev.pending_users - 1 } : prev);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl">
        <div className="border-b border-neutral-800 pb-4">
          <h1 className="text-xl font-bold text-white">Dashboard</h1>
          <p className="text-neutral-500 text-sm mt-0.5">Welcome back, {user?.full_name}</p>
        </div>

        {actionMsg && (
          <div className="text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-800 rounded px-4 py-2">
            {actionMsg}
          </div>
        )}
        <ErrorMessage message={error} />

        {statsLoading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Students" value={stats?.total_students ?? 0} icon={<Users className="w-6 h-6" />} to="/admin/students" />
            <StatCard label="Teachers" value={stats?.total_teachers ?? 0} icon={<BookOpen className="w-6 h-6" />} to="/admin/teachers" />
            <StatCard label="Pending Users" value={stats?.pending_users ?? 0} icon={<Clock className="w-6 h-6" />} to="/admin/pending-users" />
            <StatCard label="Announcements" value={stats?.total_announcements ?? 0} icon={<Megaphone className="w-6 h-6" />} to="/admin/announcements" />
          </div>
        )}

        <div className="bg-neutral-950 border border-neutral-800 rounded-lg">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800">
            <h2 className="text-sm font-semibold text-white">Recent Pending Users</h2>
            <Link to="/admin/pending-users" className="text-xs text-neutral-400 hover:text-white transition-colors">View all</Link>
          </div>

          {pendingLoading ? (
            <div className="p-6"><Loading /></div>
          ) : pending.length === 0 ? (
            <p className="text-neutral-500 text-sm px-5 py-6">No pending users at this time.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-800 text-xs text-neutral-500 uppercase">
                    <th className="text-left py-3 px-5">Name</th>
                    <th className="text-left py-3 px-5">Email</th>
                    <th className="text-left py-3 px-5">Role</th>
                    <th className="text-right py-3 px-5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  {pending.slice(0, 5).map((u) => (
                    <tr key={u.id} className="hover:bg-neutral-900/50">
                      <td className="py-3 px-5 text-white font-medium">{u.full_name}</td>
                      <td className="py-3 px-5 text-neutral-400">{u.email}</td>
                      <td className="py-3 px-5">
                        <span className="text-xs bg-neutral-900 border border-neutral-700 px-2 py-0.5 rounded capitalize">{u.role}</span>
                      </td>
                      <td className="py-3 px-5 text-right space-x-2">
                        <button
                          onClick={() => handleApprove(u.id)}
                          className="inline-flex items-center space-x-1 bg-[#1b2d53] hover:bg-[#162544] text-white text-xs px-3 py-1 rounded transition-colors"
                        >
                          <UserCheck className="w-3 h-3" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleReject(u.id)}
                          className="inline-flex items-center space-x-1 bg-neutral-900 hover:bg-red-950 text-neutral-300 hover:text-red-300 border border-neutral-700 hover:border-red-900 text-xs px-3 py-1 rounded transition-colors"
                        >
                          <UserX className="w-3 h-3" />
                          <span>Reject</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
