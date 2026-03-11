package request_model

type ProfileRequest struct {
	About   string `json:"about"`
	Vision  string `json:"vision"`
	Mission string `json:"mission"`
}
