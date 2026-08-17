package grades

import (
	"github.com/gofiber/fiber/v3"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) CreateGrade(c fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(string)
	if !ok || userID == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(APIResponse{
			Success: false,
			Message: "Unauthorized",
		})
	}

	var req CreateGradeRequest
	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(APIResponse{
			Success: false,
			Message: "Invalid JSON request body",
		})
	}

	res, err := h.service.CreateGrade(c.Context(), userID, req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(APIResponse{
			Success: false,
			Message: err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(APIResponse{
		Success: true,
		Message: "Grade recorded successfully",
		Data:    res,
	})
}

func (h *Handler) UpdateGrade(c fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(APIResponse{
			Success: false,
			Message: "Grade ID parameter is required",
		})
	}

	var req UpdateGradeRequest
	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(APIResponse{
			Success: false,
			Message: "Invalid JSON request body",
		})
	}

	err := h.service.UpdateGrade(c.Context(), id, req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(APIResponse{
			Success: false,
			Message: err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(APIResponse{
		Success: true,
		Message: "Grade updated successfully",
	})
}

func (h *Handler) GetStudentGrades(c fiber.Ctx) error {
	studentID := c.Params("studentId")
	if studentID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(APIResponse{
			Success: false,
			Message: "studentId parameter is required",
		})
	}

	records, err := h.service.GetStudentGrades(c.Context(), studentID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(APIResponse{
			Success: false,
			Message: err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(APIResponse{
		Success: true,
		Message: "Student grades retrieved successfully",
		Data:    records,
	})
}

func (h *Handler) GetMyGrades(c fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(string)
	if !ok || userID == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(APIResponse{
			Success: false,
			Message: "Unauthorized",
		})
	}

	records, err := h.service.GetMyGrades(c.Context(), userID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(APIResponse{
			Success: false,
			Message: err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(APIResponse{
		Success: true,
		Message: "My grades retrieved successfully",
		Data:    records,
	})
}

func (h *Handler) GetTeacherStudentsGrades(c fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(string)
	if !ok || userID == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(APIResponse{
			Success: false,
			Message: "Unauthorized",
		})
	}

	records, err := h.service.GetTeacherStudentsGrades(c.Context(), userID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(APIResponse{
			Success: false,
			Message: err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(APIResponse{
		Success: true,
		Message: "Teacher students grades retrieved successfully",
		Data:    records,
	})
}
