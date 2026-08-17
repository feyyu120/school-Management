import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { admissionsApi } from '../../services/admissionsApi';
import type { Admission } from '../../types/admission';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const AdminAdmissions: React.FC = () => {
  const [items, setItems] = useState<Admission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Admission | null>(null);
  const [form, setForm] = useState({ title: '', description: '', requirements: '', deadline: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const res = await admissionsApi.getAll();
      if (res.success && res.data) setItems(res.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load admissions.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const openCreate = () => {
    setEditItem(null);
    setForm({ title: '', description: '', requirements: '', deadline: '' });
    setFormError(null);
    setShowModal(true);
  };

  const openEdit = (item: Admission) => {
    setEditItem(item);
    setForm({
      title: item.title,
      description: item.description,
      requirements: item.requirements || '',
      deadline: item.deadline ? item.deadline.split('T')[0] : '',
    });
    setFormError(null);
    setShowModal(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      setFormError('Title and description are required.');
      return;
    }
    setFormLoading(true);
    setFormError(null);
    const payload = {
      title: form.title,
      description: form.description,
      requirements: form.requirements || undefined,
      deadline: form.deadline || undefined,
    };
    try {
      if (editItem) {
        await admissionsApi.update(editItem.id, payload);
        setActionMsg('Admission updated.');
      } else {
        await admissionsApi.create(payload);
        setActionMsg('Admission created.');
      }
      setShowModal(false);
      fetchAll();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this admission entry?')) return;
    setError(null);
    try {
      await admissionsApi.delete(id);
      setActionMsg('Admission deleted.');
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete.');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-4xl">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div>
            <h1 className="text-xl font-bold text-white">Admissions</h1>
            <p className="text-neutral-500 text-sm mt-0.5">Manage admission information</p>
          </div>
          <Button onClick={openCreate} className="w-auto px-4 py-2 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>New</span>
          </Button>
        </div>

        {actionMsg && (
          <div className="text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-800 rounded px-4 py-2">
            {actionMsg}
          </div>
        )}
        <ErrorMessage message={error} />

        {isLoading ? (
          <Loading />
        ) : items.length === 0 ? (
          <EmptyState message="No admissions available." />
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="bg-neutral-950 border border-neutral-800 rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-sm">{item.title}</h3>
                    <p className="text-neutral-400 text-xs mt-1">{item.description}</p>
                    {item.requirements && (
                      <p className="text-neutral-500 text-xs mt-1"><span className="text-neutral-400">Requirements:</span> {item.requirements}</p>
                    )}
                    {item.deadline && (
                      <p className="text-neutral-500 text-xs mt-1">
                        <span className="text-neutral-400">Deadline:</span> {new Date(item.deadline).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <button onClick={() => openEdit(item)} className="text-neutral-400 hover:text-white p-1.5 rounded hover:bg-neutral-800 transition-colors">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="text-neutral-400 hover:text-red-300 p-1.5 rounded hover:bg-red-950/40 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editItem ? 'Edit Admission' : 'New Admission'}
      >
        <div className="space-y-4">
          <Input id="adm-title" name="title" label="Title" type="text" placeholder="Admission title" value={form.title} onChange={handleChange} />
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Admission description..."
              className="w-full bg-black border border-neutral-800 text-white text-sm rounded px-3 py-2 focus:outline-none focus:border-[#1b2d53] resize-none placeholder:text-neutral-700"
            />
          </div>
          <Input id="adm-req" name="requirements" label="Requirements (optional)" type="text" placeholder="e.g. Transcripts, ID" value={form.requirements} onChange={handleChange} />
          <Input id="adm-dl" name="deadline" label="Deadline (optional)" type="date" value={form.deadline} onChange={handleChange} />
          <ErrorMessage message={formError} />
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => setShowModal(false)}
              className="flex-1 py-2 text-xs rounded border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
            >
              Cancel
            </button>
            <Button onClick={handleSave} isLoading={formLoading} className="flex-1 py-2">
              {editItem ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default AdminAdmissions;
