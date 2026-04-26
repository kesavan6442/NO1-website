const db = require('./db');

async function seed() {
    try {
        console.log('Starting demo data sync...');
        
        // Add categories
        const categories = [
            ['Drums', 'fas fa-drum', '/assets/drums.png'],
            ['Paper Shot', 'fas fa-sparkles', '/assets/papershot.png'],
            ['Teddy Show', 'fas fa-smile', '/assets/teddy.png'],
            ['DJ Lights', 'fas fa-lightbulb', '/assets/djlights.png']
        ];

        for (const cat of categories) {
            await db.execute(
                'INSERT IGNORE INTO categories (name, icon, cover_image) VALUES (?, ?, ?)',
                cat
            );
        }

        // Add services
        const services = [
            ['Traditional Chanda Melam', 'Kerala style grand percussion for grand entries and festive celebrations.', '15000', 'Drums', '/assets/drums.png'],
            ['Paper Shot & FX', 'Grand entry paper cannon shots and magical stage effects for weddings.', '5000', 'Paper Shot', '/assets/papershot.png'],
            ['Premium Teddy Mascot', 'Funny mascots and entertainment for children and family fun at parties.', '3500', 'Teddy Show', '/assets/teddy.png'],
            ['LED Backdrop & DJ Lights', 'Programmable stage lighting and high-quality LED backdrop setups for events.', '25000', 'DJ Lights', '/assets/djlights.png']
        ];

        for (const s of services) {
            await db.execute(
                'INSERT IGNORE INTO services (name, description, price, category, image) VALUES (?, ?, ?, ?, ?)',
                s
            );
        }

        console.log('✅ Demo data synced successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Sync failed:', err);
        process.exit(1);
    }
}

seed();
