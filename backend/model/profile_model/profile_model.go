package profile_model

import "gorm.io/gorm"

type Profile struct {
	gorm.Model
	About   string `json:"about" gorm:"type:text"`
	Vision  string `json:"vision" gorm:"type:text"`
	Mission string `json:"mission" gorm:"type:text"`
}
