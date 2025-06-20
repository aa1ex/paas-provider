package main

import (
	"fmt"
	"log"
	"net"
	"net/http"

	"github.com/paas-provider/internal/server"
	"github.com/paas-provider/internal/storage"
)

func main() {
	// Create a new storage
	store := storage.NewStorage()

	// Create a new server
	srv := server.NewServer(store)

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

	// Start a simple HTTP server for testing
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "PaaS Provider API is running")
	})

	// Create a VM endpoint
	http.HandleFunc("/api/vm", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		// Create a new VM
		vm := storage.VirtualMachine{
			Name:       "test-vm",
			CPU:        2,
			Memory:     2048,
			OS:         "Ubuntu 20.04",
			TemplateID: "vm-template-1",
		}

		// Process the VM
		result, err := srv.CreateVirtualMachine(r.Context(), vm)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Return the result
		fmt.Fprintf(w, "VM created: %s\n", result.Name)
		fmt.Fprintf(w, "Rendered template:\n%s", result.RenderedTemplate)
	})

	// Create a Kubernetes cluster endpoint
	http.HandleFunc("/api/k8s", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		// Create a new Kubernetes cluster
		cluster := storage.KubernetesCluster{
			Name:       "test-cluster",
			Region:     "us-west-1",
			NodeCount:  3,
			Version:    "1.24",
			TemplateID: "k8s-template-1",
		}

		// Process the Kubernetes cluster
		result, err := srv.CreateKubernetesCluster(r.Context(), cluster)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Return the result
		fmt.Fprintf(w, "Kubernetes cluster created: %s\n", result.Name)
		fmt.Fprintf(w, "Rendered template:\n%s", result.RenderedTemplate)
	})

	// Start the HTTP server
	port := 8080
	log.Printf("Starting HTTP server on port %d", port)
	listener, err := net.Listen("tcp", fmt.Sprintf(":%d", port))
	if err != nil {
		log.Fatalf("Failed to listen: %v", err)
	}
	if err := http.Serve(listener, nil); err != nil {
		log.Fatalf("Failed to serve: %v", err)
	}
}