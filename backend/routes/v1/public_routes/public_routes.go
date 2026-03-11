package public_routes

import (
	"pesantren-backend/handler/public_handler"

	"github.com/gofiber/fiber/v2"
)

func PublicRoutesV1(api fiber.Router) {
	api.Get("/banners", public_handler.GetAllBannerHandler)
	api.Get("/psb", public_handler.GetInfoPsb)
	api.Get("/profile", public_handler.GetProfileHandler)
}
