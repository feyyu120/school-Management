import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { profileApi } from '../../services/profileApi';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import { UserCircle, PrinterIcon } from 'lucide-react';

interface ReportData {
  student: {
    full_name: string;
    email: string;
    status: string;
    student_info?: {
      student_id: string;
      grade: string;
      class: string;
    };
  };
  grades: Array<{
    id: string;
    subject: string;
    exam_type: string;
    score: number;
    semester: string;
    created_at: string;
  }>;
  attendance_summary: {
    total_days: number;
    present: number;
    absent: number;
    late: number;
  };
}

const StudentReport: React.FC = () => {
  const [report, setReport] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    profileApi.getStudentReport().then(res => {
      if (res.success && res.data) setReport(res.data);
    }).catch(err => {
      setError(err.message || 'Failed to load student report.');
    }).finally(() => setIsLoading(false));
  }, []);

  const avg = report && report.grades.length > 0
    ? (report.grades.reduce((sum, g) => sum + g.score, 0) / report.grades.length).toFixed(1)
    : 'N/A';

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-3xl">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div>
            <h1 className="text-xl font-bold text-white">Academic Report</h1>
            <p className="text-neutral-500 text-sm mt-0.5">Your complete academic summary</p>
          </div>
          {report && (
            <button
              onClick={() => window.print()}
              className="flex items-center space-x-2 text-xs border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900 px-3 py-2 rounded transition-colors"
            >
              <PrinterIcon className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          )}
        </div>

        <ErrorMessage message={error} />

        {isLoading ? (
          <Loading />
        ) : report ? (
          <div className="space-y-4 print:text-black">
            {/* Student Info */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-5">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#1b2d53] flex items-center justify-center shrink-0">
                  <UserCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">{report.student.full_name}</p>
                  <p className="text-neutral-400 text-xs">{report.student.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="bg-black border border-neutral-800 rounded p-3">
                  <p className="text-neutral-500 mb-0.5">Student ID</p>
                  <p className="text-white font-medium">{report.student.student_info?.student_id || '—'}</p>
                </div>
                <div className="bg-black border border-neutral-800 rounded p-3">
                  <p className="text-neutral-500 mb-0.5">Grade</p>
                  <p className="text-white font-medium">{report.student.student_info?.grade || '—'}</p>
                </div>
                <div className="bg-black border border-neutral-800 rounded p-3">
                  <p className="text-neutral-500 mb-0.5">Class</p>
                  <p className="text-white font-medium">{report.student.student_info?.class || '—'}</p>
                </div>
              </div>
            </div>

            {/* Attendance Summary */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-5">
              <h2 className="text-sm font-semibold text-white mb-3">Attendance Summary</h2>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'Total Days', value: report.attendance_summary.total_days, color: 'text-white' },
                  { label: 'Present', value: report.attendance_summary.present, color: 'text-emerald-400' },
                  { label: 'Absent', value: report.attendance_summary.absent, color: 'text-red-400' },
                  { label: 'Late', value: report.attendance_summary.late, color: 'text-yellow-400' },
                ].map(s => (
                  <div key={s.label} className="bg-black border border-neutral-800 rounded p-3 text-center">
                    <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-neutral-500 text-xs mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Grades */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-white">Grades</h2>
                <span className="text-xs text-neutral-400">Average: <span className="text-white font-semibold">{avg}</span>/100</span>
              </div>
              {report.grades.length === 0 ? (
                <p className="text-neutral-500 text-sm">No grades recorded yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-neutral-800 text-xs text-neutral-500 uppercase">
                        <th className="text-left py-2 px-0">Subject</th>
                        <th className="text-left py-2 px-3">Exam</th>
                        <th className="text-left py-2 px-3">Score</th>
                        <th className="text-left py-2 px-3">Semester</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-900">
                      {report.grades.map((g) => (
                        <tr key={g.id}>
                          <td className="py-2 pr-3 text-white">{g.subject}</td>
                          <td className="py-2 px-3 text-neutral-400">{g.exam_type}</td>
                          <td className="py-2 px-3">
                            <span className={`font-semibold ${g.score >= 70 ? 'text-emerald-400' : g.score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                              {g.score}
                            </span>
                            <span className="text-neutral-600 text-xs">/100</span>
                          </td>
                          <td className="py-2 px-3 text-neutral-400">{g.semester}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </DashboardLayout>
  );
};

export default StudentReport;
