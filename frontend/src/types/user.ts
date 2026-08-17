export interface StudentInfo {
  id: string;
  student_id: string;
  grade: string;
  class: string;
  phone?: string;
}

export interface TeacherInfo {
  id: string;
  teacher_id: string;
  subject: string;
  phone?: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  id_document?: string;
  status: string;
  created_at: string;
  updated_at: string;
  student_info?: StudentInfo;
  teacher_info?: TeacherInfo;
}

export interface AdminDashboardStats {
  total_students: number;
  total_teachers: number;
  pending_users: number;
  total_announcements: number;
}
