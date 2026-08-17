import { request } from './api';
import type { APIResponse } from '../types/auth';
import type { Admission, CreateAdmissionRequest, UpdateAdmissionRequest } from '../types/admission';

export const admissionsApi = {
  getAll: async (): Promise<APIResponse<Admission[]>> => {
    return request<Admission[]>('/admissions', { method: 'GET' });
  },

  create: async (data: CreateAdmissionRequest): Promise<APIResponse<Admission>> => {
    return request<Admission>('/admissions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: UpdateAdmissionRequest): Promise<APIResponse> => {
    return request(`/admissions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<APIResponse> => {
    return request(`/admissions/${id}`, { method: 'DELETE' });
  },
};
