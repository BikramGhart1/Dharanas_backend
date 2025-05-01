const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER || 'apputilizer',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'dharanas',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

module.exports = pool;
