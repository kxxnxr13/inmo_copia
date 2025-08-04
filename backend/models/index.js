let User = null;
let Property = null;
let ContactRequest = null;

try {
  User = require('./User');
  Property = require('./Property');
  ContactRequest = require('./ContactRequest');

  // Definir relaciones solo si los modelos se cargaron correctamente
  ContactRequest.belongsTo(Property, { foreignKey: 'propertyId', as: 'property' });
  Property.hasMany(ContactRequest, { foreignKey: 'propertyId', as: 'contactRequests' });
} catch (error) {
  console.log('Error cargando modelos:', error.message);
  console.log('Los modelos no estarán disponibles - usando datos de prueba');
}

module.exports = {
  User,
  Property,
  ContactRequest
};
