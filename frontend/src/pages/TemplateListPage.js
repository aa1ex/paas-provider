import React, { useState, useEffect } from 'react';
import ResourceList from '../components/ResourceList';
import ResourceDetail from '../components/ResourceDetail';
import ResourceForm from '../components/ResourceForm';
import client from '../client/client';
import './TemplateListPage.css';

const TemplateListPage = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Define columns for the template list
  const columns = [
    { key: 'name', label: 'Имя' },
    { 
      key: 'type', 
      label: 'Тип',
      render: (template) => {
        switch (template.type) {
          case 1: return 'Виртуальная машина';
          case 2: return 'Kubernetes кластер';
          default: return 'Неизвестный';
        }
      }
    },
    { 
      key: 'rawTemplate', 
      label: 'Шаблон',
      render: (template) => (
        <div className="template-preview">
          {template.rawTemplate.length > 30 
            ? `${template.rawTemplate.substring(0, 30)}...` 
            : template.rawTemplate}
        </div>
      )
    }
  ];

  // Define fields for the template detail view
  const detailFields = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Имя' },
    { 
      key: 'type', 
      label: 'Тип',
      render: (template) => {
        switch (template.type) {
          case 1: return 'Виртуальная машина';
          case 2: return 'Kubernetes кластер';
          default: return 'Неизвестный';
        }
      }
    },
    { 
      key: 'rawTemplate', 
      label: 'Шаблон',
      render: (template) => (
        <pre className="template-code">{template.rawTemplate}</pre>
      )
    }
  ];

  // Define fields for the template form
  const formFields = [
    {
      name: 'name',
      label: 'Имя',
      type: 'text',
      placeholder: 'Введите имя шаблона',
      required: true
    },
    {
      name: 'type',
      label: 'Тип',
      type: 'select',
      required: true,
      options: [
        { value: '1', label: 'Виртуальная машина' },
        { value: '2', label: 'Kubernetes кластер' }
      ]
    },
    {
      name: 'rawTemplate',
      label: 'Шаблон',
      type: 'textarea',
      placeholder: 'Введите шаблон',
      required: true
    }
  ];

  // Fetch templates on component mount
  useEffect(() => {
    fetchTemplates();
  }, []);

  // Fetch templates from the API
  const fetchTemplates = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await client.templates.listTemplates({});
      setTemplates(response.templates || []);
    } catch (err) {
      setError('Ошибка при загрузке шаблонов: ' + (err.message || 'Неизвестная ошибка'));
      console.error('Error fetching templates:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle view template
  const handleViewTemplate = (template) => {
    setSelectedTemplate(template);
    setIsViewModalOpen(true);
  };

  // Handle edit template
  const handleEditTemplate = (template) => {
    setSelectedTemplate(template);
    setIsEditModalOpen(true);
  };

  // Handle delete template
  const handleDeleteTemplate = async (template) => {
    try {
      await client.templates.deleteTemplate({ id: template.id });
      // Refresh the template list
      fetchTemplates();
    } catch (err) {
      setError('Ошибка при удалении шаблона: ' + (err.message || 'Неизвестная ошибка'));
      console.error('Error deleting template:', err);
    }
  };

  // Handle form submit (create or update)
  const handleFormSubmit = async (formData) => {
    try {
      // Convert type to number
      formData.type = parseInt(formData.type, 10);

      if (selectedTemplate) {
        // Update existing template
        await client.templates.updateTemplate({
          template: {
            id: formData.id,
            name: formData.name,
            type: formData.type,
            rawTemplate: formData.rawTemplate
          }
        });
      } else {
        // Create new template
        await client.templates.createTemplate({
          template: {
            name: formData.name,
            type: formData.type,
            rawTemplate: formData.rawTemplate
          }
        });
      }

      // Close the modal and refresh the template list
      setIsEditModalOpen(false);
      setSelectedTemplate(null);
      fetchTemplates();
    } catch (err) {
      setError('Ошибка при сохранении шаблона: ' + (err.message || 'Неизвестная ошибка'));
      console.error('Error saving template:', err);
    }
  };

  return (
    <div className="template-list-page">
      <h2>Управление Шаблонами</h2>

      <div className="actions">
        <button 
          className="create-button" 
          onClick={() => {
            setSelectedTemplate(null);
            setIsEditModalOpen(true);
          }}
        >
          Создать Шаблон
        </button>
      </div>

      {loading && <p className="loading">Загрузка шаблонов...</p>}

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchTemplates}>Повторить</button>
        </div>
      )}

      {!loading && !error && (
        <ResourceList 
          resources={templates}
          columns={columns}
          onView={handleViewTemplate}
          onEdit={handleEditTemplate}
          onDelete={handleDeleteTemplate}
          emptyMessage="Нет доступных шаблонов"
        />
      )}

      {isViewModalOpen && selectedTemplate && (
        <ResourceDetail 
          resource={selectedTemplate}
          fields={detailFields}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedTemplate(null);
          }}
          title="Просмотр Шаблона"
        />
      )}

      {isEditModalOpen && (
        <ResourceForm 
          resource={selectedTemplate}
          fields={formFields}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsEditModalOpen(false);
            setSelectedTemplate(null);
          }}
          title={selectedTemplate ? "Редактирование Шаблона" : "Создание Шаблона"}
          submitButtonText={selectedTemplate ? "Сохранить" : "Создать"}
        />
      )}
    </div>
  );
};

export default TemplateListPage;
