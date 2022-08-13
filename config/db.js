const { Pool } = require('pg');

// connect with either URI or connection parameters
// URI takes precedence if both methods are provided
const config = process.env.PG_URI
  ? {
      connectionString: process.env.PG_URI,
      ssl: {
        rejectUnauthorized: false,
      },
    }
  : {
      user: process.env.PG_USER,
      host: process.env.PG_HOST,
      database: process.env.PG_DB,
      password: process.env.PG_PASSWORD,
      port: process.env.PG_PORT,
    };

const pool = new Pool(config);
pool.connect((err) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
});

module.exports = pool;
