package url_config

import "os"

var CLIENT_URL = "http://localhost:3000, http://192.168.1.12:3000"

func InitUrl() {
	clientUrl := os.Getenv("CLIENT_URL")
	if clientUrl != "" {
		CLIENT_URL = clientUrl
	}
}
