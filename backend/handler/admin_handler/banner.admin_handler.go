package admin_handler

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"pesantren-backend/convert"
	"pesantren-backend/database"
	"pesantren-backend/model/banner_model"
	"pesantren-backend/model/request_model"
	"time"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func CreateBannerHandler(ctx *fiber.Ctx) error {
	var bannerReq request_model.BannerRequest
	if err := ctx.BodyParser(&bannerReq); err != nil {
		return ctx.Status(400).JSON(fiber.Map{"message": "gagal parsing"})
	}

	// 1. Simpan ke DB dulu dengan ImageUrl kosong
	banner := banner_model.Banner{
		Title:    bannerReq.Title,
		Subtitle: bannerReq.Subtitle,
		ImageUrl: "", // Kosongkan dulu
	}

	// Saat Create, GORM otomatis mengisi banner.ID dengan angka AUTO_INCREMENT asli DB (misal: 2)
	if err := database.DB.Create(&banner).Error; err != nil {
		return ctx.Status(500).JSON(fiber.Map{"message": "gagal simpan db"})
	}

	// 2. Sekarang kita punya ID yang PASTI benar dari database (meski record lama dihapus)
	typeimg := fmt.Sprintf("banner-%d", banner.ID)

	filename, _, err := convert.SaveBase64ToFile(bannerReq.Image64, typeimg, "banners")
	if err != nil {
		// Opsional: Hapus record DB jika gagal simpan file (Rollback manual)
		database.DB.Delete(&banner)
		return ctx.Status(500).JSON(fiber.Map{"message": "gagal simpan file"})
	}

	fileUrl := fmt.Sprintf("/uploads/banners/%s", filename)

	// 3. Update ImageUrl dengan nama file yang sudah mengandung ID asli
	database.DB.Model(&banner).Update("image_url", fileUrl)

	return ctx.Status(201).JSON(fiber.Map{"status": "success"})
}

func DeleteBannerHandler(ctx *fiber.Ctx) error {
	id := ctx.Params("id")

	var existBanner banner_model.Banner
	if err := database.DB.Debug().First(&existBanner, id).Error; err != nil {
		log.Println("data banner tidak ditemukan")
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ctx.Status(http.StatusNotFound).JSON(fiber.Map{
				"message": "not found",
			})
		}
		log.Println("gagal mengambil data banner di database")
		return ctx.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "internal server error",
		})
	}

	filepath := "." + existBanner.ImageUrl

	go func(path string) {
		for i := 0; i < 3; i++ {
			err := os.Remove(path)
			if err != nil {
				log.Println("Berhasil menghapus file fisik:", path)
				return
			}
			time.Sleep(500 * time.Millisecond)
		}
		log.Println("Gagal menghapus file setelah 3x percobaan, mungkin masih dikunci:", path)
	}(filepath)

	// if err := os.Remove(filepath); err != nil {
	// 	log.Println("Peringatan: Gagal menghapus file fisik gambar (mungkin sudah terhapus):", err)
	// }

	if err := database.DB.Debug().Unscoped().Delete(&existBanner).Error; err != nil {
		log.Println("gagal hapus banner dari database")
		return ctx.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "internal server error",
		})
	}

	return ctx.Status(http.StatusOK).JSON(fiber.Map{
		"status": "success",
	})
}
