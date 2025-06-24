const { Client } = require('pg');

const host = process.env.DB_HOST || 'db';
const port = process.env.DB_PORT || 5432;
const user = process.env.DB_USER || 'postgres';
const password = process.env.DB_PASSWORD || 'postgres';
const database = process.env.DB_NAME || 'minerdata';

const maxRetries = 20;
const delay = 1500;

const tryConnect = async (retries) => {
    const client = new Client({ host, port, user, password, database });

    try {
        await client.connect();
        await client.query('SELECT 1+1;');
        console.log('✅ PostgreSQL pronto para conexões');
        await client.end();
        process.exit(0);
    } catch (err) {
        if (retries === 0) {
            console.error('❌ Banco não respondeu a tempo:', err.message);
            process.exit(1);
        } else {
            console.log(`⏳ Aguardando PostgreSQL ficar pronto... (${retries} tentativas restantes)`);
            setTimeout(() => tryConnect(retries - 1), delay);
        }
    }
};

tryConnect(maxRetries);