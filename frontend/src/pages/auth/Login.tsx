import React from 'react';
import LoginForm from '../../components/auth/LoginForm';

export const Login: React.FC = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <LoginForm />
    </div>
  );
};

export default Login;
