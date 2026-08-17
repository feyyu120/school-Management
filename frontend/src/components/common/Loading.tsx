import React from 'react';

export const Loading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-6 space-y-3">
      <div className="w-8 h-8 border-2 border-[#1b2d53] border-t-white rounded-full animate-spin"></div>
      <p className="text-sm text-neutral-400 font-medium">Loading...</p>
    </div>
  );
};

export default Loading;
