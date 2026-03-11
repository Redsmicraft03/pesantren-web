package public_handler

import (
	"log"
	"net/http"
	"pesantren-backend/database"
	"pesantren-backend/model/psb_model"
	"pesantren-backend/model/response_model"

	"github.com/gofiber/fiber/v2"
)

func GetInfoPsb(ctx *fiber.Ctx) error {
	var psbInfo psb_model.PSBInfo
	if err := database.DB.Debug().Table("psb_info").First(&psbInfo).Error; err != nil {
		log.Println("gagal mengambil PSB di database")
		return ctx.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "internal server error",
		})
	}

	psbResp := response_model.PSBResponse{
		IsOpen: psbInfo.IsOpen,
		AnnouncementText: psbInfo.AnnouncementText,
		RegistrationLink: psbInfo.RegistrationLink,
	}

	return ctx.Status(http.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data": psbResp,
	})
}