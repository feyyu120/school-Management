package announcements

import (
	"context"
	"errors"
	"strings"
)

type Service interface {
	CreateAnnouncement(ctx context.Context, userID string, req CreateAnnouncementRequest) (*Announcement, error)
	UpdateAnnouncement(ctx context.Context, id string, req UpdateAnnouncementRequest) error
	DeleteAnnouncement(ctx context.Context, id string) error
	GetAllAnnouncements(ctx context.Context) ([]Announcement, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) CreateAnnouncement(ctx context.Context, userID string, req CreateAnnouncementRequest) (*Announcement, error) {
	req.Title = strings.TrimSpace(req.Title)
	req.Content = strings.TrimSpace(req.Content)

	if req.Title == "" || req.Content == "" {
		return nil, errors.New("title and content are required")
	}

	item := &Announcement{
		Title:     req.Title,
		Content:   req.Content,
		CreatedBy: &userID,
	}

	if err := s.repo.CreateAnnouncement(ctx, item); err != nil {
		return nil, err
	}

	return item, nil
}

func (s *service) UpdateAnnouncement(ctx context.Context, id string, req UpdateAnnouncementRequest) error {
	req.Title = strings.TrimSpace(req.Title)
	req.Content = strings.TrimSpace(req.Content)

	return s.repo.UpdateAnnouncement(ctx, id, req.Title, req.Content)
}

func (s *service) DeleteAnnouncement(ctx context.Context, id string) error {
	return s.repo.DeleteAnnouncement(ctx, id)
}

func (s *service) GetAllAnnouncements(ctx context.Context) ([]Announcement, error) {
	return s.repo.GetAllAnnouncements(ctx)
}
