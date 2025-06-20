package base

import (
	"github.com/paas-provider/internal/storage"
	k8sv1 "github.com/paas-provider/pkg/api/grpc/kubernetes_cluster/v1"
	templatev1 "github.com/paas-provider/pkg/api/grpc/template/v1"
	vmv1 "github.com/paas-provider/pkg/api/grpc/virtual_machine/v1"
)

// ConvertStorageTemplateToProto converts a storage.Template to a templatev1.Template
func ConvertStorageTemplateToProto(template storage.Template) *templatev1.Template {
	protoTemplate := &templatev1.Template{
		Id:          template.ID,
		Name:        template.Name,
		RawTemplate: template.RawTemplate,
	}

	// Set the template type
	switch template.Type {
	case "vm":
		protoTemplate.Type = templatev1.Template_TYPE_VM
	case "kubernetes":
		protoTemplate.Type = templatev1.Template_TYPE_KUBERNETES
	}

	return protoTemplate
}

// ConvertProtoTemplateToStorage converts a templatev1.Template to a storage.Template
func ConvertProtoTemplateToStorage(template *templatev1.Template) storage.Template {
	storageTemplate := storage.Template{
		ID:          template.Id,
		Name:        template.Name,
		RawTemplate: template.RawTemplate,
	}

	// Set the template type
	switch template.Type {
	case templatev1.Template_TYPE_VM:
		storageTemplate.Type = "vm"
	case templatev1.Template_TYPE_KUBERNETES:
		storageTemplate.Type = "kubernetes"
	}

	return storageTemplate
}

// ConvertStorageVMToProto converts a storage.VirtualMachine to a vmv1.VirtualMachine
func ConvertStorageVMToProto(vm storage.VirtualMachine) *vmv1.VirtualMachine {
	return &vmv1.VirtualMachine{
		Id:               vm.ID,
		Name:             vm.Name,
		Cpu:              vm.CPU,
		Memory:           vm.Memory,
		Os:               vm.OS,
		TemplateId:       vm.TemplateID,
		RenderedTemplate: vm.RenderedTemplate,
	}
}

// ConvertProtoVMToStorage converts a vmv1.VirtualMachine to a storage.VirtualMachine
func ConvertProtoVMToStorage(vm *vmv1.VirtualMachine) storage.VirtualMachine {
	return storage.VirtualMachine{
		ID:               vm.Id,
		Name:             vm.Name,
		CPU:              vm.Cpu,
		Memory:           vm.Memory,
		OS:               vm.Os,
		TemplateID:       vm.TemplateId,
		RenderedTemplate: vm.RenderedTemplate,
	}
}

// ConvertStorageK8sToProto converts a storage.KubernetesCluster to a k8sv1.KubernetesCluster
func ConvertStorageK8sToProto(cluster storage.KubernetesCluster) *k8sv1.KubernetesCluster {
	return &k8sv1.KubernetesCluster{
		Id:               cluster.ID,
		Name:             cluster.Name,
		Region:           cluster.Region,
		NodeCount:        cluster.NodeCount,
		Version:          cluster.Version,
		TemplateId:       cluster.TemplateID,
		RenderedTemplate: cluster.RenderedTemplate,
	}
}

// ConvertProtoK8sToStorage converts a k8sv1.KubernetesCluster to a storage.KubernetesCluster
func ConvertProtoK8sToStorage(cluster *k8sv1.KubernetesCluster) storage.KubernetesCluster {
	return storage.KubernetesCluster{
		ID:               cluster.Id,
		Name:             cluster.Name,
		Region:           cluster.Region,
		NodeCount:        cluster.NodeCount,
		Version:          cluster.Version,
		TemplateID:       cluster.TemplateId,
		RenderedTemplate: cluster.RenderedTemplate,
	}
}