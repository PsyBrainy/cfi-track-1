// Alkywall - Formulario de Transferencias/Pagos
//
// NOTA: el endpoint POST /api/transacciones/transferencia todavia no existe
// en el backend (ticket #30 depende de un endpoint "nuevo" que hay que crear).
// Se asume que recibe un TransferenciaRequestDTO con forma
// { destinatario: string (id o email), monto: number } y que devuelve 400
// cuando la operacion no puede completarse (ej. saldo insuficiente).
// Ajustar la URL y los nombres de campos cuando el backend este listo.

const API_BASE_URL = 'http://localhost:8080/api';

const form = document.getElementById('form-transferencia');
const destinatarioInput = document.getElementById('destinatario');
const montoInput = document.getElementById('monto');
const errorDestinatario = document.getElementById('error-destinatario');
const errorMonto = document.getElementById('error-monto');
const mensaje = document.getElementById('transferencia-mensaje');
const btnTransferir = document.getElementById('btn-transferir');

function limpiarErrores() {
    errorDestinatario.textContent = '';
    errorMonto.textContent = '';
    destinatarioInput.classList.remove('input-error');
    montoInput.classList.remove('input-error');
    mensaje.textContent = '';
    mensaje.className = 'transferencia-mensaje';
}

function validarFormulario(destinatario, monto) {
    let esValido = true;

    if (!destinatario) {
        errorDestinatario.textContent = 'Ingresá el ID o email del destinatario.';
        destinatarioInput.classList.add('input-error');
        esValido = false;
    }

    if (!monto || Number(monto) <= 0) {
        errorMonto.textContent = 'Ingresá un monto mayor a cero.';
        montoInput.classList.add('input-error');
        esValido = false;
    }

    return esValido;
}

async function extraerMensajeError(respuesta) {
    try {
        const cuerpo = await respuesta.json();
        return cuerpo.message || cuerpo.mensaje || cuerpo.detail || 'No se pudo completar la transferencia.';
    } catch {
        return 'No se pudo completar la transferencia.';
    }
}

form.addEventListener('submit', async function (evento) {
    evento.preventDefault();
    limpiarErrores();

    const destinatario = destinatarioInput.value.trim();
    const monto = montoInput.value;

    if (!validarFormulario(destinatario, monto)) {
        return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
        mensaje.textContent = 'Tenés que iniciar sesión para transferir dinero.';
        mensaje.className = 'transferencia-mensaje transferencia-error-general';
        return;
    }

    btnTransferir.disabled = true;
    btnTransferir.textContent = 'Enviando...';

    try {
        const respuesta = await fetch(`${API_BASE_URL}/transacciones/transferencia`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                destinatario: destinatario,
                monto: Number(monto)
            })
        });

        if (respuesta.status === 400) {
            const textoError = await extraerMensajeError(respuesta);
            mensaje.textContent = textoError;
            mensaje.className = 'transferencia-mensaje transferencia-error-general';
            return;
        }

        if (!respuesta.ok) {
            const textoError = await extraerMensajeError(respuesta);
            mensaje.textContent = textoError;
            mensaje.className = 'transferencia-mensaje transferencia-error-general';
            return;
        }

        mensaje.textContent = '¡Transferencia realizada con éxito!';
        mensaje.className = 'transferencia-mensaje transferencia-exito';
        alert('Transferencia enviada correctamente.');
        form.reset();
    } catch (error) {
        console.error('Error en la transferencia:', error);
        mensaje.textContent = 'Error de conexión. Intentá nuevamente.';
        mensaje.className = 'transferencia-mensaje transferencia-error-general';
    } finally {
        btnTransferir.disabled = false;
        btnTransferir.textContent = 'Transferir';
    }
});
