.PHONY: build run clean test deps help

# Default target
all: build

# Build the application
build:
	@echo "🔨 Building Go WebSocket Chat App..."
	go build -o bin/chat-app main.go
	@echo "✅ Build complete! Binary: bin/chat-app"

# Run the application
run:
	@echo "🚀 Starting Go WebSocket Chat App..."
	go run main.go

# Install dependencies
deps:
	@echo "📦 Installing dependencies..."
	go mod tidy
	go mod download
	@echo "✅ Dependencies installed!"

# Clean build artifacts
clean:
	@echo "🧹 Cleaning build artifacts..."
	rm -rf bin/
	go clean
	@echo "✅ Clean complete!"

# Run tests
test:
	@echo "🧪 Running tests..."
	go test ./...
	@echo "✅ Tests complete!"

# Format code
fmt:
	@echo "🎨 Formatting code..."
	go fmt ./...
	@echo "✅ Code formatted!"

# Lint code
lint:
	@echo "🔍 Linting code..."
	golangci-lint run
	@echo "✅ Linting complete!"

# Development mode (with hot reload if you have air installed)
dev:
	@echo "🔥 Starting in development mode..."
	@if command -v air > /dev/null; then \
		air; \
	else \
		echo "⚠️  Air not installed. Install with: go install github.com/cosmtrek/air@latest"; \
		go run main.go; \
	fi

# Install development tools
install-tools:
	@echo "🛠️  Installing development tools..."
	go install github.com/cosmtrek/air@latest
	go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
	@echo "✅ Development tools installed!"

# Show help
help:
	@echo "🚀 Go WebSocket Chat App - Available Commands:"
	@echo ""
	@echo "  build         - Build the application"
	@echo "  run           - Run the application"
	@echo "  deps          - Install dependencies"
	@echo "  clean         - Clean build artifacts"
	@echo "  test          - Run tests"
	@echo "  fmt           - Format code"
	@echo "  lint          - Lint code"
	@echo "  dev           - Run in development mode (with hot reload)"
	@echo "  install-tools - Install development tools"
	@echo "  help          - Show this help message"
	@echo ""
	@echo "Example: make run"
