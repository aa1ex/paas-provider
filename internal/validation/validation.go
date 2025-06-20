package validation

import (
	"fmt"
	"strings"
)

// ValidationError represents a validation error
type ValidationError struct {
	Field   string
	Message string
}

// Error returns the error message
func (e ValidationError) Error() string {
	return fmt.Sprintf("%s: %s", e.Field, e.Message)
}

// ValidationErrors represents a collection of validation errors
type ValidationErrors []ValidationError

// Error returns all error messages joined with a semicolon
func (e ValidationErrors) Error() string {
	if len(e) == 0 {
		return ""
	}

	messages := make([]string, len(e))
	for i, err := range e {
		messages[i] = err.Error()
	}

	return strings.Join(messages, "; ")
}

// Add adds a validation error to the collection
func (e *ValidationErrors) Add(field, message string) {
	*e = append(*e, ValidationError{Field: field, Message: message})
}

// HasErrors returns true if there are any validation errors
func (e ValidationErrors) HasErrors() bool {
	return len(e) > 0
}

// ValidateRequired validates that a string field is not empty
func ValidateRequired(field, value string, errors *ValidationErrors) {
	if value == "" {
		errors.Add(field, "is required")
	}
}

// ValidateMinInt validates that an int field is at least min
func ValidateMinInt(field string, value, min int32, errors *ValidationErrors) {
	if value < min {
		errors.Add(field, fmt.Sprintf("must be at least %d", min))
	}
}

// ValidateMaxInt validates that an int field is at most max
func ValidateMaxInt(field string, value, max int32, errors *ValidationErrors) {
	if value > max {
		errors.Add(field, fmt.Sprintf("must be at most %d", max))
	}
}

// ValidateOneOf validates that a string field is one of the allowed values
func ValidateOneOf(field, value string, allowedValues []string, errors *ValidationErrors) {
	for _, allowedValue := range allowedValues {
		if value == allowedValue {
			return
		}
	}
	errors.Add(field, fmt.Sprintf("must be one of: %s", strings.Join(allowedValues, ", ")))
}