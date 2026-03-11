package response_model

type BannerResponse struct {
	ID       uint   `json:"id"`
	Title    string `json:"title"`
	Subtitle string `json:"subtitle"`
	ImageUrl string `json:"image_url"`
}
