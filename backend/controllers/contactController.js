// Simulación de base de datos en memoria para solicitudes de contacto
let contactRequests = [
  {
    id: 1,
    name: 'Juan Pérez',
    email: 'juan@email.com',
    phone: '3001234567',
    message: 'Estoy interesado en esta propiedad',
    propertyId: 1,
    status: 'pendiente',
    createdAt: new Date().toISOString()
  }
];

let nextId = 2;

exports.create = async (req, res) => {
  try {
    console.log('📞 Creating contact request');
    console.log('Body:', req.body);

    const { name, email, phone, message, propertyId } = req.body;

    // Validación básica
    if (!name || !email || !phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Nombre, email y teléfono son requeridos' 
      });
    }

    // Crear nueva solicitud de contacto
    const newContact = {
      id: nextId++,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      message: message ? message.trim() : '',
      propertyId: parseInt(propertyId) || null,
      status: 'pendiente',
      createdAt: new Date().toISOString()
    };

    // Agregar a nuestro array de solicitudes
    contactRequests.push(newContact);

    console.log('✅ Contact request created:', newContact.name);
    res.status(201).json({ 
      success: true, 
      message: 'Solicitud de contacto enviada exitosamente',
      contact: newContact 
    });
  } catch (error) {
    console.error('❌ Error creating contact request:', error);
    res.status(400).json({ 
      success: false, 
      message: 'Error al crear la solicitud de contacto',
      error: error.message 
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    console.log('📋 Getting all contact requests');
    console.log('Total contact requests:', contactRequests.length);

    // Ordenar por fecha de creación (más recientes primero)
    const sortedContacts = contactRequests.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json({
      success: true,
      contacts: sortedContacts,
      total: contactRequests.length
    });
  } catch (error) {
    console.error('❌ Error getting contact requests:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener las solicitudes de contacto',
      error: error.message 
    });
  }
};

exports.getById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const contact = contactRequests.find(c => c.id === id);
    
    if (!contact) {
      return res.status(404).json({ 
        success: false, 
        message: 'Solicitud de contacto no encontrada' 
      });
    }

    res.json({
      success: true,
      contact: contact
    });
  } catch (error) {
    console.error('❌ Error getting contact request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener la solicitud de contacto',
      error: error.message 
    });
  }
};

exports.update = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const contactIndex = contactRequests.findIndex(c => c.id === id);
    
    if (contactIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Solicitud de contacto no encontrada' 
      });
    }

    // Actualizar la solicitud
    const updatedContact = {
      ...contactRequests[contactIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    contactRequests[contactIndex] = updatedContact;

    console.log('✅ Contact request updated:', updatedContact.id);
    res.json({ 
      success: true, 
      message: 'Solicitud de contacto actualizada exitosamente',
      contact: updatedContact 
    });
  } catch (error) {
    console.error('❌ Error updating contact request:', error);
    res.status(400).json({ 
      success: false, 
      message: 'Error al actualizar la solicitud de contacto',
      error: error.message 
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const contactIndex = contactRequests.findIndex(c => c.id === id);
    
    if (contactIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Solicitud de contacto no encontrada' 
      });
    }

    // Eliminar la solicitud del array
    contactRequests.splice(contactIndex, 1);

    console.log('✅ Contact request deleted:', id);
    res.json({ 
      success: true, 
      message: 'Solicitud de contacto eliminada exitosamente' 
    });
  } catch (error) {
    console.error('❌ Error deleting contact request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar la solicitud de contacto',
      error: error.message 
    });
  }
};
