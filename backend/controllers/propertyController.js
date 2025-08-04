const fs = require('fs');
const path = require('path');

// Simulación de base de datos en memoria
let properties = [
  {
    id: 1,
    title: 'Casa Moderna en El Poblado',
    description: 'Hermosa casa moderna con excelente ubicación',
    price: 450000000,
    location: 'Medellín',
    address: 'Carrera 43A # 15-30',
    type: 'casa',
    status: 'disponible',
    operation: 'venta',
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    parking: 1,
    images: [],
    features: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Apartamento en Laureles',
    description: 'Cómodo apartamento cerca al metro',
    price: 280000000,
    location: 'Medellín',
    address: 'Carrera 76 # 32-15',
    type: 'apartamento',
    status: 'disponible',
    operation: 'venta',
    bedrooms: 2,
    bathrooms: 1,
    area: 80,
    parking: 1,
    images: [],
    features: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let nextId = 3;

exports.create = async (req, res) => {
  try {
    console.log('🏠 Creating property');
    console.log('Body:', req.body);
    console.log('Files:', req.files ? req.files.length : 0);

    // Procesar las imágenes subidas
    const imageFiles = req.files || [];
    const imageNames = imageFiles.map(file => file.filename);

    // Crear nueva propiedad
    const newProperty = {
      id: nextId++,
      title: req.body.title || '',
      description: req.body.description || '',
      price: parseFloat(req.body.price) || 0,
      location: req.body.location || '',
      address: req.body.address || '',
      type: req.body.type || 'casa',
      status: req.body.status || 'disponible',
      operation: req.body.operation || 'venta',
      bedrooms: parseInt(req.body.bedrooms) || 0,
      bathrooms: parseInt(req.body.bathrooms) || 0,
      area: parseFloat(req.body.area) || 0,
      parking: parseInt(req.body.parking) || 0,
      images: imageNames,
      features: req.body.features || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Agregar a nuestro array de propiedades
    properties.push(newProperty);

    console.log('✅ Property created:', newProperty.title);
    res.status(201).json({ 
      success: true, 
      message: 'Propiedad creada exitosamente',
      property: newProperty 
    });
  } catch (error) {
    console.error('❌ Error creating property:', error);
    res.status(400).json({ 
      success: false, 
      message: 'Error al crear la propiedad',
      error: error.message 
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    console.log('📋 Getting all properties');
    console.log('Total properties:', properties.length);

    res.json({
      success: true,
      properties: properties,
      total: properties.length
    });
  } catch (error) {
    console.error('❌ Error getting properties:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener las propiedades',
      error: error.message 
    });
  }
};

exports.getById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const property = properties.find(p => p.id === id);
    
    if (!property) {
      return res.status(404).json({ 
        success: false, 
        message: 'Propiedad no encontrada' 
      });
    }

    res.json({
      success: true,
      property: property
    });
  } catch (error) {
    console.error('❌ Error getting property:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener la propiedad',
      error: error.message 
    });
  }
};

exports.update = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const propertyIndex = properties.findIndex(p => p.id === id);
    
    if (propertyIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Propiedad no encontrada' 
      });
    }

    // Procesar nuevas imágenes
    const imageFiles = req.files || [];
    const newImageNames = imageFiles.map(file => file.filename);

    // Mantener imágenes existentes y agregar nuevas
    const currentImages = properties[propertyIndex].images || [];
    const updatedImages = [...currentImages, ...newImageNames];

    // Actualizar la propiedad
    const updatedProperty = {
      ...properties[propertyIndex],
      title: req.body.title || properties[propertyIndex].title,
      description: req.body.description || properties[propertyIndex].description,
      price: parseFloat(req.body.price) || properties[propertyIndex].price,
      location: req.body.location || properties[propertyIndex].location,
      address: req.body.address || properties[propertyIndex].address,
      type: req.body.type || properties[propertyIndex].type,
      status: req.body.status || properties[propertyIndex].status,
      operation: req.body.operation || properties[propertyIndex].operation,
      bedrooms: parseInt(req.body.bedrooms) || properties[propertyIndex].bedrooms,
      bathrooms: parseInt(req.body.bathrooms) || properties[propertyIndex].bathrooms,
      area: parseFloat(req.body.area) || properties[propertyIndex].area,
      parking: parseInt(req.body.parking) || properties[propertyIndex].parking,
      images: updatedImages,
      updatedAt: new Date().toISOString()
    };

    properties[propertyIndex] = updatedProperty;

    console.log('✅ Property updated:', updatedProperty.title);
    res.json({ 
      success: true, 
      message: 'Propiedad actualizada exitosamente',
      property: updatedProperty 
    });
  } catch (error) {
    console.error('❌ Error updating property:', error);
    res.status(400).json({ 
      success: false, 
      message: 'Error al actualizar la propiedad',
      error: error.message 
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const propertyIndex = properties.findIndex(p => p.id === id);
    
    if (propertyIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Propiedad no encontrada' 
      });
    }

    // Eliminar imágenes del disco si existen
    const property = properties[propertyIndex];
    if (property.images && Array.isArray(property.images)) {
      property.images.forEach(img => {
        const imgPath = path.join(__dirname, '..', 'uploads', img);
        if (fs.existsSync(imgPath)) {
          fs.unlinkSync(imgPath);
        }
      });
    }

    // Eliminar la propiedad del array
    properties.splice(propertyIndex, 1);

    console.log('✅ Property deleted:', id);
    res.json({ 
      success: true, 
      message: 'Propiedad eliminada exitosamente' 
    });
  } catch (error) {
    console.error('❌ Error deleting property:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar la propiedad',
      error: error.message 
    });
  }
};
