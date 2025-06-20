package tmplproc

import (
	"bytes"
	"fmt"
	"text/template"

	"github.com/aa1ex/paas-provider/internal/storage"
)

// TemplateProcessor is responsible for processing templates
type TemplateProcessor struct {
	storage *storage.Storage
}

// NewTemplateProcessor creates a new template processor
func NewTemplateProcessor(storage *storage.Storage) *TemplateProcessor {
	return &TemplateProcessor{
		storage: storage,
	}
}

// ProcessVirtualMachineTemplate processes a template for a virtual machine
func (p *TemplateProcessor) ProcessVirtualMachineTemplate(vm storage.VirtualMachine) (string, error) {
	// Get the template
	tmpl, err := p.storage.GetTemplate(vm.TemplateID)
	if err != nil {
		return "", fmt.Errorf("failed to get template: %w", err)
	}

	// Check if the template is for VMs
	if tmpl.Type != "vm" {
		return "", fmt.Errorf("template is not for virtual machines")
	}

	// Create a template data map
	data := map[string]interface{}{
		"Name":   vm.Name,
		"CPU":    vm.CPU,
		"Memory": vm.Memory,
		"OS":     vm.OS,
	}

	// Process the template
	return p.processTemplate(tmpl.RawTemplate, data)
}

// ProcessKubernetesClusterTemplate processes a template for a Kubernetes cluster
func (p *TemplateProcessor) ProcessKubernetesClusterTemplate(cluster storage.KubernetesCluster) (string, error) {
	// Get the template
	tmpl, err := p.storage.GetTemplate(cluster.TemplateID)
	if err != nil {
		return "", fmt.Errorf("failed to get template: %w", err)
	}

	// Check if the template is for Kubernetes clusters
	if tmpl.Type != "kubernetes" {
		return "", fmt.Errorf("template is not for Kubernetes clusters")
	}

	// Create a template data map
	data := map[string]interface{}{
		"Name":      cluster.Name,
		"Region":    cluster.Region,
		"NodeCount": cluster.NodeCount,
		"Version":   cluster.Version,
	}

	// Process the template
	return p.processTemplate(tmpl.RawTemplate, data)
}

// processTemplate processes a template with the given data
func (p *TemplateProcessor) processTemplate(rawTemplate string, data map[string]interface{}) (string, error) {
	// Parse the template
	tmpl, err := template.New("template").Parse(rawTemplate)
	if err != nil {
		return "", fmt.Errorf("failed to parse template: %w", err)
	}

	// Execute the template
	var buf bytes.Buffer
	if err := tmpl.Execute(&buf, data); err != nil {
		return "", fmt.Errorf("failed to execute template: %w", err)
	}

	// Print the result to stdout
	fmt.Println("Rendered template:")
	fmt.Println(buf.String())

	return buf.String(), nil
}
