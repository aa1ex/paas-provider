import React, { useState } from 'react';
import {
  Typography,
  Paper,
  Box,
  Alert,
  AlertTitle,
  CircularProgress,
  Divider,
  Chip
} from '@mui/material';
import { Computer as ComputerIcon } from '@mui/icons-material';
import DynamicForm from '../components/DynamicForm';
import client from "../client/client";

const VirtualMachinePage = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Define the fields for the VM form
  const vmFields = [
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
    }
  ];

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Convert numeric fields to numbers
      const data = {
        ...formData,
        cpu: parseInt(formData.cpu, 10),
        memory: parseInt(formData.memory, 10),
        templateId: 'vm-template-1' // Using the predefined template ID
      };

      // Send the data to the server
      const response = await client.virtualMachines.createVirtualMachine({
        virtualMachine: data
      });
      setResult(response?.virtualMachine?.renderedTemplate);
    } catch (err) {
      setError(err.response?.data || err.message || 'Произошла ошибка при создании виртуальной машины');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <ComputerIcon sx={{ fontSize: 28, mr: 1, color: 'primary.main' }} />
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 500 }}>
          Создание Виртуальной Машины
        </Typography>
      </Box>

      <Typography variant="body1" paragraph sx={{ mb: 3 }}>
        Заполните форму для создания новой виртуальной машины. После создания вы получите конфигурацию машины.
      </Typography>

      <Paper elevation={0} variant="outlined" sx={{ p: 3, mb: 4 }}>
        <DynamicForm 
          fields={vmFields} 
          onSubmit={handleSubmit} 
          buttonText="Создать Виртуальную Машину" 
        />
      </Paper>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert 
          severity="error" 
          variant="outlined" 
          sx={{ mt: 3, mb: 2 }}
        >
          <AlertTitle>Ошибка</AlertTitle>
          {error}
        </Alert>
      )}

      {result && (
        <Paper 
          elevation={0} 
          variant="outlined" 
          sx={{ 
            mt: 4, 
            p: 3, 
            backgroundColor: 'rgba(25, 118, 210, 0.04)',
            borderColor: 'rgba(25, 118, 210, 0.2)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Chip 
              label="Успешно" 
              color="success" 
              size="small" 
              sx={{ mr: 2 }} 
            />
            <Typography variant="h6" component="h3" sx={{ fontWeight: 500 }}>
              Виртуальная машина создана!
            </Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary' }}>
            Конфигурация:
          </Typography>

          <Box 
            component="pre" 
            sx={{ 
              p: 2, 
              backgroundColor: 'background.paper', 
              borderRadius: 1,
              border: '1px solid rgba(0, 0, 0, 0.12)',
              fontFamily: '"Roboto Mono", monospace',
              fontSize: '0.875rem',
              overflowX: 'auto',
              m: 0
            }}
          >
            {result}
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default VirtualMachinePage;
