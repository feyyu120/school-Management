package users

import (
	"context"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository interface {
	GetUserProfile(ctx context.Context, userID string) (*UserProfile, error)
	GetAllStudents(ctx context.Context) ([]UserProfile, error)
	GetAllTeachers(ctx context.Context) ([]UserProfile, error)
	GetAdminStats(ctx context.Context) (*AdminDashboardStats, error)
	GetStudentReport(ctx context.Context, userID string) (*StudentReport, error)
}

type repository struct {
	db *pgxpool.Pool
}

func NewRepository(db *pgxpool.Pool) Repository {
	return &repository{db: db}
}

func (r *repository) GetUserProfile(ctx context.Context, userID string) (*UserProfile, error) {
	query := `
		SELECT id, full_name, email, role, id_document, status, created_at, updated_at
		FROM users
		WHERE id = $1
	`
	u := &UserProfile{}
	err := r.db.QueryRow(ctx, query, userID).Scan(
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
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	if u.Role == "student" {
		studentQuery := `SELECT id, student_id, grade, class, phone FROM students WHERE user_id = $1`
		st := &StudentInfo{}
		err := r.db.QueryRow(ctx, studentQuery, u.ID).Scan(&st.ID, &st.StudentID, &st.Grade, &st.Class, &st.Phone)
		if err == nil {
			u.Student = st
		}
	} else if u.Role == "teacher" {
		teacherQuery := `SELECT id, teacher_id, subject, phone FROM teachers WHERE user_id = $1`
		tc := &TeacherInfo{}
		err := r.db.QueryRow(ctx, teacherQuery, u.ID).Scan(&tc.ID, &tc.TeacherID, &tc.Subject, &tc.Phone)
		if err == nil {
			u.Teacher = tc
		}
	}

	return u, nil
}

func (r *repository) GetAllStudents(ctx context.Context) ([]UserProfile, error) {
	query := `
		SELECT u.id, u.full_name, u.email, u.role, u.id_document, u.status, u.created_at, u.updated_at,
		       s.id, s.student_id, s.grade, s.class, s.phone
		FROM users u
		JOIN students s ON s.user_id = u.id
		WHERE u.role = 'student'
		ORDER BY u.created_at DESC
	`
	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	list := []UserProfile{}
	for rows.Next() {
		u := UserProfile{}
		st := StudentInfo{}
		err := rows.Scan(
			&u.ID, &u.FullName, &u.Email, &u.Role, &u.IDDocument, &u.Status, &u.CreatedAt, &u.UpdatedAt,
			&st.ID, &st.StudentID, &st.Grade, &st.Class, &st.Phone,
		)
		if err != nil {
			return nil, err
		}
		u.Student = &st
		list = append(list, u)
	}
	return list, nil
}

func (r *repository) GetAllTeachers(ctx context.Context) ([]UserProfile, error) {
	query := `
		SELECT u.id, u.full_name, u.email, u.role, u.id_document, u.status, u.created_at, u.updated_at,
		       t.id, t.teacher_id, t.subject, t.phone
		FROM users u
		JOIN teachers t ON t.user_id = u.id
		WHERE u.role = 'teacher'
		ORDER BY u.created_at DESC
	`
	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	list := []UserProfile{}
	for rows.Next() {
		u := UserProfile{}
		tc := TeacherInfo{}
		err := rows.Scan(
			&u.ID, &u.FullName, &u.Email, &u.Role, &u.IDDocument, &u.Status, &u.CreatedAt, &u.UpdatedAt,
			&tc.ID, &tc.TeacherID, &tc.Subject, &tc.Phone,
		)
		if err != nil {
			return nil, err
		}
		u.Teacher = &tc
		list = append(list, u)
	}
	return list, nil
}

func (r *repository) GetAdminStats(ctx context.Context) (*AdminDashboardStats, error) {
	stats := &AdminDashboardStats{}

	err := r.db.QueryRow(ctx, `SELECT COUNT(*) FROM students`).Scan(&stats.TotalStudents)
	if err != nil {
		return nil, fmt.Errorf("failed to count students: %w", err)
	}

	err = r.db.QueryRow(ctx, `SELECT COUNT(*) FROM teachers`).Scan(&stats.TotalTeachers)
	if err != nil {
		return nil, fmt.Errorf("failed to count teachers: %w", err)
	}

	err = r.db.QueryRow(ctx, `SELECT COUNT(*) FROM users WHERE status = 'pending'`).Scan(&stats.PendingUsers)
	if err != nil {
		return nil, fmt.Errorf("failed to count pending users: %w", err)
	}

	err = r.db.QueryRow(ctx, `SELECT COUNT(*) FROM announcements`).Scan(&stats.TotalAnnouncements)
	if err != nil {
		return nil, fmt.Errorf("failed to count announcements: %w", err)
	}

	return stats, nil
}

func (r *repository) GetStudentReport(ctx context.Context, userID string) (*StudentReport, error) {
	profile, err := r.GetUserProfile(ctx, userID)
	if err != nil || profile == nil {
		return nil, fmt.Errorf("student profile not found")
	}

	if profile.Student == nil {
		return nil, fmt.Errorf("user is not associated with a student record")
	}

	report := &StudentReport{
		Student: *profile,
		Grades:  []GradeRecord{},
	}

	// Fetch Grades for student
	gradesQuery := `
		SELECT id, subject, exam_type, score, semester, created_at
		FROM grades
		WHERE student_id = $1
		ORDER BY created_at DESC
	`
	gRows, err := r.db.Query(ctx, gradesQuery, profile.Student.ID)
	if err == nil {
		defer gRows.Close()
		for gRows.Next() {
			var g GradeRecord
			if err := gRows.Scan(&g.ID, &g.Subject, &g.ExamType, &g.Score, &g.Semester, &g.CreatedAt); err == nil {
				report.Grades = append(report.Grades, g)
			}
		}
	}

	// Fetch Attendance summary for student
	attQuery := `
		SELECT 
			COUNT(*) as total_days,
			COUNT(*) FILTER (WHERE status = 'present') as present,
			COUNT(*) FILTER (WHERE status = 'absent') as absent,
			COUNT(*) FILTER (WHERE status = 'late') as late
		FROM attendance
		WHERE student_id = $1
	`
	err = r.db.QueryRow(ctx, attQuery, profile.Student.ID).Scan(
		&report.Attendance.TotalDays,
		&report.Attendance.Present,
		&report.Attendance.Absent,
		&report.Attendance.Late,
	)
	if err != nil {
		report.Attendance = AttendanceSummaryReport{TotalDays: 0, Present: 0, Absent: 0, Late: 0}
	}

	return report, nil
}
