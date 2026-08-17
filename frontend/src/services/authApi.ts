import { request } from './api';
import type {
  AuthResponse,
  LoginCredentials,
  RegisterStudentData,
  RegisterTeacherData,
  User,
  APIResponse,
} from '../types/auth';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<APIResponse<AuthResponse>> => {
    return request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  registerStudent: async (data: RegisterStudentData): Promise<APIResponse> => {
    const { confirm_password, ...payload } = data;
    return request('/auth/register/student', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  registerTeacher: async (data: RegisterTeacherData): Promise<APIResponse> => {
    const { confirm_password, ...payload } = data;
    return request('/auth/register/teacher', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getPendingUsers: async (): Promise<APIResponse<User[]>> => {
    return request<User[]>('/admin/pending-users', {
      method: 'GET',
    });
  },

  approveUser: async (userId: string): Promise<APIResponse> => {
    return request(`/admin/users/${userId}/approve`, {
      method: 'PATCH',
    });
  },

  rejectUser: async (userId: string): Promise<APIResponse> => {
    return request(`/admin/users/${userId}/reject`, {
      method: 'PATCH',
    });
  },
};
