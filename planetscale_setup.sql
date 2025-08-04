-- ====================================
-- SCRIPT PARA PLANETSCALE MySQL
-- INMOBILIARIA LEAL
-- ====================================

-- TABLA: users (Usuarios/Empleados)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'super_admin') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- TABLA: properties (Propiedades)
CREATE TABLE properties (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(15,2) NOT NULL,
    location VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    type ENUM('casa', 'apartamento', 'local', 'oficina', 'terreno', 'bodega') NOT NULL,
    status ENUM('disponible', 'vendido', 'alquilado') DEFAULT 'disponible',
    operation ENUM('venta', 'alquiler') NOT NULL,
    bedrooms INT DEFAULT 0,
    bathrooms INT DEFAULT 0,
    area DECIMAL(10,2),
    parking INT DEFAULT 0,
    images JSON,
    features JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- TABLA: contact_requests (Solicitudes)
CREATE TABLE contact_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    message TEXT,
    property_id INT,
    status ENUM('pendiente', 'contactado', 'cerrado') DEFAULT 'pendiente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL
);

-- Insertar usuarios de prueba
INSERT INTO users (name, email, password, role) VALUES
('Admin Usuario', 'admin@inmobiliaria.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('Super Admin', 'superadmin@inmobiliaria.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'super_admin');

-- Insertar propiedades de prueba
INSERT INTO properties (title, description, price, location, address, type, status, operation, bedrooms, bathrooms, area, parking, images, features) VALUES
('Casa Moderna en El Poblado', 'Hermosa casa moderna con excelente ubicación', 450000000, 'Medellín', 'Carrera 43A # 15-30', 'casa', 'disponible', 'venta', 3, 2, 120, 1, '[]', '[]'),
('Apartamento en Laureles', 'Cómodo apartamento cerca al metro', 280000000, 'Medellín', 'Carrera 76 # 32-15', 'apartamento', 'disponible', 'venta', 2, 1, 80, 1, '[]', '[]'),
('Local Comercial en Envigado', 'Excelente local comercial en zona de alta circulación', 320000000, 'Envigado', 'Carrera 25 # 35-20', 'local', 'disponible', 'venta', 0, 2, 95, 2, '[]', '[]'),
('Casa Campestre en La Ceja', 'Hermosa casa campestre con vista panorámica', 650000000, 'La Ceja', 'Vereda San José', 'casa', 'disponible', 'venta', 4, 3, 200, 3, '[]', '[]');

-- Insertar solicitudes de prueba
INSERT INTO contact_requests (name, email, phone, message, property_id, status) VALUES
('Juan Pérez', 'juan@email.com', '3001234567', 'Estoy interesado en esta propiedad', 1, 'pendiente'),
('keiner tirado', 'keinertirado1302@gmail.com', '3203950777', 'Me interesa conocer más detalles', 1, 'contactado');
