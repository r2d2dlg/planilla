// payroll-app-backend/server.js
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const payrollRoutes = require('./routes/payrollRoutes');

const app = express();
const PORT = process.env.BACKEND_PORT || 5000;

app.use(cors());
app.use(express.json());

// Configuración del Pool de Conexiones a PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 15000, // 15 segundos para conectar
});

// Hacer el pool accesible globalmente a través de req
app.use((req, res, next) => {
  req.db = pool;
  next();
});

// Rutas de la API para la planilla
app.use('/api/payroll', payrollRoutes);

// Middleware para manejar errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || '¡Algo salió mal en el servidor!',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});


// --- NUEVA FUNCIÓN DE INICIO ---
// Función para verificar la conexión y luego iniciar el servidor
const startServer = async () => {
  try {
    // 1. Intenta obtener un cliente del pool y hacer una consulta simple
    const client = await pool.connect();
    console.log("Conectado exitosamente a la base de datos PostgreSQL!");
    await client.query('SELECT NOW()'); // Consulta de prueba
    client.release(); // Libera el cliente

    // 2. Si la conexión es exitosa, inicia el servidor Express
    app.listen(PORT, () => {
      console.log(`Servidor backend escuchando en el puerto ${PORT}`);
    });

  } catch (error) {
    // Si hay un error al conectar, lo muestra y detiene la aplicación
    console.error("!!! FATAL: No se pudo conectar a la base de datos al iniciar.");
    console.error(error.stack);
    process.exit(1); // Termina el proceso con un código de error
  }
};

// Llama a la función de inicio para arrancar todo
startServer();
