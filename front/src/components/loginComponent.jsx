import React, { useState } from 'react';
import useLogin from '../hooks/loginHook';
import '../style/login.css';

const LoginComponent = () => {
  const { login, loading, error, user } = useLogin();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await login(formData.email, formData.password);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <label htmlFor="email">
        Email:
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </label>
      <label htmlFor="password">
        Password:
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
      </label>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
      {error && <p className="error-message">{error}</p>}
    </form>
  );
};

export default LoginComponent;