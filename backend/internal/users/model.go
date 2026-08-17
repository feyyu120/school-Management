package users

import "time"

type UserProfile struct {
	ID         string       `json:"id"`
	FullName   string       `json:"full_name"`
	Email      string       `json:"email"`
	Role       string       `json:"role"`
	IDDocument *string      `json:"id_document,omitempty"`
	Status     string       `json:"status"`
	CreatedAt  time.Time    `json:"created_at"`
	UpdatedAt  time.Time    `json:"updated_at"`
	Student    *StudentInfo `json:"student_info,omitempty"`
	Teacher    *TeacherInfo `json:"teacher_info,omitempty"`
}

type StudentInfo struct {
	ID        string  `json:"id"`
	StudentID string  `json:"student_id"`
	Grade     string  `json:"grade"`
	Class     string  `json:"class"`
	Phone     *string `json:"phone,omitempty"`
}

type TeacherInfo struct {
	ID        string  `json:"id"`
	TeacherID string  `json:"teacher_id"`
	Subject   string  `json:"subject"`
	Phone     *string `json:"phone,omitempty"`
}

type AdminDashboardStats struct {
	TotalStudents      int `json:"total_students"`
	TotalTeachers      int `json:"total_teachers"`
	PendingUsers       int `json:"pending_users"`
	TotalAnnouncements int `json:"total_announcements"`
}

type StudentReport struct {
	Student    UserProfile             `json:"student"`
	Grades     []GradeRecord           `json:"grades"`
	Attendance AttendanceSummaryReport `json:"attendance_summary"`
}

type GradeRecord struct {
	ID        string    `json:"id"`
	Subject   string    `json:"subject"`
	ExamType  string    `json:"exam_type"`
	Score     float64   `json:"score"`
	Semester  string    `json:"semester"`
	CreatedAt time.Time `json:"created_at"`
}

type AttendanceSummaryReport struct {
	TotalDays int `json:"total_days"`
	Present   int `json:"present"`
	Absent    int `json:"absent"`
	Late      int `json:"late"`
}

type APIResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}
