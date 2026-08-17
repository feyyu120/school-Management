package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	DBURL        string
	JWTSecret    string
	Port         string
	JWTExpiresIn string
}

func LoadConfig() *Config {
	// Attempt to load .env file; log warning if not found but continue checking environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("Notice: .env file not found, reading from system environment")
	}

	dbURL := os.Getenv("DB_URL")
	if dbURL == "" {
		log.Fatal("Fatal Error: DB_URL environment variable is required")
	}

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "default-fallback-secret-change-me"
		log.Println("Warning: JWT_SECRET not set, using default secret")
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	jwtExpiresIn := os.Getenv("JWT_EXPIRES_IN")
	if jwtExpiresIn == "" {
		jwtExpiresIn = "24h"
	}

	return &Config{
		DBURL:        dbURL,
		JWTSecret:    jwtSecret,
		Port:         port,
		JWTExpiresIn: jwtExpiresIn,
	}
}
