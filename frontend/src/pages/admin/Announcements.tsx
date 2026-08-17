import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { announcementsApi } from '../../services/announcementsApi';
import type { Announcement } from '../../types/announcement';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const AdminAnnouncements: React.FC = () => {
  const [items, setItems] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Announcement | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const res = await announcementsApi.getAll();
      if (res.success && res.data) setItems(res.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load announcements.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const openCreate = () => {
    setEditItem(null);
    setFormTitle('');
    setFormContent('');
    setFormError(null);
    setShowModal(true);
  };

  const openEdit = (item: Announcement) => {
    setEditItem(item);
    setFormTitle(item.title);
    setFormContent(item.content);
    setFormError(null);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formTitle.trim() || !formContent.trim()) {
      setFormError('Title and content are required.');
      return;
    }
    setFormLoading(true);
    setFormError(null);
    try {
      if (editItem) {
        await announcementsApi.update(editItem.id, { title: formTitle, content: formContent });
        setActionMsg('Announcement updated.');
      } else {
        await announcementsApi.create({ title: formTitle, content: formContent });
        setActionMsg('Announcement created.');
      }
      setShowModal(false);
      fetchAll();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save announcement.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this announcement?')) return;
    setError(null);
    try {
      await announcementsApi.delete(id);
      setActionMsg('Announcement deleted.');
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
            <h1 className="text-xl font-bold text-white">Announcements</h1>
            <p className="text-neutral-500 text-sm mt-0.5">Manage school announcements</p>
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
          <EmptyState message="No announcements available." />
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="bg-neutral-950 border border-neutral-800 rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-sm">{item.title}</h3>
                    <p className="text-neutral-400 text-xs mt-1 whitespace-pre-line">{item.content}</p>
                    <p className="text-neutral-600 text-xs mt-2">
                      By {item.author_name || 'Admin'} · {new Date(item.created_at).toLocaleDateString()}
                    </p>
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
        title={editItem ? 'Edit Announcement' : 'New Announcement'}
      >
        <div className="space-y-4">
          <Input
            id="ann-title"
            label="Title"
            type="text"
            placeholder="Announcement title"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
          />
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Content</label>
            <textarea
              value={formContent}
              onChange={(e) => setFormContent(e.target.value)}
              rows={4}
              placeholder="Announcement content..."
              className="w-full bg-black border border-neutral-800 text-white text-sm rounded px-3 py-2 focus:outline-none focus:border-[#1b2d53] resize-none placeholder:text-neutral-700"
            />
          </div>
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

export default AdminAnnouncements;
