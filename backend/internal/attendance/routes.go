package attendance

import (
	"backend/internal/middleware"

	"github.com/gofiber/fiber/v3"
)

func RegisterRoutes(app *fiber.App, handler *Handler, jwtSecret string) {
	api := app.Group("/api/v1/attendance", middleware.RequireAuth(jwtSecret))

	// Teacher & Admin Routes
	teacherOrAdminMiddleware := middleware.RequireRole("teacher", "admin")
	api.Post("/", teacherOrAdminMiddleware, handler.CreateAttendance)
	api.Put("/:id", teacherOrAdminMiddleware, handler.UpdateAttendance)
	api.Get("/my-students", teacherOrAdminMiddleware, handler.GetTeacherStudentsAttendance)

	// Teacher or Admin View Student Attendance
	api.Get("/student/:studentId", teacherOrAdminMiddleware, handler.GetStudentAttendance)

	// Student View Own Attendance
	studentMiddleware := middleware.RequireRole("student")
	api.Get("/my-attendance", studentMiddleware, handler.GetMyAttendance)
}
