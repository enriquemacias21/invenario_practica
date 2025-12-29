import pkg from 'pg';
const { Pool } = pkg;
/*
export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "pruebita",
  password: "admin123",
  port: 5432,
});
*/

const connectionString = process.env.DATABASE_URL;

export const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false, 
  },
});