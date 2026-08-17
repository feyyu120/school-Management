export interface Grade {
  id: string;
  student_id: string;
  student_name?: string;
  teacher_id?: string;
  teacher_name?: string;
  subject: string;
  exam_type: string;
  score: number;
  semester: string;
  created_at: string;
}

export interface CreateGradeRequest {
  student_id: string;
  subject: string;
  exam_type: string;
  score: number;
  semester: string;
}

export interface UpdateGradeRequest {
  subject?: string;
  exam_type?: string;
  score?: number;
  semester?: string;
}
