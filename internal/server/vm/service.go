package vm

import (
	"connectrpc.com/connect"
	"context"
	"fmt"
	"github.com/paas-provider/internal/server/util"
	"github.com/paas-provider/internal/storage"
	"github.com/paas-provider/internal/tmplproc"
	v1 "github.com/paas-provider/pkg/api/grpc/virtual_machine/v1"
	"github.com/paas-provider/pkg/api/grpc/virtual_machine/v1/virtual_machinev1connect"
)

type Service struct {
	storage   *storage.Storage
	processor *tmplproc.TemplateProcessor
	virtual_machinev1connect.UnimplementedVirtualMachineServiceHandler
}

func NewService(storage *storage.Storage, processor *tmplproc.TemplateProcessor) *Service {
	return &Service{
		storage:   storage,
		processor: processor,
	}
}

// CreateVirtualMachine creates a new virtual machine
func (s *Service) CreateVirtualMachine(_ context.Context, req *connect.Request[v1.CreateVirtualMachineRequest]) (*connect.Response[v1.CreateVirtualMachineResponse], error) {
	if req.Msg == nil || req.Msg.VirtualMachine == nil {
		return nil, fmt.Errorf("invalid request")
	}

	vm := storage.VirtualMachine{
		ID:         util.GenerateID(),
		Name:       req.Msg.VirtualMachine.Name,
		CPU:        req.Msg.VirtualMachine.Cpu,
		Memory:     req.Msg.VirtualMachine.Memory,
		OS:         req.Msg.VirtualMachine.Os,
		TemplateID: req.Msg.VirtualMachine.TemplateId,
	}

	// Process the template
	renderedTemplate, err := s.processor.ProcessVirtualMachineTemplate(vm)
	if err != nil {
		return nil, fmt.Errorf("failed to process template: %w", err)
	}

	// Set the rendered template
	vm.RenderedTemplate = renderedTemplate

	_ = s.storage.CreateVirtualMachine(vm)

	return connect.NewResponse(&v1.CreateVirtualMachineResponse{VirtualMachine: &v1.VirtualMachine{
		Id:               vm.ID,
		Name:             vm.Name,
		Cpu:              vm.CPU,
		Memory:           vm.Memory,
		Os:               vm.OS,
		TemplateId:       vm.TemplateID,
		RenderedTemplate: vm.RenderedTemplate,
	}}), nil
}
