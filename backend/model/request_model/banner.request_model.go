package request_model

type BannerRequest struct {
	Title    string `json:"title"`
	Subtitle string `json:"subtitle"`
	Image64 string `json:"image_base64"`
}
