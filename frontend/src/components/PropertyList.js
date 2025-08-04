import React, { useEffect, useState } from 'react';
import api from '../services/api';
import PropertyForm from './PropertyForm';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [propertyToEdit, setPropertyToEdit] = useState(null);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await api.get('/properties');
      console.log('Properties response:', res.data);
      // Manejar tanto la nueva estructura como la antigua
      const propertiesData = res.data.properties || res.data || [];
      setProperties(propertiesData);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setProperties([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleEdit = (property) => {
    setPropertyToEdit(property);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta propiedad?')) {
      await api.delete(`/properties/${id}`);
      fetchProperties();
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setPropertyToEdit(null);
    fetchProperties();
  };

  return (
    <div>
      <h3>Propiedades</h3>
      {!showForm && (
        <button onClick={() => setShowForm(true)} style={{ marginBottom: 16 }}>Crear Propiedad</button>
      )}
      {showForm && (
        <PropertyForm
          onSuccess={handleSuccess}
          propertyToEdit={propertyToEdit}
          onCancel={() => { setShowForm(false); setPropertyToEdit(null); }}
        />
      )}
      {loading ? (
        <div>Cargando propiedades...</div>
      ) : (
        <table border="1" cellPadding="8" style={{ width: '100%', marginTop: 16 }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Tipo</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((prop) => (
              <tr key={prop.id}>
                <td>{prop.id}</td>
                <td>{prop.title}</td>
                <td>{prop.type}</td>
                <td>${prop.price}</td>
                <td>{prop.status}</td>
                <td>
                  <button onClick={() => handleEdit(prop)}>Editar</button>
                  <button onClick={() => handleDelete(prop.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {properties.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>No hay propiedades registradas.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PropertyList;
