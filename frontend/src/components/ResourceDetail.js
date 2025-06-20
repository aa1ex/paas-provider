import React from 'react';
import './ResourceDetail.css';

const ResourceDetail = ({ resource, fields, onClose, title }) => {
  if (!resource) return null;

  return (
    <div className="resource-detail-overlay">
      <div className="resource-detail">
        <div className="resource-detail-header">
          <h2>{title || 'Детали ресурса'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="resource-detail-content">
          {fields.map((field) => (
            <div className="detail-field" key={field.key}>
              <div className="field-label">{field.label}:</div>
              <div className="field-value">
                {field.render ? field.render(resource) : resource[field.key]}
              </div>
            </div>
          ))}
          
          {resource.renderedTemplate && (
            <div className="detail-field">
              <div className="field-label">Результат:</div>
              <pre className="rendered-template">{resource.renderedTemplate}</pre>
            </div>
          )}
        </div>
        <div className="resource-detail-footer">
          <button onClick={onClose}>Закрыть</button>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetail;