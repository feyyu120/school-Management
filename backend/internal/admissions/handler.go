package admissions

import (
	"github.com/gofiber/fiber/v3"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) GetAllAdmissions(c fiber.Ctx) error {
	items, err := h.service.GetAllAdmissions(c.Context())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(APIResponse{
			Success: false,
			Message: "Failed to retrieve admissions info",
		})
	}

	return c.Status(fiber.StatusOK).JSON(APIResponse{
		Success: true,
		Message: "Admissions info retrieved successfully",
		Data:    items,
	})
}

func (h *Handler) CreateAdmission(c fiber.Ctx) error {
	var req CreateAdmissionRequest
	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(APIResponse{
			Success: false,
			Message: "Invalid JSON request body",
		})
	}

	res, err := h.service.CreateAdmission(c.Context(), req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(APIResponse{
			Success: false,
			Message: err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(APIResponse{
		Success: true,
		Message: "Admission info created successfully",
		Data:    res,
	})
}

func (h *Handler) UpdateAdmission(c fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(APIResponse{
			Success: false,
			Message: "Admission ID is required",
		})
	}

	var req UpdateAdmissionRequest
	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(APIResponse{
			Success: false,
			Message: "Invalid JSON request body",
		})
	}

	err := h.service.UpdateAdmission(c.Context(), id, req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(APIResponse{
			Success: false,
			Message: err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(APIResponse{
		Success: true,
		Message: "Admission info updated successfully",
	})
}

func (h *Handler) DeleteAdmission(c fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(APIResponse{
			Success: false,
			Message: "Admission ID is required",
		})
	}

	err := h.service.DeleteAdmission(c.Context(), id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(APIResponse{
			Success: false,
			Message: err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(APIResponse{
		Success: true,
		Message: "Admission info deleted successfully",
	})
}
