const { Pool } = require('pg');

// connect with either URI or connection parameters
// URI takes precedence if both methods are provided
const config = (process.env.PG_URI) ? ({
    connectionString: process.env.PG_URI
}) : ({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DB,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

const pool = new Pool(config);

module.exports = pool;