import { request } from './api';
import type { APIResponse } from '../types/auth';
import type { Announcement, CreateAnnouncementRequest, UpdateAnnouncementRequest } from '../types/announcement';

export const announcementsApi = {
  getAll: async (): Promise<APIResponse<Announcement[]>> => {
    return request<Announcement[]>('/announcements', { method: 'GET' });
  },

  create: async (data: CreateAnnouncementRequest): Promise<APIResponse<Announcement>> => {
    return request<Announcement>('/announcements', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: UpdateAnnouncementRequest): Promise<APIResponse> => {
    return request(`/announcements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<APIResponse> => {
    return request(`/announcements/${id}`, { method: 'DELETE' });
  },
};
