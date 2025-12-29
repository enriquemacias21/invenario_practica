import dotenv from 'dotenv';
dotenv.config();

import pkg from 'pg';
const { Client } = pkg;

console.log("---------------------------------------------------");
console.log("INTENTANDO CONECTAR (usando pg)...");
console.log("URL:", process.env.DATABASE_URL);
console.log("---------------------------------------------------");

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, 
  },
});

async function probar() {
  try {
    await client.connect();
    const res = await client.query('SELECT NOW()');
    console.log("¡ÉXITO! Conectado a Supabase.");
    console.log("Hora del servidor:", res.rows[0].now);
    await client.end();
  } catch (err) {
    console.log("ERROR DE CONEXIÓN:");
    console.error(err);
  }
}

probar();