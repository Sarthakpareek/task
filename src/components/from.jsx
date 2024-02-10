import React, { useState } from 'react';

const XYZ = () => {
  // Initialize state for form inputs, data array, edit index, and errors
  const [formData, setFormData] = useState({ label: '', value: '' });
  const [data, setData] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [errors, setErrors] = useState({ label: '', value: '' });

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (editIndex === -1) {
        // Add new data to array
        setData([...data, formData]);
      } else {
        // Update existing data
        const updatedData = [...data];
        updatedData[editIndex] = formData;
        setData(updatedData);
        setEditIndex(-1); // Reset edit mode
      }
      // Clear form inputs and errors
      setFormData({ label: '', value: '' });
      setErrors({ label: '', value: '' });
    }
  };

  // Function to validate form data
  const validateForm = () => {
    let isValid = true;
    const newErrors = { label: '', value: '' };

    if (!formData.label.trim()) {
      newErrors.label = 'Label is required';
      isValid = false;
    }
    if (!formData.value.trim()) {
      newErrors.value = 'Value is required';
      isValid = false;
    } else if (isNaN(formData.value)) {
      newErrors.value = 'Value must be a number';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Function to handle editing data
  const handleEdit = (index) => {
    setFormData(data[index]);
    setEditIndex(index);
  };

  // Function to handle deleting data
  const handleDelete = (index) => {
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
  };

  return (
    <div>
      <h1>React App with Form Data in Table</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Label:
            <input
              type="text"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            />
            <span style={{ color: 'red' }}>{errors.label}</span>
          </label>
        </div>
        <div>
          <label>
            Value:
            <input
              type="text"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            />
            <span style={{ color: 'red' }}>{errors.value}</span>
          </label>
        </div>
        <div>
          <button type="submit">{editIndex === -1 ? 'Add' : 'Update'}</button>
        </div>
      </form>
      <div style={{ marginTop: '20px' }}>
        <h2>Data Table</h2>
        <table>
          <thead>
            <tr>
              <th>Label</th>
              <th>Value</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, index) => (
              <tr key={index}>
                <td>{entry.label}</td>
                <td>{entry.value}</td>
                <td>
                  <button onClick={() => handleEdit(index)}>Edit</button>
                  <button onClick={() => handleDelete(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default XYZ;
