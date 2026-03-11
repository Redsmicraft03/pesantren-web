package jwt_config

import "os"

var SECRET_KEY = "secret"

func InitJwt() {
	secretKey := os.Getenv("JWT_SECRET")
	if secretKey != "" {
		SECRET_KEY = secretKey
	}
}
