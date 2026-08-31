// Alkywall - Script Inicial de la Aplicación

const API_BASE_URL = 'http://localhost:8080/api';

document.addEventListener('DOMContentLoaded', function () {
  console.log('Aplicación Alkywall cargada correctamente.');

  const btnLogin = document.getElementById('btn-login');
  const btnRegister = document.getElementById('btn-register');
  const btnCrearCuenta = document.getElementById('btn-crear-cuenta');

  if (btnLogin) {
    btnLogin.addEventListener('click', function () {
      alert('Funcionalidad de Inicio de Sesión (En desarrollo).');
    });
  }

  // ---------- Modal de Registro ----------
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
      mostrarError('nombre', 'Ingresá tu nombre completo.');
      esValido = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(datos.email)) {
      mostrarError('email', 'Ingresá un email válido.');
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

  async function registrarUsuario(datos) {
    const respuesta = await fetch(`${API_BASE_URL}/usuarios/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: datos.nombre,
        email: datos.email,
        password: datos.password,
      }),
    });

    const cuerpo = await respuesta.json().catch(() => ({}));

    if (!respuesta.ok) {
      const mensaje = cuerpo.mensaje || Object.values(cuerpo)[0] || 'No se pudo completar el registro.';
      throw new Error(mensaje);
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
        email: document.getElementById('email').value.trim(),
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
