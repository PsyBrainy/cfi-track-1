// Alkywall - Panel de Administración de Usuarios (CRUD)
// Endpoints reales (requieren rol ADMIN y token JWT):
// GET    /api/usuarios         -> listar
// POST   /api/usuarios         -> crear   { nombre, apellido, email, dni, password, telefono }
// PUT    /api/usuarios/{id}    -> editar  { nombre, apellido, telefono }
// DELETE /api/usuarios/{id}    -> baja lógica (estado INACTIVO)

const mensajeGlobal = document.getElementById('usuarios-mensaje-global');
const tbody = document.getElementById('usuarios-tbody');
const form = document.getElementById('form-usuario');
const inputId = document.getElementById('usuario-id');
const inputNombre = document.getElementById('nombre');
const inputApellido = document.getElementById('apellido');
const inputEmail = document.getElementById('email');
const inputDni = document.getElementById('dni');
const inputTelefono = document.getElementById('telefono');
const inputPassword = document.getElementById('password');
const campoPassword = document.getElementById('campo-password');
const formTitulo = document.getElementById('form-titulo');
const formMensaje = document.getElementById('form-mensaje');
const btnGuardar = document.getElementById('btn-guardar');
const btnCancelarEdicion = document.getElementById('btn-cancelar-edicion');

function getToken() {
    return localStorage.getItem('token');
}

function headersAutenticados() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    };
}

async function extraerMensajeError(respuesta) {
    try {
        const cuerpo = await respuesta.json();
        return cuerpo.message || 'Ocurrió un error al procesar la solicitud.';
    } catch {
        return 'Ocurrió un error al procesar la solicitud.';
    }
}

function resetearFormulario() {
    form.reset();
    inputId.value = '';
    formTitulo.textContent = 'Crear usuario';
    btnGuardar.textContent = 'Crear usuario';
    btnCancelarEdicion.classList.add('usuarios-oculto');
    campoPassword.classList.remove('usuarios-oculto');
    inputPassword.required = true;
    inputEmail.disabled = false;
    inputDni.disabled = false;
    formMensaje.textContent = '';
    formMensaje.className = 'usuarios-mensaje';
}

function activarModoEdicion(usuario) {
    inputId.value = usuario.idUsuario;
    inputNombre.value = usuario.nombre;
    inputApellido.value = usuario.apellido;
    inputEmail.value = usuario.email;
    inputDni.value = usuario.dni;
    inputTelefono.value = usuario.telefono || '';
    inputPassword.value = '';
    inputPassword.required = false;
    campoPassword.classList.add('usuarios-oculto');
    inputEmail.disabled = true;
    inputDni.disabled = true;
    formTitulo.textContent = `Editando a ${usuario.nombre} ${usuario.apellido}`;
    btnGuardar.textContent = 'Guardar cambios';
    btnCancelarEdicion.classList.remove('usuarios-oculto');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function crearFilaUsuario(usuario) {
    const fila = document.createElement('tr');

    const tdId = document.createElement('td');
    tdId.textContent = usuario.idUsuario;

    const tdNombre = document.createElement('td');
    tdNombre.textContent = `${usuario.nombre} ${usuario.apellido}`;

    const tdEmail = document.createElement('td');
    tdEmail.textContent = usuario.email;

    const tdDni = document.createElement('td');
    tdDni.textContent = usuario.dni;

    const tdRol = document.createElement('td');
    const badgeRol = document.createElement('span');
    badgeRol.className = `usuarios-badge ${usuario.rol === 'ADMIN' ? 'usuarios-badge-rol-admin' : 'usuarios-badge-rol-client'}`;
    badgeRol.textContent = usuario.rol;
    tdRol.appendChild(badgeRol);

    const tdEstado = document.createElement('td');
    const badgeEstado = document.createElement('span');
    badgeEstado.className = `usuarios-badge ${usuario.estado === 'ACTIVO' ? 'usuarios-badge-estado-activo' : 'usuarios-badge-estado-inactivo'}`;
    badgeEstado.textContent = usuario.estado;
    tdEstado.appendChild(badgeEstado);

    const tdAcciones = document.createElement('td');
    tdAcciones.className = 'usuarios-acciones-fila';

    const btnEditar = document.createElement('button');
    btnEditar.textContent = 'Editar';
    btnEditar.className = 'editar';
    btnEditar.addEventListener('click', () => activarModoEdicion(usuario));

    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.className = 'eliminar';
    btnEliminar.addEventListener('click', () => eliminarUsuario(usuario.idUsuario));

    tdAcciones.appendChild(btnEditar);
    tdAcciones.appendChild(btnEliminar);

    fila.appendChild(tdId);
    fila.appendChild(tdNombre);
    fila.appendChild(tdEmail);
    fila.appendChild(tdDni);
    fila.appendChild(tdRol);
    fila.appendChild(tdEstado);
    fila.appendChild(tdAcciones);

    return fila;
}

async function cargarUsuarios() {
    const token = getToken();
    if (!token) {
        window.location.href = '../autenticacion/login.html';
        return;
    }

    try {
        const respuesta = await fetch(`${API_BASE_URL}/usuarios`, {
            method: 'GET',
            headers: headersAutenticados()
        });

        if (respuesta.status === 401 || respuesta.status === 403) {
            mensajeGlobal.textContent = 'No tenés permisos de administrador para ver esta sección.';
            mensajeGlobal.className = 'usuarios-mensaje error';
            tbody.innerHTML = '';
            return;
        }

        if (!respuesta.ok) {
            mensajeGlobal.textContent = 'No se pudo cargar el listado de usuarios.';
            mensajeGlobal.className = 'usuarios-mensaje error';
            return;
        }

        const usuarios = await respuesta.json();
        mensajeGlobal.textContent = '';
        tbody.innerHTML = '';

        if (!Array.isArray(usuarios) || usuarios.length === 0) {
            const fila = document.createElement('tr');
            const celda = document.createElement('td');
            celda.colSpan = 7;
            celda.textContent = 'No hay usuarios registrados todavía.';
            fila.appendChild(celda);
            tbody.appendChild(fila);
            return;
        }

        usuarios.forEach((usuario) => tbody.appendChild(crearFilaUsuario(usuario)));
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        mensajeGlobal.textContent = 'Error de conexión. Intentá nuevamente.';
        mensajeGlobal.className = 'usuarios-mensaje error';
    }
}

async function crearUsuario(datos) {
    const respuesta = await fetch(`${API_BASE_URL}/usuarios`, {
        method: 'POST',
        headers: headersAutenticados(),
        body: JSON.stringify(datos)
    });

    if (!respuesta.ok) {
        throw new Error(await extraerMensajeError(respuesta));
    }

    return respuesta.json();
}

async function actualizarUsuario(id, datos) {
    const respuesta = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
        method: 'PUT',
        headers: headersAutenticados(),
        body: JSON.stringify(datos)
    });

    if (!respuesta.ok) {
        throw new Error(await extraerMensajeError(respuesta));
    }

    return respuesta.json();
}

