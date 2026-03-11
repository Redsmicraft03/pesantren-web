package public_handler

import (
	"log"
	"net/http"
	"pesantren-backend/database"
	"pesantren-backend/model/profile_model"

	"github.com/gofiber/fiber/v2"
)

func GetProfileHandler(ctx *fiber.Ctx) error {
	var profile profile_model.Profile
	if err := database.DB.Debug().First(&profile).Error; err != nil {
		log.Println("gagal mengambil data profile di database")
		return ctx.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "internal server error",
		})
	}

	return ctx.Status(http.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data":   profile,
	})
}
