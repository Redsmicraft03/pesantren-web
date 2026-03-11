package main

import (
	"log"
	"pesantren-backend/config"
	"pesantren-backend/config/port_config"
	"pesantren-backend/database"
	"pesantren-backend/routes"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/joho/godotenv"
)

func main() {
	app := fiber.New(fiber.Config{
		BodyLimit:    100 * 1024 * 1024,
		ReadTimeout:  60 * time.Second,
		WriteTimeout: 60 * time.Second,
	})

	app.Use(logger.New())
	app.Use(recover.New())

	app.Static("/uploads", "./uploads")

	err := godotenv.Load()
	if err != nil {
		log.Println("Peringatan: File .env tidak ditemukan, menggunakan environment variable bawaan sistem")
	}

	config.InitConfig()

	database.InitDatabase()

	routes.InitRoute(app)

	app.Listen(":" + port_config.PORT)
}
