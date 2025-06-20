import React, { useState } from 'react';
import './ResourceList.css';

const ResourceList = ({
  resources, 
  columns, 
  onView, 
  onEdit, 
  onDelete, 
  emptyMessage = "Нет доступных ресурсов" 
}) => {
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleDelete = (resource) => {
    setConfirmDelete(resource);
  };

  const confirmDeleteAction = () => {
    if (confirmDelete && onDelete) {
      onDelete(confirmDelete);
      setConfirmDelete(null);
    }
  };

  const cancelDelete = () => {
    setConfirmDelete(null);
  };

  if (!resources || resources.length === 0) {
    return <div className="empty-list">{emptyMessage}</div>;
  }

  return (
    <div className="resource-list">
      <table className="resource-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {resources.map((resource) => (
            <tr key={resource.id}>
              {columns.map((column) => (
                <td key={`${resource.id}-${column.key}`}>
                  {column.render ? column.render(resource) : resource[column.key]}
                </td>
              ))}
              <td className="actions">
                {onView && (
                  <button 
                    className="action-button view-button" 
                    onClick={() => onView(resource)}
                    title="Просмотр"
                  >
                    👁️
                  </button>
                )}
                {onEdit && (
                  <button 
                    className="action-button edit-button" 
                    onClick={() => onEdit(resource)}
                    title="Редактировать"
                  >
                    ✏️
                  </button>
                )}
                {onDelete && (
                  <button 
                    className="action-button delete-button" 
                    onClick={() => handleDelete(resource)}
                    title="Удалить"
                  >
                    🗑️
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {confirmDelete && (
        <div className="delete-confirmation">
          <div className="delete-confirmation-content">
            <h3>Подтверждение удаления</h3>
            <p>Вы уверены, что хотите удалить ресурс "{confirmDelete.name}"?</p>
            <div className="delete-confirmation-actions">
              <button onClick={cancelDelete}>Отмена</button>
              <button className="delete-button" onClick={confirmDeleteAction}>Удалить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceList;
