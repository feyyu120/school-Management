package users

import (
	"backend/internal/middleware"

	"github.com/gofiber/fiber/v3"
)

func RegisterRoutes(app *fiber.App, handler *Handler, jwtSecret string) {
	api := app.Group("/api/v1")

	// Upload document endpoint (Public or Authenticated)
	api.Post("/upload", handler.UploadDocument)

	// User Profile (Any Authenticated Role)
	authMiddleware := middleware.RequireAuth(jwtSecret)
	api.Get("/profile", authMiddleware, handler.GetProfile)

	// Student Report (Student or Admin)
	api.Get("/student/report", authMiddleware, handler.GetStudentReport)

	// Students List (Accessible by Admin and Teacher)
	api.Get("/admin/students", authMiddleware, middleware.RequireRole("admin", "teacher"), handler.GetStudents)

	// Admin-only Management Endpoints
	adminGroup := api.Group("/admin", authMiddleware, middleware.RequireRole("admin"))
	adminGroup.Get("/dashboard", handler.GetAdminDashboard)
	adminGroup.Get("/teachers", handler.GetTeachers)
}
