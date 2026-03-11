package config

import (
	"pesantren-backend/config/db_config"
	"pesantren-backend/config/port_config"
)

func InitConfig() {
	db_config.InitDatabaseConfig()
	port_config.PortConfig()
}