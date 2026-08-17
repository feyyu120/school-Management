import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { adminApi } from '../../services/adminApi';
import type { UserProfile } from '../../types/user';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';

const TeacherStudents: React.FC = () => {
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi.getStudents().then(res => {
      if (res.success && res.data) setStudents(res.data);
    }).catch(err => {
      setError(err.message || 'Failed to load students.');
    }).finally(() => setIsLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-5xl">
        <div className="border-b border-neutral-800 pb-4">
          <h1 className="text-xl font-bold text-white">Students</h1>
          <p className="text-neutral-500 text-sm mt-0.5">All approved students in the system</p>
        </div>

        <ErrorMessage message={error} />

        <div className="bg-neutral-950 border border-neutral-800 rounded-lg">
          {isLoading ? (
            <div className="p-8"><Loading /></div>
          ) : students.length === 0 ? (
            <EmptyState message="No students available yet." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-800 text-xs text-neutral-500 uppercase">
                    <th className="text-left py-3 px-5">Name</th>
                    <th className="text-left py-3 px-5">Student ID</th>
                    <th className="text-left py-3 px-5">Grade</th>
                    <th className="text-left py-3 px-5">Class</th>
                    <th className="text-left py-3 px-5">Record ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  {students.map((s) => (
                    <tr key={s.id} className="hover:bg-neutral-900/40">
                      <td className="py-3 px-5 text-white font-medium">{s.full_name}</td>
                      <td className="py-3 px-5 text-neutral-300">{s.student_info?.student_id ?? '—'}</td>
                      <td className="py-3 px-5 text-neutral-300">{s.student_info?.grade ?? '—'}</td>
                      <td className="py-3 px-5 text-neutral-300">{s.student_info?.class ?? '—'}</td>
                      <td className="py-3 px-5 text-neutral-600 font-mono text-xs">{s.student_info?.id ?? '—'}</td>
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

export default TeacherStudents;
