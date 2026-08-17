export type Role = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  full_name: string;
  email: string;
  role: Role;
  id_document?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string;
  updated_at?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterStudentData {
  full_name: string;
  email: string;
  password: string;
  confirm_password?: string;
  student_id: string;
  grade: string;
  class: string;
  phone?: string;
  id_document?: string;
}

export interface RegisterTeacherData {
  full_name: string;
  email: string;
  password: string;
  confirm_password?: string;
  teacher_id: string;
  subject: string;
  phone?: string;
  id_document?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface APIResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}
