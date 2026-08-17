import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { admissionsApi } from '../../services/admissionsApi';
import type { Admission } from '../../types/admission';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';

const StudentAdmissions: React.FC = () => {
  const [items, setItems] = useState<Admission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    admissionsApi.getAll().then(res => {
      if (res.success && res.data) setItems(res.data);
    }).catch(err => {
      setError(err.message || 'Failed to load admissions.');
    }).finally(() => setIsLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-3xl">
        <div className="border-b border-neutral-800 pb-4">
          <h1 className="text-xl font-bold text-white">Admissions</h1>
          <p className="text-neutral-500 text-sm mt-0.5">Available admission information</p>
        </div>

        <ErrorMessage message={error} />

        {isLoading ? (
          <Loading />
        ) : items.length === 0 ? (
          <EmptyState message="No admissions information available." />
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="bg-neutral-950 border border-neutral-800 rounded-lg p-5">
                <h2 className="text-white font-semibold text-sm mb-2">{item.title}</h2>
                <p className="text-neutral-400 text-sm">{item.description}</p>
                {item.requirements && (
                  <div className="mt-3">
                    <p className="text-neutral-500 text-xs font-medium uppercase tracking-wide">Requirements</p>
                    <p className="text-neutral-400 text-sm mt-1">{item.requirements}</p>
                  </div>
                )}
                {item.deadline && (
                  <div className="mt-3 flex items-center space-x-2">
                    <span className="text-neutral-500 text-xs">Deadline:</span>
                    <span className="text-white text-xs font-medium">{new Date(item.deadline).toLocaleDateString()}</span>
                  </div>
                )}
                <p className="text-neutral-700 text-xs mt-3">Posted: {new Date(item.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentAdmissions;
