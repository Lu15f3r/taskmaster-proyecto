// URL del backend - si se despliega en otro lugar cambiamos esto
const API_URL = 'https://task-master-production.up.railway.app/api/tareas';

// Elementos del DOM
const formTarea = document.getElementById('formTarea');
const listaTareas = document.getElementById('listaTareas');
const contadorTareas = document.getElementById('contadorTareas');

// Cargar tareas cuando la página se carga
document.addEventListener('DOMContentLoaded', cargarTareas);

// Evento para enviar el formulario de nueva tarea
formTarea.addEventListener('submit', function(e) {
    e.preventDefault(); // Prevenir envío normal del formulario
    
    // Obtener datos del formulario
    const titulo = document.getElementById('titulo').value;
    const descripcion = document.getElementById('descripcion').value;
    const fechaVencimiento = document.getElementById('fechaVencimiento').value;
    
    // Crear objeto tarea
    const nuevaTarea = {
        titulo: titulo,
        descripcion: descripcion,
        fechaVencimiento: fechaVencimiento || null
    };
    
    // Enviar tarea al backend
    agregarTarea(nuevaTarea);
});

// Función para cargar todas las tareas desde el backend
async function cargarTareas() {
    try {
        // Hacer petición GET al backend
        const respuesta = await fetch(API_URL);
        const tareas = await respuesta.json();
        
        // Mostrar las tareas en la interfaz
        mostrarTareas(tareas);
    } catch (error) {
        console.error('Error al cargar tareas:', error);
        mostrarError('No se pudieron cargar las tareas. Verifica que el servidor esté funcionando.');
    }
}

// Función para agregar una nueva tarea
async function agregarTarea(tarea) {
    try {
        // Hacer petición POST al backend
        const respuesta = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tarea)
        });
        
        if (respuesta.ok) {
            // Limpiar formulario
            formTarea.reset();
            // Recargar la lista de tareas
            cargarTareas();
        } else {
            throw new Error('Error al agregar tarea');
        }
    } catch (error) {
        console.error('Error al agregar tarea:', error);
        mostrarError('No se pudo agregar la tarea. Verifica que el servidor esté funcionando.');
    }
}

// Función para actualizar una tarea (marcar como completada/no completada)
async function actualizarTarea(id, datosActualizados) {
    try {
        // Hacer petición PUT al backend
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosActualizados)
        });
        
        if (respuesta.ok) {
            // Recargar la lista de tareas
            cargarTareas();
        } else {
            throw new Error('Error al actualizar tarea');
        }
    } catch (error) {
        console.error('Error al actualizar tarea:', error);
        mostrarError('No se pudo actualizar la tarea.');
    }
}

// Función para eliminar una tarea
async function eliminarTarea(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
        return;
    }
    
    try {
        // Hacer petición DELETE al backend
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (respuesta.ok) {
            // Recargar la lista de tareas
            cargarTareas();
        } else {
            throw new Error('Error al eliminar tarea');
        }
    } catch (error) {
        console.error('Error al eliminar tarea:', error);
        mostrarError('No se pudo eliminar la tarea.');
    }
}

// Función para mostrar las tareas en la interfaz
function mostrarTareas(tareas) {
    // Actualizar contador
    contadorTareas.textContent = `${tareas.length} ${tareas.length === 1 ? 'tarea' : 'tareas'}`;
    
    // Si no hay tareas, mostrar mensaje
    if (tareas.length === 0) {
        listaTareas.innerHTML = `
            <div class="text-center py-4 text-muted">
                <i class="fas fa-clipboard-list fa-2x mb-2"></i>
                <p>No hay tareas registradas. ¡Agrega tu primera tarea!</p>
            </div>
        `;
        return;
    }
    
    // Generar HTML para cada tarea
    let html = '';
    tareas.forEach(tarea => {
        // Determinar clases CSS según el estado de la tarea
        let claseTarea = 'tarea-item';
        if (tarea.completada) {
            claseTarea += ' tarea-completada';
        } else if (tarea.fechaVencimiento && new Date(tarea.fechaVencimiento) < new Date()) {
            claseTarea += ' tarea-vencida';
        }
        
        // Formatear fecha
        const fechaCreacion = new Date(tarea.fechaCreacion).toLocaleDateString();
        const fechaVencimiento = tarea.fechaVencimiento 
            ? new Date(tarea.fechaVencimiento).toLocaleDateString() 
            : 'Sin fecha';
        
        html += `
            <div class="card mb-3 fade-in ${claseTarea}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start">
                        <div class="flex-grow-1">
                            <h5 class="card-title tarea-titulo">${tarea.titulo}</h5>
                            ${tarea.descripcion ? `<p class="card-text">${tarea.descripcion}</p>` : ''}
                            <div class="text-muted small">
                                <span class="me-3"><i class="fas fa-calendar-plus me-1"></i> Creada: ${fechaCreacion}</span>
                                <span><i class="fas fa-calendar-day me-1"></i> Vence: ${fechaVencimiento}</span>
                            </div>
                        </div>
                        <div class="d-flex ms-3">
                            <button class="btn btn-sm ${tarea.completada ? 'btn-warning' : 'btn-success'} btn-action me-1" 
                                    onclick="toggleCompletada('${tarea._id}', ${!tarea.completada})"
                                    title="${tarea.completada ? 'Marcar como pendiente' : 'Marcar como completada'}">
                                <i class="fas ${tarea.completada ? 'fa-undo' : 'fa-check'}"></i>
                            </button>
                            <button class="btn btn-sm btn-danger btn-action" 
                                    onclick="eliminarTarea('${tarea._id}')"
                                    title="Eliminar tarea">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    // Insertar el HTML en el contenedor
    listaTareas.innerHTML = html;
}

// Función para cambiar el estado de completado de una tarea
function toggleCompletada(id, completada) {
    actualizarTarea(id, { completada: completada });
}

// Función para mostrar mensajes de error
function mostrarError(mensaje) {
    // Crear elemento de alerta
    const alerta = document.createElement('div');
    alerta.className = 'alert alert-danger alert-dismissible fade show';
    alerta.innerHTML = `
        <i class="fas fa-exclamation-triangle me-2"></i>
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Insertar al inicio del contenedor principal
    const container = document.querySelector('.container');
    container.insertBefore(alerta, container.firstChild);
    
    // Auto-eliminar después de 5 segundos
    setTimeout(() => {
        if (alerta.parentNode) {
            alerta.remove();
        }
    }, 5000);
}