package template

import (
	"connectrpc.com/connect"
	"context"
	"github.com/paas-provider/internal/server/util"
	"github.com/paas-provider/internal/storage"
	"github.com/paas-provider/internal/tmplproc"
	v1 "github.com/paas-provider/pkg/api/grpc/template/v1"
	"github.com/paas-provider/pkg/api/grpc/template/v1/templatev1connect"
)

type Service struct {
	storage   *storage.Storage
	processor *tmplproc.TemplateProcessor
	templatev1connect.UnimplementedTemplateServiceHandler
}

func NewService(storage *storage.Storage, processor *tmplproc.TemplateProcessor) *Service {
	return &Service{
		storage:   storage,
		processor: processor,
	}
}

func (s *Service) CreateTemplate(_ context.Context, req *connect.Request[v1.CreateTemplateRequest]) (*connect.Response[v1.CreateTemplateResponse], error) {
	template := storage.Template{
		ID:          util.GenerateID(),
		Name:        req.Msg.Template.Name,
		RawTemplate: req.Msg.Template.RawTemplate,
	}
	switch req.Msg.Template.Type {
	case v1.Template_TYPE_KUBERNETES:
		template.Type = "kubernetes"
	case v1.Template_TYPE_VM:
		template.Type = "vm"
	}

	// Store the template
	_ = s.storage.CreateTemplate(template)
	return connect.NewResponse(&v1.CreateTemplateResponse{Id: template.ID}), nil
}

func (s *Service) ListTemplates(_ context.Context, req *connect.Request[v1.ListTemplatesRequest]) (*connect.Response[v1.ListTemplatesResponse], error) {
	var tType string
	switch req.Msg.Type {
	case v1.Template_TYPE_VM:
		tType = "vm"
	case v1.Template_TYPE_KUBERNETES:
		tType = "kubernetes"
	}

	list := s.storage.ListTemplates(tType)
	result := make([]*v1.Template, len(list))
	for i, tmpl := range list {
		result[i] = &v1.Template{
			Id:          tmpl.ID,
			Name:        tmpl.Name,
			RawTemplate: tmpl.RawTemplate,
		}
		switch tmpl.Type {
		case "vm":
			result[i].Type = v1.Template_TYPE_VM
		case "kubernetes":
			result[i].Type = v1.Template_TYPE_KUBERNETES
		}
	}
	return connect.NewResponse(&v1.ListTemplatesResponse{Templates: result}), nil
}
