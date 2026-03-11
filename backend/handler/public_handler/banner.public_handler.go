package public_handler

import (
	"log"
	"net/http"
	"pesantren-backend/database"
	"pesantren-backend/model/banner_model"
	"pesantren-backend/model/response_model"

	"github.com/gofiber/fiber/v2"
)

func GetAllBannerHandler(ctx *fiber.Ctx) error {
	var bannerData []banner_model.Banner
	if err := database.DB.Debug().Where("is_active = ?", true).Find(&bannerData).Error; err != nil {
		log.Println("gagal ambil data banner")
		return ctx.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "internal server error",
		})
	}

	var bannerResp []response_model.BannerResponse
	for _, banner := range bannerData {
		item := response_model.BannerResponse{
			ID:       banner.ID,
			Title:    banner.Title,
			Subtitle: banner.Subtitle,
			ImageUrl: banner.ImageUrl,
		}

		bannerResp = append(bannerResp, item)
	}

	return ctx.Status(http.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data":   bannerResp,
	})
}
