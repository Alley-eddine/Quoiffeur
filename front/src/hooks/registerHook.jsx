import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    mail: '',
    password: '',
    phone: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      console.log(data);
      if (data.token) {
        localStorage.setItem('token', data.token);
        navigate('/login');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit
  };
};

export default useRegister;