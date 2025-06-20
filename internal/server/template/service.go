package template

import (
	"connectrpc.com/connect"
	"context"
	"github.com/aa1ex/paas-provider/internal/server/base"
	"github.com/aa1ex/paas-provider/internal/server/util"
	"github.com/aa1ex/paas-provider/internal/storage"
	"github.com/aa1ex/paas-provider/internal/tmplproc"
	"github.com/aa1ex/paas-provider/internal/validation"
	v1 "github.com/aa1ex/paas-provider/pkg/api/grpc/template/v1"
	"github.com/aa1ex/paas-provider/pkg/api/grpc/template/v1/templatev1connect"
)

type Service struct {
	*base.Service
	templatev1connect.UnimplementedTemplateServiceHandler
}

func NewService(storage *storage.Storage, processor *tmplproc.TemplateProcessor) *Service {
	return &Service{
		Service: base.NewService(storage, processor),
	}
}

func (s *Service) CreateTemplate(_ context.Context, req *connect.Request[v1.CreateTemplateRequest]) (*connect.Response[v1.CreateTemplateResponse], error) {
	// Validate the request
	errors := validation.ValidateCreateTemplateRequest(req.Msg)
	if err := s.HandleValidationErrors(errors); err != nil {
		return nil, err
	}

	// Convert proto template to storage template
	template := base.ConvertProtoTemplateToStorage(req.Msg.Template)

	// Generate ID
	template.ID = util.GenerateID()

	// Store the template
	createdTemplate := s.Storage.CreateTemplate(template)

	// Return the response
	return connect.NewResponse(&v1.CreateTemplateResponse{
		Id: createdTemplate.ID,
	}), nil
}

func (s *Service) GetTemplate(_ context.Context, req *connect.Request[v1.GetTemplateRequest]) (*connect.Response[v1.GetTemplateResponse], error) {
	// Validate the request
	errors := validation.ValidateGetTemplateRequest(req.Msg)
	if err := s.HandleValidationErrors(errors); err != nil {
		return nil, err
	}

	// Get the template from storage
	template, err := s.Storage.GetTemplate(req.Msg.Id)
	if err != nil {
		return nil, s.HandleStorageError(err)
	}

	// Convert storage template to proto template
	protoTemplate := base.ConvertStorageTemplateToProto(template)

	// Return the response
	return connect.NewResponse(&v1.GetTemplateResponse{
		Template: protoTemplate,
	}), nil
}

func (s *Service) ListTemplates(_ context.Context, req *connect.Request[v1.ListTemplatesRequest]) (*connect.Response[v1.ListTemplatesResponse], error) {
	// Validate the request
	errors := validation.ValidateListTemplatesRequest(req.Msg)
	if err := s.HandleValidationErrors(errors); err != nil {
		return nil, err
	}

	// Convert proto type to storage type
	var templateType string
	switch req.Msg.Type {
	case v1.Template_TYPE_VM:
		templateType = "vm"
	case v1.Template_TYPE_KUBERNETES:
		templateType = "kubernetes"
	}

	// Get templates from storage
	templates := s.Storage.ListTemplates(templateType)

	// Convert storage templates to proto templates
	protoTemplates := make([]*v1.Template, len(templates))
	for i, template := range templates {
		protoTemplates[i] = base.ConvertStorageTemplateToProto(template)
	}

	// Return the response
	return connect.NewResponse(&v1.ListTemplatesResponse{
		Templates: protoTemplates,
	}), nil
}

func (s *Service) UpdateTemplate(_ context.Context, req *connect.Request[v1.UpdateTemplateRequest]) (*connect.Response[v1.UpdateTemplateResponse], error) {
	// Validate the request
	errors := validation.ValidateUpdateTemplateRequest(req.Msg)
	if err := s.HandleValidationErrors(errors); err != nil {
		return nil, err
	}

	// Convert proto template to storage template
	template := base.ConvertProtoTemplateToStorage(req.Msg.Template)

	// Update the template in storage
	updatedTemplate, err := s.Storage.UpdateTemplate(template)
	if err != nil {
		return nil, s.HandleStorageError(err)
	}

	// Convert storage template to proto template
	protoTemplate := base.ConvertStorageTemplateToProto(updatedTemplate)

	// Return the response
	return connect.NewResponse(&v1.UpdateTemplateResponse{
		Template: protoTemplate,
	}), nil
}

func (s *Service) DeleteTemplate(_ context.Context, req *connect.Request[v1.DeleteTemplateRequest]) (*connect.Response[v1.DeleteTemplateResponse], error) {
	// Validate the request
	errors := validation.ValidateDeleteTemplateRequest(req.Msg)
	if err := s.HandleValidationErrors(errors); err != nil {
		return nil, err
	}

	// Delete the template from storage
	err := s.Storage.DeleteTemplate(req.Msg.Id)
	if err != nil {
		return nil, s.HandleStorageError(err)
	}

	// Return the response
	return connect.NewResponse(&v1.DeleteTemplateResponse{
		Success: true,
	}), nil
}
