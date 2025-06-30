package validation

import (
	"fmt"
	"strings"
)

// Error represents a validation error
type Error struct {
	Field   string
	Message string
}

// Error returns the error message
func (e Error) Error() string {
	return fmt.Sprintf("%s: %s", e.Field, e.Message)
}

// Errors represents a collection of validation errors
type Errors []Error

// Error returns all error messages joined with a semicolon
func (e Errors) Error() string {
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
func (e *Errors) Add(field, message string) {
	*e = append(*e, Error{Field: field, Message: message})
}

// HasErrors returns true if there are any validation errors
func (e Errors) HasErrors() bool {
	return len(e) > 0
}

// ValidateRequired validates that a string field is not empty
func ValidateRequired(field, value string, errors *Errors) {
	if value == "" {
		errors.Add(field, "is required")
	}
}

// ValidateMinInt validates that an int field is at least min
func ValidateMinInt(field string, value, minV int32, errors *Errors) {
	if value < minV {
		errors.Add(field, fmt.Sprintf("must be at least %d", minV))
	}
}

// ValidateMaxInt validates that an int field is at most max
func ValidateMaxInt(field string, value, maxV int32, errors *Errors) {
	if value > maxV {
		errors.Add(field, fmt.Sprintf("must be at most %d", maxV))
	}
}

// ValidateOneOf validates that a string field is one of the allowed values
func ValidateOneOf(field, value string, allowedValues []string, errors *Errors) {
	for _, allowedValue := range allowedValues {
		if value == allowedValue {
			return
		}
	}
	errors.Add(field, fmt.Sprintf("must be one of: %s", strings.Join(allowedValues, ", ")))
}