async function eliminarUsuario(id) {
    const confirmar = await mostrarAlerta("¿Seguro que desea dar de baja a este usuario?");
    if (!confirmar) return;

    try {
        const respuesta = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
            method: 'DELETE',
            headers: headersAutenticados()
        });

        if (!respuesta.ok && respuesta.status !== 204) {
            const textoError = await extraerMensajeError(respuesta);
            mostrarToast(textoError, 'error');
            mensajeGlobal.textContent = textoError;
            mensajeGlobal.className = 'usuarios-mensaje error';
            return;
        }
        mostrarToast('Usuario dado de baja correctamente.', 'exito')
        mensajeGlobal.textContent = 'Usuario dado de baja correctamente.';
        mensajeGlobal.className = 'usuarios-mensaje exito';
        cargarUsuarios();
    } catch (error) {
        mostrarToast('Error al eliminar usuario:', 'error');
        console.error('Error al eliminar usuario:', error);
        mensajeGlobal.textContent = 'Error de conexión. Intentá nuevamente.';
        mensajeGlobal.className = 'usuarios-mensaje error';
    }
}

form.addEventListener('submit', async function (evento) {
    evento.preventDefault();
    formMensaje.textContent = '';
    formMensaje.className = 'usuarios-mensaje';

    const idEdicion = inputId.value;

    try {
        if (idEdicion) {
            const datosUpdate = {
                nombre: inputNombre.value.trim(),
                apellido: inputApellido.value.trim(),
                telefono: inputTelefono.value.trim()
            };
            await actualizarUsuario(idEdicion, datosUpdate);
            mostrarToast('Usuario actualizado con éxito.', 'exito');
            mensajeGlobal.textContent = 'Usuario actualizado con éxito.';
        } else {
            const datosCreacion = {
                nombre: inputNombre.value.trim(),
                apellido: inputApellido.value.trim(),
                email: inputEmail.value.trim(),
                dni: inputDni.value.trim(),
                password: inputPassword.value,
                telefono: inputTelefono.value.trim()
            };
            await crearUsuario(datosCreacion);
            mensajeGlobal.textContent = 'Usuario creado con éxito.';
        }

        mensajeGlobal.className = 'usuarios-mensaje exito';
        resetearFormulario();
        cargarUsuarios();
    } catch (error) {
        formMensaje.textContent = error.message || 'No se pudo guardar el usuario.';
        formMensaje.className = 'usuarios-mensaje error';
    }
});

btnCancelarEdicion.addEventListener('click', resetearFormulario);

document.addEventListener('DOMContentLoaded', cargarUsuarios);

const modal = document.getElementById('miModal');
const modalTexto = document.getElementById('modalTexto');
const btnOk = document.getElementById('btnOk');
const closeBtn = document.getElementById('closeBtn')
const btnCancelar = document.getElementById('btnCancelar');
const btnOpen = document.getElementById('btnOpen');

// Función para mostrar la alerta
function mostrarAlerta(mensaje) {
    modalTexto.textContent = mensaje;
    modal.classList.remove('hidden');
    modal.style.display = 'flex';

    return new Promise((resolve) => {
        modal._resolver = resolve;
    });
}

modal.addEventListener('click', (e) => {
    if (!modal._resolver) return;

    const confirmar = e.target === btnOk;
    const cerrar = e.target === modal || e.target === btnCancelar || e.target === closeBtn;

    if (confirmar || cerrar) {
        const resolver = modal._resolver;
        modal._resolver = null;
        cerrarAlerta();
        resolver(confirmar);
    }
});

function cerrarAlerta() {
    modal.classList.add('hidden');
    setTimeout(() => { modal.style.display = 'none'; }, 300);
}