package grades

import (
	"context"
	"errors"
	"strings"
)

type Service interface {
	CreateGrade(ctx context.Context, userID string, req CreateGradeRequest) (*Grade, error)
	UpdateGrade(ctx context.Context, id string, req UpdateGradeRequest) error
	GetStudentGrades(ctx context.Context, studentID string) ([]Grade, error)
	GetMyGrades(ctx context.Context, userID string) ([]Grade, error)
	GetTeacherStudentsGrades(ctx context.Context, userID string) ([]Grade, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) CreateGrade(ctx context.Context, userID string, req CreateGradeRequest) (*Grade, error) {
	req.Subject = strings.TrimSpace(req.Subject)
	req.ExamType = strings.TrimSpace(req.ExamType)
	req.Semester = strings.TrimSpace(req.Semester)

	if req.StudentID == "" || req.Subject == "" || req.ExamType == "" || req.Semester == "" {
		return nil, errors.New("student_id, subject, exam_type, score, and semester are required")
	}

	if req.Score < 0 || req.Score > 100 {
		return nil, errors.New("score must be between 0 and 100")
	}

	teacherID, err := s.repo.GetTeacherIDByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}

	grade := &Grade{
		StudentID: req.StudentID,
		TeacherID: &teacherID,
		Subject:   req.Subject,
		ExamType:  req.ExamType,
		Score:     req.Score,
		Semester:  req.Semester,
	}

	if err := s.repo.CreateGrade(ctx, grade); err != nil {
		return nil, err
	}

	return grade, nil
}

func (s *service) UpdateGrade(ctx context.Context, id string, req UpdateGradeRequest) error {
	return s.repo.UpdateGrade(ctx, id, req)
}

func (s *service) GetStudentGrades(ctx context.Context, studentID string) ([]Grade, error) {
	return s.repo.GetGradesByStudent(ctx, studentID)
}

func (s *service) GetMyGrades(ctx context.Context, userID string) ([]Grade, error) {
	studentID, err := s.repo.GetStudentIDByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}
	return s.repo.GetGradesByStudent(ctx, studentID)
}

func (s *service) GetTeacherStudentsGrades(ctx context.Context, userID string) ([]Grade, error) {
	teacherID, err := s.repo.GetTeacherIDByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}
	return s.repo.GetGradesByTeacher(ctx, teacherID)
}
