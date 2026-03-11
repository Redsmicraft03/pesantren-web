package admin_handler

import (
	"errors"
	"log"
	"net/http"
	"pesantren-backend/database"
	"pesantren-backend/model/profile_model"
	"pesantren-backend/model/request_model"
	"pesantren-backend/model/response_model"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func UpdateProfileHandler(ctx *fiber.Ctx) error {
	var profileReq request_model.ProfileRequest
	if err := ctx.BodyParser(&profileReq); err != nil {
		log.Println("gagal mengambil JSON")
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{
			"message": "format JSON salah",
		})
	}

	var existProfile profile_model.Profile
	if err := database.DB.Debug().First(&existProfile).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			log.Println("lanjutkan")
		} else {
			log.Println("gagal mengambil profile di database")
			return ctx.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"message": "internal server error",
			})
		}
	}

	
	existProfile.About = profileReq.About
	existProfile.Vision = profileReq.Vision
	existProfile.Mission = profileReq.Mission
	
	if err := database.DB.Debug().Save(&existProfile).Error; err != nil {
		log.Println("gagal update profile")
		return ctx.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "internal server error",
		})
	}

	profileResp := response_model.ProfileResponse{
		About:   existProfile.About,
		Vision:  existProfile.Vision,
		Mission: existProfile.Mission,
	}

	return ctx.Status(http.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data":   profileResp,
	})
}
