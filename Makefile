# Makefile for PaaS Provider project

# Variables
GO = go
NPM = npm
BUF = buf
GOFMT = gofmt
GOLINT = golangci-lint
FRONTEND_DIR = frontend
SERVER_DIR = cmd/server
BUILD_DIR = build
BIN_DIR = bin
SERVER_BIN = paas-provider-server
PROTO_DIR = proto

# Default target
.PHONY: all
all: deps build

# Initialize project
.PHONY: init
init:
	@echo "Initializing project..."
	$(GO) mod download
	cd $(FRONTEND_DIR) && $(NPM) install
	@echo "Project initialized successfully!"

# Dependencies
.PHONY: deps
deps: go-deps npm-deps

.PHONY: go-deps
go-deps:
	$(GO) mod download

.PHONY: npm-deps
npm-deps:
	cd $(FRONTEND_DIR) && $(NPM) install

# Build
.PHONY: build
build: build-proto build-backend build-frontend

.PHONY: build-proto
build-proto:
	$(BUF) generate

.PHONY: lint-proto
lint-proto:
	$(BUF) lint $(PROTO_DIR)

.PHONY: breaking-proto
breaking-proto:
	$(BUF) breaking --against '.git#branch=main'

.PHONY: build-backend
build-backend:
	mkdir -p $(BIN_DIR)
	$(GO) build -o $(BIN_DIR)/$(SERVER_BIN) ./$(SERVER_DIR)

.PHONY: build-frontend
build-frontend:
	cd $(FRONTEND_DIR) && $(NPM) run build

# Run
.PHONY: run
run: run-backend

.PHONY: run-backend
run-backend:
	$(GO) run ./$(SERVER_DIR)

.PHONY: run-frontend
run-frontend:
	cd $(FRONTEND_DIR) && $(NPM) start

.PHONY: run-prod
run-prod: build
	$(BIN_DIR)/$(SERVER_BIN)

.PHONY: serve-frontend
serve-frontend: build-frontend
	cd $(FRONTEND_DIR) && npx serve -s build

# Development
.PHONY: dev
dev:
	@echo "Starting backend and frontend in development mode..."
	@echo "Run 'make run-backend' and 'make run-frontend' in separate terminals"

.PHONY: dev-backend
dev-backend:
	$(GO) run ./$(SERVER_DIR)

.PHONY: dev-frontend
dev-frontend:
	cd $(FRONTEND_DIR) && $(NPM) start

.PHONY: dev-all
dev-all:
	@echo "Starting both backend and frontend in development mode..."
	@(trap 'kill 0' INT; $(MAKE) dev-backend & $(MAKE) dev-frontend & wait)

.PHONY: fmt
fmt:
	$(GOFMT) -w -s ./cmd ./internal ./pkg

.PHONY: lint
lint:
	$(GOLINT) run ./...

.PHONY: lint-fix
lint-fix:
	$(GOLINT) run --fix  ./...

.PHONY: vet
vet:
	$(GO) vet ./...

.PHONY: tidy
tidy:
	$(GO) mod tidy

# Test
.PHONY: test
test: test-backend test-frontend

.PHONY: test-backend
test-backend:
	$(GO) test ./...

.PHONY: test-frontend
test-frontend:
	cd $(FRONTEND_DIR) && $(NPM) test

# Clean
.PHONY: clean
clean: clean-backend clean-frontend

.PHONY: clean-backend
clean-backend:
	rm -rf $(BIN_DIR)
	rm -rf $(BUILD_DIR)

.PHONY: clean-frontend
clean-frontend:
	rm -rf $(FRONTEND_DIR)/build
	rm -rf $(FRONTEND_DIR)/node_modules

# Docker
.PHONY: docker-build-server
docker-build-server:
	docker build -t paas-provider-server -f Dockerfile.server .

.PHONY: docker-build-frontend
docker-build-frontend:
	docker build -t paas-provider-frontend -f Dockerfile.frontend .

.PHONY: docker-build
docker-build: docker-build-server docker-build-frontend

.PHONY: docker-run
docker-run:
	docker run -p 8080:8080 paas-provider-server

.PHONY: kind-load-images
kind-load-images: docker-build
	kind load docker-image paas-provider-server
	kind load docker-image paas-provider-frontend

# Helm
.PHONY: helm-lint
helm-lint:
	helm lint charts/paas-provider

.PHONY: helm-template
helm-template:
	helm template paas-provider charts/paas-provider

.PHONY: helm-install
helm-install:
	helm install paas-provider charts/paas-provider

.PHONY: helm-upgrade
helm-upgrade:
	helm upgrade paas-provider charts/paas-provider

.PHONY: helm-uninstall
helm-uninstall:
	helm uninstall paas-provider

.PHONY: helm-deploy-kind
helm-deploy-kind: kind-load-images
	helm upgrade --install paas-provider charts/paas-provider --namespace default --create-namespace

# Help
.PHONY: help
help:
	@echo "Available targets:"
	@echo "  all            - Download dependencies and build the project"
	@echo "  init           - Initialize the project by installing all dependencies"
	@echo "  deps           - Download all dependencies"
	@echo "  go-deps        - Download Go dependencies"
	@echo "  npm-deps       - Download NPM dependencies"
	@echo "  build          - Build the entire project"
	@echo "  build-proto    - Generate code from Protocol Buffers"
	@echo "  build-backend  - Build the backend server"
	@echo "  build-frontend - Build the frontend application"
	@echo "  run            - Run the backend server"
	@echo "  run-backend    - Run the backend server"
	@echo "  run-frontend   - Run the frontend development server"
	@echo "  run-prod       - Run the backend server in production mode"
	@echo "  serve-frontend - Serve the built frontend using a static server"
	@echo "  dev            - Start development environment"
	@echo "  dev-backend    - Run the backend in development mode"
	@echo "  dev-frontend   - Run the frontend in development mode"
	@echo "  dev-all        - Run both backend and frontend in development mode"
	@echo "  fmt            - Format Go code"
	@echo "  lint           - Lint Go code"
	@echo "  lint-fix       - Lint and fix Go code"
	@echo "  lint-proto     - Lint Protocol Buffer definitions"
	@echo "  breaking-proto - Check for breaking changes in Protocol Buffer definitions"
	@echo "  vet            - Vet Go code for potential issues"
	@echo "  tidy           - Tidy Go module dependencies"
	@echo "  test           - Run all tests"
	@echo "  test-backend   - Run backend tests"
	@echo "  test-frontend  - Run frontend tests"
	@echo "  clean          - Clean build artifacts"
	@echo "  docker-build-server - Build server Docker image"
	@echo "  docker-build-frontend - Build frontend Docker image"
	@echo "  docker-build   - Build all Docker images"
	@echo "  docker-run     - Run Docker container"
	@echo "  kind-load-images - Build and load Docker images into Kind cluster"
	@echo "  helm-lint      - Lint the Helm chart"
	@echo "  helm-template  - Render the Helm templates locally"
	@echo "  helm-install   - Install the Helm chart"
	@echo "  helm-upgrade   - Upgrade the Helm chart"
	@echo "  helm-uninstall - Uninstall the Helm chart"
	@echo "  helm-deploy-kind - Deploy the Helm chart to a local Kind cluster"
	@echo "  help           - Show this help message"
