package auth

import (
	"context"
	"errors"
	"net/mail"
	"strings"
	"time"

	"backend/pkg/jwt"
	"backend/pkg/password"
)

var (
	ErrInvalidInput       = errors.New("invalid input data")
	ErrEmailExists        = errors.New("email is already registered")
	ErrStudentIDExists    = errors.New("student ID is already registered")
	ErrTeacherIDExists    = errors.New("teacher ID is already registered")
	ErrInvalidCredentials = errors.New("invalid email or password")
	ErrAccountPending     = errors.New("account is pending admin approval")
	ErrAccountRejected    = errors.New("account registration was rejected by admin")
	ErrUserNotFound       = errors.New("user not found")
)

type Service interface {
	RegisterStudent(ctx context.Context, req RegisterStudentRequest) error
	RegisterTeacher(ctx context.Context, req RegisterTeacherRequest) error
	Login(ctx context.Context, req LoginRequest) (*AuthResponse, error)
	GetPendingUsers(ctx context.Context) ([]UserResponse, error)
	ApproveUser(ctx context.Context, userID string) error
	RejectUser(ctx context.Context, userID string) error
}

type service struct {
	repo         Repository
	jwtSecret    string
	jwtExpiresIn time.Duration
}

func NewService(repo Repository, jwtSecret string, jwtExpiresIn string) Service {
	duration, err := time.ParseDuration(jwtExpiresIn)
	if err != nil {
		duration = 24 * time.Hour
	}
	return &service{
		repo:         repo,
		jwtSecret:    jwtSecret,
		jwtExpiresIn: duration,
	}
}

func isValidEmail(email string) bool {
	_, err := mail.ParseAddress(email)
	return err == nil
}

func (s *service) RegisterStudent(ctx context.Context, req RegisterStudentRequest) error {
	req.Email = strings.TrimSpace(strings.ToLower(req.Email))
	req.FullName = strings.TrimSpace(req.FullName)
	req.StudentID = strings.TrimSpace(req.StudentID)
	req.Grade = strings.TrimSpace(req.Grade)
	req.Class = strings.TrimSpace(req.Class)

	if req.Email == "" || req.FullName == "" || req.Password == "" || req.StudentID == "" || req.Grade == "" || req.Class == "" {
		return errors.New("full_name, email, password, student_id, grade, and class are required")
	}

	if !isValidEmail(req.Email) {
		return errors.New("invalid email format")
	}

	if len(req.Password) < 6 {
		return errors.New("password must be at least 6 characters long")
	}

	emailExists, err := s.repo.ExistsEmail(ctx, req.Email)
	if err != nil {
		return err
	}
	if emailExists {
		return ErrEmailExists
	}

	studentIDExists, err := s.repo.ExistsStudentID(ctx, req.StudentID)
	if err != nil {
		return err
	}
	if studentIDExists {
		return ErrStudentIDExists
	}

	hashedPassword, err := password.HashPassword(req.Password)
	if err != nil {
		return err
	}

	user := &User{
		FullName:     req.FullName,
		Email:        req.Email,
		PasswordHash: hashedPassword,
		Role:         "student",
		Status:       "pending",
	}
	if req.IDDocument != "" {
		user.IDDocument = &req.IDDocument
	}

	student := &Student{
		StudentID: req.StudentID,
		Grade:     req.Grade,
		Class:     req.Class,
	}
	if req.Phone != "" {
		student.Phone = &req.Phone
	}

	return s.repo.CreateStudentTx(ctx, user, student)
}

