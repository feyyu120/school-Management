import { request } from './api';
import type { APIResponse } from '../types/auth';
import type { UserProfile } from '../types/user';

export const profileApi = {
  getProfile: async (): Promise<APIResponse<UserProfile>> => {
    return request<UserProfile>('/profile', { method: 'GET' });
  },

  getStudentReport: async (): Promise<APIResponse<any>> => {
    return request<any>('/student/report', { method: 'GET' });
  },
};
