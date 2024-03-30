import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/api/formFields')
      .then(response => response.json())
      .then(data => {
        setFormFields(data);
        const initialFormData = {};
        data.forEach(field => {
          initialFormData[field.label.toLowerCase()] = '';
        });
        setFormData(initialFormData);
      })
      .catch(error => setErrorMessage('Error fetching form fields: ' + error));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.name) {
      setErrorMessage('Please fill out all fields.');
      return;
    }
    fetch('http://localhost:3001/api/submitForm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(data => {
      if (data.errors) {
        setErrorMessage('Validation error: ' + JSON.stringify(data.errors));
      } else {
        alert('Form submitted successfully');
      }
    })
    .catch(error => setErrorMessage('Error submitting form: ' + error));
  };

  return (
    <div className="App">
      <h1>Dynamic Form</h1>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        {formFields.map(field => (
          <div key={field.id}>
            <label>{field.label}:</label>
            <input
              type={field.type}
              placeholder={field.placeholder}
              name={field.label.toLowerCase()}
              value={formData[field.label.toLowerCase()]}
              onChange={handleChange}
            />
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
