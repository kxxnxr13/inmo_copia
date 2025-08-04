// Simulación de base de datos en memoria para solicitudes de contacto (fallback)
let contactRequestsMemory = [
  {
    id: 1,
    name: 'Juan Pérez',
    email: 'juan@email.com',
    phone: '3001234567',
    message: 'Estoy interesado en esta propiedad',
    propertyId: 1,
    status: 'pendiente',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: 'keiner tirado',
    email: 'keinertirado1302@gmail.com',
    phone: '3203950777',
    message: 'Me interesa conocer más detalles',
    propertyId: 1,
    status: 'contactado',
    createdAt: new Date().toISOString()
  }
];

let nextId = 3;

// Función para obtener los modelos
const getContactModels = () => {
  try {
    const { ContactRequest, Property } = require('../models');
    return { ContactRequest, Property };
  } catch (error) {
    console.log('⚠️ Models not available, using memory storage');
    return { ContactRequest: null, Property: null };
  }
};

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

    const { ContactRequest } = getContactModels();

    const contactData = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      message: message ? message.trim() : '',
      propertyId: parseInt(propertyId) || null,
      status: 'pendiente'
    };

    if (ContactRequest) {
      try {
        // Usar base de datos real
        console.log('💾 Using database storage');
        const contact = await ContactRequest.create(contactData);

        console.log('✅ Contact request created in database:', contact.name);
        return res.status(201).json({
          success: true,
          message: 'Solicitud de contacto enviada exitosamente a la base de datos',
          contact: contact.toJSON()
        });
      } catch (dbError) {
        console.error('❌ Database error, falling back to memory:', dbError.message);
        // Fallar silenciosamente a memoria
      }
    }

    // Usar memoria (fallback) - tanto si ContactRequest es null como si falla la consulta
    console.log('🧠 Using memory storage');
    const newContact = {
      id: nextId++,
      ...contactData,
      createdAt: new Date().toISOString()
    };

    contactRequestsMemory.push(newContact);
    console.log('✅ Contact request created in memory:', newContact.name);
    res.status(201).json({
      success: true,
      message: 'Solicitud de contacto enviada exitosamente en memoria',
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

    const { ContactRequest, Property } = getContactModels();

    if (ContactRequest) {
      try {
        // Usar base de datos real
        console.log('💾 Fetching from database');
        const contacts = await ContactRequest.findAll({
          include: Property ? [{
            model: Property,
            as: 'property',
            attributes: ['id', 'title']
          }] : [],
          order: [['createdAt', 'DESC']]
        });

        console.log('Total contact requests from database:', contacts.length);

        return res.json({
          success: true,
          contacts: contacts.map(c => c.toJSON()),
          total: contacts.length,
          source: 'database'
        });
      } catch (dbError) {
        console.error('❌ Database error, falling back to memory:', dbError.message);
        // Fallar silenciosamente a memoria
      }
    }

    // Usar memoria (fallback) - tanto si ContactRequest es null como si falla la consulta
    console.log('🧠 Fetching from memory');
    const sortedContacts = contactRequestsMemory.sort((a, b) =>
      new Date(b.createdAt) - new Date(a.createdAt)
    );

    console.log('Total contact requests from memory:', sortedContacts.length);

    res.json({
      success: true,
      contacts: sortedContacts,
      total: sortedContacts.length,
      source: 'memory'
    });
  } catch (error) {
    console.error('❌ Critical error getting contact requests:', error);
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
    console.log('🔍 Looking for contact request with ID:', id);

    const { ContactRequest, Property } = getContactModels();

    if (ContactRequest) {
      try {
        // Usar base de datos real
        console.log('💾 Searching in database');
        const contact = await ContactRequest.findByPk(id, {
          include: Property ? [{
            model: Property,
            as: 'property',
            attributes: ['id', 'title']
          }] : []
        });

        if (!contact) {
          console.log('❌ Contact request not found in database with ID:', id);
          // Fallar a memoria en lugar de devolver 404 inmediatamente
        } else {
          console.log('✅ Contact request found in database:', contact.name);
          return res.json({
            success: true,
            contact: contact.toJSON(),
            source: 'database'
          });
        }
      } catch (dbError) {
        console.error('❌ Database error, falling back to memory:', dbError.message);
        // Fallar silenciosamente a memoria
      }
    }

    // Usar memoria (fallback) - tanto si ContactRequest es null como si falla la consulta
    console.log('🧠 Searching in memory');
    const contact = contactRequestsMemory.find(c => c.id === id);

    if (!contact) {
      console.log('❌ Contact request not found in memory with ID:', id);
      return res.status(404).json({
        success: false,
        message: `Solicitud de contacto con ID ${id} no encontrada`
      });
    }

    console.log('✅ Contact request found in memory:', contact.name);
    res.json({
      success: true,
      contact: contact,
      source: 'memory'
    });
  } catch (error) {
    console.error('❌ Critical error getting contact request:', error);
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
    console.log('📝 Updating contact request with ID:', id);
    
    const { ContactRequest } = getContactModels();
    
    if (ContactRequest) {
      // Usar base de datos real
      console.log('💾 Updating in database');
      const contact = await ContactRequest.findByPk(id);
      
      if (!contact) {
        return res.status(404).json({ 
          success: false, 
          message: 'Solicitud de contacto no encontrada en la base de datos' 
        });
      }

      await contact.update(req.body);
      console.log('✅ Contact request updated in database:', contact.id);
      res.json({ 
        success: true, 
        message: 'Solicitud de contacto actualizada exitosamente en base de datos',
        contact: contact.toJSON() 
      });
    } else {
      // Usar memoria (fallback)
      console.log('🧠 Updating in memory');
      const contactIndex = contactRequestsMemory.findIndex(c => c.id === id);
      
      if (contactIndex === -1) {
        return res.status(404).json({ 
          success: false, 
          message: 'Solicitud de contacto no encontrada en memoria' 
        });
      }

      const updatedContact = {
        ...contactRequestsMemory[contactIndex],
        ...req.body,
        updatedAt: new Date().toISOString()
      };

      contactRequestsMemory[contactIndex] = updatedContact;
      console.log('✅ Contact request updated in memory:', updatedContact.id);
      res.json({ 
        success: true, 
        message: 'Solicitud de contacto actualizada exitosamente en memoria',
        contact: updatedContact 
      });
    }
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
    console.log('🗑️ Deleting contact request with ID:', id);
    
    const { ContactRequest } = getContactModels();
    
    if (ContactRequest) {
      // Usar base de datos real
      console.log('💾 Deleting from database');
      const contact = await ContactRequest.findByPk(id);
      
      if (!contact) {
        return res.status(404).json({ 
          success: false, 
          message: 'Solicitud de contacto no encontrada en la base de datos' 
        });
      }

      await contact.destroy();
      console.log('✅ Contact request deleted from database:', id);
      res.json({ 
        success: true, 
        message: 'Solicitud de contacto eliminada exitosamente de la base de datos' 
      });
    } else {
      // Usar memoria (fallback)
      console.log('🧠 Deleting from memory');
      const contactIndex = contactRequestsMemory.findIndex(c => c.id === id);
      
      if (contactIndex === -1) {
        return res.status(404).json({ 
          success: false, 
          message: 'Solicitud de contacto no encontrada en memoria' 
        });
      }

      contactRequestsMemory.splice(contactIndex, 1);
      console.log('✅ Contact request deleted from memory:', id);
      res.json({ 
        success: true, 
        message: 'Solicitud de contacto eliminada exitosamente de la memoria' 
      });
    }
  } catch (error) {
    console.error('❌ Error deleting contact request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar la solicitud de contacto',
      error: error.message 
    });
  }
};
