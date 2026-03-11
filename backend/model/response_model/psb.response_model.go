package response_model

type PSBResponse struct {
	IsOpen           bool   `json:"is_open"`
	AnnouncementText string `json:"announcement_text"`
	RegistrationLink string `json:"registration_link"`
}
