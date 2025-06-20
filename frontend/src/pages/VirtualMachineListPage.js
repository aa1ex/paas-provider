import React, { useState, useEffect } from 'react';
import ResourceList from '../components/ResourceList';
import ResourceDetail from '../components/ResourceDetail';
import ResourceForm from '../components/ResourceForm';
import client from '../client/client';
import './VirtualMachineListPage.css';
import {Button} from "@mui/material";
import {Add as AddIcon} from "@mui/icons-material";

const VirtualMachineListPage = () => {
  const [virtualMachines, setVirtualMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVM, setSelectedVM] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [templates, setTemplates] = useState([]);

  // Define columns for the VM list
  const columns = [
    { key: 'name', label: 'Имя' },
    { key: 'cpu', label: 'CPU (ядра)' },
    { key: 'memory', label: 'Память (МБ)' },
    { key: 'os', label: 'ОС' }
  ];

  // Define fields for the VM detail view
  const detailFields = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Имя' },
    { key: 'cpu', label: 'CPU (ядра)' },
    { key: 'memory', label: 'Память (МБ)' },
    { key: 'os', label: 'Операционная система' },
    { key: 'templateId', label: 'ID шаблона' }
  ];

  // Fetch VMs and templates on component mount
  useEffect(() => {
    fetchVirtualMachines();
    fetchTemplates();
  }, []);

  // Fetch virtual machines from the API
  const fetchVirtualMachines = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await client.virtualMachines.listVirtualMachines({});
      setVirtualMachines(response.virtualMachines || []);
    } catch (err) {
      setError('Ошибка при загрузке виртуальных машин: ' + (err.message || 'Неизвестная ошибка'));
      console.error('Error fetching virtual machines:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch templates from the API
  const fetchTemplates = async () => {
    try {
      const response = await client.templates.listTemplates({ type: 1 }); // Type 1 = VM templates
      setTemplates(response.templates || []);
    } catch (err) {
      console.error('Error fetching templates:', err);
    }
  };

  // Define fields for the VM form
  const formFields = [
    {
      name: 'name',
      label: 'Имя',
      type: 'text',
      placeholder: 'Введите имя виртуальной машины',
      required: true
    },
    {
      name: 'cpu',
      label: 'CPU (ядра)',
      type: 'number',
      placeholder: 'Введите количество ядер',
      required: true,
      min: 1,
      max: 16
    },
    {
      name: 'memory',
      label: 'Память (МБ)',
      type: 'number',
      placeholder: 'Введите объем памяти в МБ',
      required: true,
      min: 512,
      max: 32768
    },
    {
      name: 'os',
      label: 'Операционная система',
      type: 'select',
      required: true,
      options: [
        { value: 'ubuntu-20.04', label: 'Ubuntu 20.04' },
        { value: 'ubuntu-22.04', label: 'Ubuntu 22.04' },
        { value: 'centos-7', label: 'CentOS 7' },
        { value: 'centos-8', label: 'CentOS 8' },
        { value: 'debian-10', label: 'Debian 10' },
        { value: 'debian-11', label: 'Debian 11' },
        { value: 'windows-server-2019', label: 'Windows Server 2019' },
        { value: 'windows-server-2022', label: 'Windows Server 2022' }
      ]
    },
    {
      name: 'templateId',
      label: 'Шаблон',
      type: 'select',
      required: true,
      options: templates.map(template => ({
        value: template.id,
        label: template.name
      }))
    }
  ];

  // Handle view VM
  const handleViewVM = (vm) => {
    setSelectedVM(vm);
    setIsViewModalOpen(true);
  };

  // Handle edit VM
  const handleEditVM = (vm) => {
    setSelectedVM(vm);
    setIsEditModalOpen(true);
  };

  // Handle delete VM
  const handleDeleteVM = async (vm) => {
    try {
      await client.virtualMachines.deleteVirtualMachine({ id: vm.id });
      // Refresh the VM list
      fetchVirtualMachines();
    } catch (err) {
      setError('Ошибка при удалении виртуальной машины: ' + (err.message || 'Неизвестная ошибка'));
      console.error('Error deleting virtual machine:', err);
    }
  };

  // Handle form submit (create or update)
  const handleFormSubmit = async (formData) => {
    try {
      // Convert numeric fields to numbers
      formData.cpu = parseInt(formData.cpu, 10);
      formData.memory = parseInt(formData.memory, 10);

      if (selectedVM) {
        // Update existing VM
        await client.virtualMachines.updateVirtualMachine({
          virtualMachine: {
            id: formData.id,
            name: formData.name,
            cpu: formData.cpu,
            memory: formData.memory,
            os: formData.os,
            templateId: formData.templateId
          }
        });
      } else {
        // Create new VM
        await client.virtualMachines.createVirtualMachine({
          virtualMachine: {
            name: formData.name,
            cpu: formData.cpu,
            memory: formData.memory,
            os: formData.os,
            templateId: formData.templateId
          }
        });
      }

      // Close the modal and refresh the VM list
      setIsEditModalOpen(false);
      setSelectedVM(null);
      fetchVirtualMachines();
    } catch (err) {
      setError('Ошибка при сохранении виртуальной машины: ' + (err.message || 'Неизвестная ошибка'));
      console.error('Error saving virtual machine:', err);
    }
  };

  return (
    <div className="vm-list-page">
      <h2>Управление Виртуальными Машинами</h2>

      <div className="actions">
        <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedVM(null);
              setIsEditModalOpen(true);
            }}
        >
          Создать виртуальную машину
        </Button>
      </div>

      {loading && <p className="loading">Загрузка виртуальных машин...</p>}

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchVirtualMachines}>Повторить</button>
        </div>
      )}

      {!loading && !error && (
        <ResourceList 
          resources={virtualMachines}
          columns={columns}
          onView={handleViewVM}
          onEdit={handleEditVM}
          onDelete={handleDeleteVM}
          emptyMessage="Нет доступных виртуальных машин"
        />
      )}

      {isViewModalOpen && selectedVM && (
        <ResourceDetail 
          resource={selectedVM}
          fields={detailFields}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedVM(null);
          }}
          title="Просмотр Виртуальной Машины"
        />
      )}

      {isEditModalOpen && (
        <ResourceForm 
          resource={selectedVM}
          fields={formFields}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsEditModalOpen(false);
            setSelectedVM(null);
          }}
          title={selectedVM ? "Редактирование Виртуальной Машины" : "Создание Виртуальной Машины"}
          submitButtonText={selectedVM ? "Сохранить" : "Создать"}
        />
      )}
    </div>
  );
};

export default VirtualMachineListPage;
