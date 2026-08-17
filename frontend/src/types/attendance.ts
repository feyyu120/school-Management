export interface Attendance {
  id: string;
  student_id: string;
  student_name?: string;
  teacher_id?: string;
  teacher_name?: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  created_at: string;
}

export interface CreateAttendanceRequest {
  student_id: string;
  date: string;
  status: 'present' | 'absent' | 'late';
}

export interface UpdateAttendanceRequest {
  status: 'present' | 'absent' | 'late';
}
