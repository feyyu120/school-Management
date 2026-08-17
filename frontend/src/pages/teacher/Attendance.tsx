import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { attendanceApi } from '../../services/attendanceApi';
import { adminApi } from '../../services/adminApi';
import type { Attendance } from '../../types/attendance';
import type { UserProfile } from '../../types/user';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

const STATUS_OPTIONS = ['present', 'absent', 'late'] as const;

const TeacherAttendance: React.FC = () => {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editRecord, setEditRecord] = useState<Attendance | null>(null);
  const [form, setForm] = useState<{ student_id: string; date: string; status: 'present' | 'absent' | 'late' }>({
    student_id: '',
    date: new Date().toISOString().split('T')[0],
    status: 'present',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const [attRes, stuRes] = await Promise.all([
        attendanceApi.getTeacherStudentsAttendance(),
        adminApi.getStudents(),
      ]);
      if (attRes.success && attRes.data) setRecords(attRes.data);
      if (stuRes.success && stuRes.data) setStudents(stuRes.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load attendance records.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const openCreate = () => {
    setEditRecord(null);
    setForm({ student_id: students[0]?.student_info?.id || '', date: new Date().toISOString().split('T')[0], status: 'present' });
    setFormError(null);
    setShowModal(true);
  };

  const openEdit = (record: Attendance) => {
    setEditRecord(record);
    setForm({ student_id: record.student_id, date: record.date, status: record.status });
    setFormError(null);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.student_id || !form.date) {
      setFormError('Student and date are required.');
      return;
    }
    setFormLoading(true);
    setFormError(null);
    try {
      if (editRecord) {
        await attendanceApi.updateAttendance(editRecord.id, { status: form.status });
        setActionMsg('Attendance updated.');
      } else {
        await attendanceApi.createAttendance({ student_id: form.student_id, date: form.date, status: form.status });
        setActionMsg('Attendance recorded.');
      }
      setShowModal(false);
      fetchAll();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save attendance.');
    } finally {
      setFormLoading(false);
    }
  };

  const statusBadge = (status: string) => {
    const cls = status === 'present' ? 'text-emerald-300 bg-emerald-950/40 border-emerald-900'
      : status === 'absent' ? 'text-red-300 bg-red-950/40 border-red-900'
      : 'text-yellow-300 bg-yellow-950/40 border-yellow-900';
    return <span className={`text-xs px-2 py-0.5 rounded border capitalize ${cls}`}>{status}</span>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-5xl">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div>
            <h1 className="text-xl font-bold text-white">Attendance</h1>
            <p className="text-neutral-500 text-sm mt-0.5">Record and manage student attendance</p>
          </div>
          <Button onClick={openCreate} className="w-auto px-4 py-2">
            + Record
          </Button>
        </div>

        {actionMsg && (
          <div className="text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-800 rounded px-4 py-2">{actionMsg}</div>
        )}
        <ErrorMessage message={error} />

        <div className="bg-neutral-950 border border-neutral-800 rounded-lg">
          {isLoading ? (
            <div className="p-8"><Loading /></div>
          ) : records.length === 0 ? (
            <EmptyState message="No attendance records yet. Record the first one!" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-800 text-xs text-neutral-500 uppercase">
                    <th className="text-left py-3 px-5">Student</th>
                    <th className="text-left py-3 px-5">Date</th>
                    <th className="text-left py-3 px-5">Status</th>
                    <th className="text-right py-3 px-5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  {records.map((r) => (
                    <tr key={r.id} className="hover:bg-neutral-900/40">
                      <td className="py-3 px-5 text-white font-medium">{r.student_name || r.student_id}</td>
                      <td className="py-3 px-5 text-neutral-400">{r.date}</td>
                      <td className="py-3 px-5">{statusBadge(r.status)}</td>
                      <td className="py-3 px-5 text-right">
                        <button
                          onClick={() => openEdit(r)}
                          className="text-xs text-neutral-400 hover:text-white border border-neutral-700 hover:border-neutral-500 px-3 py-1 rounded transition-colors"
                        >
                          Edit
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editRecord ? 'Update Attendance' : 'Record Attendance'}>
        <div className="space-y-4">
          {!editRecord && (
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">Student</label>
              <select
                value={form.student_id}
                onChange={(e) => setForm({ ...form, student_id: e.target.value })}
                className="w-full bg-black border border-neutral-800 text-white text-sm rounded px-3 py-2 focus:outline-none focus:border-[#1b2d53]"
              >
                <option value="">Select a student</option>
                {students.map((s) => (
                  <option key={s.student_info?.id} value={s.student_info?.id}>
                    {s.full_name} ({s.student_info?.student_id})
                  </option>
                ))}
              </select>
            </div>
          )}
          {editRecord && (
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">Student</label>
              <p className="text-white text-sm px-3 py-2 bg-neutral-900 rounded">{editRecord.student_name}</p>
            </div>
          )}
          {!editRecord && (
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full bg-black border border-neutral-800 text-white text-sm rounded px-3 py-2 focus:outline-none focus:border-[#1b2d53]"
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Status</label>
            <div className="flex gap-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm({ ...form, status: s })}
                  className={`flex-1 py-2 rounded text-xs font-medium border transition-colors ${
                    form.status === s ? 'bg-[#1b2d53] border-[#1b2d53] text-white' : 'bg-black border-neutral-800 text-neutral-400 hover:border-neutral-600'
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <ErrorMessage message={formError} />
          <div className="flex gap-2 pt-1">
            <button onClick={() => setShowModal(false)} className="flex-1 py-2 text-xs rounded border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors">
              Cancel
            </button>
            <Button onClick={handleSave} isLoading={formLoading} className="flex-1 py-2">
              {editRecord ? 'Update' : 'Record'}
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default TeacherAttendance;
