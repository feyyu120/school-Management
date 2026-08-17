import { request } from './api';
import type { UserProfile, AdminDashboardStats } from '../types/user';
import type { APIResponse } from '../types/auth';
import type { User } from '../types/auth';

export const adminApi = {
  getDashboardStats: async (): Promise<APIResponse<AdminDashboardStats>> => {
    return request<AdminDashboardStats>('/admin/dashboard', { method: 'GET' });
  },

  getStudents: async (): Promise<APIResponse<UserProfile[]>> => {
    return request<UserProfile[]>('/admin/students', { method: 'GET' });
  },

  getTeachers: async (): Promise<APIResponse<UserProfile[]>> => {
    return request<UserProfile[]>('/admin/teachers', { method: 'GET' });
  },

  getPendingUsers: async (): Promise<APIResponse<User[]>> => {
    return request<User[]>('/admin/pending-users', { method: 'GET' });
  },

  approveUser: async (userId: string): Promise<APIResponse> => {
    return request(`/admin/users/${userId}/approve`, { method: 'PATCH' });
  },

  rejectUser: async (userId: string): Promise<APIResponse> => {
    return request(`/admin/users/${userId}/reject`, { method: 'PATCH' });
  },

  getProfile: async (): Promise<APIResponse<UserProfile>> => {
    return request<UserProfile>('/profile', { method: 'GET' });
  },
};
