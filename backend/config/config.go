package config

import "pesantren-backend/config/db_config"

func InitConfig() {
	db_config.InitDatabaseConfig()
}