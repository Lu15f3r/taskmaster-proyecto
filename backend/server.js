// Importar módulos necesarios
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware CORS CONFIGURADO CORRECTAMENTE
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// Middleware CORS adicional para headers manuales
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Middleware para procesar datos JSON en las solicitudes
app.use(express.json());

// Conectar a la base de datos MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tareasdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch(err => console.error('❌ Error conectando a MongoDB:', err));

// Ruta de salud para verificar que el servidor funciona
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    mensaje: '🚀 Servidor del Sistema de Tareas funcionando correctamente',
    timestamp: new Date()
  });
});

// Ruta básica para verificar que el servidor funciona
app.get('/', (req, res) => {
  res.json({ 
    mensaje: '🚀 Servidor del Sistema de Tareas funcionando correctamente',
    endpoints: {
      tareas: '/api/tareas',
      health: '/health'
    }
  });
});

// DEBUG: Verificar carga de rutas
console.log('🔄 Intentando cargar rutas de tareas...');
try {
  const tareasRoutes = require('./routes/tareas');
  console.log('✅ routes/tareas.js cargado exitosamente');
  
  // Usar las rutas con el prefijo /api
  app.use('/api/tareas', tareasRoutes);
  console.log('✅ Rutas /api/tareas registradas correctamente');
  
} catch (error) {
  console.error('❌ ERROR CARGANDO RUTAS:', error);
  // Ruta de fallback para debugging
  app.use('/api/tareas', (req, res) => {
    res.status(500).json({ 
      error: 'Error cargando rutas',
      mensaje: error.message 
    });
  });
}

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🎯 Servidor ejecutándose y LISTO en el puerto: ${PORT}`);
  console.log(`🌐 URL local: http://localhost:${PORT}`);
  console.log(`🔧 Entorno: ${process.env.NODE_ENV || 'development'}`);
});