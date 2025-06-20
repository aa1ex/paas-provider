import React, { useState } from 'react';
import axios from 'axios';
import DynamicForm from '../components/DynamicForm';

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
      const response = await axios.post('/api/vm', data);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data || err.message || 'Произошла ошибка при создании виртуальной машины');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Создание Виртуальной Машины</h2>
      <p>Заполните форму для создания новой виртуальной машины.</p>
      
      <DynamicForm 
        fields={vmFields} 
        onSubmit={handleSubmit} 
        buttonText="Создать Виртуальную Машину" 
      />
      
      {loading && <p>Загрузка...</p>}
      
      {error && (
        <div className="error">
          <p>Ошибка: {error}</p>
        </div>
      )}
      
      {result && (
        <div className="result">
          <h3>Виртуальная машина создана!</h3>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
};

export default VirtualMachinePage;