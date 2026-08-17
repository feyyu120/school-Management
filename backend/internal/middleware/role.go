package middleware

import (
	"github.com/gofiber/fiber/v3"
)

// RequireRole enforces role-based access control (RBAC)
func RequireRole(allowedRoles ...string) fiber.Handler {
	return func(c fiber.Ctx) error {
		roleVal := c.Locals("role")
		userRole, ok := roleVal.(string)
		if !ok || userRole == "" {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"success": false,
				"message": "Forbidden: user role not found in token context",
			})
		}

		for _, allowed := range allowedRoles {
			if userRole == allowed {
				return c.Next()
			}
		}

		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"success": false,
			"message": "Forbidden: insufficient role permissions",
		})
	}
}
