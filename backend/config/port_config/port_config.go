package port_config

import "os"

var (
	PORT = "8080"
)

func PortConfig() {
	port := os.Getenv("PORT")
	if port != "" {
		PORT = port
	}
}