package convert

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"net/http"
	"strings"

	"github.com/disintegration/imaging"
)

func SaveBase64ToFile(base64String, typeimg, path string) (string, string, error) {
	b64data := base64String
	if strings.Contains(b64data, ",") {
		b64data = strings.Split(b64data, ",")[1]
	}

	dec, err := base64.StdEncoding.DecodeString(b64data)
	if err != nil {
		return "", "", fmt.Errorf("gagal membaca base64: %v", err)
	}

	checkSize := len(dec)
	if checkSize > 512 {
		checkSize = 512
	}

	fileType := http.DetectContentType(dec[:checkSize])

	if !strings.HasPrefix(fileType, "image/") {
		return "", "", fmt.Errorf("keamanan: file ditolak, tipe file terdeteksi sebagai %s", fileType)
	}

	img, err := imaging.Decode(bytes.NewReader(dec))
	if err != nil {
		return "", "", fmt.Errorf("gagal membaca format gambar: %v", err)
	}

	img = imaging.Resize(img, 800, 0, imaging.Lanczos)

	filename := fmt.Sprintf("%s.jpg", typeimg)
	filepath := fmt.Sprintf("./uploads/%s/%s", path, filename)

	err = imaging.Save(img, filepath, imaging.JPEGQuality(80))
	if err != nil {
		return "", "", fmt.Errorf("gagal menyimpan gambar: %v", err)
	}
	return filename, filepath, err
}
