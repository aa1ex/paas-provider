package server

import (
	"context"
	"fmt"
	"math/rand"
	"strconv"
	"time"

	"github.com/paas-provider/internal/storage"
)

// generateID generates a unique ID
func generateID() string {
	rand.Seed(time.Now().UnixNano())
	return strconv.FormatInt(time.Now().UnixNano(), 10) + strconv.Itoa(rand.Intn(1000))
}

// Server implements the gRPC service
type Server struct {
	storage    *storage.Storage
	processor  *TemplateProcessor
}

// NewServer creates a new server
func NewServer(storage *storage.Storage) *Server {
	return &Server{
		storage:    storage,
		processor:  NewTemplateProcessor(storage),
	}
}

// Template operations

// CreateTemplate creates a new template
func (s *Server) CreateTemplate(ctx context.Context, template storage.Template) (storage.Template, error) {
	// Generate ID if not provided
	if template.ID == "" {
		template.ID = generateID()
	}

	// Store the template
	return s.storage.CreateTemplate(template), nil
}

// GetTemplate retrieves a template by ID
func (s *Server) GetTemplate(ctx context.Context, id string) (storage.Template, error) {
	return s.storage.GetTemplate(id)
}

// ListTemplates retrieves all templates
func (s *Server) ListTemplates(ctx context.Context, templateType string) ([]storage.Template, error) {
	return s.storage.ListTemplates(templateType), nil
}

// UpdateTemplate updates an existing template
func (s *Server) UpdateTemplate(ctx context.Context, template storage.Template) (storage.Template, error) {
	return s.storage.UpdateTemplate(template)
}

// DeleteTemplate deletes a template by ID
func (s *Server) DeleteTemplate(ctx context.Context, id string) error {
	return s.storage.DeleteTemplate(id)
}

// VirtualMachine operations

// CreateVirtualMachine creates a new virtual machine
func (s *Server) CreateVirtualMachine(ctx context.Context, vm storage.VirtualMachine) (storage.VirtualMachine, error) {
	// Generate ID if not provided
	if vm.ID == "" {
		vm.ID = generateID()
	}

	// Process the template
	renderedTemplate, err := s.processor.ProcessVirtualMachineTemplate(vm)
	if err != nil {
		return storage.VirtualMachine{}, fmt.Errorf("failed to process template: %w", err)
	}

	// Set the rendered template
	vm.RenderedTemplate = renderedTemplate

	// Store the virtual machine
	return s.storage.CreateVirtualMachine(vm), nil
}

// GetVirtualMachine retrieves a virtual machine by ID
func (s *Server) GetVirtualMachine(ctx context.Context, id string) (storage.VirtualMachine, error) {
	return s.storage.GetVirtualMachine(id)
}

// ListVirtualMachines retrieves all virtual machines
func (s *Server) ListVirtualMachines(ctx context.Context) ([]storage.VirtualMachine, error) {
	return s.storage.ListVirtualMachines(), nil
}

// UpdateVirtualMachine updates an existing virtual machine
func (s *Server) UpdateVirtualMachine(ctx context.Context, vm storage.VirtualMachine) (storage.VirtualMachine, error) {
	// Process the template
	renderedTemplate, err := s.processor.ProcessVirtualMachineTemplate(vm)
	if err != nil {
		return storage.VirtualMachine{}, fmt.Errorf("failed to process template: %w", err)
	}

	// Set the rendered template
	vm.RenderedTemplate = renderedTemplate

	// Update the virtual machine
	return s.storage.UpdateVirtualMachine(vm)
}

// DeleteVirtualMachine deletes a virtual machine by ID
func (s *Server) DeleteVirtualMachine(ctx context.Context, id string) error {
	return s.storage.DeleteVirtualMachine(id)
}

// KubernetesCluster operations

// CreateKubernetesCluster creates a new Kubernetes cluster
func (s *Server) CreateKubernetesCluster(ctx context.Context, cluster storage.KubernetesCluster) (storage.KubernetesCluster, error) {
	// Generate ID if not provided
	if cluster.ID == "" {
		cluster.ID = generateID()
	}

	// Process the template
	renderedTemplate, err := s.processor.ProcessKubernetesClusterTemplate(cluster)
	if err != nil {
		return storage.KubernetesCluster{}, fmt.Errorf("failed to process template: %w", err)
	}

	// Set the rendered template
	cluster.RenderedTemplate = renderedTemplate

	// Store the Kubernetes cluster
	return s.storage.CreateKubernetesCluster(cluster), nil
}

// GetKubernetesCluster retrieves a Kubernetes cluster by ID
func (s *Server) GetKubernetesCluster(ctx context.Context, id string) (storage.KubernetesCluster, error) {
	return s.storage.GetKubernetesCluster(id)
}

// ListKubernetesClusters retrieves all Kubernetes clusters
func (s *Server) ListKubernetesClusters(ctx context.Context) ([]storage.KubernetesCluster, error) {
	return s.storage.ListKubernetesClusters(), nil
}

// UpdateKubernetesCluster updates an existing Kubernetes cluster
func (s *Server) UpdateKubernetesCluster(ctx context.Context, cluster storage.KubernetesCluster) (storage.KubernetesCluster, error) {
	// Process the template
	renderedTemplate, err := s.processor.ProcessKubernetesClusterTemplate(cluster)
	if err != nil {
		return storage.KubernetesCluster{}, fmt.Errorf("failed to process template: %w", err)
	}

	// Set the rendered template
	cluster.RenderedTemplate = renderedTemplate

	// Update the Kubernetes cluster
	return s.storage.UpdateKubernetesCluster(cluster)
}

// DeleteKubernetesCluster deletes a Kubernetes cluster by ID
func (s *Server) DeleteKubernetesCluster(ctx context.Context, id string) error {
	return s.storage.DeleteKubernetesCluster(id)
}
