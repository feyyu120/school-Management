package attendance

import (
	"context"
	"errors"
	"strings"
)

type Service interface {
	CreateAttendance(ctx context.Context, userID string, req CreateAttendanceRequest) (*Attendance, error)
	UpdateAttendance(ctx context.Context, id string, req UpdateAttendanceRequest) error
	GetStudentAttendance(ctx context.Context, studentID string) ([]Attendance, error)
	GetMyAttendance(ctx context.Context, userID string) ([]Attendance, error)
	GetTeacherStudentsAttendance(ctx context.Context, userID string) ([]Attendance, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) CreateAttendance(ctx context.Context, userID string, req CreateAttendanceRequest) (*Attendance, error) {
	req.Status = strings.ToLower(strings.TrimSpace(req.Status))
	if req.StudentID == "" || req.Date == "" || req.Status == "" {
		return nil, errors.New("student_id, date, and status are required")
	}

	if req.Status != "present" && req.Status != "absent" && req.Status != "late" {
		return nil, errors.New("status must be 'present', 'absent', or 'late'")
	}

	teacherID, err := s.repo.GetTeacherIDByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}

	att := &Attendance{
		StudentID: req.StudentID,
		TeacherID: &teacherID,
		Date:      req.Date,
		Status:    req.Status,
	}

	if err := s.repo.CreateAttendance(ctx, att); err != nil {
		return nil, err
	}

	return att, nil
}

func (s *service) UpdateAttendance(ctx context.Context, id string, req UpdateAttendanceRequest) error {
	req.Status = strings.ToLower(strings.TrimSpace(req.Status))
	if req.Status != "present" && req.Status != "absent" && req.Status != "late" {
		return errors.New("status must be 'present', 'absent', or 'late'")
	}

	return s.repo.UpdateAttendance(ctx, id, req.Status)
}

func (s *service) GetStudentAttendance(ctx context.Context, studentID string) ([]Attendance, error) {
	return s.repo.GetAttendanceByStudent(ctx, studentID)
}

func (s *service) GetMyAttendance(ctx context.Context, userID string) ([]Attendance, error) {
	studentID, err := s.repo.GetStudentIDByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}
	return s.repo.GetAttendanceByStudent(ctx, studentID)
}

func (s *service) GetTeacherStudentsAttendance(ctx context.Context, userID string) ([]Attendance, error) {
	teacherID, err := s.repo.GetTeacherIDByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}
	return s.repo.GetAttendanceByTeacher(ctx, teacherID)
}
