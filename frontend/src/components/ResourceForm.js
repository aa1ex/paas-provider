import React, { useState, useEffect } from 'react';
import DynamicForm from './DynamicForm';
import './ResourceForm.css';

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
    <div className="resource-form-overlay">
      <div className="resource-form">
        <div className="resource-form-header">
          <h2>{title || (resource ? 'Редактирование ресурса' : 'Создание ресурса')}</h2>
          <button className="close-button" onClick={onCancel}>×</button>
        </div>
        <div className="resource-form-content">
          <DynamicForm 
            fields={fields} 
            onSubmit={handleSubmit} 
            buttonText={submitButtonText}
            initialValues={initialValues}
          />
        </div>
        <div className="resource-form-footer">
          <button className="cancel-button" onClick={onCancel}>Отмена</button>
        </div>
      </div>
    </div>
  );
};

export default ResourceForm;