const fs = require('fs');
const path = require('path');

// Simulación de base de datos en memoria (fallback)
let propertiesMemory = [
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
  },
  {
    id: 3,
    title: 'Local Comercial en Envigado',
    description: 'Excelente local comercial en zona de alta circulación',
    price: 320000000,
    location: 'Envigado',
    address: 'Carrera 25 # 35-20',
    type: 'local',
    status: 'disponible',
    operation: 'venta',
    bedrooms: 0,
    bathrooms: 2,
    area: 95,
    parking: 2,
    images: [],
    features: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 4,
    title: 'Casa Campestre en La Ceja',
    description: 'Hermosa casa campestre con vista panorámica',
    price: 650000000,
    location: 'La Ceja',
    address: 'Vereda San José',
    type: 'casa',
    status: 'disponible',
    operation: 'venta',
    bedrooms: 4,
    bathrooms: 3,
    area: 200,
    parking: 3,
    images: [],
    features: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let nextId = 5;

// Función para obtener el modelo Property
const getPropertyModel = () => {
  try {
    const { Property } = require('../models');
    return Property;
  } catch (error) {
    console.log('⚠️ Models not available, using memory storage');
    return null;
  }
};

// Función para convertir de memoria a formato de base de datos
const formatPropertyForDB = (property) => ({
  ...property,
  images: JSON.stringify(property.images || []),
  features: JSON.stringify(property.features || [])
});

// Función para convertir de base de datos a formato frontend
const formatPropertyFromDB = (property) => {
  const formatted = { ...property };
  
  // Convertir images de JSON string a array si es necesario
  if (typeof formatted.images === 'string') {
    try {
      formatted.images = JSON.parse(formatted.images);
    } catch {
      formatted.images = [];
    }
  }
  
  // Convertir features de JSON string a array si es necesario
  if (typeof formatted.features === 'string') {
    try {
      formatted.features = JSON.parse(formatted.features);
    } catch {
      formatted.features = [];
    }
  }
  
  return formatted;
};

exports.create = async (req, res) => {
  try {
    console.log('🏠 Creating property');
    console.log('Body:', req.body);
    console.log('Files:', req.files ? req.files.length : 0);

    const Property = getPropertyModel();
    const imageFiles = req.files || [];
    const imageNames = imageFiles.map(file => file.filename);

    const propertyData = {
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
      features: req.body.features || []
    };

    if (Property) {
      // Usar base de datos real
      console.log('💾 Using database storage');
      const property = await Property.create(formatPropertyForDB(propertyData));
      const formattedProperty = formatPropertyFromDB(property.toJSON());
      
      console.log('✅ Property created in database:', formattedProperty.title);
      res.status(201).json({ 
        success: true, 
        message: 'Propiedad creada exitosamente en base de datos',
        property: formattedProperty 
      });
    } else {
      // Usar memoria (fallback)
      console.log('🧠 Using memory storage');
      const newProperty = {
        id: nextId++,
        ...propertyData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      propertiesMemory.push(newProperty);
      console.log('✅ Property created in memory:', newProperty.title);
      res.status(201).json({ 
        success: true, 
        message: 'Propiedad creada exitosamente en memoria',
        property: newProperty 
      });
    }
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
    
    const Property = getPropertyModel();
    
    if (Property) {
      // Usar base de datos real
      console.log('💾 Fetching from database');
      const properties = await Property.findAll({
        order: [['createdAt', 'DESC']]
      });
      
      const formattedProperties = properties.map(p => formatPropertyFromDB(p.toJSON()));
      console.log('Total properties from database:', formattedProperties.length);
      
      res.json({
        success: true,
        properties: formattedProperties,
        total: formattedProperties.length,
        source: 'database'
      });
    } else {
      // Usar memoria (fallback)
      console.log('🧠 Fetching from memory');
      console.log('Total properties from memory:', propertiesMemory.length);
      
      res.json({
        success: true,
        properties: propertiesMemory,
        total: propertiesMemory.length,
        source: 'memory'
      });
    }
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
    console.log('🔍 Looking for property with ID:', id);
    
    const Property = getPropertyModel();
    
    if (Property) {
      // Usar base de datos real
      console.log('💾 Searching in database');
      const property = await Property.findByPk(id);
      
      if (!property) {
        console.log('❌ Property not found in database with ID:', id);
        return res.status(404).json({ 
          success: false, 
          message: `Propiedad con ID ${id} no encontrada en la base de datos` 
        });
      }
      
      const formattedProperty = formatPropertyFromDB(property.toJSON());
      console.log('✅ Property found in database:', formattedProperty.title);
      res.json({
        success: true,
        property: formattedProperty,
        source: 'database'
      });
    } else {
      // Usar memoria (fallback)
      console.log('🧠 Searching in memory');
      console.log('Available property IDs:', propertiesMemory.map(p => p.id));
      
      const property = propertiesMemory.find(p => p.id === id);
      
      if (!property) {
        console.log('❌ Property not found in memory with ID:', id);
        return res.status(404).json({ 
          success: false, 
          message: `Propiedad con ID ${id} no encontrada. IDs disponibles: ${propertiesMemory.map(p => p.id).join(', ')}` 
        });
      }
      
      console.log('✅ Property found in memory:', property.title);
      res.json({
        success: true,
        property: property,
        source: 'memory'
      });
    }
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
    console.log('📝 Updating property with ID:', id);
    
    const Property = getPropertyModel();
    const imageFiles = req.files || [];
    const newImageNames = imageFiles.map(file => file.filename);

    if (Property) {
      // Usar base de datos real
      console.log('💾 Updating in database');
      const property = await Property.findByPk(id);
      
      if (!property) {
        return res.status(404).json({ 
          success: false, 
          message: 'Propiedad no encontrada en la base de datos' 
        });
      }

      // Mantener imágenes existentes y agregar nuevas
      const existingImages = property.images ? 
        (typeof property.images === 'string' ? JSON.parse(property.images) : property.images) : [];
      const updatedImages = [...existingImages, ...newImageNames];

      const updateData = formatPropertyForDB({
        title: req.body.title || property.title,
        description: req.body.description || property.description,
        price: parseFloat(req.body.price) || property.price,
        location: req.body.location || property.location,
        address: req.body.address || property.address,
        type: req.body.type || property.type,
        status: req.body.status || property.status,
        operation: req.body.operation || property.operation,
        bedrooms: parseInt(req.body.bedrooms) || property.bedrooms,
        bathrooms: parseInt(req.body.bathrooms) || property.bathrooms,
        area: parseFloat(req.body.area) || property.area,
        parking: parseInt(req.body.parking) || property.parking,
        images: updatedImages,
        features: req.body.features || property.features
      });

      await property.update(updateData);
      const formattedProperty = formatPropertyFromDB(property.toJSON());
      
      console.log('✅ Property updated in database:', formattedProperty.title);
      res.json({ 
        success: true, 
        message: 'Propiedad actualizada exitosamente en base de datos',
        property: formattedProperty 
      });
    } else {
      // Usar memoria (fallback)
      console.log('🧠 Updating in memory');
      const propertyIndex = propertiesMemory.findIndex(p => p.id === id);
      
      if (propertyIndex === -1) {
        return res.status(404).json({ 
          success: false, 
          message: 'Propiedad no encontrada en memoria' 
        });
      }

      // Mantener imágenes existentes y agregar nuevas
      const currentImages = propertiesMemory[propertyIndex].images || [];
      const updatedImages = [...currentImages, ...newImageNames];

      const updatedProperty = {
        ...propertiesMemory[propertyIndex],
        title: req.body.title || propertiesMemory[propertyIndex].title,
        description: req.body.description || propertiesMemory[propertyIndex].description,
        price: parseFloat(req.body.price) || propertiesMemory[propertyIndex].price,
        location: req.body.location || propertiesMemory[propertyIndex].location,
        address: req.body.address || propertiesMemory[propertyIndex].address,
        type: req.body.type || propertiesMemory[propertyIndex].type,
        status: req.body.status || propertiesMemory[propertyIndex].status,
        operation: req.body.operation || propertiesMemory[propertyIndex].operation,
        bedrooms: parseInt(req.body.bedrooms) || propertiesMemory[propertyIndex].bedrooms,
        bathrooms: parseInt(req.body.bathrooms) || propertiesMemory[propertyIndex].bathrooms,
        area: parseFloat(req.body.area) || propertiesMemory[propertyIndex].area,
        parking: parseInt(req.body.parking) || propertiesMemory[propertyIndex].parking,
        images: updatedImages,
        updatedAt: new Date().toISOString()
      };

      propertiesMemory[propertyIndex] = updatedProperty;
      console.log('✅ Property updated in memory:', updatedProperty.title);
      res.json({ 
        success: true, 
        message: 'Propiedad actualizada exitosamente en memoria',
        property: updatedProperty 
      });
    }
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
    console.log('🗑️ Deleting property with ID:', id);
    
    const Property = getPropertyModel();
    
    if (Property) {
      // Usar base de datos real
      console.log('💾 Deleting from database');
      const property = await Property.findByPk(id);
      
      if (!property) {
        return res.status(404).json({ 
          success: false, 
          message: 'Propiedad no encontrada en la base de datos' 
        });
      }

      // Eliminar imágenes del disco si existen
      const images = property.images ? 
        (typeof property.images === 'string' ? JSON.parse(property.images) : property.images) : [];
      
      images.forEach(img => {
        const imgPath = path.join(__dirname, '..', 'uploads', img);
        if (fs.existsSync(imgPath)) {
          fs.unlinkSync(imgPath);
        }
      });

      await property.destroy();
      console.log('✅ Property deleted from database:', id);
      res.json({ 
        success: true, 
        message: 'Propiedad eliminada exitosamente de la base de datos' 
      });
    } else {
      // Usar memoria (fallback)
      console.log('🧠 Deleting from memory');
      const propertyIndex = propertiesMemory.findIndex(p => p.id === id);
      
      if (propertyIndex === -1) {
        return res.status(404).json({ 
          success: false, 
          message: 'Propiedad no encontrada en memoria' 
        });
      }

      // Eliminar imágenes del disco si existen
      const property = propertiesMemory[propertyIndex];
      if (property.images && Array.isArray(property.images)) {
        property.images.forEach(img => {
          const imgPath = path.join(__dirname, '..', 'uploads', img);
          if (fs.existsSync(imgPath)) {
            fs.unlinkSync(imgPath);
          }
        });
      }

      propertiesMemory.splice(propertyIndex, 1);
      console.log('✅ Property deleted from memory:', id);
      res.json({ 
        success: true, 
        message: 'Propiedad eliminada exitosamente de la memoria' 
      });
    }
  } catch (error) {
    console.error('❌ Error deleting property:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar la propiedad',
      error: error.message 
    });
  }
};
