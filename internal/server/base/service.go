package base

import (
	"connectrpc.com/connect"
	"fmt"
	"github.com/paas-provider/internal/storage"
	"github.com/paas-provider/internal/tmplproc"
	"github.com/paas-provider/internal/validation"
)

// Service is a base service that provides common functionality
type Service struct {
	Storage   *storage.Storage
	Processor *tmplproc.TemplateProcessor
}

// NewService creates a new base service
func NewService(storage *storage.Storage, processor *tmplproc.TemplateProcessor) *Service {
	return &Service{
		Storage:   storage,
		Processor: processor,
	}
}

// HandleValidationErrors converts validation errors to a connect error
func (s *Service) HandleValidationErrors(errors validation.ValidationErrors) error {
	if errors.HasErrors() {
		return connect.NewError(connect.CodeInvalidArgument, fmt.Errorf("validation failed: %s", errors.Error()))
	}
	return nil
}

// HandleStorageError converts a storage error to a connect error
func (s *Service) HandleStorageError(err error) error {
	if err == storage.ErrNotFound {
		return connect.NewError(connect.CodeNotFound, err)
	}
	return connect.NewError(connect.CodeInternal, fmt.Errorf("storage error: %w", err))
}

// HandleTemplateProcessorError converts a template processor error to a connect error
func (s *Service) HandleTemplateProcessorError(err error) error {
	return connect.NewError(connect.CodeInternal, fmt.Errorf("template processing error: %w", err))
}