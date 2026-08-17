import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { attendanceApi } from '../../services/attendanceApi';
import type { Attendance } from '../../types/attendance';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';

const StudentAttendance: React.FC = () => {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    attendanceApi.getMyAttendance().then(res => {
      if (res.success && res.data) setRecords(res.data);
    }).catch(err => {
      setError(err.message || 'Failed to load attendance.');
    }).finally(() => setIsLoading(false));
  }, []);

  const present = records.filter(r => r.status === 'present').length;
  const absent = records.filter(r => r.status === 'absent').length;
  const late = records.filter(r => r.status === 'late').length;

  const statusBadge = (status: string) => {
    const cls = status === 'present' ? 'text-emerald-300 bg-emerald-950/40 border-emerald-900'
      : status === 'absent' ? 'text-red-300 bg-red-950/40 border-red-900'
      : 'text-yellow-300 bg-yellow-950/40 border-yellow-900';
    return <span className={`text-xs px-2 py-0.5 rounded border capitalize ${cls}`}>{status}</span>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-4xl">
        <div className="border-b border-neutral-800 pb-4">
          <h1 className="text-xl font-bold text-white">My Attendance</h1>
          <p className="text-neutral-500 text-sm mt-0.5">Your attendance records</p>
        </div>

        <ErrorMessage message={error} />

        {!isLoading && records.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Present', value: present, color: 'text-emerald-400' },
              { label: 'Absent', value: absent, color: 'text-red-400' },
              { label: 'Late', value: late, color: 'text-yellow-400' },
            ].map((s) => (
              <div key={s.label} className="bg-neutral-950 border border-neutral-800 rounded-lg p-4 text-center">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-neutral-500 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="bg-neutral-950 border border-neutral-800 rounded-lg">
          {isLoading ? (
            <div className="p-8"><Loading /></div>
          ) : records.length === 0 ? (
            <EmptyState message="No attendance records available yet." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-800 text-xs text-neutral-500 uppercase">
                    <th className="text-left py-3 px-5">Date</th>
                    <th className="text-left py-3 px-5">Status</th>
                    <th className="text-left py-3 px-5">Teacher</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  {records.map((r) => (
                    <tr key={r.id} className="hover:bg-neutral-900/40">
                      <td className="py-3 px-5 text-white">{r.date}</td>
                      <td className="py-3 px-5">{statusBadge(r.status)}</td>
                      <td className="py-3 px-5 text-neutral-400">{r.teacher_name || '—'}</td>
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

export default StudentAttendance;
