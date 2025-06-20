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
import { Storage as StorageIcon } from '@mui/icons-material';
import DynamicForm from '../components/DynamicForm';
import client from "../client/client";

const KubernetesClusterPage = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Define the fields for the Kubernetes cluster form
  const k8sFields = [
    {
      name: 'name',
      label: 'Имя',
      type: 'text',
      placeholder: 'Введите имя кластера',
      required: true
    },
    {
      name: 'region',
      label: 'Регион',
      type: 'select',
      required: true,
      options: [
        { value: 'us-east-1', label: 'US East (N. Virginia)' },
        { value: 'us-west-1', label: 'US West (N. California)' },
        { value: 'eu-west-1', label: 'EU (Ireland)' },
        { value: 'eu-central-1', label: 'EU (Frankfurt)' },
        { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' },
        { value: 'ap-northeast-1', label: 'Asia Pacific (Tokyo)' }
      ]
    },
    {
      name: 'nodeCount',
      label: 'Количество узлов',
      type: 'number',
      placeholder: 'Введите количество узлов',
      required: true,
      min: 1,
      max: 10
    },
    {
      name: 'version',
      label: 'Версия Kubernetes',
      type: 'select',
      required: true,
      options: [
        { value: '1.22', label: 'Kubernetes 1.22' },
        { value: '1.23', label: 'Kubernetes 1.23' },
        { value: '1.24', label: 'Kubernetes 1.24' },
        { value: '1.25', label: 'Kubernetes 1.25' }
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
        nodeCount: parseInt(formData.nodeCount, 10),
        templateId: 'k8s-template-1' // Using the predefined template ID
      };

      // Send the data to the server
      const response = await client.kubernetesClusters.createKubernetesCluster({
        kubernetesCluster: data
      });
      setResult(response?.kubernetesCluster?.renderedTemplate);
    } catch (err) {
      setError(err.response?.data || err.message || 'Произошла ошибка при создании кластера Kubernetes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <StorageIcon sx={{ fontSize: 28, mr: 1, color: 'primary.main' }} />
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 500 }}>
          Создание Кластера Kubernetes
        </Typography>
      </Box>

      <Typography variant="body1" paragraph sx={{ mb: 3 }}>
        Заполните форму для создания нового кластера Kubernetes. После создания вы получите конфигурацию кластера.
      </Typography>

      <Paper elevation={0} variant="outlined" sx={{ p: 3, mb: 4 }}>
        <DynamicForm 
          fields={k8sFields} 
          onSubmit={handleSubmit} 
          buttonText="Создать Кластер Kubernetes" 
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
              Кластер Kubernetes создан!
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

export default KubernetesClusterPage;
