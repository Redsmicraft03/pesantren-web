package main

import (
	"log"
	"pesantren-backend/config"
	"pesantren-backend/database"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("Peringatan: File .env tidak ditemukan, menggunakan environment variable bawaan sistem")
	}

	config.InitConfig()

	database.InitDatabase()


}
