USE no1_events;

-- Ensure categories exist
INSERT IGNORE INTO categories (name, icon, cover_image) VALUES 
('Drums', 'fas fa-drum', '/assets/drums.png'),
('Paper Shot', 'fas fa-sparkles', '/assets/papershot.png'),
('Teddy Show', 'fas fa-smile', '/assets/teddy.png'),
('DJ Lights', 'fas fa-lightbulb', '/assets/djlights.png');

-- Add services matching the website
INSERT IGNORE INTO services (name, description, price, category, image, is_active) VALUES 
('Traditional Chanda Melam', 'Kerala style grand percussion for grand entries and festive celebrations.', '15000', 'Drums', '/assets/drums.png', 1),
('Paper Shot & FX', 'Grand entry paper cannon shots and magical stage effects for weddings.', '5000', 'Paper Shot', '/assets/papershot.png', 1),
('Premium Teddy Mascot', 'Funny mascots and entertainment for children and family fun at parties.', '3500', 'Teddy Show', '/assets/teddy.png', 1),
('LED Backdrop & DJ Lights', 'Programmable stage lighting and high-quality LED backdrop setups for events.', '25000', 'DJ Lights', '/assets/djlights.png', 1);
