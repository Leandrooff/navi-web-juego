document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('cuentos-list');
    if (tableBody) {
        fetch('../demo/cuentos-admin-demo.json')
            .then(response => response.json())
            .then(data => {
                data.cuentos.forEach(cuento => {
                    const row = `<tr>
                        <td>${cuento.titulo}</td>
                        <td>${cuento.categoria}</td>
                        <td><span class="badge ${cuento.estado}">${cuento.estado}</span></td>
                        <td>
                            <button class="btn btn-warning" onclick="location.href='cuentos-form.html?id=${cuento.id}'">Editar</button>
                            <button class="btn btn-primary" onclick="location.href='escenas-form.html?cuentoId=${cuento.id}'">Escenas</button>
                            <button class="btn btn-danger" onclick="eliminarCuento(this, '${cuento.titulo}')">Borrar</button>
                        </td>
                    </tr>`;
                    tableBody.innerHTML += row;
                });
            })
            .catch(err => console.log('Cargando en modo estático:', err));
    }
});

// Función para eliminar cuento de la tabla con confirmación
function eliminarCuento(boton, titulo) {
    if (confirm(`¿Estás seguro de que deseas eliminar el cuento "${titulo}"?`)) {
        const fila = boton.closest('tr');
        fila.remove();
        alert(`El cuento "${titulo}" ha sido eliminado (Simulación).`);
    }
}

// Función para agregar opciones de decisión dinámicas con botón de borrado
function agregarOpcion() {
    const container = document.getElementById('opciones-container');
    const optionId = Date.now();
    const html = `
        <div class="card" id="opcion-${optionId}" style="background: #F8FAFC; border: 1px dashed #CBD5E1; position: relative;">
            <button class="btn btn-danger" style="position: absolute; top: 10px; right: 10px; padding: 4px 8px; font-size: 0.8em;" onclick="eliminarOpcion('opcion-${optionId}')">✕ Eliminar</button>
            <div class="form-group" style="margin-right: 90px;">
                <label>Texto de la opción</label>
                <input type="text" placeholder="Ej: Abrir la puerta">
            </div>
            <div style="display: flex; gap: 10px;">
                <div class="form-group" style="flex: 1;">
                    <label>Puntaje</label>
                    <input type="number" value="0">
                </div>
                <div class="form-group" style="flex: 1;">
                    <label>Siguiente Escena (ID)</label>
                    <input type="text" placeholder="Ej: escena_2">
                </div>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
}

// Función para eliminar una tarjeta de opción
function eliminarOpcion(idElemento) {
    const elem = document.getElementById(idElemento);
    if (elem) elem.remove();
}

function previsualizar() {
    alert("Vista previa del cuento (Simulación)");
}

function guardarSimulado(tipo) {
    alert(`${tipo} guardado correctamente (Simulación).`);
}