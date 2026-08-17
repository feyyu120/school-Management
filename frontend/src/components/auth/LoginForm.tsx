import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authApi } from '../../services/authApi';
import type { Role } from '../../types/auth';
import Button from '../common/Button';
import Input from '../common/Input';
import ErrorMessage from '../common/ErrorMessage';

export const LoginForm: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<Role>('student');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.login({ email, password });
      if (response.success && response.data) {
        const user = response.data.user;
        const token = response.data.token;

        // Verify that the user role matches the selected login role
        if (user.role !== selectedRole) {
          setError(`This account is registered as a ${user.role}. Please select "${user.role.toUpperCase()}" to log in.`);
          setIsLoading(false);
          return;
        }

        login(token, user);

        // Redirect based on role
        if (user.role === 'admin') navigate('/admin/dashboard');
        else if (user.role === 'teacher') navigate('/teacher/dashboard');
        else navigate('/student/dashboard');
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-black border border-neutral-800 rounded-lg p-8 space-y-6 text-center shadow-xl">
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight text-white uppercase">SCHOOL SYSTEM</h2>
        <p className="text-xs text-neutral-400">Login as {selectedRole.toUpperCase()}</p>
      </div>

      {/* Role Selection Tabs */}
      <div className="flex border border-neutral-800 rounded p-1 bg-neutral-950">
        {(['student', 'teacher', 'admin'] as Role[]).map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => {
              setSelectedRole(role);
              setError(null);
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded capitalize transition duration-150 ${
              selectedRole === role
                ? 'bg-[#1b2d53] text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      <ErrorMessage message={error} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="user@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button type="submit" isLoading={isLoading}>
          Login as {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
        </Button>
      </form>

      {/* Role-specific Registration Links */}
      <div className="pt-4 border-t border-neutral-900 text-xs text-neutral-400">
        {selectedRole === 'student' && (
          <p>
            Don't have a student account?{' '}
            <Link to="/register/student" className="text-white font-medium hover:underline">
              Register as Student
            </Link>
          </p>
        )}

        {selectedRole === 'teacher' && (
          <p>
            Don't have a teacher account?{' '}
            <Link to="/register/teacher" className="text-white font-medium hover:underline">
              Register as Teacher
            </Link>
          </p>
        )}

        {selectedRole === 'admin' && (
          <p className="text-neutral-500 text-[11px]">
            Admin accounts are managed directly by system administration.
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
