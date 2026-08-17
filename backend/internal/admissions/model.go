package admissions

import "time"

type Admission struct {
	ID           string     `json:"id"`
	Title        string     `json:"title"`
	Description  string     `json:"description"`
	Requirements *string    `json:"requirements,omitempty"`
	Deadline     *time.Time `json:"deadline,omitempty"`
	CreatedAt    time.Time  `json:"created_at"`
}

type CreateAdmissionRequest struct {
	Title        string `json:"title"`
	Description  string `json:"description"`
	Requirements string `json:"requirements,omitempty"`
	Deadline     string `json:"deadline,omitempty"` // RFC3339 or YYYY-MM-DD
}

type UpdateAdmissionRequest struct {
	Title        string `json:"title,omitempty"`
	Description  string `json:"description,omitempty"`
	Requirements string `json:"requirements,omitempty"`
	Deadline     string `json:"deadline,omitempty"`
}

type APIResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}
