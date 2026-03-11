package database

import (
	"fmt"
	"log"
	"pesantren-backend/config/db_config"
	"pesantren-backend/model/banner_model"
	"pesantren-backend/model/profile_model"
	"pesantren-backend/model/psb_model"
	"pesantren-backend/model/user_model"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDatabase() {
	var err error

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Jakarta", db_config.DB_HOST, db_config.DB_USER, db_config.DB_PASSWORD, db_config.DB_NAME, db_config.DB_PORT)

	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("can't connect to database postgres")
	}

	err = DB.AutoMigrate(
		user_model.User{},
		banner_model.Banner{},
		profile_model.Profile{},
		psb_model.PSBInfo{},
	)

	if err != nil {
		log.Println("gagal migrate")
	}

	log.Println("berhasil terhubung ke database")
}
