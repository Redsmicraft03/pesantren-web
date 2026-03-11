package v1

import (
	"pesantren-backend/handler/login_handler"
	"pesantren-backend/routes/v1/admin_routes"
	"pesantren-backend/routes/v1/public_routes"

	"github.com/gofiber/fiber/v2"
)

func InitV1(api fiber.Router) {
	apiV1 := api.Group("/v1")

	apiV1.Post("/login", login_handler.LoginHandler)
	// apiV1.Post("/register", register_handler.CreateAdminHandler)

	public_routes.PublicRoutesV1(apiV1)
	admin_routes.AdminRoutesV1(apiV1)
}
