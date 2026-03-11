package request_model

type PSBRequest struct {
	IsOpen           bool   `json:"is_open"`
	AnnouncementText string `json:"announcement_text"`
	RegistrationLink string `json:"registration_link"`
}