import React, { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import { useAuth } from '../../hooks/useAuth';
import { authApi } from '../../services/authApi';
import type { User } from '../../types/auth';
import ErrorMessage from '../../components/common/ErrorMessage';
import Loading from '../../components/common/Loading';
import { UserCheck, UserX, ShieldAlert } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchPending = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.getPendingUsers();
      if (response.success && response.data) {
        setPendingUsers(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load pending users.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (userId: string) => {
    setActionMessage(null);
    try {
      const res = await authApi.approveUser(userId);
      setActionMessage(res.message || 'User approved.');
      fetchPending();
    } catch (err: any) {
      setError(err.message || 'Failed to approve user.');
    }
  };

  const handleReject = async (userId: string) => {
    setActionMessage(null);
    try {
      const res = await authApi.rejectUser(userId);
      setActionMessage(res.message || 'User rejected.');
      fetchPending();
    } catch (err: any) {
      setError(err.message || 'Failed to reject user.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8 space-y-6 text-left">
          <div className="border-b border-neutral-800 pb-4">
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-sm text-neutral-400">Welcome back, {user?.full_name}</p>
          </div>

          {actionMessage && (
            <div className="bg-emerald-950/40 border border-emerald-800 text-emerald-300 px-4 py-3 rounded text-sm">
              {actionMessage}
            </div>
          )}

          <ErrorMessage message={error} />

          <div className="bg-black border border-neutral-800 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <span>Pending User Approvals</span>
              </h2>
              <span className="text-xs bg-[#1b2d53] px-2.5 py-1 rounded-full font-bold">
                {pendingUsers.length} Pending
              </span>
            </div>

            {isLoading ? (
              <Loading />
            ) : pendingUsers.length === 0 ? (
              <p className="text-sm text-neutral-500 py-4">No pending user approvals at this time.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-800 text-xs text-neutral-400 uppercase">
                      <th className="py-3 px-4">Full Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Submitted At</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900">
                    {pendingUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-neutral-950">
                        <td className="py-3 px-4 font-medium text-white">{u.full_name}</td>
                        <td className="py-3 px-4 text-neutral-300">{u.email}</td>
                        <td className="py-3 px-4 capitalize">
                          <span className="bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded text-xs">
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-neutral-500 text-xs">
                          {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleApprove(u.id)}
                            className="bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-800 px-3 py-1 rounded text-xs inline-flex items-center space-x-1"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleReject(u.id)}
                            className="bg-red-950 hover:bg-red-900 text-red-200 border border-red-800 px-3 py-1 rounded text-xs inline-flex items-center space-x-1"
                          >
                            <UserX className="w-3.5 h-3.5" />
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
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
