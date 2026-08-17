package admissions

import (
	"backend/internal/middleware"

	"github.com/gofiber/fiber/v3"
)

func RegisterRoutes(app *fiber.App, handler *Handler, jwtSecret string) {
	api := app.Group("/api/v1/admissions", middleware.RequireAuth(jwtSecret))

	// Any authenticated user can read admissions
	api.Get("/", handler.GetAllAdmissions)

	// Admin Only Mutation Endpoints
	adminMiddleware := middleware.RequireRole("admin")
	api.Post("/", adminMiddleware, handler.CreateAdmission)
	api.Put("/:id", adminMiddleware, handler.UpdateAdmission)
	api.Delete("/:id", adminMiddleware, handler.DeleteAdmission)
}
