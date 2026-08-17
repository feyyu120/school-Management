package admissions

import (
	"context"
	"errors"
	"strings"
	"time"
)

type Service interface {
	CreateAdmission(ctx context.Context, req CreateAdmissionRequest) (*Admission, error)
	UpdateAdmission(ctx context.Context, id string, req UpdateAdmissionRequest) error
	DeleteAdmission(ctx context.Context, id string) error
	GetAllAdmissions(ctx context.Context) ([]Admission, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) CreateAdmission(ctx context.Context, req CreateAdmissionRequest) (*Admission, error) {
	req.Title = strings.TrimSpace(req.Title)
	req.Description = strings.TrimSpace(req.Description)

	if req.Title == "" || req.Description == "" {
		return nil, errors.New("title and description are required")
	}

	item := &Admission{
		Title:       req.Title,
		Description: req.Description,
	}

	if req.Requirements != "" {
		reqs := strings.TrimSpace(req.Requirements)
		item.Requirements = &reqs
	}

	if req.Deadline != "" {
		parsed, err := time.Parse(time.RFC3339, req.Deadline)
		if err != nil {
			parsed, err = time.Parse("2006-01-02", req.Deadline)
		}
		if err == nil {
			item.Deadline = &parsed
		}
	}

	if err := s.repo.CreateAdmission(ctx, item); err != nil {
		return nil, err
	}

	return item, nil
}

func (s *service) UpdateAdmission(ctx context.Context, id string, req UpdateAdmissionRequest) error {
	req.Title = strings.TrimSpace(req.Title)
	req.Description = strings.TrimSpace(req.Description)

	return s.repo.UpdateAdmission(ctx, id, req)
}

func (s *service) DeleteAdmission(ctx context.Context, id string) error {
	return s.repo.DeleteAdmission(ctx, id)
}

func (s *service) GetAllAdmissions(ctx context.Context) ([]Admission, error) {
	return s.repo.GetAllAdmissions(ctx)
}
