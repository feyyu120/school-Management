package announcements

import (
	"backend/internal/middleware"

	"github.com/gofiber/fiber/v3"
)

func RegisterRoutes(app *fiber.App, handler *Handler, jwtSecret string) {
	api := app.Group("/api/v1/announcements", middleware.RequireAuth(jwtSecret))

	// Any authenticated user can read announcements
	api.Get("/", handler.GetAllAnnouncements)

	// Admin Only Mutation Endpoints
	adminMiddleware := middleware.RequireRole("admin")
	api.Post("/", adminMiddleware, handler.CreateAnnouncement)
	api.Put("/:id", adminMiddleware, handler.UpdateAnnouncement)
	api.Delete("/:id", adminMiddleware, handler.DeleteAnnouncement)
}
