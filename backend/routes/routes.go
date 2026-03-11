package routes

import (
	"pesantren-backend/config/url_config"
	v1 "pesantren-backend/routes/v1"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func InitRoute(app *fiber.App) {
	app.Use(cors.New(cors.Config{
		AllowOrigins: url_config.CLIENT_URL,
		AllowMethods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization, ngrok-skip-browser-warning",
		AllowCredentials: true,
	}))

	api := app.Group("/api")

	v1.InitV1(api)
}
