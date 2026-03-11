package register_handler

import (
	"log"
	"net/http"
	"pesantren-backend/database"
	"pesantren-backend/model/request_model"
	"pesantren-backend/model/user_model"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

func CreateAdminHandler(ctx *fiber.Ctx) error {
	var userReq request_model.LoginRequest
	if err := ctx.BodyParser(&userReq); err != nil {
		log.Println("gagal mengambil JSON")
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{
			"message": "JSON tidak valid",
		})
	}

	password, err := bcrypt.GenerateFromPassword([]byte(userReq.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Println("gagal hash password")
		return ctx.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "internal server error",
		})
	}

	user := user_model.User{
		Username: userReq.Username,
		Password: string(password),
	}
	if err := database.DB.Debug().Create(&user).Error; err != nil {
		log.Println("gagal menyimpan user di database")
		return ctx.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "internal server error",
		})
	}

	return ctx.Status(http.StatusOK).JSON(fiber.Map{
		"status": "success",
	})
}
