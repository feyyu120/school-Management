package users

import (
	"context"
	"errors"
)

type Service interface {
	GetProfile(ctx context.Context, userID string) (*UserProfile, error)
	GetStudents(ctx context.Context) ([]UserProfile, error)
	GetTeachers(ctx context.Context) ([]UserProfile, error)
	GetAdminStats(ctx context.Context) (*AdminDashboardStats, error)
	GetStudentReport(ctx context.Context, userID string) (*StudentReport, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) GetProfile(ctx context.Context, userID string) (*UserProfile, error) {
	profile, err := s.repo.GetUserProfile(ctx, userID)
	if err != nil {
		return nil, err
	}
	if profile == nil {
		return nil, errors.New("user profile not found")
	}
	return profile, nil
}

func (s *service) GetStudents(ctx context.Context) ([]UserProfile, error) {
	return s.repo.GetAllStudents(ctx)
}

func (s *service) GetTeachers(ctx context.Context) ([]UserProfile, error) {
	return s.repo.GetAllTeachers(ctx)
}

func (s *service) GetAdminStats(ctx context.Context) (*AdminDashboardStats, error) {
	return s.repo.GetAdminStats(ctx)
}

func (s *service) GetStudentReport(ctx context.Context, userID string) (*StudentReport, error) {
	return s.repo.GetStudentReport(ctx, userID)
}
