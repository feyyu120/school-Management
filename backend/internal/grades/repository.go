package grades

import (
	"context"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository interface {
	CreateGrade(ctx context.Context, grade *Grade) error
	UpdateGrade(ctx context.Context, id string, req UpdateGradeRequest) error
	GetGradesByStudent(ctx context.Context, studentID string) ([]Grade, error)
	GetGradesByTeacher(ctx context.Context, teacherID string) ([]Grade, error)
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

func (r *repository) CreateGrade(ctx context.Context, grade *Grade) error {
	gradeUUID := uuid.New().String()
	query := `
		INSERT INTO grades (id, student_id, teacher_id, subject, exam_type, score, semester, created_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
		RETURNING created_at
	`
	err := r.db.QueryRow(ctx, query,
		gradeUUID,
		grade.StudentID,
		grade.TeacherID,
		grade.Subject,
		grade.ExamType,
		grade.Score,
		grade.Semester,
	).Scan(&grade.CreatedAt)

	if err != nil {
		return fmt.Errorf("failed to insert grade: %w", err)
	}
	grade.ID = gradeUUID
	return nil
}

func (r *repository) UpdateGrade(ctx context.Context, id string, req UpdateGradeRequest) error {
	query := `
		UPDATE grades
		SET subject = COALESCE(NULLIF($1, ''), subject),
		    exam_type = COALESCE(NULLIF($2, ''), exam_type),
		    score = CASE WHEN $3 >= 0 THEN $3 ELSE score END,
		    semester = COALESCE(NULLIF($4, ''), semester)
		WHERE id = $5
	`
	cmdTag, err := r.db.Exec(ctx, query, req.Subject, req.ExamType, req.Score, req.Semester, id)
	if err != nil {
		return err
	}
	if cmdTag.RowsAffected() == 0 {
		return errors.New("grade record not found")
	}
	return nil
}

func (r *repository) GetGradesByStudent(ctx context.Context, studentID string) ([]Grade, error) {
	query := `
		SELECT g.id, g.student_id, u_s.full_name, g.teacher_id, COALESCE(u_t.full_name, 'N/A'),
		       g.subject, g.exam_type, g.score, g.semester, g.created_at
		FROM grades g
		JOIN students s ON s.id = g.student_id
		JOIN users u_s ON u_s.id = s.user_id
		LEFT JOIN teachers t ON t.id = g.teacher_id
		LEFT JOIN users u_t ON u_t.id = t.user_id
		WHERE g.student_id = $1
		ORDER BY g.created_at DESC
	`
	rows, err := r.db.Query(ctx, query, studentID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	list := []Grade{}
	for rows.Next() {
		var g Grade
		var tID *string
		err := rows.Scan(&g.ID, &g.StudentID, &g.StudentName, &tID, &g.TeacherName, &g.Subject, &g.ExamType, &g.Score, &g.Semester, &g.CreatedAt)
		if err != nil {
			return nil, err
		}
		g.TeacherID = tID
		list = append(list, g)
	}
	return list, nil
}

func (r *repository) GetGradesByTeacher(ctx context.Context, teacherID string) ([]Grade, error) {
	query := `
		SELECT g.id, g.student_id, u_s.full_name, g.teacher_id, COALESCE(u_t.full_name, 'N/A'),
		       g.subject, g.exam_type, g.score, g.semester, g.created_at
		FROM grades g
		JOIN students s ON s.id = g.student_id
		JOIN users u_s ON u_s.id = s.user_id
		LEFT JOIN teachers t ON t.id = g.teacher_id
		LEFT JOIN users u_t ON u_t.id = t.user_id
		WHERE g.teacher_id = $1
		ORDER BY g.created_at DESC
	`
	rows, err := r.db.Query(ctx, query, teacherID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	list := []Grade{}
	for rows.Next() {
		var g Grade
		var tID *string
		err := rows.Scan(&g.ID, &g.StudentID, &g.StudentName, &tID, &g.TeacherName, &g.Subject, &g.ExamType, &g.Score, &g.Semester, &g.CreatedAt)
		if err != nil {
			return nil, err
		}
		g.TeacherID = tID
		list = append(list, g)
	}
	return list, nil
}
