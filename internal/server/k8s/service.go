package k8s

import (
	"connectrpc.com/connect"
	"context"
	"fmt"
	"github.com/paas-provider/internal/server/util"
	"github.com/paas-provider/internal/storage"
	"github.com/paas-provider/internal/tmplproc"
	v1 "github.com/paas-provider/pkg/api/grpc/kubernetes_cluster/v1"
	"github.com/paas-provider/pkg/api/grpc/kubernetes_cluster/v1/kubernetes_clusterv1connect"
)

type Service struct {
	storage   *storage.Storage
	processor *tmplproc.TemplateProcessor
	kubernetes_clusterv1connect.UnimplementedKubernetesClusterServiceHandler
}

func NewService(storage *storage.Storage, processor *tmplproc.TemplateProcessor) *Service {
	return &Service{
		storage:   storage,
		processor: processor,
	}
}

func (s *Service) CreateKubernetesCluster(_ context.Context, req *connect.Request[v1.CreateKubernetesClusterRequest]) (*connect.Response[v1.CreateKubernetesClusterResponse], error) {
	if req.Msg == nil || req.Msg.KubernetesCluster == nil {
		return nil, fmt.Errorf("invalid request")
	}

	kc := storage.KubernetesCluster{
		ID:         util.GenerateID(),
		Name:       req.Msg.KubernetesCluster.Name,
		Region:     req.Msg.KubernetesCluster.Region,
		NodeCount:  req.Msg.KubernetesCluster.NodeCount,
		Version:    req.Msg.KubernetesCluster.Version,
		TemplateID: req.Msg.KubernetesCluster.TemplateId,
	}

	// Process the template
	renderedTemplate, err := s.processor.ProcessKubernetesClusterTemplate(kc)
	if err != nil {
		return nil, fmt.Errorf("failed to process template: %w", err)
	}

	// Set the rendered template
	kc.RenderedTemplate = renderedTemplate

	_ = s.storage.CreateKubernetesCluster(kc)

	return connect.NewResponse(&v1.CreateKubernetesClusterResponse{KubernetesCluster: &v1.KubernetesCluster{
		Id:               kc.ID,
		Name:             kc.Name,
		Region:           kc.Region,
		NodeCount:        kc.NodeCount,
		Version:          kc.Version,
		TemplateId:       kc.TemplateID,
		RenderedTemplate: kc.RenderedTemplate,
	}}), nil
}
