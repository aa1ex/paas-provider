import React, { useState } from 'react';

const DynamicForm = ({ fields, onSubmit, buttonText = "Применить" }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = 'Это поле обязательно для заполнения';
        valid = false;
      }
    });

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {fields.map((field) => (
        <div className="form-group" key={field.name}>
          <label htmlFor={field.name}>{field.label}</label>
          {field.type === 'select' ? (
            <select
              id={field.name}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleChange}
              required={field.required}
            >
              <option value="">Выберите {field.label.toLowerCase()}</option>
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type || 'text'}
              id={field.name}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleChange}
              placeholder={field.placeholder}
              required={field.required}
              min={field.min}
              max={field.max}
            />
          )}
          {errors[field.name] && <div className="error">{errors[field.name]}</div>}
        </div>
      ))}
      <button type="submit">{buttonText}</button>
    </form>
  );
};

export default DynamicForm;