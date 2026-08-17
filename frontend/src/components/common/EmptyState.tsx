import React from 'react';

interface EmptyStateProps {
  message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message = 'No data available.' }) => {
  return (
    <div className="py-12 text-center">
      <p className="text-neutral-500 text-sm">{message}</p>
    </div>
  );
};

export default EmptyState;
