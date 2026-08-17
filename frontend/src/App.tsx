import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-black text-white font-sans selection:bg-[#1b2d53] selection:text-white">
          <AppRoutes />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
