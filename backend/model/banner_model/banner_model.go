package banner_model

import "gorm.io/gorm"

type Banner struct {
	gorm.Model
	Title    string `json:"title"`
	Subtitle string `json:"subtitle"`
	ImageUrl string `json:"image_url"`
	IsActive bool   `json:"is_active" gorm:"default:true"`
}
