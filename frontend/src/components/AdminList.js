import React, { useEffect, useState } from 'react';
import api from '../services/api';
import AdminForm from './AdminForm';

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [adminToEdit, setAdminToEdit] = useState(null);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');
      console.log('Users API response:', res.data);
      // Manejar tanto el formato nuevo como el viejo
      const users = res.data.users || res.data || [];
      setAdmins(users.filter(u => u.role === 'admin'));
    } catch (err) {
      console.error('Error fetching admins:', err);
      setAdmins([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleEdit = (admin) => {
    setAdminToEdit(admin);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este administrador?')) {
      await api.delete(`/users/${id}`);
      fetchAdmins();
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setAdminToEdit(null);
    fetchAdmins();
  };

  return (
    <div>
      <h3>Administradores</h3>
      {!showForm && (
        <button onClick={() => setShowForm(true)} style={{ marginBottom: 16 }}>Crear Administrador</button>
      )}
      {showForm && (
        <AdminForm
          onSuccess={handleSuccess}
          adminToEdit={adminToEdit}
          onCancel={() => { setShowForm(false); setAdminToEdit(null); }}
        />
      )}
      {loading ? (
        <div>Cargando administradores...</div>
      ) : (
        <table border="1" cellPadding="8" style={{ width: '100%', marginTop: 16 }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td>{admin.id}</td>
                <td>{admin.name}</td>
                <td>{admin.email}</td>
                <td>
                  <button onClick={() => handleEdit(admin)}>Editar</button>
                  <button onClick={() => handleDelete(admin.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {admins.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>No hay administradores registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminList;
