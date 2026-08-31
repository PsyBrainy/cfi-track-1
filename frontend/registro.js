// Alkywall - Registro de Usuario (modal, validaciones y conexión al backend)

const API_BASE_URL = 'http://localhost:8080/api';

document.addEventListener('DOMContentLoaded', function () {
  const btnRegister = document.getElementById('btn-register');
  const btnCrearCuenta = document.getElementById('btn-crear-cuenta');

  const modalRegistro = document.getElementById('modal-registro');
  const formRegistro = document.getElementById('form-registro');
  const btnCerrarModal = document.getElementById('modal-cerrar');
  const mensajeRegistro = document.getElementById('mensaje-registro');
  const btnEnviarRegistro = document.getElementById('btn-enviar-registro');

  function abrirModalRegistro() {
    if (!modalRegistro) return;
    formRegistro.reset();
    limpiarErrores();
    mensajeRegistro.textContent = '';
    mensajeRegistro.className = 'mensaje-formulario';
    modalRegistro.classList.add('activo');
  }

  function cerrarModalRegistro() {
    if (!modalRegistro) return;
    modalRegistro.classList.remove('activo');
  }

  function limpiarErrores() {
    document.querySelectorAll('.error-campo').forEach((el) => (el.textContent = ''));
    document.querySelectorAll('.campo input').forEach((el) => el.classList.remove('input-error'));
  }

  function mostrarError(campoId, mensaje) {
    const input = document.getElementById(campoId);
    const error = document.getElementById(`error-${campoId}`);
    if (input) input.classList.add('input-error');
    if (error) error.textContent = mensaje;
  }

  function validarFormularioRegistro(datos) {
    let esValido = true;

    if (!datos.nombre || datos.nombre.trim().length < 2) {
      mostrarError('nombre', 'Ingresá tu nombre.');
      esValido = false;
    }

    if (!datos.apellido || datos.apellido.trim().length < 2) {
      mostrarError('apellido', 'Ingresá tu apellido.');
      esValido = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(datos.email)) {
      mostrarError('email', 'Ingresá un email válido.');
      esValido = false;
    }

    if (!datos.dni || !/^\d{7,8}$/.test(datos.dni.trim())) {
      mostrarError('dni', 'Ingresá un DNI válido (sin puntos).');
      esValido = false;
    }

    if (!datos.password || datos.password.length < 6) {
      mostrarError('password', 'La contraseña debe tener al menos 6 caracteres.');
      esValido = false;
    }

    if (datos.confirmarPassword !== datos.password) {
      mostrarError('confirmar-password', 'Las contraseñas no coinciden.');
      esValido = false;
    }

    return esValido;
  }

  function extraerMensajeError(cuerpo) {
    if (!cuerpo) return 'No se pudo completar el registro.';
    if (typeof cuerpo.message === 'string') return cuerpo.message;
    if (typeof cuerpo.mensaje === 'string') return cuerpo.mensaje;
    if (typeof cuerpo.detail === 'string') return cuerpo.detail;
    if (Array.isArray(cuerpo.errors) && cuerpo.errors.length > 0) {
      const primero = cuerpo.errors[0];
      return primero.defaultMessage || primero.message || JSON.stringify(primero);
    }
    return 'No se pudo completar el registro.';
  }

  async function registrarUsuario(datos) {
    const respuesta = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: datos.nombre,
        apellido: datos.apellido,
        email: datos.email,
        dni: datos.dni,
        password: datos.password,
        telefono: datos.telefono || null,
      }),
    });

    const cuerpo = await respuesta.json().catch(() => ({}));

    if (!respuesta.ok) {
      throw new Error(extraerMensajeError(cuerpo));
    }

    return cuerpo;
  }

  if (formRegistro) {
    formRegistro.addEventListener('submit', async function (evento) {
      evento.preventDefault();
      limpiarErrores();
      mensajeRegistro.textContent = '';
      mensajeRegistro.className = 'mensaje-formulario';

      const datos = {
        nombre: document.getElementById('nombre').value.trim(),
        apellido: document.getElementById('apellido').value.trim(),
        email: document.getElementById('email').value.trim(),
        dni: document.getElementById('dni').value.trim(),
        telefono: document.getElementById('telefono').value.trim(),
        password: document.getElementById('password').value,
        confirmarPassword: document.getElementById('confirmar-password').value,
      };

      if (!validarFormularioRegistro(datos)) {
        return;
      }

      btnEnviarRegistro.disabled = true;
      btnEnviarRegistro.textContent = 'Registrando...';

      try {
        await registrarUsuario(datos);
        mensajeRegistro.textContent = '¡Cuenta creada con éxito! Ya podés iniciar sesión.';
        mensajeRegistro.className = 'mensaje-formulario exito';
        formRegistro.reset();
      } catch (error) {
        mensajeRegistro.textContent = error.message || 'Ocurrió un error. Intentá nuevamente.';
        mensajeRegistro.className = 'mensaje-formulario error';
      } finally {
        btnEnviarRegistro.disabled = false;
        btnEnviarRegistro.textContent = 'Registrarme';
      }
    });
  }

  [btnRegister, btnCrearCuenta].forEach((btn) => {
    if (btn) {
      btn.addEventListener('click', abrirModalRegistro);
    }
  });

  if (btnCerrarModal) {
    btnCerrarModal.addEventListener('click', cerrarModalRegistro);
  }

  if (modalRegistro) {
    modalRegistro.addEventListener('click', function (evento) {
      if (evento.target === modalRegistro) {
        cerrarModalRegistro();
      }
    });
  }
});
