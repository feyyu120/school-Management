package grades

import "time"

type Grade struct {
	ID          string    `json:"id"`
	StudentID   string    `json:"student_id"`
	StudentName string    `json:"student_name,omitempty"`
	TeacherID   *string   `json:"teacher_id,omitempty"`
	TeacherName string    `json:"teacher_name,omitempty"`
	Subject     string    `json:"subject"`
	ExamType    string    `json:"exam_type"`
	Score       float64   `json:"score"`
	Semester    string    `json:"semester"`
	CreatedAt   time.Time `json:"created_at"`
}

type CreateGradeRequest struct {
	StudentID string  `json:"student_id"`
	Subject   string  `json:"subject"`
	ExamType  string  `json:"exam_type"`
	Score     float64 `json:"score"`
	Semester  string  `json:"semester"`
}

type UpdateGradeRequest struct {
	Subject  string  `json:"subject,omitempty"`
	ExamType string  `json:"exam_type,omitempty"`
	Score    float64 `json:"score,omitempty"`
	Semester string  `json:"semester,omitempty"`
}

type APIResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}
