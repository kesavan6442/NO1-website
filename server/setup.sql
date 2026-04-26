CREATE DATABASE IF NOT EXISTS no1_events;
USE no1_events;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(100),
    role ENUM('admin', 'customer') DEFAULT 'customer',
    is_blocked BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer VARCHAR(100),
    mobile VARCHAR(15),
    service VARCHAR(100),
    date DATE,
    notes TEXT,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    total_price DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    description TEXT,
    price VARCHAR(50),
    category VARCHAR(50),
    image VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE,
    icon VARCHAR(50),
    cover_image VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    service_id INT,
    rating INT,
    comment TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS media (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_id INT,
    url VARCHAR(255),
    type ENUM('image', 'video'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Default Admin
INSERT IGNORE INTO users (name, email, password, role) VALUES ('Kesavan', 'kesavan.mcse@gmail.com', 'kesav123', 'admin');

-- Initial Categories
INSERT IGNORE INTO categories (name, icon) VALUES 
('Drums', 'fas fa-drum'),
('Paper Shot', 'fas fa-sparkles'),
('Dhol Band', 'fas fa-music'),
('DJ Lights', 'fas fa-lightbulb');
