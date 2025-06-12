// F:\projects\Payroll\payroll-app-backend\test-db-connection.js

require('dotenv').config();
const { Pool } = require('pg');

console.log("--- Iniciando prueba de conexión directa ---");
console.log("Host:", process.env.DB_HOST);
console.log("Usuario:", process.env.DB_USER);
console.log("Base de datos:", process.env.DB_NAME);
console.log("Puerto:", process.env.DB_PORT);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false
  },
  // Añadimos un timeout para que no se quede colgado indefinidamente
  connectionTimeoutMillis: 10000, // 10 segundos
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('!!! ERROR AL INTENTAR CONECTAR:', err.stack);
    pool.end();
    return;
  }
  console.log('>>> ¡CONEXIÓN EXITOSA! <<<');
  client.query('SELECT NOW()', (err, result) => {
    release(); // Liberar el cliente de vuelta al pool
    if (err) {
      console.error('!!! ERROR EJECUTANDO CONSULTA:', err.stack);
      pool.end();
      return;
    }
    console.log('Respuesta de la base de datos:', result.rows[0]);
    pool.end(); // Cerrar el pool y terminar el script
  });
});