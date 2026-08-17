import { request } from './api';
import type { APIResponse } from '../types/auth';
import type { Grade, CreateGradeRequest, UpdateGradeRequest } from '../types/grade';

export const gradesApi = {
  createGrade: async (data: CreateGradeRequest): Promise<APIResponse<Grade>> => {
    return request<Grade>('/grades', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateGrade: async (id: string, data: UpdateGradeRequest): Promise<APIResponse> => {
    return request(`/grades/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  getStudentGrades: async (studentId: string): Promise<APIResponse<Grade[]>> => {
    return request<Grade[]>(`/grades/student/${studentId}`, { method: 'GET' });
  },

  getMyGrades: async (): Promise<APIResponse<Grade[]>> => {
    return request<Grade[]>('/grades/my-grades', { method: 'GET' });
  },

  getTeacherStudentsGrades: async (): Promise<APIResponse<Grade[]>> => {
    return request<Grade[]>('/grades/my-students', { method: 'GET' });
  },
};
