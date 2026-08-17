import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { authApi } from '../../services/authApi';
import type { User } from '../../types/auth';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { UserCheck, UserX } from 'lucide-react';

const PendingUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);

  const fetchPending = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authApi.getPendingUsers();
      if (res.success && res.data) setUsers(res.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load pending users.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchPending(); }, []);

  const handleApprove = async (id: string) => {
    setProcessing(id);
    setActionMsg(null);
    setError(null);
    try {
      await authApi.approveUser(id);
      setActionMsg('User approved successfully.');
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to approve user.');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (id: string) => {
    setProcessing(id);
    setActionMsg(null);
    setError(null);
    try {
      await authApi.rejectUser(id);
      setActionMsg('User rejected.');
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to reject user.');
    } finally {
      setProcessing(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-5xl">
        <div className="border-b border-neutral-800 pb-4">
          <h1 className="text-xl font-bold text-white">Pending Users</h1>
          <p className="text-neutral-500 text-sm mt-0.5">Review and approve or reject pending registrations</p>
        </div>

        {actionMsg && (
          <div className="text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-800 rounded px-4 py-2">
            {actionMsg}
          </div>
        )}
        <ErrorMessage message={error} />

        <div className="bg-neutral-950 border border-neutral-800 rounded-lg">
          {isLoading ? (
            <div className="p-8"><Loading /></div>
          ) : users.length === 0 ? (
            <EmptyState message="No pending users." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-800 text-xs text-neutral-500 uppercase">
                    <th className="text-left py-3 px-5">Name</th>
                    <th className="text-left py-3 px-5">Email</th>
                    <th className="text-left py-3 px-5">Role</th>
                    <th className="text-left py-3 px-5">Submitted</th>
                    <th className="text-right py-3 px-5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-neutral-900/40">
                      <td className="py-3 px-5 text-white font-medium">{u.full_name}</td>
                      <td className="py-3 px-5 text-neutral-400">{u.email}</td>
                      <td className="py-3 px-5">
                        <span className="capitalize text-xs bg-neutral-900 border border-neutral-700 px-2 py-0.5 rounded">{u.role}</span>
                      </td>
                      <td className="py-3 px-5 text-neutral-500 text-xs">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-3 px-5 text-right space-x-2">
                        <button
                          onClick={() => handleApprove(u.id)}
                          disabled={processing === u.id}
                          className="inline-flex items-center space-x-1 bg-[#1b2d53] hover:bg-[#162544] disabled:opacity-50 text-white text-xs px-3 py-1.5 rounded transition-colors"
                        >
                          <UserCheck className="w-3 h-3" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleReject(u.id)}
                          disabled={processing === u.id}
                          className="inline-flex items-center space-x-1 bg-neutral-900 hover:bg-red-950 disabled:opacity-50 text-neutral-300 hover:text-red-300 border border-neutral-700 hover:border-red-800 text-xs px-3 py-1.5 rounded transition-colors"
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

export default PendingUsers;
