// index.js

let tareas = [];

// Función para obtener las tareas desde el archivo JSON
async function obtenerTareas() {
    try {
        const response = await fetch('tareas.json');
        if (!response.ok) {
            throw new Error(`Error al obtener tareas: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        tareas = data;
        renderizarTareas();
    } catch (error) {
        console.error('Error al obtener las tareas:', error);
    }
}

// Función para agregar una tarea
function agregarTarea(tarea) {
    tarea.id = tareas.length ? tareas[tareas.length - 1].id + 1 : 1; // Asignar un nuevo id
    tareas.push(tarea);
    renderizarTareas();
    guardarTareas();
}

// Función para eliminar una tarea
function eliminarTarea(id) {
    tareas = tareas.filter(tarea => tarea.id !== id);
    renderizarTareas();
    guardarTareas();
}

// Función para guardar las tareas en localStorage
function guardarTareas() {
    localStorage.setItem('tareas', JSON.stringify(tareas));
}

// Función para renderizar las tareas en el DOM
function renderizarTareas(tareasFiltradas = tareas) {
    const listaTareas = document.getElementById('lista-tareas');
    listaTareas.innerHTML = '';

    tareasFiltradas.forEach(tarea => {
        const tareaElemento = document.createElement('li');

        const textoTarea = document.createElement('span');
        textoTarea.textContent = tarea.texto;

        const botonEliminar = document.createElement('button');
        botonEliminar.textContent = 'Eliminar';
        botonEliminar.className = 'eliminar';
        botonEliminar.addEventListener('click', function() {
            eliminarTarea(tarea.id);
        });

        tareaElemento.appendChild(textoTarea);
        tareaElemento.appendChild(botonEliminar);

        listaTareas.appendChild(tareaElemento);
    });
}

// Función para buscar y filtrar tareas
function buscarTarea(termino) {
    const tareasFiltradas = tareas.filter(tarea => tarea.texto.toLowerCase().includes(termino.toLowerCase()));
    renderizarTareas(tareasFiltradas);
}

// Función para mostrar mensajes de error implementando SweetAlert
function mostrarMensajeError(mensaje) {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: mensaje,
    });
}

// Eventos
document.getElementById('agregar-tarea').addEventListener('click', function() {
    const nuevaTareaInput = document.getElementById('nueva-tarea');
    const nuevaTareaTexto = nuevaTareaInput.value;

    if (nuevaTareaTexto === '') {
        mostrarMensajeError('Por favor, ingresa una tarea.');
        return;
    }

    const nuevaTarea = {
        texto: nuevaTareaTexto,
        completada: false
    };

    agregarTarea(nuevaTarea);
    nuevaTareaInput.value = '';
});

document.getElementById('buscar-tarea').addEventListener('input', function() {
    const terminoBusqueda = document.getElementById('buscar-tarea').value;
    buscarTarea(terminoBusqueda);
});

// Obtener y renderizar tareas iniciales desde el archivo JSON o localStorage
window.addEventListener('load', function() {
    const tareasGuardadas = localStorage.getItem('tareas');
    if (tareasGuardadas) {
        tareas = JSON.parse(tareasGuardadas);
        renderizarTareas();
    } else {
        obtenerTareas();
    }
});