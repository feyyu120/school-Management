import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { announcementsApi } from '../../services/announcementsApi';
import type { Announcement } from '../../types/announcement';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';

const StudentAnnouncements: React.FC = () => {
  const [items, setItems] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    announcementsApi.getAll().then(res => {
      if (res.success && res.data) setItems(res.data);
    }).catch(err => {
      setError(err.message || 'Failed to load announcements.');
    }).finally(() => setIsLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-3xl">
        <div className="border-b border-neutral-800 pb-4">
          <h1 className="text-xl font-bold text-white">Announcements</h1>
          <p className="text-neutral-500 text-sm mt-0.5">School news and updates</p>
        </div>

        <ErrorMessage message={error} />

        {isLoading ? (
          <Loading />
        ) : items.length === 0 ? (
          <EmptyState message="No announcements available." />
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="bg-neutral-950 border border-neutral-800 rounded-lg p-5">
                <h2 className="text-white font-semibold text-sm mb-2">{item.title}</h2>
                <p className="text-neutral-400 text-sm whitespace-pre-line">{item.content}</p>
                <p className="text-neutral-600 text-xs mt-3">
                  {item.author_name || 'Admin'} · {new Date(item.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentAnnouncements;
