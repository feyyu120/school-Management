package grades

import (
	"backend/internal/middleware"

	"github.com/gofiber/fiber/v3"
)

func RegisterRoutes(app *fiber.App, handler *Handler, jwtSecret string) {
	api := app.Group("/api/v1/grades", middleware.RequireAuth(jwtSecret))

	// Teacher & Admin Routes
	teacherOrAdminMiddleware := middleware.RequireRole("teacher", "admin")
	api.Post("/", teacherOrAdminMiddleware, handler.CreateGrade)
	api.Put("/:id", teacherOrAdminMiddleware, handler.UpdateGrade)
	api.Get("/my-students", teacherOrAdminMiddleware, handler.GetTeacherStudentsGrades)

	// Teacher or Admin View Student Grades
	api.Get("/student/:studentId", teacherOrAdminMiddleware, handler.GetStudentGrades)

	// Student View Own Grades
	studentMiddleware := middleware.RequireRole("student")
	api.Get("/my-grades", studentMiddleware, handler.GetMyGrades)
}
