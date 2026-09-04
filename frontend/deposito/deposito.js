// Alkywall - Depósito de dinero
//
// NOTA: el endpoint POST /api/transacciones/deposito ya existe en el backend,
// pero espera "cuentaId" y "monto" como QUERY PARAMS (@RequestParam), no como
// JSON body. Ademas, todavia no hay ningun endpoint que devuelva el cuentaId
// de la cuenta del usuario logueado (GET /api/cuentas devuelve saldo, moneda,
// alias y cbu, pero no el id de la cuenta). Se intenta leer cuentaDTO.cuentaId
// o cuentaDTO.id como placeholder hasta que el backend lo exponga; si ninguno
// viene, se avisa en pantalla en vez de fallar en silencio.

const API_BASE_URL = 'http://localhost:8080/api';

const montoInput = document.getElementById('deposito-monto');
const errorMonto = document.getElementById('deposito-error');
const notificacion = document.getElementById('deposito-notificacion');
const btnConfirmar = document.getElementById('btn-confirmar-deposito');

function validarMonto() {
    const valorIngresado = montoInput.value;
    const monto = Number(valorIngresado);
    const esValido = valorIngresado !== '' && monto > 0;

    if (valorIngresado === '') {
        errorMonto.textContent = '';
        montoInput.classList.remove('input-error');
    } else if (!esValido) {
        errorMonto.textContent = 'Ingresá un monto mayor a cero.';
        montoInput.classList.add('input-error');
    } else {
        errorMonto.textContent = '';
        montoInput.classList.remove('input-error');
    }

    btnConfirmar.disabled = !esValido;
    return esValido;
}

function mostrarNotificacion(texto, tipo) {
    notificacion.textContent = texto;
    notificacion.className = `deposito-notificacion ${tipo}`;
}

async function obtenerCuentaId(token) {
    const respuesta = await fetch(`${API_BASE_URL}/cuentas`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!respuesta.ok) {
        throw new Error('No se pudo obtener la cuenta del usuario.');
    }

    const cuentaDTO = await respuesta.json();
    return cuentaDTO.cuentaId ?? cuentaDTO.id ?? null;
}

montoInput.addEventListener('input', validarMonto);

btnConfirmar.addEventListener('click', async function () {
    if (!validarMonto()) {
        return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
        mostrarNotificacion('Tenés que iniciar sesión para depositar dinero.', 'deposito-error-general');
        return;
    }

    const monto = montoInput.value;

    btnConfirmar.disabled = true;
    btnConfirmar.textContent = 'Depositando...';

    try {
        const cuentaId = await obtenerCuentaId(token);

        if (!cuentaId) {
            mostrarNotificacion('Todavía no se puede depositar: falta que el backend exponga el ID de la cuenta.', 'deposito-error-general');
            return;
        }

        const parametros = new URLSearchParams({ cuentaId, monto });

        const respuesta = await fetch(`${API_BASE_URL}/transacciones/deposito?${parametros.toString()}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!respuesta.ok) {
            const cuerpo = await respuesta.json().catch(() => ({}));
            mostrarNotificacion(cuerpo.message || cuerpo.mensaje || 'No se pudo completar el depósito.', 'deposito-error-general');
            return;
        }

        mostrarNotificacion('¡Depósito realizado con éxito!', 'deposito-exito');
        montoInput.value = '';

        if (typeof cargarSaldo === 'function') {
            cargarSaldo();
        }
    } catch (error) {
        console.error('Error al depositar:', error);
        mostrarNotificacion('Error de conexión. Intentá nuevamente.', 'deposito-error-general');
    } finally {
        btnConfirmar.disabled = montoInput.value === '' || Number(montoInput.value) <= 0;
        btnConfirmar.textContent = 'Confirmar Depósito';
    }
});
