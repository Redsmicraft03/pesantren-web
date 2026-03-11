package login_handler

import (
	"errors"
	"net/http"
	"pesantren-backend/config/jwt_config"
	"pesantren-backend/database"
	"pesantren-backend/model/request_model"
	"pesantren-backend/model/user_model"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func LoginHandler(ctx *fiber.Ctx) error {
	var logReq request_model.LoginRequest
	if err := ctx.BodyParser(&logReq); err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{
			"message": "gagal mengambil JSON",
		})
	}

	var existUser user_model.User
	if err := database.DB.Debug().Where("username = ?", logReq.Username).First(&existUser).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ctx.Status(http.StatusUnauthorized).JSON(fiber.Map{
				"message": "username atau password salah",
			})
		}
		return ctx.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "internal server error",
		})
	}

	if err := bcrypt.CompareHashAndPassword([]byte(existUser.Password), []byte(logReq.Password)); err != nil {
		return ctx.Status(http.StatusUnauthorized).JSON(fiber.Map{
			"message": "username atau password salah",
		})
	}

	claims := jwt.MapClaims{
		"sub":      existUser.ID,
		"username": existUser.Username,
		"iat":      time.Now().Unix(),
		"exp":      time.Now().Add(time.Hour * 24 * 7).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	signedToken, err := token.SignedString([]byte(jwt_config.SECRET_KEY))
	if err != nil {
		return ctx.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "failed to generate token",
		})
	}

	return ctx.Status(http.StatusOK).JSON(fiber.Map{
		"status": "success login",
		"token":   signedToken,
	})
}
