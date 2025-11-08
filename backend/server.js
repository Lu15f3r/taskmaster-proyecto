// Importar módulos necesarios
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware para permitir solicitudes de diferentes dominios (CORS)
app.use(cors());
// Middleware para procesar datos JSON en las solicitudes
app.use(express.json());

// Conectar a la base de datos MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tareasdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch(err => console.error('❌ Error conectando a MongoDB:', err));

// Importar rutas de tareas
const tareasRoutes = require('./routes/tareas');
// Usar las rutas con el prefijo /api
app.use('/api/tareas', tareasRoutes);

// Ruta básica para verificar que el servidor funciona
app.get('/', (req, res) => {
  res.json({ mensaje: '🚀 Servidor del Sistema de Tareas funcionando correctamente' });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🎯 Servidor ejecutándose en http://localhost:${PORT}`);
});