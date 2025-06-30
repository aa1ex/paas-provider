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
	store := storage.NewStorage()

	// Add some example templates
	vmTemplate := storage.Template{
		ID:   "vm-template-1",
		Name: "Basic VM Template",
		Type: "vm",
		RawTemplate: `
Name: {{ .Name }}
CPU: {{ .CPU }} cores
Memory: {{ .Memory }} MB
OS: {{ .OS }}
`,
	}
	store.CreateTemplate(vmTemplate)

	k8sTemplate := storage.Template{
		ID:   "k8s-template-1",
		Name: "Basic Kubernetes Template",
		Type: "kubernetes",
		RawTemplate: `
Name: {{ .Name }}
Region: {{ .Region }}
Node Count: {{ .NodeCount }}
Kubernetes Version: {{ .Version }}
`,
	}
	store.CreateTemplate(k8sTemplate)

	runServer(store)
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

	port := 8080
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
