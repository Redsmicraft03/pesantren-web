package url_config

import "os"

var CLIENT_URL = ""
func InitUrl() {
	clientUrl := os.Getenv("CLIENT_URL")
	if clientUrl != "" {
		CLIENT_URL = clientUrl
	}
}
