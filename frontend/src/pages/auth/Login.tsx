import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authApi } from '../../services/authApi';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import ErrorMessage from '../../components/common/ErrorMessage';
import type { Role } from '../../types/auth';

const ROLES: { value: Role; label: string }[] = [
  { value: 'student', label: 'Student' },
  { value: 'teacher', label: 'Teacher' },
  { value: 'admin', label: 'Admin' },
];

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await authApi.login({ email, password });
      if (res.success && res.data) {
        const { token, user } = res.data;
        login(token, user);
        if (user.role === 'admin') navigate('/admin/dashboard');
        else if (user.role === 'teacher') navigate('/teacher/dashboard');
        else navigate('/student/dashboard');
      } else {
        setError(res.message || 'Login failed.');
      }
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.toLowerCase().includes('pending')) {
        setError('Your account is waiting for admin approval.');
      } else if (msg.toLowerCase().includes('rejected')) {
        setError('Your account has been rejected. Contact the administrator.');
      } else if (msg.toLowerCase().includes('invalid') || msg.toLowerCase().includes('password')) {
        setError('Invalid email or password.');
      } else {
        setError(msg || 'Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-xl font-bold text-white tracking-wide uppercase">School System</h1>
          <p className="text-neutral-500 text-sm mt-1">Sign in to your account</p>
        </div>

        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6 space-y-5">
          {/* Role Selector */}
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-2">Login as</label>
            <div className="flex gap-2">
              {ROLES.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setSelectedRole(r.value)}
                  className={`flex-1 py-2 rounded text-xs font-medium border transition-colors duration-150 ${
                    selectedRole === r.value
                      ? 'bg-[#1b2d53] border-[#1b2d53] text-white'
                      : 'bg-black border-neutral-800 text-neutral-400 hover:border-neutral-600'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email"
              type="email"
              label="Email"
              placeholder="you@school.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Input
              id="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            <ErrorMessage message={error} />

            <Button type="submit" isLoading={isLoading}>
              Sign In
            </Button>
          </form>

          {selectedRole !== 'admin' && (
            <p className="text-center text-xs text-neutral-500">
              {selectedRole === 'student' ? (
                <>
                  No account?{' '}
                  <Link to="/register/student" className="text-white hover:underline">
                    Register as Student
                  </Link>
                </>
              ) : (
                <>
                  No account?{' '}
                  <Link to="/register/teacher" className="text-white hover:underline">
                    Register as Teacher
                  </Link>
                </>
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
