import React, { useState } from 'react';
import api from '../services/api';

const initialState = {
  title: '',
  description: '',
  price: '',
  location: '',
  address: '',
  type: 'casa',
  status: 'disponible',
  operation: 'venta',
  bedrooms: 0,
  bathrooms: 0,
  area: '',
  parking: 0,
  images: [],
  features: [],
};

const PropertyForm = ({ onSuccess, propertyToEdit, onCancel }) => {
  const [form, setForm] = useState(propertyToEdit ? propertyToEdit : initialState);
  const [selectedImages, setSelectedImages] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isEdit = !!propertyToEdit;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
  };

  const handleRemoveImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const formData = new FormData();

      // Agregar todos los campos del formulario
      Object.entries(form).forEach(([key, value]) => {
        if (key !== 'images') {
          formData.append(key, value);
        }
      });

      // Agregar las imágenes seleccionadas
      selectedImages.forEach((image) => {
        formData.append('images', image);
      });

      console.log('Enviando datos:', Object.fromEntries(formData.entries()));

      if (isEdit) {
        await api.put(`/properties/${propertyToEdit.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/properties', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      
      alert(isEdit ? 'Propiedad actualizada exitosamente' : 'Propiedad creada exitosamente');
      setForm(initialState);
      setSelectedImages([]);
      onSuccess();
    } catch (err) {
      console.error('Error al guardar la propiedad:', err);
      setError(err.response?.data?.message || 'Error al guardar la propiedad');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, border: '1px solid #ddd', borderRadius: 8, marginBottom: 20 }}>
      <h3>{isEdit ? 'Editar Propiedad' : 'Crear Nueva Propiedad'}</h3>
      <form onSubmit={handleSubmit}>
        
        {/* Título */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>
            Título *
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="Ej: Casa moderna en el centro"
            style={{ width: '100%', padding: 8, marginBottom: 4 }}
          />
        </div>

        {/* Descripción */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>
            Descripción
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="Describe la propiedad..."
            style={{ width: '100%', padding: 8, marginBottom: 4 }}
          />
        </div>

        {/* Precio */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>
            Precio *
          </label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            placeholder="Ej: 150000"
            style={{ width: '100%', padding: 8, marginBottom: 4 }}
          />
        </div>

        {/* Tipo de Propiedad */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>
            Tipo de Propiedad *
          </label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: 8, marginBottom: 4 }}
          >
            <option value="casa">Casa</option>
            <option value="apartamento">Apartamento</option>
            <option value="local">Local</option>
            <option value="oficina">Oficina</option>
            <option value="terreno">Terreno</option>
            <option value="bodega">Bodega</option>
          </select>
        </div>

        {/* Operación */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>
            Operación *
          </label>
          <select
            name="operation"
            value={form.operation}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: 8, marginBottom: 4 }}
          >
            <option value="venta">Venta</option>
            <option value="alquiler">Alquiler</option>
          </select>
        </div>

        {/* Estado */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>
            Estado
          </label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            style={{ width: '100%', padding: 8, marginBottom: 4 }}
          >
            <option value="disponible">Disponible</option>
            <option value="vendido">Vendido</option>
            <option value="alquilado">Alquilado</option>
          </select>
        </div>

        {/* Ubicación */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>
            Ubicación (Ciudad) *
          </label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            required
            placeholder="Ej: Medellín"
            style={{ width: '100%', padding: 8, marginBottom: 4 }}
          />
        </div>

        {/* Dirección */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>
            Dirección
          </label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Ej: Carrera 50 # 25-30"
            style={{ width: '100%', padding: 8, marginBottom: 4 }}
          />
        </div>

        {/* Área */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>
            Área (m²)
          </label>
          <input
            type="number"
            name="area"
            value={form.area}
            onChange={handleChange}
            placeholder="Ej: 120"
            style={{ width: '100%', padding: 8, marginBottom: 4 }}
          />
        </div>

        {/* Habitaciones */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>
            Habitaciones
          </label>
          <input
            type="number"
            name="bedrooms"
            value={form.bedrooms}
            onChange={handleChange}
            min="0"
            style={{ width: '100%', padding: 8, marginBottom: 4 }}
          />
        </div>

        {/* Baños */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>
            Baños
          </label>
          <input
            type="number"
            name="bathrooms"
            value={form.bathrooms}
            onChange={handleChange}
            min="0"
            style={{ width: '100%', padding: 8, marginBottom: 4 }}
          />
        </div>

        {/* Parqueaderos */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>
            Parqueaderos
          </label>
          <input
            type="number"
            name="parking"
            value={form.parking}
            onChange={handleChange}
            min="0"
            style={{ width: '100%', padding: 8, marginBottom: 4 }}
          />
        </div>

        {/* Imágenes */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>
            Imágenes (máximo 5)
          </label>
          <input 
            type="file" 
            name="images" 
            multiple 
            accept="image/*" 
            onChange={handleImagesChange} 
            style={{ width: '100%', padding: 8, marginBottom: 8 }} 
          />
          {selectedImages.length > 0 && (
            <div style={{ fontSize: '12px', color: '#666', marginBottom: 8 }}>
              <p>{selectedImages.length} imagen(es) seleccionada(s):</p>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {selectedImages.map((file, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    {file.name}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      style={{
                        marginLeft: 8,
                        color: 'white',
                        background: '#d9534f',
                        border: 'none',
                        borderRadius: 3,
                        padding: '2px 8px',
                        cursor: 'pointer'
                      }}
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div style={{ 
            color: 'white', 
            background: '#d9534f', 
            padding: 10, 
            borderRadius: 4, 
            marginBottom: 16 
          }}>
            {error}
          </div>
        )}

        {/* Botones */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              background: loading ? '#ccc' : '#5cb85c', 
              color: 'white', 
              border: 'none', 
              padding: '10px 20px', 
              borderRadius: 4, 
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            {loading ? 'Guardando...' : (isEdit ? 'Actualizar Propiedad' : 'Crear Propiedad')}
          </button>
          
          {onCancel && (
            <button 
              type="button" 
              onClick={onCancel}
              style={{ 
                background: '#6c757d', 
                color: 'white', 
                border: 'none', 
                padding: '10px 20px', 
                borderRadius: 4, 
                cursor: 'pointer' 
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PropertyForm;
