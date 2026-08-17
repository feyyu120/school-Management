import React from 'react';
import RegisterForm from '../../components/auth/RegisterForm';

export const StudentRegister: React.FC = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 py-12">
      <RegisterForm role="student" />
    </div>
  );
};

export default StudentRegister;
