package admin_routes

import (
	"pesantren-backend/handler/admin_handler"
	"pesantren-backend/middleware"

	"github.com/gofiber/fiber/v2"
)

func AdminRoutesV1(api fiber.Router) {
	adminGroup := api.Group("/admin")
	adminGroup.Use(middleware.Protected())

	apiV1Banner := adminGroup.Group("/banners")
	{
		apiV1Banner.Post("", admin_handler.CreateBannerHandler)
		apiV1Banner.Delete("/:id", admin_handler.DeleteBannerHandler)
	}

	apiV1Psb := adminGroup.Group("/psb")
	{
		apiV1Psb.Put("", admin_handler.UpdatePsbHandler)
	}

	apiV1Profile := adminGroup.Group("/profile")
	{
		apiV1Profile.Put("", admin_handler.UpdateProfileHandler)
	}
}
