import React, { useState } from 'react';
import useRegister from '../hooks/registerHook';
import '../style/register.css';

const RegisterComponent = () => {
  const { formData, handleChange, handleSubmit } = useRegister();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page lors de la soumission du formulaire
    setIsSubmitting(true);
    await handleSubmit(e); // Passe l'événement à handleSubmit
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={onSubmit} className="register-form">
      <label>
        Name:
        <input 
          type="text" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
        />
      </label>
      <label>
        Mail:
        <input 
          type="email" 
          name="mail" 
          value={formData.mail} 
          onChange={handleChange} 
        />
      </label>
      <label>
        Password:
        <input 
          type="password" 
          name="password" 
          value={formData.password} 
          onChange={handleChange} 
        />
      </label>
      <label>
        Phone:
        <input 
          type="tel" 
          name="phone" 
          value={formData.phone} 
          onChange={handleChange} 
        />
      </label>
      <button 
        type="submit" 
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
};

export default RegisterComponent;
