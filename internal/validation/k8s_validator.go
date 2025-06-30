package validation

import (
	v1 "github.com/aa1ex/paas-provider/pkg/api/grpc/kubernetes_cluster/v1"
)

// ValidateCreateKubernetesClusterRequest validates a CreateKubernetesClusterRequest
func ValidateCreateKubernetesClusterRequest(req *v1.CreateKubernetesClusterRequest) ValidationErrors {
	var errors ValidationErrors

	if req == nil || req.KubernetesCluster == nil {
		errors.Add("request", "is required")
		return errors
	}

	cluster := req.KubernetesCluster
	ValidateRequired("name", cluster.Name, &errors)
	ValidateRequired("region", cluster.Region, &errors)
	ValidateMinInt("node_count", cluster.NodeCount, 1, &errors)
	ValidateMaxInt("node_count", cluster.NodeCount, 100, &errors)
	ValidateRequired("version", cluster.Version, &errors)
	ValidateRequired("template_id", cluster.TemplateId, &errors)

	return errors
}

// ValidateUpdateKubernetesClusterRequest validates an UpdateKubernetesClusterRequest
func ValidateUpdateKubernetesClusterRequest(req *v1.UpdateKubernetesClusterRequest) ValidationErrors {
	var errors ValidationErrors

	if req == nil || req.KubernetesCluster == nil {
		errors.Add("request", "is required")
		return errors
	}

	cluster := req.KubernetesCluster
	ValidateRequired("id", cluster.Id, &errors)
	ValidateRequired("name", cluster.Name, &errors)
	ValidateRequired("region", cluster.Region, &errors)
	ValidateMinInt("node_count", cluster.NodeCount, 1, &errors)
	ValidateMaxInt("node_count", cluster.NodeCount, 100, &errors)
	ValidateRequired("version", cluster.Version, &errors)
	ValidateRequired("template_id", cluster.TemplateId, &errors)

	return errors
}

// ValidateGetKubernetesClusterRequest validates a GetKubernetesClusterRequest
func ValidateGetKubernetesClusterRequest(req *v1.GetKubernetesClusterRequest) ValidationErrors {
	var errors ValidationErrors

	if req == nil {
		errors.Add("request", "is required")
		return errors
	}

	ValidateRequired("id", req.Id, &errors)

	return errors
}

// ValidateDeleteKubernetesClusterRequest validates a DeleteKubernetesClusterRequest
func ValidateDeleteKubernetesClusterRequest(req *v1.DeleteKubernetesClusterRequest) ValidationErrors {
	var errors ValidationErrors

	if req == nil {
		errors.Add("request", "is required")
		return errors
	}

	ValidateRequired("id", req.Id, &errors)

	return errors
}

// TODO: Implement ValidateGetKubernetesClusterKubeconfigRequest after code generation
// This function should be implemented after running the protobuf compiler to generate
// the Go code from the updated proto file.
//
// Example implementation:
/*
// ValidateGetKubernetesClusterKubeconfigRequest validates a GetKubernetesClusterKubeconfigRequest
func ValidateGetKubernetesClusterKubeconfigRequest(req *v1.GetKubernetesClusterKubeconfigRequest) ValidationErrors {
	var errors ValidationErrors

	if req == nil {
		errors.Add("request", "is required")
		return errors
	}

	ValidateRequired("id", req.Id, &errors)

	return errors
}
*/
