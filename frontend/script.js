// 🌍 URL PARA NETLIFY - CAMBIA ESTA URL POR LA DE NGROK CUANDO LA TENGAS
const API_URL = 'https://taskmaster-backend.onrender.com/api/tareas'; 

// Elementos DOM
const formTarea = document.getElementById('formTarea');
const listaTareas = document.getElementById('listaTareas');
const contadorTareas = document.getElementById('contadorTareas');

// Cargar tareas al iniciar
document.addEventListener('DOMContentLoaded', cargarTareas);

// Evento formulario
formTarea.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const titulo = document.getElementById('titulo').value;
    const descripcion = document.getElementById('descripcion').value;
    const fechaVencimiento = document.getElementById('fechaVencimiento').value;
    
    const nuevaTarea = {
        titulo: titulo,
        descripcion: descripcion,
        fechaVencimiento: fechaVencimiento || null
    };
    
    agregarTarea(nuevaTarea);
});

// Función cargar tareas
async function cargarTareas() {
    try {
        const response = await fetch(API_URL);
        const tareas = await response.json();
        mostrarTareas(tareas);
    } catch (error) {
        console.error('Error:', error);
        listaTareas.innerHTML = `
            <div class="alert alert-warning">
                <i class="fas fa-exclamation-triangle"></i>
                Error conectando al backend. Verifica la conexión.
            </div>
        `;
    }
}

// Función agregar tarea
async function agregarTarea(tarea) {
    try {
        const respuesta = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tarea)
        });
        
        if (respuesta.ok) {
            formTarea.reset();
            cargarTareas();
        } else {
            throw new Error('Error al agregar tarea');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudo agregar la tarea. Verifica el backend.');
    }
}

// Función actualizar tarea
async function actualizarTarea(id, datos) {
    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });
        
        if (respuesta.ok) {
            cargarTareas();
        } else {
            throw new Error('Error al actualizar tarea');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al actualizar tarea');
    }
}

// Función eliminar tarea
async function eliminarTarea(id) {
    if (!confirm('¿Eliminar esta tarea?')) return;
    
    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (respuesta.ok) {
            cargarTareas();
        } else {
            throw new Error('Error al eliminar tarea');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar tarea');
    }
}

// Función mostrar tareas
function mostrarTareas(tareas) {
    contadorTareas.textContent = `${tareas.length} ${tareas.length === 1 ? 'tarea' : 'tareas'}`;
    
    if (tareas.length === 0) {
        listaTareas.innerHTML = `
            <div class="text-center py-4 text-muted">
                <i class="fas fa-clipboard-list fa-2x mb-2"></i>
                <p>No hay tareas. ¡Agrega la primera!</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    tareas.forEach(tarea => {
        let claseTarea = 'tarea-item';
        if (tarea.completada) claseTarea += ' tarea-completada';
        
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
                            <button class="btn btn-sm ${tarea.completada ? 'btn-warning' : 'btn-success'} me-1" 
                                    onclick="toggleCompletada('${tarea._id}', ${!tarea.completada})">
                                <i class="fas ${tarea.completada ? 'fa-undo' : 'fa-check'}"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" 
                                    onclick="eliminarTarea('${tarea._id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    listaTareas.innerHTML = html;
}

// Función toggle completada
function toggleCompletada(id, completada) {
    actualizarTarea(id, { completada: completada });
}
