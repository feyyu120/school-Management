package auth

import "time"

// User entity matching migrations/001_create_users.sql
type User struct {
	ID           string    `json:"id"`
	FullName     string    `json:"full_name"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"`
	Role         string    `json:"role"`
	IDDocument   *string   `json:"id_document,omitempty"`
	Status       string    `json:"status"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// Student entity matching migrations/002_create_students.sql
type Student struct {
	ID        string    `json:"id"`
	UserID    string    `json:"user_id"`
	StudentID string    `json:"student_id"`
	Grade     string    `json:"grade"`
	Class     string    `json:"class"`
	Phone     *string   `json:"phone,omitempty"`
	CreatedAt time.Time `json:"created_at"`
}

// Teacher entity matching migrations/003_create_teachers.sql
type Teacher struct {
	ID        string    `json:"id"`
	UserID    string    `json:"user_id"`
	TeacherID string    `json:"teacher_id"`
	Subject   string    `json:"subject"`
	Phone     *string   `json:"phone,omitempty"`
	CreatedAt time.Time `json:"created_at"`
}

// RegisterStudentRequest payload
type RegisterStudentRequest struct {
	FullName   string `json:"full_name"`
	Email      string `json:"email"`
	Password   string `json:"password"`
	StudentID  string `json:"student_id"`
	Grade      string `json:"grade"`
	Class      string `json:"class"`
	Phone      string `json:"phone,omitempty"`
	IDDocument string `json:"id_document,omitempty"`
}

// RegisterTeacherRequest payload
type RegisterTeacherRequest struct {
	FullName   string `json:"full_name"`
	Email      string `json:"email"`
	Password   string `json:"password"`
	TeacherID  string `json:"teacher_id"`
	Subject    string `json:"subject"`
	Phone      string `json:"phone,omitempty"`
	IDDocument string `json:"id_document,omitempty"`
}

// LoginRequest payload
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// UserResponse DTO to safely export user data without password hash
type UserResponse struct {
	ID         string    `json:"id"`
	FullName   string    `json:"full_name"`
	Email      string    `json:"email"`
	Role       string    `json:"role"`
	IDDocument *string   `json:"id_document,omitempty"`
	Status     string    `json:"status"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

// AuthResponse payload returned upon successful login
type AuthResponse struct {
	Token string       `json:"token"`
	User  UserResponse `json:"user"`
}

// Standard API response struct
type APIResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}
