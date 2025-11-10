// Importar módulos necesarios
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// 🔥 CONFIGURACIÓN CORS CORREGIDA PARA PRODUCCIÓN
app.use(cors({
    origin: "*", // ✅ ACEPTA CUALQUIER ORIGEN
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true
}));

// 🔥 MANEJO DE PRE-FLIGHT REQUESTS (IMPORTANTE)
app.options('*', cors()); // ✅ Maneja requests OPTIONS

// Middleware para procesar datos JSON
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tareasdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch(err => console.error('❌ Error conectando a MongoDB:', err));

// 🔥 VERIFICAR Y CARGAR RUTAS DE TAREAS
console.log('🔄 Cargando rutas de tareas...');
try {
    const tareasRoutes = require('./routes/tareas');
    app.use('/api/tareas', tareasRoutes);
    console.log('✅ Rutas /api/tareas registradas correctamente');
} catch (error) {
    console.error('❌ ERROR cargando rutas:', error);
    console.error('📌 Stack:', error.stack);
}

// ==================== RUTAS DEL API ====================

// Ruta de prueba
app.get('/api/test', (req, res) => {
    res.json({ 
        mensaje: '✅ Backend funcionando correctamente',
        cors: 'Configurado para producción',
        fecha: new Date()
    });
});

// Ruta principal
app.get('/', (req, res) => {
    res.json({ 
        mensaje: '🚀 Servidor de Tareas - Backend Activo',
        endpoints: {
            test: '/api/test',
            tareas: '/api/tareas',
            health: '/health'
        },
        cors: 'Habilitado para todos los orígenes'
    });
});

// Ruta de salud
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        mongodb: mongoose.connection.readyState === 1 ? 'Conectado' : 'Desconectado',
        cors: 'Configurado',
        timestamp: new Date()
    });
});

// 🔥 MANEJO DE ERRORES MEJORADO
app.use('*', (req, res) => {
    res.status(404).json({ 
        error: 'Ruta no encontrada',
        rutas_disponibles: [
            '/',
            '/api/test', 
            '/api/tareas',
            '/health'
        ]
    });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('❌ Error del servidor:', err);
    res.status(500).json({ 
        error: 'Error interno del servidor',
        mensaje: err.message
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('🚀 SERVIDOR INICIADO - CORS CONFIGURADO');
    console.log('='.repeat(60));
    console.log(`📍 Puerto: ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`🔧 Entorno: ${process.env.NODE_ENV || 'development'}`);
    console.log('✅ CORS: Habilitado para todos los orígenes');
    console.log('✅ Métodos: GET, POST, PUT, DELETE, OPTIONS');
    console.log('='.repeat(60));
});
