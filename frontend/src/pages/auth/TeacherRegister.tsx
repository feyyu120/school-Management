import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../services/authApi';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import ErrorMessage from '../../components/common/ErrorMessage';

const TeacherRegister: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    teacher_id: '',
    subject: '',
    phone: '',
    password: '',
    confirm_password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirm_password) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authApi.registerTeacher({
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        teacher_id: form.teacher_id,
        subject: form.subject,
        phone: form.phone || undefined,
      });
      if (res.success) {
        setSuccess(true);
      } else {
        setError(res.message || 'Registration failed.');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center space-y-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-8">
            <div className="w-12 h-12 rounded-full bg-[#1b2d53] flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-white font-semibold text-base mb-2">Registration Successful</h2>
            <p className="text-neutral-400 text-sm mb-6">
              Your account is waiting for administrator approval. You will be able to login once approved.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="text-xs text-white underline"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold text-white uppercase tracking-wide">School System</h1>
          <p className="text-neutral-500 text-sm mt-1">Teacher Registration</p>
        </div>

        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Input id="full_name" name="full_name" type="text" label="Full Name" placeholder="John Smith" value={form.full_name} onChange={handleChange} required />
              </div>
              <div className="col-span-2">
                <Input id="email" name="email" type="email" label="Email" placeholder="john@school.com" value={form.email} onChange={handleChange} required />
              </div>
              <Input id="teacher_id" name="teacher_id" type="text" label="Teacher ID" placeholder="TCH-001" value={form.teacher_id} onChange={handleChange} required />
              <Input id="subject" name="subject" type="text" label="Subject" placeholder="Mathematics" value={form.subject} onChange={handleChange} required />
              <div className="col-span-2">
                <Input id="phone" name="phone" type="text" label="Phone (optional)" placeholder="+1234567890" value={form.phone} onChange={handleChange} />
              </div>
              <Input id="password" name="password" type="password" label="Password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
              <Input id="confirm_password" name="confirm_password" type="password" label="Confirm Password" placeholder="••••••••" value={form.confirm_password} onChange={handleChange} required />
            </div>

            <ErrorMessage message={error} />

            <Button type="submit" isLoading={isLoading}>
              Register
            </Button>
          </form>

          <p className="text-center text-xs text-neutral-500 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-white hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeacherRegister;
