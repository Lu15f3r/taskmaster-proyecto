const mongoose = require('mongoose');

//  esquema (estructura) de una tarea en la base de datos
const tareaSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true, // Este campo es obligatorio
    trim: true // Elimina espacios en blanco al inicio y final
  },
  descripcion: {
    type: String,
    required: false,
    trim: true
  },
  completada: {
    type: Boolean,
    default: false // Valor por defecto es false (no completada)
  },
  fechaCreacion: {
    type: Date,
    default: Date.now // Fecha actual por defecto
  },
  fechaVencimiento: {
    type: Date,
    required: false
  }
});

// Crear el modelo Tarea basado en el esquema
const Tarea = mongoose.model('Tarea', tareaSchema);

// Exportar el modelo para usarlo en otras partes de la aplicación
module.exports = Tarea;