const { Pool } = require('pg');
require('dotenv').config();

//would have used env variables but for now this is fine
const pool = new Pool({
    user:  'postgres',
    host: 'localhost',
    database: 'bank_db',
    password:  'postgres',
    port:  5432,
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
}; 