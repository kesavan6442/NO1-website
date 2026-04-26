require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'no1_events',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000
});

console.log('Attempting to connect to database:', process.env.DB_NAME || 'no1_events');
module.exports = pool.promise();

// Test Connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('CRITICAL: Database connection failed!', err.message);
    } else {
        console.log('✅ Database connected successfully!');
        connection.release();
    }
});
