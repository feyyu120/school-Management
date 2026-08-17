import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { gradesApi } from '../../services/gradesApi';
import type { Grade } from '../../types/grade';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';

const StudentResults: React.FC = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    gradesApi.getMyGrades().then(res => {
      if (res.success && res.data) setGrades(res.data);
    }).catch(err => {
      setError(err.message || 'Failed to load grades.');
    }).finally(() => setIsLoading(false));
  }, []);

  const avg = grades.length > 0 ? (grades.reduce((sum, g) => sum + g.score, 0) / grades.length).toFixed(1) : null;

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-4xl">
        <div className="border-b border-neutral-800 pb-4">
          <h1 className="text-xl font-bold text-white">My Results</h1>
          <p className="text-neutral-500 text-sm mt-0.5">Your academic grades</p>
        </div>

        <ErrorMessage message={error} />

        {!isLoading && avg && (
          <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4 flex items-center space-x-4">
            <div>
              <p className="text-neutral-500 text-xs">Average Score</p>
              <p className="text-2xl font-bold text-white">{avg}<span className="text-neutral-600 text-sm">/100</span></p>
            </div>
            <div className="h-10 w-px bg-neutral-800" />
            <div>
              <p className="text-neutral-500 text-xs">Total Records</p>
              <p className="text-2xl font-bold text-white">{grades.length}</p>
            </div>
          </div>
        )}

        <div className="bg-neutral-950 border border-neutral-800 rounded-lg">
          {isLoading ? (
            <div className="p-8"><Loading /></div>
          ) : grades.length === 0 ? (
            <EmptyState message="No grades available yet." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-800 text-xs text-neutral-500 uppercase">
                    <th className="text-left py-3 px-5">Subject</th>
                    <th className="text-left py-3 px-5">Exam Type</th>
                    <th className="text-left py-3 px-5">Score</th>
                    <th className="text-left py-3 px-5">Semester</th>
                    <th className="text-left py-3 px-5">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  {grades.map((g) => (
                    <tr key={g.id} className="hover:bg-neutral-900/40">
                      <td className="py-3 px-5 text-white font-medium">{g.subject}</td>
                      <td className="py-3 px-5 text-neutral-400">{g.exam_type}</td>
                      <td className="py-3 px-5">
                        <span className={`font-semibold ${g.score >= 70 ? 'text-emerald-400' : g.score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {g.score}
                        </span>
                        <span className="text-neutral-600 text-xs">/100</span>
                      </td>
                      <td className="py-3 px-5 text-neutral-400">{g.semester}</td>
                      <td className="py-3 px-5 text-neutral-500 text-xs">{new Date(g.created_at).toLocaleDateString()}</td>
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

export default StudentResults;
