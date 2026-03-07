FROM golang:1.25-alpine

WORKDIR /app

# Copy daftar dependency terlebih dahulu agar proses build Docker lebih cepat
COPY go.mod go.sum ./
RUN go mod download

# Copy seluruh kode backend
COPY . .

# Build aplikasinya
RUN go build -o main .

EXPOSE 8080

CMD ["./main"]