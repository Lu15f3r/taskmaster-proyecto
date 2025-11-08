const express = require('express');
const router = express.Router();
const Tarea = require('../models/Tarea'); // Importar el modelo Tarea

// GET - Obtener todas las tareas
router.get('/', async (req, res) => {
  try {
    // Buscar todas las tareas en la base de datos
    const tareas = await Tarea.find();
    // Enviar las tareas como respuesta
    res.json(tareas);
  } catch (error) {
    // Si hay error, enviar mensaje de error
    res.status(500).json({ mensaje: 'Error al obtener tareas', error: error.message });
  }
});

// POST - Crear una nueva tarea
router.post('/', async (req, res) => {
  try {
    // Crear nueva tarea con los datos del cuerpo de la solicitud
    const nuevaTarea = new Tarea({
      titulo: req.body.titulo,
      descripcion: req.body.descripcion,
      fechaVencimiento: req.body.fechaVencimiento
    });
    
    // Guardar la tarea en la base de datos
    const tareaGuardada = await nuevaTarea.save();
    // Enviar la tarea guardada como respuesta
    res.status(201).json(tareaGuardada);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear tarea', error: error.message });
  }
});

// PUT - Actualizar una tarea existente
router.put('/:id', async (req, res) => {
  try {
    // Buscar y actualizar la tarea por ID
    const tareaActualizada = await Tarea.findByIdAndUpdate(
      req.params.id, // ID de la tarea a actualizar
      req.body, // Nuevos datos de la tarea
      { new: true } // Devolver la tarea actualizada
    );
    
    if (!tareaActualizada) {
      return res.status(404).json({ mensaje: 'Tarea no encontrada' });
    }
    
    res.json(tareaActualizada);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar tarea', error: error.message });
  }
});

// DELETE - Eliminar una tarea
router.delete('/:id', async (req, res) => {
  try {
    // Buscar y eliminar la tarea por ID
    const tareaEliminada = await Tarea.findByIdAndDelete(req.params.id);
    
    if (!tareaEliminada) {
      return res.status(404).json({ mensaje: 'Tarea no encontrada' });
    }
    
    res.json({ mensaje: 'Tarea eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar tarea', error: error.message });
  }
});

// Exportar el router para usarlo en server.js
module.exports = router;