// Alkywall - Listado de Movimientos
//
// Endpoint real: GET /api/transacciones/historial
// Devuelve un array de TransaccionResumenDTO:
// { id, monto (siempre positivo), tipo ("INGRESO" | "EGRESO"), fecha, estado }
// El backend identifica la cuenta a partir del email del JWT.
// Nota: por ahora el historial solo incluye transferencias; los depositos
// todavia no se listan aca (pendiente del lado del backend).

const API_BASE_URL = 'http://localhost:8080/api';

const contenedor = document.getElementById('historial-lista');
const mensaje = document.getElementById('historial-mensaje');

function formatearMoneda(monto) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
    }).format(Math.abs(monto));
}

function formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' });
}

function etiquetaTipo(tipo) {
    const etiquetas = {
        INGRESO: 'Transferencia recibida',
        EGRESO: 'Transferencia enviada',
        DEPOSITO: 'Depósito'
    };

    return etiquetas[tipo] || tipo;
}

function crearTarjetaMovimiento(movimiento) {
    const esIngreso = movimiento.tipo === 'INGRESO' || movimiento.tipo === 'DEPOSITO';

    const tarjeta = document.createElement('div');
    tarjeta.className = 'historial-tarjeta';

    const info = document.createElement('div');
    info.className = 'historial-info';

    const tipo = document.createElement('p');
    tipo.className = 'historial-tipo';
    tipo.textContent = etiquetaTipo(movimiento.tipo);

    const fecha = document.createElement('p');
    fecha.className = 'historial-fecha';
    fecha.textContent = formatearFecha(movimiento.fecha);

    info.appendChild(tipo);
    info.appendChild(fecha);

    const monto = document.createElement('p');
    monto.className = esIngreso ? 'historial-monto historial-ingreso' : 'historial-monto historial-egreso';
    monto.textContent = `${esIngreso ? '+' : '-'} ${formatearMoneda(movimiento.monto)}`;

    tarjeta.appendChild(info);
    tarjeta.appendChild(monto);

    return tarjeta;
}

async function cargarMovimientos() {
    const token = localStorage.getItem('token');

    if (!token) {
        mensaje.textContent = 'Tenés que iniciar sesión para ver tus movimientos.';
        return;
    }

    try {
        const respuesta = await fetch(`${API_BASE_URL}/transacciones/historial`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!respuesta.ok) {
            mensaje.textContent = 'No se pudieron cargar los movimientos.';
            return;
        }

        const movimientos = await respuesta.json();

        if (!Array.isArray(movimientos) || movimientos.length === 0) {
            mensaje.textContent = 'Todavía no tenés movimientos.';
            return;
        }

        mensaje.textContent = '';
        movimientos.forEach(function (movimiento) {
            contenedor.appendChild(crearTarjetaMovimiento(movimiento));
        });
    } catch (error) {
        console.error('Error al cargar movimientos:', error);
        mensaje.textContent = 'Error de conexión. Intentá nuevamente.';
    }
}

document.addEventListener('DOMContentLoaded', cargarMovimientos);
