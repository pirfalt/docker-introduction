FROM golang:1.16-alpine AS builder

WORKDIR /project

# Get dependencies specification
COPY go.mod ./

# Install dependencies
RUN go mod download

# Get everyhing else
COPY . .

# Configure the go compiler
ENV CGO_ENABLED=0
ENV GOARCH=amd64
ENV GOOS=linux

# Run unit tests
RUN go test -v

# Build the application
RUN go build -o hello-world .

# -------------------------------------------------
# Start fresh
FROM scratch

COPY --from=builder /project/hello-world /app

CMD ["/app"]
