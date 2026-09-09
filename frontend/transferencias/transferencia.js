// Alkywall - Formulario de Transferencias/Pagos
//
// Endpoint real: POST /api/transacciones/transferencia
// Body: { "alias": "...", "cbu": "...", "monto": 123 } (mandar solo uno de
// alias/cbu, el otro vacio). El backend identifica la cuenta de origen a
// partir del email del JWT.
// Errores: 404 si no existe la cuenta destino, 422 si el saldo es
// insuficiente o los datos son invalidos (no 400).

const API_BASE_URL = 'http://localhost:8080/api';

const form = document.getElementById('form-transferencia');
const aliasInput = document.getElementById('alias');
const cbuInput = document.getElementById('cbu');
const montoInput = document.getElementById('monto');
const errorAlias = document.getElementById('error-alias');
const errorCbu = document.getElementById('error-cbu');
const errorMonto = document.getElementById('error-monto');
const mensaje = document.getElementById('transferencia-mensaje');
const btnTransferir = document.getElementById('btn-transferir');

function limpiarErrores() {
    errorAlias.textContent = '';
    errorCbu.textContent = '';
    errorMonto.textContent = '';
    aliasInput.classList.remove('input-error');
    cbuInput.classList.remove('input-error');
    montoInput.classList.remove('input-error');
    mensaje.textContent = '';
    mensaje.className = 'transferencia-mensaje';
}

function validarFormulario(alias, cbu, monto) {
    let esValido = true;

    if (!alias && !cbu) {
        errorAlias.textContent = 'Ingresá un alias o un CBU.';
        aliasInput.classList.add('input-error');
        cbuInput.classList.add('input-error');
        esValido = false;
    }

    if (!monto || Number(monto) < 1) {
        errorMonto.textContent = 'El monto mínimo a transferir es $1.';
        montoInput.classList.add('input-error');
        esValido = false;
    }

    return esValido;
}

async function extraerMensajeError(respuesta) {
    try {
        const cuerpo = await respuesta.json();
        return cuerpo.message || 'No se pudo completar la transferencia.';
    } catch {
        return 'No se pudo completar la transferencia.';
    }
}

form.addEventListener('submit', async function (evento) {
    evento.preventDefault();
    limpiarErrores();

    const alias = aliasInput.value.trim();
    const cbu = cbuInput.value.trim();
    const monto = montoInput.value;

    if (!validarFormulario(alias, cbu, monto)) {
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
                alias: alias || null,
                cbu: cbu || null,
                monto: Number(monto)
            })
        });

        if (!respuesta.ok) {
            const textoError = await extraerMensajeError(respuesta);
            mensaje.textContent = textoError;
            mensaje.className = 'transferencia-mensaje transferencia-error-general';
            return;
        }

        mensaje.textContent = '¡Transferencia realizada con éxito!';
        mensaje.className = 'transferencia-mensaje transferencia-exito';
        if (typeof mostrarToast === 'function') {
            mostrarToast('Transferencia enviada correctamente.', 'exito');
        }
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

aliasInput.addEventListener('input', function () {
    if (aliasInput.value.trim().length > 0) {
        cbuInput.value = '';
        cbuInput.disabled = true;
    } else {
        cbuInput.disabled = false;
    }
});

cbuInput.addEventListener('input', function () {
    if (cbuInput.value.trim().length > 0) {
        aliasInput.value = '';
        aliasInput.disabled = true;
    } else {
        aliasInput.disabled = false;
    }
});