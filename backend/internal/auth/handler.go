package auth

import (
	"errors"

	"github.com/gofiber/fiber/v3"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) RegisterStudent(c fiber.Ctx) error {
	var req RegisterStudentRequest
	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(APIResponse{
			Success: false,
			Message: "Invalid JSON request payload",
		})
	}

	err := h.service.RegisterStudent(c.Context(), req)
	if err != nil {
		if errors.Is(err, ErrEmailExists) || errors.Is(err, ErrStudentIDExists) {
			return c.Status(fiber.StatusConflict).JSON(APIResponse{
				Success: false,
				Message: err.Error(),
			})
		}
		return c.Status(fiber.StatusBadRequest).JSON(APIResponse{
			Success: false,
			Message: err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(APIResponse{
		Success: true,
		Message: "Registration successful. Waiting for admin approval.",
	})
}

func (h *Handler) RegisterTeacher(c fiber.Ctx) error {
	var req RegisterTeacherRequest
	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(APIResponse{
			Success: false,
			Message: "Invalid JSON request payload",
		})
	}

	err := h.service.RegisterTeacher(c.Context(), req)
	if err != nil {
		if errors.Is(err, ErrEmailExists) || errors.Is(err, ErrTeacherIDExists) {
			return c.Status(fiber.StatusConflict).JSON(APIResponse{
				Success: false,
				Message: err.Error(),
			})
		}
		return c.Status(fiber.StatusBadRequest).JSON(APIResponse{
			Success: false,
			Message: err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(APIResponse{
		Success: true,
		Message: "Registration successful. Waiting for admin approval.",
	})
}

func (h *Handler) Login(c fiber.Ctx) error {
	var req LoginRequest
	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(APIResponse{
			Success: false,
			Message: "Invalid JSON request payload",
		})
	}

	res, err := h.service.Login(c.Context(), req)
	if err != nil {
		if errors.Is(err, ErrAccountPending) {
			return c.Status(fiber.StatusUnauthorized).JSON(APIResponse{
				Success: false,
				Message: err.Error(),
			})
		}
		if errors.Is(err, ErrAccountRejected) {
			return c.Status(fiber.StatusForbidden).JSON(APIResponse{
				Success: false,
				Message: err.Error(),
			})
		}
		if errors.Is(err, ErrInvalidCredentials) {
			return c.Status(fiber.StatusUnauthorized).JSON(APIResponse{
				Success: false,
				Message: err.Error(),
			})
		}
		return c.Status(fiber.StatusBadRequest).JSON(APIResponse{
			Success: false,
			Message: err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(APIResponse{
		Success: true,
		Message: "Login successful",
		Data:    res,
	})
}

func (h *Handler) GetPendingUsers(c fiber.Ctx) error {
	users, err := h.service.GetPendingUsers(c.Context())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(APIResponse{
			Success: false,
			Message: "Failed to retrieve pending users",
		})
	}

	return c.Status(fiber.StatusOK).JSON(APIResponse{
		Success: true,
		Message: "Pending users retrieved successfully",
		Data:    users,
	})
}

func (h *Handler) ApproveUser(c fiber.Ctx) error {
	userID := c.Params("id")
	if userID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(APIResponse{
			Success: false,
			Message: "User ID parameter is required",
		})
	}

	err := h.service.ApproveUser(c.Context(), userID)
	if err != nil {
		if errors.Is(err, ErrUserNotFound) {
			return c.Status(fiber.StatusNotFound).JSON(APIResponse{
				Success: false,
				Message: err.Error(),
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(APIResponse{
			Success: false,
			Message: "Failed to approve user",
		})
	}

	return c.Status(fiber.StatusOK).JSON(APIResponse{
		Success: true,
		Message: "User approved successfully",
	})
}

func (h *Handler) RejectUser(c fiber.Ctx) error {
	userID := c.Params("id")
	if userID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(APIResponse{
			Success: false,
			Message: "User ID parameter is required",
		})
	}

	err := h.service.RejectUser(c.Context(), userID)
	if err != nil {
		if errors.Is(err, ErrUserNotFound) {
			return c.Status(fiber.StatusNotFound).JSON(APIResponse{
				Success: false,
				Message: err.Error(),
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(APIResponse{
			Success: false,
			Message: "Failed to reject user",
		})
	}

	return c.Status(fiber.StatusOK).JSON(APIResponse{
		Success: true,
		Message: "User rejected successfully",
	})
}
