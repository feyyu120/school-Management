package middleware

import (
	"strings"

	"backend/pkg/jwt"

	"github.com/gofiber/fiber/v3"
)

// RequireAuth validates the JWT Bearer token in the Authorization header
func RequireAuth(jwtSecret string) fiber.Handler {
	return func(c fiber.Ctx) error {
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"success": false,
				"message": "Unauthorized: missing Authorization header",
			})
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"success": false,
				"message": "Unauthorized: invalid Authorization header format. Expected 'Bearer <token>'",
			})
		}

		tokenString := parts[1]
		claims, err := jwt.ValidateToken(tokenString, jwtSecret)
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"success": false,
				"message": "Unauthorized: " + err.Error(),
			})
		}

		// Store claims in Fiber request context
		c.Locals("user_id", claims.UserID)
		c.Locals("role", claims.Role)

		return c.Next()
	}
}
