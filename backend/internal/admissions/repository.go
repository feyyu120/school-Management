package admissions

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository interface {
	CreateAdmission(ctx context.Context, item *Admission) error
	UpdateAdmission(ctx context.Context, id string, req UpdateAdmissionRequest) error
	DeleteAdmission(ctx context.Context, id string) error
	GetAllAdmissions(ctx context.Context) ([]Admission, error)
}

type repository struct {
	db *pgxpool.Pool
}

func NewRepository(db *pgxpool.Pool) Repository {
	return &repository{db: db}
}

func (r *repository) CreateAdmission(ctx context.Context, item *Admission) error {
	admUUID := uuid.New().String()
	query := `
		INSERT INTO admissions (id, title, description, requirements, deadline, created_at)
		VALUES ($1, $2, $3, $4, $5, NOW())
		RETURNING created_at
	`
	err := r.db.QueryRow(ctx, query, admUUID, item.Title, item.Description, item.Requirements, item.Deadline).Scan(&item.CreatedAt)
	if err != nil {
		return fmt.Errorf("failed to create admission record: %w", err)
	}
	item.ID = admUUID
	return nil
}

func (r *repository) UpdateAdmission(ctx context.Context, id string, req UpdateAdmissionRequest) error {
	var deadline *time.Time
	if req.Deadline != "" {
		parsed, err := time.Parse(time.RFC3339, req.Deadline)
		if err != nil {
			parsed, err = time.Parse("2006-01-02", req.Deadline)
		}
		if err == nil {
			deadline = &parsed
		}
	}

	query := `
		UPDATE admissions
		SET title = COALESCE(NULLIF($1, ''), title),
		    description = COALESCE(NULLIF($2, ''), description),
		    requirements = COALESCE(NULLIF($3, ''), requirements),
		    deadline = COALESCE($4, deadline)
		WHERE id = $5
	`
	cmdTag, err := r.db.Exec(ctx, query, req.Title, req.Description, req.Requirements, deadline, id)
	if err != nil {
		return err
	}
	if cmdTag.RowsAffected() == 0 {
		return errors.New("admission record not found")
	}
	return nil
}

func (r *repository) DeleteAdmission(ctx context.Context, id string) error {
	query := `DELETE FROM admissions WHERE id = $1`
	cmdTag, err := r.db.Exec(ctx, query, id)
	if err != nil {
		return err
	}
	if cmdTag.RowsAffected() == 0 {
		return errors.New("admission record not found")
	}
	return nil
}

func (r *repository) GetAllAdmissions(ctx context.Context) ([]Admission, error) {
	query := `
		SELECT id, title, description, requirements, deadline, created_at
		FROM admissions
		ORDER BY created_at DESC
	`
	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	list := []Admission{}
	for rows.Next() {
		var item Admission
		err := rows.Scan(&item.ID, &item.Title, &item.Description, &item.Requirements, &item.Deadline, &item.CreatedAt)
		if err != nil {
			return nil, err
		}
		list = append(list, item)
	}
	return list, nil
}
