import React, { useState } from 'react';
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
    <div>
      <h2>Создание Кластера Kubernetes</h2>
      <p>Заполните форму для создания нового кластера Kubernetes.</p>
      
      <DynamicForm 
        fields={k8sFields} 
        onSubmit={handleSubmit} 
        buttonText="Создать Кластер Kubernetes" 
      />
      
      {loading && <p>Загрузка...</p>}
      
      {error && (
        <div className="error">
          <p>Ошибка: {error}</p>
        </div>
      )}
      
      {result && (
        <div className="result">
          <h3>Кластер Kubernetes создан!</h3>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
};

export default KubernetesClusterPage;