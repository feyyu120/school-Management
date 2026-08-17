package announcements

import (
	"context"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository interface {
	CreateAnnouncement(ctx context.Context, item *Announcement) error
	UpdateAnnouncement(ctx context.Context, id string, title, content string) error
	DeleteAnnouncement(ctx context.Context, id string) error
	GetAllAnnouncements(ctx context.Context) ([]Announcement, error)
}

type repository struct {
	db *pgxpool.Pool
}

func NewRepository(db *pgxpool.Pool) Repository {
	return &repository{db: db}
}

func (r *repository) CreateAnnouncement(ctx context.Context, item *Announcement) error {
	annUUID := uuid.New().String()
	query := `
		INSERT INTO announcements (id, title, content, created_by, created_at)
		VALUES ($1, $2, $3, $4, NOW())
		RETURNING created_at
	`
	err := r.db.QueryRow(ctx, query, annUUID, item.Title, item.Content, item.CreatedBy).Scan(&item.CreatedAt)
	if err != nil {
		return fmt.Errorf("failed to create announcement: %w", err)
	}
	item.ID = annUUID
	return nil
}

func (r *repository) UpdateAnnouncement(ctx context.Context, id string, title, content string) error {
	query := `
		UPDATE announcements
		SET title = COALESCE(NULLIF($1, ''), title),
		    content = COALESCE(NULLIF($2, ''), content)
		WHERE id = $3
	`
	cmdTag, err := r.db.Exec(ctx, query, title, content, id)
	if err != nil {
		return err
	}
	if cmdTag.RowsAffected() == 0 {
		return errors.New("announcement not found")
	}
	return nil
}

func (r *repository) DeleteAnnouncement(ctx context.Context, id string) error {
	query := `DELETE FROM announcements WHERE id = $1`
	cmdTag, err := r.db.Exec(ctx, query, id)
	if err != nil {
		return err
	}
	if cmdTag.RowsAffected() == 0 {
		return errors.New("announcement not found")
	}
	return nil
}

func (r *repository) GetAllAnnouncements(ctx context.Context) ([]Announcement, error) {
	query := `
		SELECT a.id, a.title, a.content, a.created_by, COALESCE(u.full_name, 'System Admin'), a.created_at
		FROM announcements a
		LEFT JOIN users u ON u.id = a.created_by
		ORDER BY a.created_at DESC
	`
	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	list := []Announcement{}
	for rows.Next() {
		var item Announcement
		var authorID *string
		err := rows.Scan(&item.ID, &item.Title, &item.Content, &authorID, &item.AuthorName, &item.CreatedAt)
		if err != nil {
			return nil, err
		}
		item.CreatedBy = authorID
		list = append(list, item)
	}
	return list, nil
}
