import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const PropertyCatalog = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    operation: '',
    type: '',
    location: '',
    minPrice: '',
    maxPrice: ''
  });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await api.get('/properties');
        console.log('PropertyCatalog response:', res.data);
        // Handle both new structure { properties: [...] } and old structure [...]
        const propertiesData = res.data.properties || res.data || [];
        console.log('Properties data:', propertiesData);
        setProperties(Array.isArray(propertiesData) ? propertiesData : []);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setProperties([]);
      }
      setLoading(false);
    };
    fetchProperties();
  }, []);

  // Filtrado básico en frontend
  const filtered = properties.filter(p => {
    return (
      (!filters.operation || p.operation === filters.operation) &&
      (!filters.type || p.type === filters.type) &&
      (!filters.location || p.location.toLowerCase().includes(filters.location.toLowerCase())) &&
      (!filters.minPrice || Number(p.price) >= Number(filters.minPrice)) &&
      (!filters.maxPrice || Number(p.price) <= Number(filters.maxPrice))
    );
  });

  const handleChange = e => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ maxWidth: 1100, margin: '40px auto', padding: 24 }}>
      <h2 style={{ color: '#002147', marginBottom: 24 }}>Propiedades disponibles</h2>
      <div style={{
        display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap',
        background: '#f7f9fb', padding: 16, borderRadius: 8
      }}>
        <select name="operation" value={filters.operation} onChange={handleChange} style={{ padding: 8 }}>
          <option value="">Operación</option>
          <option value="venta">Venta</option>
          <option value="alquiler">Alquiler</option>
        </select>
        <select name="type" value={filters.type} onChange={handleChange} style={{ padding: 8 }}>
          <option value="">Tipo</option>
          <option value="casa">Casa</option>
          <option value="apartamento">Apartamento</option>
          <option value="local">Local</option>
          <option value="oficina">Oficina</option>
          <option value="terreno">Terreno</option>
          <option value="bodega">Bodega</option>
        </select>
        <input
          name="location"
          value={filters.location}
          onChange={handleChange}
          placeholder="Ubicación"
          style={{ padding: 8, minWidth: 120 }}
        />
        <input
          name="minPrice"
          value={filters.minPrice}
          onChange={handleChange}
          placeholder="Precio mínimo"
          type="number"
          style={{ padding: 8, minWidth: 120 }}
        />
        <input
          name="maxPrice"
          value={filters.maxPrice}
          onChange={handleChange}
          placeholder="Precio máximo"
          type="number"
          style={{ padding: 8, minWidth: 120 }}
        />
      </div>
      {loading ? (
        <div>Cargando propiedades...</div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 24
        }}>
          {filtered.map(property => (
            <div key={property.id} style={{
              background: '#fff',
              borderRadius: 10,
              boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              {/* Mostrar la primera imagen de la propiedad */}
              {property.images && property.images.length > 0 ? (
                <img
                  src={`http://localhost:5000/uploads/${property.images[0]}`}
                  alt={property.title}
                  style={{ 
                    width: '100%', 
                    height: 200, 
                    objectFit: 'cover',
                    borderRadius: '10px 10px 0 0'
                  }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: 200,
                  backgroundColor: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#888',
                  borderRadius: '10px 10px 0 0'
                }}>
                  Sin imagen
                </div>
              )}
              
              <div style={{ padding: 16 }}>
                <h3 style={{ color: '#002147', marginBottom: 12 }}>{property.title}</h3>
                <div style={{ marginBottom: 12, lineHeight: 1.5 }}>
                  <div><b>Tipo:</b> {property.type}</div>
                  <div><b>Operación:</b> {property.operation}</div>
                  <div><b>Precio:</b> ${Number(property.price).toLocaleString()}</div>
                  <div><b>Ubicación:</b> {property.location}</div>
                  {property.area && <div><b>Área:</b> {property.area} m²</div>}
                  {property.bedrooms > 0 && <div><b>Habitaciones:</b> {property.bedrooms}</div>}
                  {property.bathrooms > 0 && <div><b>Baños:</b> {property.bathrooms}</div>}
                </div>
                <Link
                  to={`/propiedades/${property.id}`}
                  style={{
                    background: '#f5a623',
                    color: '#fff',
                    padding: '10px 16px',
                    borderRadius: 6,
                    textAlign: 'center',
                    textDecoration: 'none',
                    display: 'block',
                    fontWeight: 'bold'
                  }}
                >
                  Ver detalles
                </Link>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#888' }}>
              No se encontraron propiedades con esos filtros.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertyCatalog;
