export interface Announcement {
  id: string;
  title: string;
  content: string;
  created_by?: string;
  author_name?: string;
  created_at: string;
}

export interface CreateAnnouncementRequest {
  title: string;
  content: string;
}

export interface UpdateAnnouncementRequest {
  title?: string;
  content?: string;
}
