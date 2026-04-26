require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors({ origin: '*' })); 
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Create uploads folder if not exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Serve uploads as static files
app.use('/uploads', express.static(uploadDir));

// Multer Storage Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
    }
});
const upload = multer({ storage });

// Multi-file Upload Endpoint
app.post('/api/upload', upload.array('files'), (req, res) => {
    try {
        const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;
        const fileUrls = req.files.map(file => ({
            url: `${baseUrl}/uploads/${file.filename}`,
            type: file.mimetype.startsWith('video') ? 'video' : 'image'
        }));
        res.json({ success: true, files: fileUrls });
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ success: true, status: 'online' });
});

// Stats API
app.get('/api/stats', async (req, res) => {
    try {
        const [[bookings]] = await db.execute('SELECT COUNT(*) as count FROM bookings');
        const [[customers]] = await db.execute('SELECT COUNT(*) as count FROM users WHERE role = "customer"');
        const [[categories]] = await db.execute('SELECT COUNT(*) as count FROM categories');
        const [[revenue]] = await db.execute('SELECT SUM(total_price) as sum FROM bookings WHERE status = "completed"');
        
        res.json({
            totalBookings: bookings.count || 0,
            totalCustomers: customers.count || 0,
            totalCategories: categories.count || 0,
            totalRevenue: revenue.sum || 0
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- SERVICES ---
app.get('/api/services', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM services ORDER BY name ASC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/services/:id', async (req, res) => {
    try {
        const [[service]] = await db.execute('SELECT * FROM services WHERE id = ?', [req.params.id]);
        if (!service) return res.status(404).json({ error: 'Service not found' });
        res.json(service);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/services', async (req, res) => {
    const { name, description, price, category, image } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO services (name, description, price, category, image) VALUES (?, ?, ?, ?, ?)',
            [name, description, price, category, image]
        );
        res.json({ success: true, id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/services/:id', async (req, res) => {
    const { name, description, price, category, image } = req.body;
    try {
        await db.execute(
            'UPDATE services SET name = ?, description = ?, price = ?, category = ?, image = ? WHERE id = ?',
            [name, description, price, category, image, req.params.id]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/services/:id', async (req, res) => {
    try {
        await db.execute('DELETE FROM services WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- BOOKINGS ---
app.get('/api/bookings', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM bookings ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/bookings', async (req, res) => {
    const { customer, mobile, service, date, notes, address, total_price } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO bookings (customer, mobile, service, date, notes, address, total_price) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [customer, mobile, service, date, notes, address, total_price || 0]
        );
        res.json({ success: true, id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/bookings/:id', async (req, res) => {
    const { status, total_price, notes, address } = req.body;
    try {
        await db.execute(
            'UPDATE bookings SET status = ?, total_price = ?, notes = ?, address = ? WHERE id = ?',
            [status, total_price, notes, address, req.params.id]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- REVIEWS ---
app.get('/api/reviews', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM reviews ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/reviews/:id/approve', async (req, res) => {
    try {
        await db.execute('UPDATE reviews SET is_approved = 1 WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/reviews/:id/feature', async (req, res) => {
    const { isFeatured } = req.body;
    try {
        await db.execute('UPDATE reviews SET is_featured = ? WHERE id = ?', [isFeatured ? 1 : 0, req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/reviews/:id', async (req, res) => {
    try {
        await db.execute('DELETE FROM reviews WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- MEDIA ---
app.get('/api/media', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM media ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/services/:id/media', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM media WHERE service_id = ? ORDER BY created_at DESC', [req.params.id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/services/:id/media', async (req, res) => {
    const { url, type } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO media (service_id, url, type) VALUES (?, ?, ?)',
            [req.params.id, url, type || 'image']
        );
        res.json({ success: true, id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/media/:id', async (req, res) => {
    try {
        const [[media]] = await db.execute('SELECT url FROM media WHERE id = ?', [req.params.id]);
        if (media) {
            const fileName = media.url.split('/').pop();
            const filePath = path.join(uploadDir, fileName);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        await db.execute('DELETE FROM media WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- CUSTOMERS ---
app.get('/api/customers', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT id, name, email, is_blocked FROM users WHERE role = "customer"');
        const customersWithStats = await Promise.all(rows.map(async (user) => {
            const [[stats]] = await db.execute('SELECT COUNT(*) as count FROM bookings WHERE customer = ?', [user.name]);
            return { ...user, bookings: stats.count };
        }));
        res.json(customersWithStats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/customers/:id/block', async (req, res) => {
    const { isBlocked } = req.body;
    try {
        await db.execute('UPDATE users SET is_blocked = ? WHERE id = ?', [isBlocked ? 1 : 0, req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- CATEGORIES ---
app.get('/api/categories', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM categories');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/categories', async (req, res) => {
    const { name, icon, cover_image } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO categories (name, icon, cover_image) VALUES (?, ?, ?)',
            [name, icon || 'fas fa-layer-group', cover_image || '']
        );
        res.json({ success: true, id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/categories/:id', async (req, res) => {
    const { name, icon, cover_image } = req.body;
    try {
        await db.execute(
            'UPDATE categories SET name = ?, icon = ?, cover_image = ? WHERE id = ?',
            [name, icon || 'fas fa-layer-group', cover_image || '', req.params.id]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/categories/:id', async (req, res) => {
    try {
        await db.execute('DELETE FROM categories WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- AUTH ---
app.post('/api/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const role = email === 'kesavan.mcse@gmail.com' ? 'admin' : 'customer';
        const [result] = await db.execute(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role]
        );
        res.json({ success: true, id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) return res.status(401).json({ error: 'Invalid email or password' });

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });

        if (user.is_blocked) return res.status(403).json({ error: 'Account is blocked' });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'no1secret', { expiresIn: '1d' });
        res.json({ 
            success: true, 
            token, 
            user: { id: user.id, name: user.name, email: user.email, role: user.role } 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
// --- SETTINGS ---
app.get('/api/settings', async (req, res) => {
    try {
        const [[settings]] = await db.execute('SELECT * FROM settings WHERE id = 1');
        res.json(settings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/settings', async (req, res) => {
    const { site_name, phone1, phone2, email1, email2, address, whatsapp, hero_image } = req.body;
    try {
        await db.execute(
            'UPDATE settings SET site_name = ?, phone1 = ?, phone2 = ?, email1 = ?, email2 = ?, address = ?, whatsapp = ?, hero_image = ? WHERE id = 1',
            [site_name, phone1, phone2, email1, email2, address, whatsapp, hero_image]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
