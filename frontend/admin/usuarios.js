// Alkywall - Panel de Administración de Usuarios (CRUD)
// Endpoints reales (requieren rol ADMIN y token JWT):
// GET    /api/usuarios         -> listar
// POST   /api/usuarios         -> crear   { nombre, apellido, email, dni, password, telefono }
// PUT    /api/usuarios/{id}    -> editar  { nombre, apellido, telefono }
// DELETE /api/usuarios/{id}    -> baja lógica (estado INACTIVO)

const API_BASE_URL = 'http://localhost:8080/api';

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
    btnCancelarEdicion.style.display = 'none';
    campoPassword.style.display = 'block';
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
    campoPassword.style.display = 'none';
    inputEmail.disabled = true;
    inputDni.disabled = true;
    formTitulo.textContent = `Editando a ${usuario.nombre} ${usuario.apellido}`;
    btnGuardar.textContent = 'Guardar cambios';
    btnCancelarEdicion.style.display = 'inline-block';
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
    tdRol.textContent = usuario.rol;

    const tdEstado = document.createElement('td');
    tdEstado.textContent = usuario.estado;

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
    const confirmado = window.confirm('¿Seguro que querés dar de baja a este usuario?');
    if (!confirmado) return;

    try {
        const respuesta = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
            method: 'DELETE',
            headers: headersAutenticados()
        });

        if (!respuesta.ok && respuesta.status !== 204) {
            const textoError = await extraerMensajeError(respuesta);
            mensajeGlobal.textContent = textoError;
            mensajeGlobal.className = 'usuarios-mensaje error';
            return;
        }

        mensajeGlobal.textContent = 'Usuario dado de baja correctamente.';
        mensajeGlobal.className = 'usuarios-mensaje exito';
        cargarUsuarios();
    } catch (error) {
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