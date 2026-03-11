package admin_handler

import (
	"errors"
	"log"
	"net/http"
	"pesantren-backend/database"
	"pesantren-backend/model/psb_model"
	"pesantren-backend/model/request_model"
	"pesantren-backend/model/response_model"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func UpdatePsbHandler(ctx *fiber.Ctx) error {
	var psbReq request_model.PSBRequest
	if err := ctx.BodyParser(&psbReq); err != nil {
		log.Println("gagal mengambil JSON")
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{
			"message": "format JSON salah",
		})
	}

	var existPsb psb_model.PSBInfo
	if err := database.DB.Debug().Table("psb_info").First(&existPsb).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			log.Println("lanjutkan")
		} else {
			log.Println("gagal mengambil data PSB di database")
			return ctx.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"message": "internal server error",
			})
		}
	}

	existPsb.IsOpen = psbReq.IsOpen
	existPsb.AnnouncementText = psbReq.AnnouncementText
	existPsb.RegistrationLink = psbReq.RegistrationLink

	if err := database.DB.Debug().Table("psb_info").Save(&existPsb).Error; err != nil {
		log.Println("gagal perbarui data PSB di database")
		return ctx.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "internal server error",
		})
	}

	psbResp := response_model.PSBResponse{
		IsOpen:           existPsb.IsOpen,
		AnnouncementText: existPsb.AnnouncementText,
		RegistrationLink: existPsb.RegistrationLink,
	}

	return ctx.Status(http.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data":   psbResp,
	})
}