func (s *service) RegisterTeacher(ctx context.Context, req RegisterTeacherRequest) error {
	req.Email = strings.TrimSpace(strings.ToLower(req.Email))
	req.FullName = strings.TrimSpace(req.FullName)
	req.TeacherID = strings.TrimSpace(req.TeacherID)
	req.Subject = strings.TrimSpace(req.Subject)

	if req.Email == "" || req.FullName == "" || req.Password == "" || req.TeacherID == "" || req.Subject == "" {
		return errors.New("full_name, email, password, teacher_id, and subject are required")
	}

	if !isValidEmail(req.Email) {
		return errors.New("invalid email format")
	}

	if len(req.Password) < 6 {
		return errors.New("password must be at least 6 characters long")
	}

	emailExists, err := s.repo.ExistsEmail(ctx, req.Email)
	if err != nil {
		return err
	}
	if emailExists {
		return ErrEmailExists
	}

	teacherIDExists, err := s.repo.ExistsTeacherID(ctx, req.TeacherID)
	if err != nil {
		return err
	}
	if teacherIDExists {
		return ErrTeacherIDExists
	}

	hashedPassword, err := password.HashPassword(req.Password)
	if err != nil {
		return err
	}

	user := &User{
		FullName:     req.FullName,
		Email:        req.Email,
		PasswordHash: hashedPassword,
		Role:         "teacher",
		Status:       "pending",
	}
	if req.IDDocument != "" {
		user.IDDocument = &req.IDDocument
	}

	teacher := &Teacher{
		TeacherID: req.TeacherID,
		Subject:   req.Subject,
	}
	if req.Phone != "" {
		teacher.Phone = &req.Phone
	}

	return s.repo.CreateTeacherTx(ctx, user, teacher)
}

func (s *service) Login(ctx context.Context, req LoginRequest) (*AuthResponse, error) {
	req.Email = strings.TrimSpace(strings.ToLower(req.Email))
	if req.Email == "" || req.Password == "" {
		return nil, errors.New("email and password are required")
	}

	user, err := s.repo.GetUserByEmail(ctx, req.Email)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, ErrInvalidCredentials
	}

	// Check user status
	if user.Status == "pending" {
		return nil, ErrAccountPending
	}
	if user.Status == "rejected" {
		return nil, ErrAccountRejected
	}

	// Verify password
	if !password.CheckPassword(req.Password, user.PasswordHash) {
		return nil, ErrInvalidCredentials
	}

	// Generate JWT token
	token, err := jwt.GenerateToken(user.ID, user.Role, s.jwtSecret, s.jwtExpiresIn)
	if err != nil {
		return nil, err
	}

	userResp := UserResponse{
		ID:         user.ID,
		FullName:   user.FullName,
		Email:      user.Email,
		Role:       user.Role,
		IDDocument: user.IDDocument,
		Status:     user.Status,
		CreatedAt:  user.CreatedAt,
		UpdatedAt:  user.UpdatedAt,
	}

	return &AuthResponse{
		Token: token,
		User:  userResp,
	}, nil
}

func (s *service) GetPendingUsers(ctx context.Context) ([]UserResponse, error) {
	users, err := s.repo.GetPendingUsers(ctx)
	if err != nil {
		return nil, err
	}

	resps := make([]UserResponse, 0, len(users))
	for _, u := range users {
		resps = append(resps, UserResponse{
			ID:         u.ID,
			FullName:   u.FullName,
			Email:      u.Email,
			Role:       u.Role,
			IDDocument: u.IDDocument,
			Status:     u.Status,
			CreatedAt:  u.CreatedAt,
			UpdatedAt:  u.UpdatedAt,
		})
	}
	return resps, nil
}

func (s *service) ApproveUser(ctx context.Context, userID string) error {
	user, err := s.repo.GetUserByID(ctx, userID)
	if err != nil {
		return err
	}
	if user == nil {
		return ErrUserNotFound
	}
	return s.repo.UpdateUserStatus(ctx, userID, "approved")
}

func (s *service) RejectUser(ctx context.Context, userID string) error {
	user, err := s.repo.GetUserByID(ctx, userID)
	if err != nil {
		return err
	}
	if user == nil {
		return ErrUserNotFound
	}
	return s.repo.UpdateUserStatus(ctx, userID, "rejected")
}
