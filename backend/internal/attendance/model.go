package attendance

import "time"

type Attendance struct {
	ID          string    `json:"id"`
	StudentID   string    `json:"student_id"`
	StudentName string    `json:"student_name,omitempty"`
	TeacherID   *string   `json:"teacher_id,omitempty"`
	TeacherName string    `json:"teacher_name,omitempty"`
	Date        string    `json:"date"`
	Status      string    `json:"status"`
	CreatedAt   time.Time `json:"created_at"`
}

type CreateAttendanceRequest struct {
	StudentID string `json:"student_id"`
	Date      string `json:"date"` // YYYY-MM-DD
	Status    string `json:"status"` // present / absent / late
}

type UpdateAttendanceRequest struct {
	Status string `json:"status"`
}

type APIResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}
