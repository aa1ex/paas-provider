package k8s

import (
	"connectrpc.com/connect"
	"context"
	"github.com/aa1ex/paas-provider/internal/server/base"
	"github.com/aa1ex/paas-provider/internal/server/util"
	"github.com/aa1ex/paas-provider/internal/storage"
	"github.com/aa1ex/paas-provider/internal/tmplproc"
	"github.com/aa1ex/paas-provider/internal/validation"
	v1 "github.com/aa1ex/paas-provider/pkg/api/grpc/kubernetes_cluster/v1"
	"github.com/aa1ex/paas-provider/pkg/api/grpc/kubernetes_cluster/v1/kubernetes_clusterv1connect"
)

type Service struct {
	*base.Service
	kubernetes_clusterv1connect.UnimplementedKubernetesClusterServiceHandler
}

func NewService(storage *storage.Storage, processor *tmplproc.TemplateProcessor) *Service {
	return &Service{
		Service: base.NewService(storage, processor),
	}
}

// CreateKubernetesCluster creates a new Kubernetes cluster
func (s *Service) CreateKubernetesCluster(_ context.Context, req *connect.Request[v1.CreateKubernetesClusterRequest]) (*connect.Response[v1.CreateKubernetesClusterResponse], error) {
	// Validate the request
	errors := validation.ValidateCreateKubernetesClusterRequest(req.Msg)
	if err := s.HandleValidationErrors(errors); err != nil {
		return nil, err
	}

	// Convert proto cluster to storage cluster
	cluster := base.ConvertProtoK8sToStorage(req.Msg.KubernetesCluster)

	// Generate ID
	cluster.ID = util.GenerateID()

	// Process the template
	renderedTemplate, err := s.Processor.ProcessKubernetesClusterTemplate(cluster)
	if err != nil {
		return nil, s.HandleTemplateProcessorError(err)
	}

	// Set the rendered template
	cluster.RenderedTemplate = renderedTemplate

	// Store the Kubernetes cluster
	createdCluster := s.Storage.CreateKubernetesCluster(cluster)

	// Return the response
	return connect.NewResponse(&v1.CreateKubernetesClusterResponse{
		KubernetesCluster: base.ConvertStorageK8sToProto(createdCluster),
	}), nil
}

// GetKubernetesCluster retrieves a Kubernetes cluster by ID
func (s *Service) GetKubernetesCluster(_ context.Context, req *connect.Request[v1.GetKubernetesClusterRequest]) (*connect.Response[v1.GetKubernetesClusterResponse], error) {
	// Validate the request
	errors := validation.ValidateGetKubernetesClusterRequest(req.Msg)
	if err := s.HandleValidationErrors(errors); err != nil {
		return nil, err
	}

	// Get the Kubernetes cluster from storage
	cluster, err := s.Storage.GetKubernetesCluster(req.Msg.Id)
	if err != nil {
		return nil, s.HandleStorageError(err)
	}

	// Convert storage cluster to proto cluster
	protoCluster := base.ConvertStorageK8sToProto(cluster)

	// Return the response
	return connect.NewResponse(&v1.GetKubernetesClusterResponse{
		KubernetesCluster: protoCluster,
	}), nil
}

// ListKubernetesClusters retrieves all Kubernetes clusters
func (s *Service) ListKubernetesClusters(_ context.Context, _ *connect.Request[v1.ListKubernetesClustersRequest]) (*connect.Response[v1.ListKubernetesClustersResponse], error) {
	// Get all Kubernetes clusters from storage
	clusters := s.Storage.ListKubernetesClusters()

	// Convert storage clusters to proto clusters
	protoClusters := make([]*v1.KubernetesCluster, len(clusters))
	for i, cluster := range clusters {
		protoClusters[i] = base.ConvertStorageK8sToProto(cluster)
	}

	// Return the response
	return connect.NewResponse(&v1.ListKubernetesClustersResponse{
		KubernetesClusters: protoClusters,
	}), nil
}

// UpdateKubernetesCluster updates an existing Kubernetes cluster
func (s *Service) UpdateKubernetesCluster(_ context.Context, req *connect.Request[v1.UpdateKubernetesClusterRequest]) (*connect.Response[v1.UpdateKubernetesClusterResponse], error) {
	// Validate the request
	errors := validation.ValidateUpdateKubernetesClusterRequest(req.Msg)
	if err := s.HandleValidationErrors(errors); err != nil {
		return nil, err
	}

	// Convert proto cluster to storage cluster
	cluster := base.ConvertProtoK8sToStorage(req.Msg.KubernetesCluster)

	// Process the template
	renderedTemplate, err := s.Processor.ProcessKubernetesClusterTemplate(cluster)
	if err != nil {
		return nil, s.HandleTemplateProcessorError(err)
	}

	// Set the rendered template
	cluster.RenderedTemplate = renderedTemplate

	// Update the Kubernetes cluster in storage
	updatedCluster, err := s.Storage.UpdateKubernetesCluster(cluster)
	if err != nil {
		return nil, s.HandleStorageError(err)
	}

	// Convert storage cluster to proto cluster
	protoCluster := base.ConvertStorageK8sToProto(updatedCluster)

	// Return the response
	return connect.NewResponse(&v1.UpdateKubernetesClusterResponse{
		KubernetesCluster: protoCluster,
	}), nil
}

// DeleteKubernetesCluster deletes a Kubernetes cluster by ID
func (s *Service) DeleteKubernetesCluster(_ context.Context, req *connect.Request[v1.DeleteKubernetesClusterRequest]) (*connect.Response[v1.DeleteKubernetesClusterResponse], error) {
	// Validate the request
	errors := validation.ValidateDeleteKubernetesClusterRequest(req.Msg)
	if err := s.HandleValidationErrors(errors); err != nil {
		return nil, err
	}

	// Delete the Kubernetes cluster from storage
	err := s.Storage.DeleteKubernetesCluster(req.Msg.Id)
	if err != nil {
		return nil, s.HandleStorageError(err)
	}

	// Return the response
	return connect.NewResponse(&v1.DeleteKubernetesClusterResponse{
		Success: true,
	}), nil
}

// TODO: Implement GetKubernetesClusterKubeconfig after code generation
// This method should be implemented after running the protobuf compiler to generate
// the Go code from the updated proto file. The implementation should:
// 1. Validate the request using a new validation function
// 2. Retrieve the Kubernetes cluster from storage
// 3. Return the rendered template as the kubeconfig
// Example implementation:
func (s *Service) GetKubernetesClusterKubeconfig(_ context.Context, req *connect.Request[v1.GetKubernetesClusterKubeconfigRequest]) (*connect.Response[v1.GetKubernetesClusterKubeconfigResponse], error) {
	// Validate the request
	//errors := validation.ValidateGetKubernetesClusterKubeconfigRequest(req.Msg)
	//if err := s.HandleValidationErrors(errors); err != nil {
	//	return nil, err
	//}

	// Get the Kubernetes cluster from storage
	cluster, err := s.Storage.GetKubernetesCluster(req.Msg.Id)
	if err != nil {
		return nil, s.HandleStorageError(err)
	}

	// Return the rendered template as the kubeconfig
	// Note: This assumes that the rendered template is the kubeconfig or contains it
	return connect.NewResponse(&v1.GetKubernetesClusterKubeconfigResponse{
		Kubeconfig: cluster.RenderedTemplate,
	}), nil
}
