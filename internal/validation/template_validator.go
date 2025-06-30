package validation

import (
	v1 "github.com/aa1ex/paas-provider/pkg/api/grpc/template/v1"
)

// ValidateCreateTemplateRequest validates a CreateTemplateRequest
func ValidateCreateTemplateRequest(req *v1.CreateTemplateRequest) Errors {
	var errors Errors

	if req == nil || req.Template == nil {
		errors.Add("request", "is required")
		return errors
	}

	template := req.Template
	ValidateRequired("name", template.Name, &errors)
	ValidateRequired("raw_template", template.RawTemplate, &errors)

	// Validate template type
	if template.Type == v1.Template_TYPE_UNSPECIFIED {
		errors.Add("type", "must be specified")
	}

	return errors
}

// ValidateUpdateTemplateRequest validates an UpdateTemplateRequest
func ValidateUpdateTemplateRequest(req *v1.UpdateTemplateRequest) Errors {
	var errors Errors

	if req == nil || req.Template == nil {
		errors.Add("request", "is required")
		return errors
	}

	template := req.Template
	ValidateRequired("id", template.Id, &errors)
	ValidateRequired("name", template.Name, &errors)
	ValidateRequired("raw_template", template.RawTemplate, &errors)

	// Validate template type
	if template.Type == v1.Template_TYPE_UNSPECIFIED {
		errors.Add("type", "must be specified")
	}

	return errors
}

// ValidateGetTemplateRequest validates a GetTemplateRequest
func ValidateGetTemplateRequest(req *v1.GetTemplateRequest) Errors {
	var errors Errors

	if req == nil {
		errors.Add("request", "is required")
		return errors
	}

	ValidateRequired("id", req.Id, &errors)

	return errors
}

// ValidateListTemplatesRequest validates a ListTemplatesRequest
func ValidateListTemplatesRequest(req *v1.ListTemplatesRequest) Errors {
	var errors Errors

	if req == nil {
		errors.Add("request", "is required")
		return errors
	}

	// No specific validation for ListTemplatesRequest as the type field is optional

	return errors
}

// ValidateDeleteTemplateRequest validates a DeleteTemplateRequest
func ValidateDeleteTemplateRequest(req *v1.DeleteTemplateRequest) Errors {
	var errors Errors

	if req == nil {
		errors.Add("request", "is required")
		return errors
	}

	ValidateRequired("id", req.Id, &errors)

	return errors
}
