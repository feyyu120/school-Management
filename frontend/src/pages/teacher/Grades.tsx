import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { gradesApi } from '../../services/gradesApi';
import { adminApi } from '../../services/adminApi';
import type { Grade } from '../../types/grade';
import type { UserProfile } from '../../types/user';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';

const EXAM_TYPES = ['Midterm', 'Final', 'Quiz', 'Assignment', 'Project'];
const SEMESTERS = ['Semester 1', 'Semester 2'];

const TeacherGrades: React.FC = () => {
  const [records, setRecords] = useState<Grade[]>([]);
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editRecord, setEditRecord] = useState<Grade | null>(null);
  const [form, setForm] = useState({ student_id: '', subject: '', exam_type: 'Midterm', score: '', semester: 'Semester 1' });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const [gradesRes, stuRes] = await Promise.all([
        gradesApi.getTeacherStudentsGrades(),
        adminApi.getStudents(),
      ]);
      if (gradesRes.success && gradesRes.data) setRecords(gradesRes.data);
      if (stuRes.success && stuRes.data) setStudents(stuRes.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load grades.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const openCreate = () => {
    setEditRecord(null);
    setForm({ student_id: students[0]?.student_info?.id || '', subject: '', exam_type: 'Midterm', score: '', semester: 'Semester 1' });
    setFormError(null);
    setShowModal(true);
  };

  const openEdit = (record: Grade) => {
    setEditRecord(record);
    setForm({
      student_id: record.student_id,
      subject: record.subject,
      exam_type: record.exam_type,
      score: String(record.score),
      semester: record.semester,
    });
    setFormError(null);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.subject.trim() || !form.score || !form.semester) {
      setFormError('All fields are required.');
      return;
    }
    const scoreNum = parseFloat(form.score);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
      setFormError('Score must be between 0 and 100.');
      return;
    }
    setFormLoading(true);
    setFormError(null);
    try {
      if (editRecord) {
        await gradesApi.updateGrade(editRecord.id, {
          subject: form.subject,
          exam_type: form.exam_type,
          score: scoreNum,
          semester: form.semester,
        });
        setActionMsg('Grade updated.');
      } else {
        await gradesApi.createGrade({
          student_id: form.student_id,
          subject: form.subject,
          exam_type: form.exam_type,
          score: scoreNum,
          semester: form.semester,
        });
        setActionMsg('Grade added.');
      }
      setShowModal(false);
      fetchAll();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save grade.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-5xl">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div>
            <h1 className="text-xl font-bold text-white">Grades</h1>
            <p className="text-neutral-500 text-sm mt-0.5">Add and manage student grades</p>
          </div>
          <Button onClick={openCreate} className="w-auto px-4 py-2">
            + Add Grade
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
            <EmptyState message="No grades recorded yet." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-800 text-xs text-neutral-500 uppercase">
                    <th className="text-left py-3 px-5">Student</th>
                    <th className="text-left py-3 px-5">Subject</th>
                    <th className="text-left py-3 px-5">Exam</th>
                    <th className="text-left py-3 px-5">Score</th>
                    <th className="text-left py-3 px-5">Semester</th>
                    <th className="text-right py-3 px-5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  {records.map((r) => (
                    <tr key={r.id} className="hover:bg-neutral-900/40">
                      <td className="py-3 px-5 text-white font-medium">{r.student_name || r.student_id}</td>
                      <td className="py-3 px-5 text-neutral-300">{r.subject}</td>
                      <td className="py-3 px-5 text-neutral-400">{r.exam_type}</td>
                      <td className="py-3 px-5">
                        <span className={`font-semibold ${r.score >= 70 ? 'text-emerald-400' : r.score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {r.score}
                        </span>
                        <span className="text-neutral-600 text-xs">/100</span>
                      </td>
                      <td className="py-3 px-5 text-neutral-400">{r.semester}</td>
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editRecord ? 'Edit Grade' : 'Add Grade'}>
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
          <Input id="grade-subject" label="Subject" type="text" placeholder="e.g. Mathematics" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Exam Type</label>
            <select
              value={form.exam_type}
              onChange={(e) => setForm({ ...form, exam_type: e.target.value })}
              className="w-full bg-black border border-neutral-800 text-white text-sm rounded px-3 py-2 focus:outline-none focus:border-[#1b2d53]"
            >
              {EXAM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <Input id="grade-score" label="Score (0–100)" type="number" placeholder="85" value={form.score} onChange={(e) => setForm({ ...form, score: e.target.value })} />
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Semester</label>
            <select
              value={form.semester}
              onChange={(e) => setForm({ ...form, semester: e.target.value })}
              className="w-full bg-black border border-neutral-800 text-white text-sm rounded px-3 py-2 focus:outline-none focus:border-[#1b2d53]"
            >
              {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <ErrorMessage message={formError} />
          <div className="flex gap-2 pt-1">
            <button onClick={() => setShowModal(false)} className="flex-1 py-2 text-xs rounded border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors">
              Cancel
            </button>
            <Button onClick={handleSave} isLoading={formLoading} className="flex-1 py-2">
              {editRecord ? 'Update' : 'Add Grade'}
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default TeacherGrades;
