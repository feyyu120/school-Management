import type { APIResponse } from '../types/auth';

const rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '');

export async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<APIResponse<T>> {
  const token = localStorage.getItem('token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'An error occurred during request execution');
    }

    return data as APIResponse<T>;
  } catch (error: any) {
    throw new Error(error.message || 'Network error or server unavailable');
  }
}
