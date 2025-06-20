package storage

import (
	"errors"
	"sync"
)

var (
	ErrNotFound = errors.New("entity not found")
)

// Template represents a configuration template
type Template struct {
	ID          string
	Name        string
	Type        string // "vm" or "kubernetes"
	RawTemplate string
}

// VirtualMachine represents a VM configuration
type VirtualMachine struct {
	ID               string
	Name             string
	CPU              int32
	Memory           int32
	OS               string
	TemplateID       string
	RenderedTemplate string
}

// KubernetesCluster represents a Kubernetes cluster configuration
type KubernetesCluster struct {
	ID               string
	Name             string
	Region           string
	NodeCount        int32
	Version          string
	TemplateID       string
	RenderedTemplate string
}

// Storage is an in-memory storage for our entities
type Storage struct {
	templates          map[string]Template
	virtualMachines    map[string]VirtualMachine
	kubernetesClusters map[string]KubernetesCluster
	mu                 sync.RWMutex
}

// NewStorage creates a new in-memory storage
func NewStorage() *Storage {
	return &Storage{
		templates:          make(map[string]Template),
		virtualMachines:    make(map[string]VirtualMachine),
		kubernetesClusters: make(map[string]KubernetesCluster),
	}
}

// Template operations

// CreateTemplate creates a new template
func (s *Storage) CreateTemplate(template Template) Template {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.templates[template.ID] = template
	return template
}

// GetTemplate retrieves a template by ID
func (s *Storage) GetTemplate(id string) (Template, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	template, ok := s.templates[id]
	if !ok {
		return Template{}, ErrNotFound
	}
	return template, nil
}

// ListTemplates retrieves all templates
func (s *Storage) ListTemplates(templateType string) []Template {
	s.mu.RLock()
	defer s.mu.RUnlock()
	var templates []Template
	for _, template := range s.templates {
		if templateType == "" || template.Type == templateType {
			templates = append(templates, template)
		}
	}
	return templates
}

// UpdateTemplate updates an existing template
func (s *Storage) UpdateTemplate(template Template) (Template, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	if _, ok := s.templates[template.ID]; !ok {
		return Template{}, ErrNotFound
	}
	s.templates[template.ID] = template
	return template, nil
}

// DeleteTemplate deletes a template by ID
func (s *Storage) DeleteTemplate(id string) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	if _, ok := s.templates[id]; !ok {
		return ErrNotFound
	}
	delete(s.templates, id)
	return nil
}

// VirtualMachine operations

// CreateVirtualMachine creates a new virtual machine
func (s *Storage) CreateVirtualMachine(vm VirtualMachine) VirtualMachine {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.virtualMachines[vm.ID] = vm
	return vm
}

// GetVirtualMachine retrieves a virtual machine by ID
func (s *Storage) GetVirtualMachine(id string) (VirtualMachine, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	vm, ok := s.virtualMachines[id]
	if !ok {
		return VirtualMachine{}, ErrNotFound
	}
	return vm, nil
}

// ListVirtualMachines retrieves all virtual machines
func (s *Storage) ListVirtualMachines() []VirtualMachine {
	s.mu.RLock()
	defer s.mu.RUnlock()
	var vms []VirtualMachine
	for _, vm := range s.virtualMachines {
		vms = append(vms, vm)
	}
	return vms
}

// UpdateVirtualMachine updates an existing virtual machine
func (s *Storage) UpdateVirtualMachine(vm VirtualMachine) (VirtualMachine, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	if _, ok := s.virtualMachines[vm.ID]; !ok {
		return VirtualMachine{}, ErrNotFound
	}
	s.virtualMachines[vm.ID] = vm
	return vm, nil
}

// DeleteVirtualMachine deletes a virtual machine by ID
func (s *Storage) DeleteVirtualMachine(id string) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	if _, ok := s.virtualMachines[id]; !ok {
		return ErrNotFound
	}
	delete(s.virtualMachines, id)
	return nil
}

// KubernetesCluster operations

// CreateKubernetesCluster creates a new Kubernetes cluster
func (s *Storage) CreateKubernetesCluster(cluster KubernetesCluster) KubernetesCluster {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.kubernetesClusters[cluster.ID] = cluster
	return cluster
}

// GetKubernetesCluster retrieves a Kubernetes cluster by ID
func (s *Storage) GetKubernetesCluster(id string) (KubernetesCluster, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	cluster, ok := s.kubernetesClusters[id]
	if !ok {
		return KubernetesCluster{}, ErrNotFound
	}
	return cluster, nil
}

// ListKubernetesClusters retrieves all Kubernetes clusters
func (s *Storage) ListKubernetesClusters() []KubernetesCluster {
	s.mu.RLock()
	defer s.mu.RUnlock()
	var clusters []KubernetesCluster
	for _, cluster := range s.kubernetesClusters {
		clusters = append(clusters, cluster)
	}
	return clusters
}

// UpdateKubernetesCluster updates an existing Kubernetes cluster
func (s *Storage) UpdateKubernetesCluster(cluster KubernetesCluster) (KubernetesCluster, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	if _, ok := s.kubernetesClusters[cluster.ID]; !ok {
		return KubernetesCluster{}, ErrNotFound
	}
	s.kubernetesClusters[cluster.ID] = cluster
	return cluster, nil
}

// DeleteKubernetesCluster deletes a Kubernetes cluster by ID
func (s *Storage) DeleteKubernetesCluster(id string) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	if _, ok := s.kubernetesClusters[id]; !ok {
		return ErrNotFound
	}
	delete(s.kubernetesClusters, id)
	return nil
}