import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import DynamicForm from './DynamicForm';

const ResourceForm = ({ 
  resource, 
  fields, 
  onSubmit, 
  onCancel, 
  title, 
  submitButtonText = "Сохранить" 
}) => {
  const [initialValues, setInitialValues] = useState({});

  useEffect(() => {
    if (resource) {
      // Extract initial values from resource
      const values = {};
      fields.forEach(field => {
        if (resource[field.name] !== undefined) {
          values[field.name] = resource[field.name];
        }
      });
      setInitialValues(values);
    }
  }, [resource, fields]);

  const handleSubmit = (formData) => {
    // If editing an existing resource, preserve the ID
    if (resource && resource.id) {
      formData.id = resource.id;
    }

    // If the resource has a templateId, preserve it
    if (resource && resource.templateId) {
      formData.templateId = resource.templateId;
    }

    onSubmit(formData);
  };

  return (
    <Dialog
      open={true}
      onClose={onCancel}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          backgroundColor: 'background.default'
        }}
      >
        <Typography variant="h6" component="div">
          {title || (resource ? 'Редактирование ресурса' : 'Создание ресурса')}
        </Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onCancel}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <DynamicForm 
          fields={fields} 
          onSubmit={handleSubmit} 
          buttonText={submitButtonText}
          initialValues={initialValues}
        />
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Button onClick={onCancel} variant="outlined" color="inherit">
          Отмена
        </Button>
        <Button 
          type="submit" 
          variant="contained" 
          color="primary"
          form="resource-form" // Connect to the form in DynamicForm
          sx={{ minWidth: 120 }}
        >
          {submitButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResourceForm;
