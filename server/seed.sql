-- Seed Initial Services to match the website's hardcoded data
USE no1_events;

INSERT IGNORE INTO services (name, description, price, category, image, is_active) VALUES 
('Traditional Chanda Melam', 'Kerala style grand percussion for grand entries.', '15000', 'Drums', '/assets/drums.png', 1),
('Paper Shot & FX', 'Grand entry paper cannon shots and magical stage effects.', '5000', 'Effects', '/assets/papershot.png', 1),
('Teddy Show', 'Funny mascots and entertainment for children and family fun.', '3500', 'Kids Fun', '/assets/teddy.png', 1),
('LED Backdrop & DJ Lights', 'Programmable stage lighting and high-quality LED backdrop setups.', '25000', 'Lighting', '/assets/djlights.png', 1);

-- Initial Categories
INSERT IGNORE INTO categories (name, icon, cover_image) VALUES 
('Drums', 'fas fa-drum', '/assets/drums.png'),
('Effects', 'fas fa-sparkles', '/assets/papershot.png'),
('Kids Fun', 'fas fa-smile', '/assets/teddy.png'),
('Lighting', 'fas fa-lightbulb', '/assets/djlights.png');
