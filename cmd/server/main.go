package main

import (
	"context"
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"syscall"
	"time"

	"github.com/rs/cors"
	"github.com/spf13/viper"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"

	"github.com/aa1ex/paas-provider/internal/server/k8s"
	"github.com/aa1ex/paas-provider/internal/server/template"
	"github.com/aa1ex/paas-provider/internal/server/vm"
	"github.com/aa1ex/paas-provider/internal/tmplproc"
	"github.com/aa1ex/paas-provider/pkg/api/grpc/kubernetes_cluster/v1/kubernetes_clusterv1connect"
	"github.com/aa1ex/paas-provider/pkg/api/grpc/template/v1/templatev1connect"
	"github.com/aa1ex/paas-provider/pkg/api/grpc/virtual_machine/v1/virtual_machinev1connect"

	"github.com/aa1ex/paas-provider/internal/storage"
)

func main() {
	// Initialize viper
	initConfig()

	store := storage.NewStorage()

	// Load templates from files
	loadTemplates(store)

	// Run the server with the port from config
	runServer(store)
}

// initConfig initializes the configuration using viper
func initConfig() {
	// Set default values
	viper.SetDefault("server.port", 8080)
	viper.SetDefault("templates.vm.id", "vm-template-1")
	viper.SetDefault("templates.vm.name", "Basic VM Template")
	viper.SetDefault("templates.vm.file", "templates/vm-template.tmpl")
	viper.SetDefault("templates.kubernetes.id", "k8s-template-1")
	viper.SetDefault("templates.kubernetes.name", "Basic Kubernetes Template")
	viper.SetDefault("templates.kubernetes.file", "templates/kubernetes-template.tmpl")

	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath(".")

	if err := viper.ReadInConfig(); err != nil {
		log.Printf("Warning: Could not read config file: %v. Using default values.", err)
	} else {
		log.Println("Config loaded successfully")
	}
}

// loadTemplates loads templates from files specified in the config
func loadTemplates(store *storage.Storage) {
	// Default template content
	defaultVMTemplate := `Name: {{ .Name }}
CPU: {{ .CPU }} cores
Memory: {{ .Memory }} MB
OS: {{ .OS }}`

	defaultK8sTemplate := `Name: {{ .Name }}
Region: {{ .Region }}
Node Count: {{ .NodeCount }}
Kubernetes Version: {{ .Version }}`

	// Load VM template
	vmTemplateFile := viper.GetString("templates.vm.file")
	vmTemplateContent, err := os.ReadFile(vmTemplateFile)
	if err != nil {
		log.Printf("Warning: Could not read VM template file: %v. Using default template.", err)
		vmTemplateContent = []byte(defaultVMTemplate)
	}

	vmTemplate := storage.Template{
		ID:          viper.GetString("templates.vm.id"),
		Name:        viper.GetString("templates.vm.name"),
		Type:        "vm",
		RawTemplate: string(vmTemplateContent),
	}
	store.CreateTemplate(vmTemplate)
	log.Printf("Loaded VM template: %s", vmTemplate.Name)

	// Load Kubernetes template
	k8sTemplateFile := viper.GetString("templates.kubernetes.file")
	k8sTemplateContent, err := os.ReadFile(k8sTemplateFile)
	if err != nil {
		log.Printf("Warning: Could not read Kubernetes template file: %v. Using default template.", err)
		k8sTemplateContent = []byte(defaultK8sTemplate)
	}

	k8sTemplate := storage.Template{
		ID:          viper.GetString("templates.kubernetes.id"),
		Name:        viper.GetString("templates.kubernetes.name"),
		Type:        "kubernetes",
		RawTemplate: string(k8sTemplateContent),
	}
	store.CreateTemplate(k8sTemplate)
	log.Printf("Loaded Kubernetes template: %s", k8sTemplate.Name)
}

func runServer(s *storage.Storage) {
	mux := http.NewServeMux()
	tmplProc := tmplproc.NewTemplateProcessor(s)

	path, handler := templatev1connect.NewTemplateServiceHandler(template.NewService(s, tmplProc))
	mux.Handle(path, handler)
	path, handler = virtual_machinev1connect.NewVirtualMachineServiceHandler(vm.NewService(s, tmplProc))
	mux.Handle(path, handler)
	path, handler = kubernetes_clusterv1connect.NewKubernetesClusterServiceHandler(k8s.NewService(s, tmplProc))
	mux.Handle(path, handler)

	port := viper.GetInt("server.port")
	if port == 0 {
		port = 8080 // Default port if not specified in config
	}
	addr := net.JoinHostPort("", strconv.Itoa(port))

	// Create a new server with the handler
	server := &http.Server{
		Addr:    addr,
		Handler: h2c.NewHandler(cors.AllowAll().Handler(mux), &http2.Server{}),
	}

	// Create a channel to listen for interrupt signals
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)

	// Start the server in a goroutine
	go func() {
		log.Printf("Starting HTTP server on port %d", port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Error starting server: %v", err)
		}
	}()

	// Wait for interrupt signal
	<-stop
	log.Println("Shutting down server...")

	// Create a context with timeout for shutdown
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Attempt graceful shutdown
	if err := server.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	log.Println("Server gracefully stopped")
}
