// Alkywall - Depósito de dinero
//
// Endpoint real: POST /api/transacciones/deposito
// Body: { "monto": 123 } (JSON)
// El backend identifica la cuenta a partir del email del JWT, no hace
// falta mandar cuentaId.

//const API_BASE_URL = 'http://localhost:8080/api';

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

    const monto = Number(montoInput.value);

    btnConfirmar.disabled = true;
    btnConfirmar.textContent = 'Depositando...';

    try {
        const respuesta = await fetch(`${API_BASE_URL}/transacciones/deposito`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ monto: monto })
        });

        if (!respuesta.ok) {
            const cuerpo = await respuesta.json().catch(() => ({}));
            mostrarNotificacion(cuerpo.message || 'No se pudo completar el depósito.', 'deposito-error-general');
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
