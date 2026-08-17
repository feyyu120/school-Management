package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"backend/internal/auth"
	"backend/internal/config"
	"backend/internal/db"
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

	// Apply database migrations automatically
	if err := db.RunMigrations(ctx, pool, "migrations"); err != nil {
		log.Printf("Notice during migration execution: %v", err)
	} else {
		log.Println("Database migrations checked/applied successfully!")
	}

	repo := auth.NewRepository(pool)

	// Seed default admin account (admin@school.com / admin123) if no admin exists
	adminPasswordHash, err := password.HashPassword("admin123")
	if err == nil {
		if err := repo.SeedAdminUserIfNone(ctx, "admin@school.com", adminPasswordHash); err != nil {
			log.Printf("Notice: Admin seed check: %v", err)
		} else {
			log.Println("Admin seed check complete (Default Admin: admin@school.com / admin123)")
		}
	}

	service := auth.NewService(repo, cfg.JWTSecret, cfg.JWTExpiresIn)
	handler := auth.NewHandler(service)

	app := fiber.New(fiber.Config{
		AppName: "School Management System API v1",
	})

	// Add CORS middleware to support cross-origin requests from frontend (e.g. http://localhost:5174)
	app.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowHeaders: []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowMethods: []string{"GET", "POST", "HEAD", "PUT", "DELETE", "PATCH", "OPTIONS"},
	}))

	auth.RegisterRoutes(app, handler, cfg.JWTSecret)

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
