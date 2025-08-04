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
    <div style={{
      maxWidth: 500,
      margin: '40px auto',
      padding: 24,
      background: '#f8f9fa',
      border: '1px solid #ddd',
      borderRadius: 12,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{
        color: '#002147',
        marginBottom: 20,
        textAlign: 'center',
        fontSize: 24
      }}>
        💬 Solicitar Información
      </h3>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={{
            display: 'block',
            marginBottom: 6,
            fontWeight: 'bold',
            color: '#333'
          }}>
            Nombre completo *
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Ej: Juan Pérez"
            style={{
              width: '100%',
              padding: 12,
              border: '1px solid #ccc',
              borderRadius: 6,
              fontSize: 16
            }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{
            display: 'block',
            marginBottom: 6,
            fontWeight: 'bold',
            color: '#333'
          }}>
            Email *
          </label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="Ej: juan@email.com"
            style={{
              width: '100%',
              padding: 12,
              border: '1px solid #ccc',
              borderRadius: 6,
              fontSize: 16
            }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{
            display: 'block',
            marginBottom: 6,
            fontWeight: 'bold',
            color: '#333'
          }}>
            Teléfono *
          </label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            placeholder="Ej: 3001234567"
            style={{
              width: '100%',
              padding: 12,
              border: '1px solid #ccc',
              borderRadius: 6,
              fontSize: 16
            }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{
            display: 'block',
            marginBottom: 6,
            fontWeight: 'bold',
            color: '#333'
          }}>
            Mensaje
          </label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={4}
            placeholder="Cuéntanos sobre tu interés en esta propiedad..."
            style={{
              width: '100%',
              padding: 12,
              border: '1px solid #ccc',
              borderRadius: 6,
              fontSize: 16,
              resize: 'vertical'
            }}
          />
        </div>

        {error && (
          <div style={{
            color: 'white',
            background: '#dc3545',
            padding: 12,
            borderRadius: 6,
            marginBottom: 16,
            textAlign: 'center'
          }}>
            ❌ {error}
          </div>
        )}

        {success && (
          <div style={{
            color: 'white',
            background: '#28a745',
            padding: 12,
            borderRadius: 6,
            marginBottom: 16,
            textAlign: 'center'
          }}>
            ✅ {success}
          </div>
        )}

        <button
          type="submit"
          style={{
            width: '100%',
            background: '#f5a623',
            color: 'white',
            border: 'none',
            padding: '14px 20px',
            borderRadius: 6,
            fontSize: 18,
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.background = '#e09612'}
          onMouseOut={(e) => e.target.style.background = '#f5a623'}
        >
          📤 Enviar Solicitud
        </button>
      </form>

      <p style={{
        textAlign: 'center',
        color: '#666',
        fontSize: 14,
        marginTop: 16,
        marginBottom: 0
      }}>
        Te contactaremos en las próximas 24 horas
      </p>
    </div>
  );
};

export default PublicContactForm;
