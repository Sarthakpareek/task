import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

const ADD = () => {
  const [fileData, setFileData] = useState([]);
  const [formData, setFormData] = useState({ name: '', age: '', email: '', salary: '', joinDate: '' });
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [disableValidation, setDisableValidation] = useState(true); // Temporary state to disable validation

  const chartRef = useRef(null);
  const canvasRef = useRef(null);

  const parseCSV = (csvContent) => {
    const rows = csvContent.split('\n');
    return rows.map(row => row.split(','));
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidDate = (date) => {
    return !isNaN(Date.parse(date));
  };

  const validateFormData = () => {
    if (disableValidation) { // Disable validation temporarily
      return true;
    }
    if (!formData.name.trim() || !formData.age.trim() || !formData.email.trim() || !formData.salary.trim() || !formData.joinDate.trim()) {
      return false;
    }
    if (isNaN(formData.age) || parseInt(formData.age) <= 0) {
      return false;
    }
    if (!isValidEmail(formData.email)) {
      return false;
    }
    if (isNaN(formData.salary) || parseFloat(formData.salary) <= 0) {
      return false;
    }
    if (!isValidDate(formData.joinDate)) {
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateFormData()) return;
    
    if (selectedIndex === -1) {
      setFileData([...fileData, [formData.name, formData.email, formData.salary, formData.age, formData.joinDate]]);
    } 
    setFormData({ name: '', salary: '', email: '', age: '', joinDate: '' });
  };

  const handleDeleteEntry = (index) => {
    const newData = [...fileData];
    newData.splice(index, 1);
    setFileData(newData);
    if (selectedIndex === index) {
      setSelectedIndex(-1);
      setFormData({ name: '', salary: '', email: '', age: '', joinDate: '' });
    }
  };

  const handleUpdateEntry = (index) => {
    const [name, age, email, salary, joinDate] = fileData[index];
    setFormData({ name, age, email, salary, joinDate });
    setSelectedIndex(index);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const parsedData = parseCSV(content);
      setFileData(parsedData);
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    const generateGraphData = () => {
      const joinDates = fileData.map(entry => new Date(entry[4])).filter(date => date.getFullYear() >= 2001);
      const salaries = fileData.filter(entry => new Date(entry[4]).getFullYear() >= 2001).map(entry => parseInt(entry[3]));

      const ctx = canvasRef.current.getContext('2d');
      if (chartRef.current) {
        chartRef.current.destroy();
      }
      chartRef.current = new Chart(ctx, {
        type: 'bar', // Changed to bar
        data: {
          labels: joinDates,
          datasets: [{
            label: 'Salary vs Join Date',
            data: salaries,
            backgroundColor: 'rgb(75, 192, 192)', // Added backgroundColor property
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 1 // Added borderWidth property
          }]
        },
        options: {
          scales: {
            x: {
              type: 'time',
              time: {
                parser: 'yyyy-MM-dd',
                tooltipFormat: 'MMM d, yyyy',
              },
              title: {
                display: true,
                text: 'Join Date'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Salary'
              }
            }
          }
        }
      });
    };

    generateGraphData();
  }, [fileData]);

  return (
    <div>
      <h1>Task</h1>
      <form onSubmit={handleSubmit}>
        <table>
          <tbody>
            <tr>
              <td><input 
                type="text" 
                placeholder="Name" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              /></td>
              <td><input 
                type="number" 
                placeholder="Age" 
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              /></td>
              <td><input 
                type="text" 
                placeholder="Email" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              /></td>
              <td><input 
                type="number" 
                placeholder="Salary" 
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              /></td>
              <td><input 
                type="date" 
                placeholder="Join Date" 
                value={formData.joinDate}
                onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
              /></td>
              <td><button type="submit">Submit</button></td>
            </tr>
          </tbody>
        </table>
      </form>
      <input type="file" onChange={handleFileUpload} />
      <canvas ref={canvasRef}></canvas>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Salary</th>
            <th>Age</th>
            <th>Join Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {fileData.map((rowData, rowIndex) => (
            <tr key={rowIndex}>
              {rowData.map((cellData, cellIndex) => (
                <td key={cellIndex}>{cellData}</td>
              ))}
              <td>
                <button onClick={() => handleUpdateEntry(rowIndex)}>Update</button>
                <button onClick={() => handleDeleteEntry(rowIndex)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ADD;
