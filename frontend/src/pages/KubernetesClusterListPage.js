import React, { useState, useEffect } from 'react';
import ResourceList from '../components/ResourceList';
import ResourceDetail from '../components/ResourceDetail';
import ResourceForm from '../components/ResourceForm';
import client from '../client/client';
import './KubernetesClusterListPage.css';

const KubernetesClusterListPage = () => {
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [templates, setTemplates] = useState([]);

  // Define columns for the cluster list
  const columns = [
    { key: 'name', label: 'Имя' },
    { key: 'region', label: 'Регион' },
    { key: 'nodeCount', label: 'Количество узлов' },
    { key: 'version', label: 'Версия Kubernetes' }
  ];

  // Define fields for the cluster detail view
  const detailFields = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Имя' },
    { key: 'region', label: 'Регион' },
    { key: 'nodeCount', label: 'Количество узлов' },
    { key: 'version', label: 'Версия Kubernetes' },
    { key: 'templateId', label: 'ID шаблона' }
  ];

  // Fetch clusters and templates on component mount
  useEffect(() => {
    fetchKubernetesClusters();
    fetchTemplates();
  }, []);

  // Fetch Kubernetes clusters from the API
  const fetchKubernetesClusters = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await client.kubernetesClusters.listKubernetesClusters({});
      setClusters(response.kubernetesClusters || []);
    } catch (err) {
      setError('Ошибка при загрузке кластеров Kubernetes: ' + (err.message || 'Неизвестная ошибка'));
      console.error('Error fetching Kubernetes clusters:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch templates from the API
  const fetchTemplates = async () => {
    try {
      const response = await client.templates.listTemplates({ type: 2 }); // Type 2 = Kubernetes templates
      setTemplates(response.templates || []);
    } catch (err) {
      console.error('Error fetching templates:', err);
    }
  };

  // Define fields for the cluster form
  const formFields = [
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

  // Handle view cluster
  const handleViewCluster = (cluster) => {
    setSelectedCluster(cluster);
    setIsViewModalOpen(true);
  };

  // Handle edit cluster
  const handleEditCluster = (cluster) => {
    setSelectedCluster(cluster);
    setIsEditModalOpen(true);
  };

  // Handle delete cluster
  const handleDeleteCluster = async (cluster) => {
    try {
      await client.kubernetesClusters.deleteKubernetesCluster({ id: cluster.id });
      // Refresh the cluster list
      fetchKubernetesClusters();
    } catch (err) {
      setError('Ошибка при удалении кластера: ' + (err.message || 'Неизвестная ошибка'));
      console.error('Error deleting cluster:', err);
    }
  };

  // Handle form submit (create or update)
  const handleFormSubmit = async (formData) => {
    try {
      // Convert numeric fields to numbers
      formData.nodeCount = parseInt(formData.nodeCount, 10);
      
      if (selectedCluster) {
        // Update existing cluster
        await client.kubernetesClusters.updateKubernetesCluster({
          kubernetesCluster: {
            id: formData.id,
            name: formData.name,
            region: formData.region,
            nodeCount: formData.nodeCount,
            version: formData.version,
            templateId: formData.templateId
          }
        });
      } else {
        // Create new cluster
        await client.kubernetesClusters.createKubernetesCluster({
          kubernetesCluster: {
            name: formData.name,
            region: formData.region,
            nodeCount: formData.nodeCount,
            version: formData.version,
            templateId: formData.templateId
          }
        });
      }
      
      // Close the modal and refresh the cluster list
      setIsEditModalOpen(false);
      setSelectedCluster(null);
      fetchKubernetesClusters();
    } catch (err) {
      setError('Ошибка при сохранении кластера: ' + (err.message || 'Неизвестная ошибка'));
      console.error('Error saving cluster:', err);
    }
  };

  return (
    <div className="k8s-list-page">
      <h2>Управление Кластерами Kubernetes</h2>
      
      <div className="actions">
        <button 
          className="create-button" 
          onClick={() => {
            setSelectedCluster(null);
            setIsEditModalOpen(true);
          }}
        >
          Создать Кластер Kubernetes
        </button>
      </div>
      
      {loading && <p className="loading">Загрузка кластеров...</p>}
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchKubernetesClusters}>Повторить</button>
        </div>
      )}
      
      {!loading && !error && (
        <ResourceList 
          resources={clusters}
          columns={columns}
          onView={handleViewCluster}
          onEdit={handleEditCluster}
          onDelete={handleDeleteCluster}
          emptyMessage="Нет доступных кластеров Kubernetes"
        />
      )}
      
      {isViewModalOpen && selectedCluster && (
        <ResourceDetail 
          resource={selectedCluster}
          fields={detailFields}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedCluster(null);
          }}
          title="Просмотр Кластера Kubernetes"
        />
      )}
      
      {isEditModalOpen && (
        <ResourceForm 
          resource={selectedCluster}
          fields={formFields}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsEditModalOpen(false);
            setSelectedCluster(null);
          }}
          title={selectedCluster ? "Редактирование Кластера Kubernetes" : "Создание Кластера Kubernetes"}
          submitButtonText={selectedCluster ? "Сохранить" : "Создать"}
        />
      )}
    </div>
  );
};

export default KubernetesClusterListPage;