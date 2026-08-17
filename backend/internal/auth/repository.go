package auth

import (
	"context"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository interface {
	CreateStudentTx(ctx context.Context, user *User, student *Student) error
	CreateTeacherTx(ctx context.Context, user *User, teacher *Teacher) error
	GetUserByEmail(ctx context.Context, email string) (*User, error)
	GetUserByID(ctx context.Context, id string) (*User, error)
	ExistsEmail(ctx context.Context, email string) (bool, error)
	ExistsStudentID(ctx context.Context, studentID string) (bool, error)
	ExistsTeacherID(ctx context.Context, teacherID string) (bool, error)
	GetPendingUsers(ctx context.Context) ([]*User, error)
	UpdateUserStatus(ctx context.Context, userID string, status string) error
	SeedAdminUserIfNone(ctx context.Context, defaultEmail, defaultPasswordHash string) error
}

type repository struct {
	db *pgxpool.Pool
}

func NewRepository(db *pgxpool.Pool) Repository {
	return &repository{db: db}
}

func (r *repository) CreateStudentTx(ctx context.Context, user *User, student *Student) error {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	userUUID := uuid.New().String()
	studentUUID := uuid.New().String()

	userQuery := `
		INSERT INTO users (id, full_name, email, password_hash, role, id_document, status, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
		RETURNING created_at, updated_at
	`
	err = tx.QueryRow(ctx, userQuery,
		userUUID,
		user.FullName,
		user.Email,
		user.PasswordHash,
		user.Role,
		user.IDDocument,
		user.Status,
	).Scan(&user.CreatedAt, &user.UpdatedAt)
	if err != nil {
		return fmt.Errorf("failed to insert user: %w", err)
	}
	user.ID = userUUID

	studentQuery := `
		INSERT INTO students (id, user_id, student_id, grade, class, phone, created_at)
		VALUES ($1, $2, $3, $4, $5, $6, NOW())
		RETURNING created_at
	`
	err = tx.QueryRow(ctx, studentQuery,
		studentUUID,
		user.ID,
		student.StudentID,
		student.Grade,
		student.Class,
		student.Phone,
	).Scan(&student.CreatedAt)
	if err != nil {
		return fmt.Errorf("failed to insert student: %w", err)
	}
	student.ID = studentUUID
	student.UserID = user.ID

	if err := tx.Commit(ctx); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	return nil
}

func (r *repository) CreateTeacherTx(ctx context.Context, user *User, teacher *Teacher) error {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	userUUID := uuid.New().String()
	teacherUUID := uuid.New().String()

	userQuery := `
		INSERT INTO users (id, full_name, email, password_hash, role, id_document, status, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
		RETURNING created_at, updated_at
	`
	err = tx.QueryRow(ctx, userQuery,
		userUUID,
		user.FullName,
		user.Email,
		user.PasswordHash,
		user.Role,
		user.IDDocument,
		user.Status,
	).Scan(&user.CreatedAt, &user.UpdatedAt)
	if err != nil {
		return fmt.Errorf("failed to insert user: %w", err)
	}
	user.ID = userUUID

	teacherQuery := `
		INSERT INTO teachers (id, user_id, teacher_id, subject, phone, created_at)
		VALUES ($1, $2, $3, $4, $5, NOW())
		RETURNING created_at
	`
	err = tx.QueryRow(ctx, teacherQuery,
		teacherUUID,
		user.ID,
		teacher.TeacherID,
		teacher.Subject,
		teacher.Phone,
	).Scan(&teacher.CreatedAt)
	if err != nil {
		return fmt.Errorf("failed to insert teacher: %w", err)
	}
	teacher.ID = teacherUUID
	teacher.UserID = user.ID

	if err := tx.Commit(ctx); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	return nil
}

func (r *repository) GetUserByEmail(ctx context.Context, email string) (*User, error) {
	query := `
		SELECT id, full_name, email, password_hash, role, id_document, status, created_at, updated_at
		FROM users
		WHERE email = $1
	`
	u := &User{}
	err := r.db.QueryRow(ctx, query, email).Scan(
		&u.ID,
		&u.FullName,
		&u.Email,
		&u.PasswordHash,
		&u.Role,
		&u.IDDocument,
		&u.Status,
		&u.CreatedAt,
		&u.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return u, nil
}

func (r *repository) GetUserByID(ctx context.Context, id string) (*User, error) {
	query := `
		SELECT id, full_name, email, password_hash, role, id_document, status, created_at, updated_at
		FROM users
		WHERE id = $1
	`
	u := &User{}
	err := r.db.QueryRow(ctx, query, id).Scan(
		&u.ID,
		&u.FullName,
		&u.Email,
		&u.PasswordHash,
		&u.Role,
		&u.IDDocument,
		&u.Status,
		&u.CreatedAt,
		&u.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return u, nil
}

func (r *repository) ExistsEmail(ctx context.Context, email string) (bool, error) {
	var exists bool
	query := `SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)`
	err := r.db.QueryRow(ctx, query, email).Scan(&exists)
	return exists, err
}

func (r *repository) ExistsStudentID(ctx context.Context, studentID string) (bool, error) {
	var exists bool
	query := `SELECT EXISTS(SELECT 1 FROM students WHERE student_id = $1)`
	err := r.db.QueryRow(ctx, query, studentID).Scan(&exists)
	return exists, err
}

func (r *repository) ExistsTeacherID(ctx context.Context, teacherID string) (bool, error) {
	var exists bool
	query := `SELECT EXISTS(SELECT 1 FROM teachers WHERE teacher_id = $1)`
	err := r.db.QueryRow(ctx, query, teacherID).Scan(&exists)
	return exists, err
}

func (r *repository) GetPendingUsers(ctx context.Context) ([]*User, error) {
	query := `
		SELECT id, full_name, email, role, id_document, status, created_at, updated_at
		FROM users
		WHERE status = 'pending'
		ORDER BY created_at DESC
	`
	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	users := []*User{}
	for rows.Next() {
		u := &User{}
		err := rows.Scan(
			&u.ID,
			&u.FullName,
			&u.Email,
			&u.Role,
			&u.IDDocument,
			&u.Status,
			&u.CreatedAt,
			&u.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		users = append(users, u)
	}

	return users, nil
}

func (r *repository) UpdateUserStatus(ctx context.Context, userID string, status string) error {
	query := `
		UPDATE users
		SET status = $1, updated_at = NOW()
		WHERE id = $2
	`
	cmdTag, err := r.db.Exec(ctx, query, status, userID)
	if err != nil {
		return err
	}
	if cmdTag.RowsAffected() == 0 {
		return errors.New("user not found")
	}
	return nil
}

func (r *repository) SeedAdminUserIfNone(ctx context.Context, defaultEmail, defaultPasswordHash string) error {
	var count int
	err := r.db.QueryRow(ctx, `SELECT COUNT(*) FROM users WHERE role = 'admin'`).Scan(&count)
	if err != nil {
		return err
	}

	if count == 0 {
		adminUUID := uuid.New().String()
		query := `
			INSERT INTO users (id, full_name, email, password_hash, role, status, created_at, updated_at)
			VALUES ($1, 'System Administrator', $2, $3, 'admin', 'approved', NOW(), NOW())
		`
		_, err := r.db.Exec(ctx, query, adminUUID, defaultEmail, defaultPasswordHash)
		if err != nil {
			return fmt.Errorf("failed to seed admin user: %w", err)
		}
	}
	return nil
}
