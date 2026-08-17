package announcements

import "time"

type Announcement struct {
	ID          string    `json:"id"`
	Title       string    `json:"title"`
	Content     string    `json:"content"`
	CreatedBy   *string   `json:"created_by,omitempty"`
	AuthorName  string    `json:"author_name,omitempty"`
	CreatedAt   time.Time `json:"created_at"`
}

type CreateAnnouncementRequest struct {
	Title   string `json:"title"`
	Content string `json:"content"`
}

type UpdateAnnouncementRequest struct {
	Title   string `json:"title,omitempty"`
	Content string `json:"content,omitempty"`
}

type APIResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}
