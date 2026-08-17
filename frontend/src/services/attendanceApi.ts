import { request } from './api';
import type { APIResponse } from '../types/auth';
import type { Attendance, CreateAttendanceRequest, UpdateAttendanceRequest } from '../types/attendance';

export const attendanceApi = {
  createAttendance: async (data: CreateAttendanceRequest): Promise<APIResponse<Attendance>> => {
    return request<Attendance>('/attendance', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateAttendance: async (id: string, data: UpdateAttendanceRequest): Promise<APIResponse> => {
    return request(`/attendance/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  getStudentAttendance: async (studentId: string): Promise<APIResponse<Attendance[]>> => {
    return request<Attendance[]>(`/attendance/student/${studentId}`, { method: 'GET' });
  },

  getMyAttendance: async (): Promise<APIResponse<Attendance[]>> => {
    return request<Attendance[]>('/attendance/my-attendance', { method: 'GET' });
  },

  getTeacherStudentsAttendance: async (): Promise<APIResponse<Attendance[]>> => {
    return request<Attendance[]>('/attendance/my-students', { method: 'GET' });
  },
};
