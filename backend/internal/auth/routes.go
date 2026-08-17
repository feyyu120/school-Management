package auth

import (
	"backend/internal/middleware"

	"github.com/gofiber/fiber/v3"
)

// RegisterRoutes sets up auth and admin approval endpoints
func RegisterRoutes(app *fiber.App, handler *Handler, jwtSecret string) {
	api := app.Group("/api/v1")

	// Public Auth endpoints
	authGroup := api.Group("/auth")
	authGroup.Post("/register/student", handler.RegisterStudent)
	authGroup.Post("/register/teacher", handler.RegisterTeacher)
	authGroup.Post("/login", handler.Login)

	// Protected Admin endpoints (Requires valid JWT + Admin Role)
	adminGroup := api.Group("/admin", middleware.RequireAuth(jwtSecret), middleware.RequireRole("admin"))
	adminGroup.Get("/pending-users", handler.GetPendingUsers)
	adminGroup.Patch("/users/:id/approve", handler.ApproveUser)
	adminGroup.Patch("/users/:id/reject", handler.RejectUser)
}
