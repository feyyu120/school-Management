import React from 'react';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700 text-center space-y-6">
        <div className="inline-block bg-indigo-500/10 text-indigo-400 px-4 py-1.5 rounded-full text-sm font-semibold border border-indigo-500/20">
          Tailwind CSS & React Configured ✨
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">
          School Management Frontend
        </h1>
        <p className="text-slate-400 text-base leading-relaxed">
          The frontend project structure is ready with Tailwind CSS installed and fully configured.
        </p>
        <div className="pt-4 border-t border-slate-700/60 flex justify-center gap-4">
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2.5 rounded-xl transition duration-200 shadow-lg shadow-indigo-600/30">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
