import React, { useEffect, useState } from 'react';
import api from '../services/api';

const estados = ['pendiente', 'contactado', 'cerrado'];

const ContactRequestList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get('/contacts');
      console.log('ContactRequestList response:', res.data);
      // Handle both new structure { contacts: [...] } and old structure [...]
      const contactsData = res.data.contacts || res.data || [];
      setRequests(Array.isArray(contactsData) ? contactsData : []);
    } catch (err) {
      console.error('Error fetching contact requests:', err);
      setRequests([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta solicitud?')) {
      await api.delete(`/contacts/${id}`);
      fetchRequests();
    }
  };

  const handleEditClick = (req) => {
    setEditingId(req.id);
    setNewStatus(req.status);
  };

  const handleSave = async (id) => {
    try {
      await api.put(`/contacts/${id}`, { status: newStatus });
      setEditingId(null);
      fetchRequests();
    } catch (err) {
      alert('Error al actualizar el estado');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setNewStatus('');
  };

  return (
    <div>
      <h3>Solicitudes de Contacto</h3>
      {loading ? (
        <div>Cargando solicitudes...</div>
      ) : (
        <table border="1" cellPadding="8" style={{ width: '100%', marginTop: 16 }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Propiedad</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Mensaje</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id}>
                <td>{req.id}</td>
                <td>{req.property ? req.property.title : 'N/A'}</td>
                <td>{req.name}</td>
                <td>{req.email}</td>
                <td>{req.phone}</td>
                <td>{req.message}</td>
                <td>
                  {editingId === req.id ? (
                    <select
                      value={newStatus}
                      onChange={e => setNewStatus(e.target.value)}
                    >
                      {estados.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  ) : (
                    req.status
                  )}
                </td>
                <td>
                  {editingId === req.id ? (
                    <>
                      <button onClick={() => handleSave(req.id)}>Guardar</button>
                      <button onClick={handleCancel}>Cancelar</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEditClick(req)}>Editar</button>
                      <button onClick={() => handleDelete(req.id)}>Eliminar</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center' }}>No hay solicitudes registradas.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ContactRequestList;
