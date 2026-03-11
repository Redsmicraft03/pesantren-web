package psb_model

import "gorm.io/gorm"

type PSBInfo struct {
	gorm.Model
	IsOpen           bool   `json:"is_open" gorm:"default:false"`
	AnnouncementText string `json:"announcement_text"`
	RegistrationLink string `json:"registration_link"`
}

func (PSBInfo) TableName() string {
	return "psb_info"
}