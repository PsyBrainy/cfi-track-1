// Alkywall - Listado de Movimientos
//
// NOTA: el endpoint GET /api/transacciones/historial todavia no existe en el
// backend (el ticket #34 asume que "el backend ya provee la informacion",
// pero en este repo todavia no esta implementado). Se asume que devuelve un
// array de movimientos con forma:
// { idTransaccion, tipo, monto (positivo = ingreso, negativo = egreso),
//   fechaHora, descripcion }
// Ajustar la URL y los nombres de campos cuando el backend este listo.

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

function crearTarjetaMovimiento(movimiento) {
    const esIngreso = Number(movimiento.monto) >= 0;

    const tarjeta = document.createElement('div');
    tarjeta.className = 'historial-tarjeta';

    const info = document.createElement('div');
    info.className = 'historial-info';

    const tipo = document.createElement('p');
    tipo.className = 'historial-tipo';
    tipo.textContent = movimiento.descripcion || movimiento.tipo;

    const fecha = document.createElement('p');
    fecha.className = 'historial-fecha';
    fecha.textContent = formatearFecha(movimiento.fechaHora);

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
