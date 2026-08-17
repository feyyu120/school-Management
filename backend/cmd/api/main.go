package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"backend/internal/admissions"
	"backend/internal/announcements"
	"backend/internal/attendance"
	"backend/internal/auth"
	"backend/internal/config"
	"backend/internal/db"
	"backend/internal/grades"
	"backend/internal/users"
	"backend/pkg/password"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
)

func main() {
	cfg := config.LoadConfig()

	pool, err := db.InitDB(cfg.DBURL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer pool.Close()

	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	// Ensure uploads directory exists
	if err := os.MkdirAll("./uploads", 0755); err != nil {
		log.Printf("Notice: uploads directory setup: %v", err)
	}

	// Apply database migrations automatically
	if err := db.RunMigrations(ctx, pool, "migrations"); err != nil {
		log.Printf("Notice during migration execution: %v", err)
	} else {
		log.Println("Database migrations checked/applied successfully!")
	}

	// 1. Auth Module Setup
	authRepo := auth.NewRepository(pool)

	// Seed default admin account (admin@school.com / admin123) if no admin exists
	adminPasswordHash, err := password.HashPassword("admin123")
	if err == nil {
		if err := authRepo.SeedAdminUserIfNone(ctx, "admin@school.com", adminPasswordHash); err != nil {
			log.Printf("Notice: Admin seed check: %v", err)
		} else {
			log.Println("Admin seed check complete (Default Admin: admin@school.com / admin123)")
		}
	}

	authService := auth.NewService(authRepo, cfg.JWTSecret, cfg.JWTExpiresIn)
	authHandler := auth.NewHandler(authService)

	// 2. Users Module Setup
	usersRepo := users.NewRepository(pool)
	usersService := users.NewService(usersRepo)
	usersHandler := users.NewHandler(usersService)

	// 3. Attendance Module Setup
	attendanceRepo := attendance.NewRepository(pool)
	attendanceService := attendance.NewService(attendanceRepo)
	attendanceHandler := attendance.NewHandler(attendanceService)

	// 4. Grades Module Setup
	gradesRepo := grades.NewRepository(pool)
	gradesService := grades.NewService(gradesRepo)
	gradesHandler := grades.NewHandler(gradesService)

	// 5. Announcements Module Setup
	announcementsRepo := announcements.NewRepository(pool)
	announcementsService := announcements.NewService(announcementsRepo)
	announcementsHandler := announcements.NewHandler(announcementsService)

	// 6. Admissions Module Setup
	admissionsRepo := admissions.NewRepository(pool)
	admissionsService := admissions.NewService(admissionsRepo)
	admissionsHandler := admissions.NewHandler(admissionsService)

	// Initialize Fiber app
	app := fiber.New(fiber.Config{
		AppName: "School Management System API v1",
	})

	// Configure CORS middleware for local frontend access
	app.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowHeaders: []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowMethods: []string{"GET", "POST", "HEAD", "PUT", "DELETE", "PATCH", "OPTIONS"},
	}))

	// Static route for uploaded files
	app.Get("/uploads/*", func(c fiber.Ctx) error {
		return c.SendFile("./" + c.Params("*"))
	})

	// Register Module Routes
	auth.RegisterRoutes(app, authHandler, cfg.JWTSecret)
	users.RegisterRoutes(app, usersHandler, cfg.JWTSecret)
	attendance.RegisterRoutes(app, attendanceHandler, cfg.JWTSecret)
	grades.RegisterRoutes(app, gradesHandler, cfg.JWTSecret)
	announcements.RegisterRoutes(app, announcementsHandler, cfg.JWTSecret)
	admissions.RegisterRoutes(app, admissionsHandler, cfg.JWTSecret)

	// Start server in background goroutine
	go func() {
		log.Printf("Server listening on port %s...", cfg.Port)
		if err := app.Listen(":" + cfg.Port); err != nil {
			log.Printf("Server listener closed: %v", err)
		}
	}()

	// Listen for system termination signals
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
	<-quit

	log.Println("Gracefully shutting down server...")
	if err := app.Shutdown(); err != nil {
		log.Printf("Error during Fiber app shutdown: %v", err)
	}
	log.Println("Server shutdown complete.")
}
