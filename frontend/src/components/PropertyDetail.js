import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import PublicContactForm from './PublicContactForm';

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await api.get(`/properties/${id}`);
        console.log('PropertyDetail response:', res.data);
        // Handle both new structure { property: {...} } and old structure {...}
        const propertyData = res.data.property || res.data;
        setProperty(propertyData);
      } catch (err) {
        console.error('Error fetching property:', err);
        setProperty(null);
      }
      setLoading(false);
    };
    fetchProperty();
  }, [id]);

  if (loading) return <div style={{ padding: 32 }}>Cargando propiedad...</div>;
  if (!property) return <div style={{ padding: 32 }}>Propiedad no encontrada.</div>;

  // Asegurarse de que images siempre sea un array
  const images = Array.isArray(property.images)
    ? property.images
    : property.images
      ? (() => {
          try {
            return JSON.parse(property.images);
          } catch {
            return [];
          }
        })()
      : [];

  return (
    <div style={{
      maxWidth: 900,
      margin: '40px auto',
      padding: 24,
      background: '#fff',
      borderRadius: 12,
      boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
    }}>
      <h2 style={{ color: '#002147', marginBottom: 16 }}>{property.title}</h2>
      
      {/* Galería de imágenes */}
      {images.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          {/* Imagen principal */}
          <div style={{ marginBottom: 16 }}>
            <img
              src={`http://localhost:8000/uploads/${images[selectedImage]}`}
              alt={`${property.title} - Imagen ${selectedImage + 1}`}
              style={{
                width: '100%',
                height: 400,
                objectFit: 'cover',
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            />
          </div>
          
          {/* Miniaturas (si hay más de una imagen) */}
          {images.length > 1 && (
            <div style={{
              display: 'flex',
              gap: 8,
              overflowX: 'auto',
              paddingBottom: 8
            }}>
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={`http://localhost:8000/uploads/${img}`}
                  alt={`Miniatura ${idx + 1}`}
                  onClick={() => setSelectedImage(idx)}
                  style={{
                    width: 80,
                    height: 60,
                    objectFit: 'cover',
                    borderRadius: 4,
                    cursor: 'pointer',
                    border: selectedImage === idx ? '3px solid #f5a623' : '2px solid #ddd',
                    transition: 'border 0.2s ease'
                  }}
                />
              ))}
            </div>
          )}
          
          {/* Contador de imágenes */}
          {images.length > 1 && (
            <p style={{ 
              textAlign: 'center', 
              color: '#666', 
              fontSize: '14px', 
              marginTop: 8 
            }}>
              Imagen {selectedImage + 1} de {images.length}
            </p>
          )}
        </div>
      )}

      <div style={{ marginBottom: 16 }}>
        <b>Tipo:</b> {property.type} &nbsp;|&nbsp;
        <b>Operación:</b> {property.operation} &nbsp;|&nbsp;
        <b>Estado:</b> {property.status}
      </div>
      <div style={{ marginBottom: 16 }}>
        <b>Precio:</b> ${Number(property.price).toLocaleString()} &nbsp;|&nbsp;
        <b>Ubicación:</b> {property.location}
      </div>
      <div style={{ marginBottom: 16 }}>
        <b>Dirección:</b> {property.address}
      </div>
      <div style={{ marginBottom: 16 }}>
        <b>Habitaciones:</b> {property.bedrooms} &nbsp;|&nbsp;
        <b>Baños:</b> {property.bathrooms} &nbsp;|&nbsp;
        <b>Área:</b> {property.area} m² &nbsp;|&nbsp;
        <b>Parqueaderos:</b> {property.parking}
      </div>
      <div style={{ marginBottom: 24 }}>
        <b>Descripción:</b>
        <p style={{ lineHeight: 1.6, marginTop: 8 }}>{property.description}</p>
      </div>
      
      <hr style={{ margin: '32px 0' }} />
      <PublicContactForm propertyId={property.id} />
    </div>
  );
};

export default PropertyDetail;
