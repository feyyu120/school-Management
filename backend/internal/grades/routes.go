package grades

import (
	"backend/internal/middleware"

	"github.com/gofiber/fiber/v3"
)

func RegisterRoutes(app *fiber.App, handler *Handler, jwtSecret string) {
	api := app.Group("/api/v1/grades", middleware.RequireAuth(jwtSecret))

	// Teacher Routes
	teacherMiddleware := middleware.RequireRole("teacher")
	api.Post("/", teacherMiddleware, handler.CreateGrade)
	api.Put("/:id", teacherMiddleware, handler.UpdateGrade)
	api.Get("/my-students", teacherMiddleware, handler.GetTeacherStudentsGrades)

	// Teacher or Admin View Student Grades
	teacherOrAdminMiddleware := middleware.RequireRole("teacher", "admin")
	api.Get("/student/:studentId", teacherOrAdminMiddleware, handler.GetStudentGrades)

	// Student View Own Grades
	studentMiddleware := middleware.RequireRole("student")
	api.Get("/my-grades", studentMiddleware, handler.GetMyGrades)
}
