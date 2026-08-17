package attendance

import (
	"backend/internal/middleware"

	"github.com/gofiber/fiber/v3"
)

func RegisterRoutes(app *fiber.App, handler *Handler, jwtSecret string) {
	api := app.Group("/api/v1/attendance", middleware.RequireAuth(jwtSecret))

	// Teacher Routes
	teacherMiddleware := middleware.RequireRole("teacher")
	api.Post("/", teacherMiddleware, handler.CreateAttendance)
	api.Put("/:id", teacherMiddleware, handler.UpdateAttendance)
	api.Get("/my-students", teacherMiddleware, handler.GetTeacherStudentsAttendance)

	// Teacher or Admin View Student Attendance
	teacherOrAdminMiddleware := middleware.RequireRole("teacher", "admin")
	api.Get("/student/:studentId", teacherOrAdminMiddleware, handler.GetStudentAttendance)

	// Student View Own Attendance
	studentMiddleware := middleware.RequireRole("student")
	api.Get("/my-attendance", studentMiddleware, handler.GetMyAttendance)
}
