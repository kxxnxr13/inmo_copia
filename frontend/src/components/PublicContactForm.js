import React, { useState } from 'react';
import api from '../services/api';

const PublicContactForm = ({ propertyId }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    console.log('📤 Sending contact form:', { ...form, propertyId });

    try {
      const response = await api.post('/contacts', { ...form, propertyId });
      console.log('✅ Contact form response:', response.data);

      setSuccess('¡Solicitud enviada correctamente! Nos pondremos en contacto contigo pronto.');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      console.error('❌ Contact form error:', err);

      const errorMessage = err.response?.data?.message ||
                          err.response?.data?.error ||
                          'Error al enviar la solicitud. Por favor, intenta de nuevo.';
      setError(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '40px auto', padding: 24, border: '1px solid #ccc', borderRadius: 8 }}>
      <h3>Solicitar información</h3>
      <div>
        <label>Nombre:</label>
        <input name="name" value={form.name} onChange={handleChange} required style={{ width: '100%', marginBottom: 8 }} />
      </div>
      <div>
        <label>Email:</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} required style={{ width: '100%', marginBottom: 8 }} />
      </div>
      <div>
        <label>Teléfono:</label>
        <input name="phone" value={form.phone} onChange={handleChange} required style={{ width: '100%', marginBottom: 8 }} />
      </div>
      <div>
        <label>Mensaje:</label>
        <textarea name="message" value={form.message} onChange={handleChange} style={{ width: '100%', marginBottom: 8 }} />
      </div>
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: 8 }}>{success}</div>}
      <button type="submit">Enviar Solicitud</button>
    </form>
  );
};

export default PublicContactForm;
