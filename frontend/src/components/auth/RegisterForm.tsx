import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../services/authApi';
import type { RegisterStudentData, RegisterTeacherData } from '../../types/auth';
import Button from '../common/Button';
import Input from '../common/Input';
import ErrorMessage from '../common/ErrorMessage';
import { CheckCircle2 } from 'lucide-react';

interface RegisterFormProps {
  role: 'student' | 'teacher';
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ role }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
    student_id: '',
    teacher_id: '',
    grade: '',
    class: '',
    subject: '',
    phone: '',
    id_document: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      if (role === 'student') {
        const studentPayload: RegisterStudentData = {
          full_name: formData.full_name,
          email: formData.email,
          password: formData.password,
          student_id: formData.student_id,
          grade: formData.grade,
          class: formData.class,
          phone: formData.phone || undefined,
          id_document: formData.id_document || undefined,
        };
        await authApi.registerStudent(studentPayload);
      } else {
        const teacherPayload: RegisterTeacherData = {
          full_name: formData.full_name,
          email: formData.email,
          password: formData.password,
          teacher_id: formData.teacher_id,
          subject: formData.subject,
          phone: formData.phone || undefined,
          id_document: formData.id_document || undefined,
        };
        await authApi.registerTeacher(teacherPayload);
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-md bg-black border border-neutral-800 rounded-lg p-8 space-y-6 text-center shadow-xl">
        <div className="flex justify-center text-green-400">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">Registration successful.</h2>
          <p className="text-sm text-neutral-300">
            Your account is waiting for administrator approval.
          </p>
          <p className="text-xs text-neutral-400">
            You will be able to login after your account has been verified by an admin.
          </p>
        </div>
        <Button onClick={() => navigate('/login')}>Return to Login</Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg bg-black border border-neutral-800 rounded-lg p-8 space-y-6 text-center shadow-xl">
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight text-white uppercase">SCHOOL SYSTEM</h2>
        <p className="text-xs text-neutral-400">Register as {role.toUpperCase()}</p>
      </div>

      <ErrorMessage message={error} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          name="full_name"
          placeholder="John Doe"
          value={formData.full_name}
          onChange={handleChange}
          required
        />

        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="user@example.com"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            name="confirm_password"
            placeholder="••••••••"
            value={formData.confirm_password}
            onChange={handleChange}
            required
          />
        </div>

        {role === 'student' ? (
          <>
            <Input
              label="Student ID"
              type="text"
              name="student_id"
              placeholder="e.g. STU-1001"
              value={formData.student_id}
              onChange={handleChange}
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Grade"
                type="text"
                name="grade"
                placeholder="Grade 10"
                value={formData.grade}
                onChange={handleChange}
                required
              />
              <Input
                label="Class"
                type="text"
                name="class"
                placeholder="Class A"
                value={formData.class}
                onChange={handleChange}
                required
              />
            </div>
          </>
        ) : (
          <>
            <Input
              label="Teacher ID"
              type="text"
              name="teacher_id"
              placeholder="e.g. TCH-2001"
              value={formData.teacher_id}
              onChange={handleChange}
              required
            />
            <Input
              label="Subject"
              type="text"
              name="subject"
              placeholder="Mathematics"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </>
        )}

        <Input
          label="Phone Number (Optional)"
          type="tel"
          name="phone"
          placeholder="+1234567890"
          value={formData.phone}
          onChange={handleChange}
        />

        <Input
          label="ID / Document Number (Optional)"
          type="text"
          name="id_document"
          placeholder="DOC-998877"
          value={formData.id_document}
          onChange={handleChange}
        />

        <Button type="submit" isLoading={isLoading}>
          Submit Registration
        </Button>
      </form>

      <div className="pt-4 border-t border-neutral-900 text-xs text-neutral-400">
        Already have an account?{' '}
        <Link to="/login" className="text-white font-medium hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default RegisterForm;
