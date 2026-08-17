package attendance

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository interface {
	CreateAttendance(ctx context.Context, att *Attendance) error
	UpdateAttendance(ctx context.Context, id string, status string) error
	GetAttendanceByStudent(ctx context.Context, studentID string) ([]Attendance, error)
	GetAttendanceByTeacher(ctx context.Context, teacherID string) ([]Attendance, error)
	GetTeacherIDByUserID(ctx context.Context, userID string) (string, error)
	GetStudentIDByUserID(ctx context.Context, userID string) (string, error)
}

type repository struct {
	db *pgxpool.Pool
}

func NewRepository(db *pgxpool.Pool) Repository {
	return &repository{db: db}
}

func (r *repository) GetTeacherIDByUserID(ctx context.Context, userID string) (string, error) {
	var teacherID string
	err := r.db.QueryRow(ctx, `SELECT id FROM teachers WHERE user_id = $1`, userID).Scan(&teacherID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return "", errors.New("teacher profile not found")
		}
		return "", err
	}
	return teacherID, nil
}

func (r *repository) GetStudentIDByUserID(ctx context.Context, userID string) (string, error) {
	var studentID string
	err := r.db.QueryRow(ctx, `SELECT id FROM students WHERE user_id = $1`, userID).Scan(&studentID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return "", errors.New("student profile not found")
		}
		return "", err
	}
	return studentID, nil
}

func (r *repository) CreateAttendance(ctx context.Context, att *Attendance) error {
	attUUID := uuid.New().String()
	query := `
		INSERT INTO attendance (id, student_id, teacher_id, date, status, created_at)
		VALUES ($1, $2, $3, $4, $5, NOW())
		RETURNING created_at
	`
	parsedDate, err := time.Parse("2006-01-02", att.Date)
	if err != nil {
		return fmt.Errorf("invalid date format, expected YYYY-MM-DD: %w", err)
	}

	err = r.db.QueryRow(ctx, query, attUUID, att.StudentID, att.TeacherID, parsedDate, att.Status).Scan(&att.CreatedAt)
	if err != nil {
		return fmt.Errorf("failed to insert attendance: %w", err)
	}
	att.ID = attUUID
	return nil
}

func (r *repository) UpdateAttendance(ctx context.Context, id string, status string) error {
	query := `UPDATE attendance SET status = $1 WHERE id = $2`
	cmdTag, err := r.db.Exec(ctx, query, status, id)
	if err != nil {
		return err
	}
	if cmdTag.RowsAffected() == 0 {
		return errors.New("attendance record not found")
	}
	return nil
}

func (r *repository) GetAttendanceByStudent(ctx context.Context, studentID string) ([]Attendance, error) {
	query := `
		SELECT a.id, a.student_id, u_s.full_name, a.teacher_id, COALESCE(u_t.full_name, 'N/A'),
		       TO_CHAR(a.date, 'YYYY-MM-DD'), a.status, a.created_at
		FROM attendance a
		JOIN students s ON s.id = a.student_id
		JOIN users u_s ON u_s.id = s.user_id
		LEFT JOIN teachers t ON t.id = a.teacher_id
		LEFT JOIN users u_t ON u_t.id = t.user_id
		WHERE a.student_id = $1
		ORDER BY a.date DESC
	`
	rows, err := r.db.Query(ctx, query, studentID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	list := []Attendance{}
	for rows.Next() {
		var a Attendance
		var tID *string
		err := rows.Scan(&a.ID, &a.StudentID, &a.StudentName, &tID, &a.TeacherName, &a.Date, &a.Status, &a.CreatedAt)
		if err != nil {
			return nil, err
		}
		a.TeacherID = tID
		list = append(list, a)
	}
	return list, nil
}

func (r *repository) GetAttendanceByTeacher(ctx context.Context, teacherID string) ([]Attendance, error) {
	query := `
		SELECT a.id, a.student_id, u_s.full_name, a.teacher_id, COALESCE(u_t.full_name, 'N/A'),
		       TO_CHAR(a.date, 'YYYY-MM-DD'), a.status, a.created_at
		FROM attendance a
		JOIN students s ON s.id = a.student_id
		JOIN users u_s ON u_s.id = s.user_id
		LEFT JOIN teachers t ON t.id = a.teacher_id
		LEFT JOIN users u_t ON u_t.id = t.user_id
		WHERE a.teacher_id = $1
		ORDER BY a.date DESC
	`
	rows, err := r.db.Query(ctx, query, teacherID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	list := []Attendance{}
	for rows.Next() {
		var a Attendance
		var tID *string
		err := rows.Scan(&a.ID, &a.StudentID, &a.StudentName, &tID, &a.TeacherName, &a.Date, &a.Status, &a.CreatedAt)
		if err != nil {
			return nil, err
		}
		a.TeacherID = tID
		list = append(list, a)
	}
	return list, nil
}
