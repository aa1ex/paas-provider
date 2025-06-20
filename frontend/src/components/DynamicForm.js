import React, { useState, useEffect, useRef } from 'react';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Button,
  Box,
  Stack,
  Typography,
  FormLabel
} from '@mui/material';

const DynamicForm = ({ fields, onSubmit, buttonText = "Применить", initialValues = {} }) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const prevInitialValuesRef = useRef();

  // Update form data when initialValues change (with deep comparison)
  useEffect(() => {
    // Only update if initialValues has actually changed
    const prevInitialValues = prevInitialValuesRef.current;
    const initialValuesChanged = JSON.stringify(prevInitialValues) !== JSON.stringify(initialValues);

    if (initialValuesChanged) {
      setFormData(initialValues);
      prevInitialValuesRef.current = initialValues;
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = 'Это поле обязательно для заполнения';
        valid = false;
      }
    });

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Box component="form" id="resource-form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
      <Stack spacing={3}>
        {fields.map((field) => {
          const error = !!errors[field.name];
          const helperText = errors[field.name];

          if (field.type === 'select') {
            return (
              <FormControl 
                key={field.name} 
                fullWidth 
                error={error} 
                required={field.required}
                variant="outlined"
              >
                <InputLabel id={`${field.name}-label`}>{field.label}</InputLabel>
                <Select
                  labelId={`${field.name}-label`}
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  label={field.label}
                >
                  <MenuItem value="">
                    <em>Выберите {field.label.toLowerCase()}</em>
                  </MenuItem>
                  {field.options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {error && <FormHelperText>{helperText}</FormHelperText>}
              </FormControl>
            );
          } else if (field.type === 'textarea') {
            return (
              <FormControl key={field.name} fullWidth error={error} required={field.required}>
                <FormLabel 
                  htmlFor={field.name}
                  sx={{ 
                    mb: 1, 
                    fontWeight: 'medium',
                    color: 'text.primary',
                    '&.Mui-focused': {
                      color: 'primary.main',
                    }
                  }}
                >
                  {field.label}
                </FormLabel>
                <TextField
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  multiline
                  rows={field.rows || 5}
                  variant="outlined"
                  error={error}
                  helperText={helperText}
                  fullWidth
                  InputProps={{
                    sx: {
                      fontFamily: '"Roboto Mono", monospace',
                      fontSize: '0.875rem',
                    }
                  }}
                />
              </FormControl>
            );
          } else {
            return (
              <TextField
                key={field.name}
                id={field.name}
                name={field.name}
                label={field.label}
                type={field.type || 'text'}
                value={formData[field.name] || ''}
                onChange={handleChange}
                placeholder={field.placeholder}
                required={field.required}
                error={error}
                helperText={helperText}
                fullWidth
                variant="outlined"
                InputProps={{
                  inputProps: {
                    min: field.min,
                    max: field.max
                  }
                }}
              />
            );
          }
        })}

        <Box sx={{ mt: 2 }}>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            size="large"
            sx={{ minWidth: 120 }}
          >
            {buttonText}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default DynamicForm;
