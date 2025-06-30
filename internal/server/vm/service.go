package vm

import (
	"context"

	"connectrpc.com/connect"

	"github.com/aa1ex/paas-provider/internal/server/base"
	"github.com/aa1ex/paas-provider/internal/server/util"
	"github.com/aa1ex/paas-provider/internal/storage"
	"github.com/aa1ex/paas-provider/internal/tmplproc"
	"github.com/aa1ex/paas-provider/internal/validation"
	v1 "github.com/aa1ex/paas-provider/pkg/api/grpc/virtual_machine/v1"
	"github.com/aa1ex/paas-provider/pkg/api/grpc/virtual_machine/v1/virtual_machinev1connect"
)

type Service struct {
	*base.Service
	virtual_machinev1connect.UnimplementedVirtualMachineServiceHandler
}

func NewService(storage *storage.Storage, processor *tmplproc.TemplateProcessor) *Service {
	return &Service{
		Service: base.NewService(storage, processor),
	}
}

// CreateVirtualMachine creates a new virtual machine
func (s *Service) CreateVirtualMachine(_ context.Context, req *connect.Request[v1.CreateVirtualMachineRequest]) (*connect.Response[v1.CreateVirtualMachineResponse], error) {
	// Validate the request
	errors := validation.ValidateCreateVirtualMachineRequest(req.Msg)
	if err := s.HandleValidationErrors(errors); err != nil {
		return nil, err
	}

	// Convert proto VM to storage VM
	vm := base.ConvertProtoVMToStorage(req.Msg.VirtualMachine)

	// Generate ID
	vm.ID = util.GenerateID()

	// Process the template
	renderedTemplate, err := s.Processor.ProcessVirtualMachineTemplate(vm)
	if err != nil {
		return nil, s.HandleTemplateProcessorError(err)
	}

	// Set the rendered template
	vm.RenderedTemplate = renderedTemplate

	// Store the virtual machine
	createdVM := s.Storage.CreateVirtualMachine(vm)

	// Return the response
	return connect.NewResponse(&v1.CreateVirtualMachineResponse{
		VirtualMachine: base.ConvertStorageVMToProto(createdVM),
	}), nil
}

// GetVirtualMachine retrieves a virtual machine by ID
func (s *Service) GetVirtualMachine(_ context.Context, req *connect.Request[v1.GetVirtualMachineRequest]) (*connect.Response[v1.GetVirtualMachineResponse], error) {
	// Validate the request
	errors := validation.ValidateGetVirtualMachineRequest(req.Msg)
	if err := s.HandleValidationErrors(errors); err != nil {
		return nil, err
	}

	// Get the virtual machine from storage
	vm, err := s.Storage.GetVirtualMachine(req.Msg.Id)
	if err != nil {
		return nil, s.HandleStorageError(err)
	}

	// Convert storage VM to proto VM
	protoVM := base.ConvertStorageVMToProto(vm)

	// Return the response
	return connect.NewResponse(&v1.GetVirtualMachineResponse{
		VirtualMachine: protoVM,
	}), nil
}

// ListVirtualMachines retrieves all virtual machines
func (s *Service) ListVirtualMachines(_ context.Context, _ *connect.Request[v1.ListVirtualMachinesRequest]) (*connect.Response[v1.ListVirtualMachinesResponse], error) {
	// Get all virtual machines from storage
	vms := s.Storage.ListVirtualMachines()

	// Convert storage VMs to proto VMs
	protoVMs := make([]*v1.VirtualMachine, len(vms))
	for i, vm := range vms {
		protoVMs[i] = base.ConvertStorageVMToProto(vm)
	}

	// Return the response
	return connect.NewResponse(&v1.ListVirtualMachinesResponse{
		VirtualMachines: protoVMs,
	}), nil
}

// UpdateVirtualMachine updates an existing virtual machine
func (s *Service) UpdateVirtualMachine(_ context.Context, req *connect.Request[v1.UpdateVirtualMachineRequest]) (*connect.Response[v1.UpdateVirtualMachineResponse], error) {
	// Validate the request
	errors := validation.ValidateUpdateVirtualMachineRequest(req.Msg)
	if err := s.HandleValidationErrors(errors); err != nil {
		return nil, err
	}

	// Convert proto VM to storage VM
	vm := base.ConvertProtoVMToStorage(req.Msg.VirtualMachine)

	// Process the template
	renderedTemplate, err := s.Processor.ProcessVirtualMachineTemplate(vm)
	if err != nil {
		return nil, s.HandleTemplateProcessorError(err)
	}

	// Set the rendered template
	vm.RenderedTemplate = renderedTemplate

	// Update the virtual machine in storage
	updatedVM, err := s.Storage.UpdateVirtualMachine(vm)
	if err != nil {
		return nil, s.HandleStorageError(err)
	}

	// Convert storage VM to proto VM
	protoVM := base.ConvertStorageVMToProto(updatedVM)

	// Return the response
	return connect.NewResponse(&v1.UpdateVirtualMachineResponse{
		VirtualMachine: protoVM,
	}), nil
}

// DeleteVirtualMachine deletes a virtual machine by ID
func (s *Service) DeleteVirtualMachine(_ context.Context, req *connect.Request[v1.DeleteVirtualMachineRequest]) (*connect.Response[v1.DeleteVirtualMachineResponse], error) {
	// Validate the request
	errors := validation.ValidateDeleteVirtualMachineRequest(req.Msg)
	if err := s.HandleValidationErrors(errors); err != nil {
		return nil, err
	}

	// Delete the virtual machine from storage
	err := s.Storage.DeleteVirtualMachine(req.Msg.Id)
	if err != nil {
		return nil, s.HandleStorageError(err)
	}

	// Return the response
	return connect.NewResponse(&v1.DeleteVirtualMachineResponse{
		Success: true,
	}), nil
}
