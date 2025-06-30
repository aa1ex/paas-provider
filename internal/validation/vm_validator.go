package validation

import (
	v1 "github.com/aa1ex/paas-provider/pkg/api/grpc/virtual_machine/v1"
)

// ValidateCreateVirtualMachineRequest validates a CreateVirtualMachineRequest
func ValidateCreateVirtualMachineRequest(req *v1.CreateVirtualMachineRequest) Errors {
	var errors Errors

	if req == nil || req.VirtualMachine == nil {
		errors.Add("request", "is required")
		return errors
	}

	vm := req.VirtualMachine
	ValidateRequired("name", vm.Name, &errors)
	ValidateMinInt("cpu", vm.Cpu, 1, &errors)
	ValidateMaxInt("cpu", vm.Cpu, 32, &errors)
	ValidateMinInt("memory", vm.Memory, 512, &errors)
	ValidateMaxInt("memory", vm.Memory, 65536, &errors)
	ValidateRequired("os", vm.Os, &errors)
	ValidateRequired("template_id", vm.TemplateId, &errors)

	return errors
}

// ValidateUpdateVirtualMachineRequest validates an UpdateVirtualMachineRequest
func ValidateUpdateVirtualMachineRequest(req *v1.UpdateVirtualMachineRequest) Errors {
	var errors Errors

	if req == nil || req.VirtualMachine == nil {
		errors.Add("request", "is required")
		return errors
	}

	vm := req.VirtualMachine
	ValidateRequired("id", vm.Id, &errors)
	ValidateRequired("name", vm.Name, &errors)
	ValidateMinInt("cpu", vm.Cpu, 1, &errors)
	ValidateMaxInt("cpu", vm.Cpu, 32, &errors)
	ValidateMinInt("memory", vm.Memory, 512, &errors)
	ValidateMaxInt("memory", vm.Memory, 65536, &errors)
	ValidateRequired("os", vm.Os, &errors)
	ValidateRequired("template_id", vm.TemplateId, &errors)

	return errors
}

// ValidateGetVirtualMachineRequest validates a GetVirtualMachineRequest
func ValidateGetVirtualMachineRequest(req *v1.GetVirtualMachineRequest) Errors {
	var errors Errors

	if req == nil {
		errors.Add("request", "is required")
		return errors
	}

	ValidateRequired("id", req.Id, &errors)

	return errors
}

// ValidateDeleteVirtualMachineRequest validates a DeleteVirtualMachineRequest
func ValidateDeleteVirtualMachineRequest(req *v1.DeleteVirtualMachineRequest) Errors {
	var errors Errors

	if req == nil {
		errors.Add("request", "is required")
		return errors
	}

	ValidateRequired("id", req.Id, &errors)

	return errors
}
