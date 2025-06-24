require('dotenv').config();

if (!process.env.DATABASE_URL) {
  throw new Error("❌ DATABASE_URL não definida no .env");
}

module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './src/db/migrations'
    },
    seeds: {
      directory: './src/db/seeds'
    }
  }
};
