export interface Admission {
  id: string;
  title: string;
  description: string;
  requirements?: string;
  deadline?: string;
  created_at: string;
}

export interface CreateAdmissionRequest {
  title: string;
  description: string;
  requirements?: string;
  deadline?: string;
}

export interface UpdateAdmissionRequest {
  title?: string;
  description?: string;
  requirements?: string;
  deadline?: string;
}
