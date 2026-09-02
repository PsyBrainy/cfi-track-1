// Alkywall - Sistema Visual de Gestión de Gastos
//
// NOTA: el endpoint GET /api/transacciones/reporte-gastos todavia no existe
// en el backend (el ticket #35 asume un reporte agrupado ya armado con
// GROUP BY, que en este repo todavia no esta implementado). Se asume que
// devuelve un array con forma:
// { categoria: string, total: number, porcentaje: number (0-100) }
// Ajustar la URL y los nombres de campos cuando el backend este listo.

const API_BASE_URL = 'http://localhost:8080/api';

const contenedorBarras = document.getElementById('reporte-barras');
const mensajeReporte = document.getElementById('reporte-mensaje');

function formatearMoneda(monto) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
    }).format(monto);
}

function crearBarraGasto(item) {
    const fila = document.createElement('div');
    fila.className = 'reporte-fila';

    const etiqueta = document.createElement('div');
    etiqueta.className = 'reporte-etiqueta';

    const nombreCategoria = document.createElement('span');
    nombreCategoria.textContent = item.categoria;

    const totalCategoria = document.createElement('span');
    totalCategoria.textContent = formatearMoneda(item.total);

    etiqueta.appendChild(nombreCategoria);
    etiqueta.appendChild(totalCategoria);

    const barraFondo = document.createElement('div');
    barraFondo.className = 'reporte-barra-fondo';

    const barraRelleno = document.createElement('div');
    barraRelleno.className = 'reporte-barra-relleno';
    barraRelleno.style.width = `${item.porcentaje}%`;
    barraRelleno.textContent = `${Math.round(item.porcentaje)}%`;

    barraFondo.appendChild(barraRelleno);

    fila.appendChild(etiqueta);
    fila.appendChild(barraFondo);

    return fila;
}

async function cargarReporteGastos() {
    const token = localStorage.getItem('token');

    if (!token) {
        mensajeReporte.textContent = 'Tenés que iniciar sesión para ver tu reporte.';
        return;
    }

    try {
        const respuesta = await fetch(`${API_BASE_URL}/transacciones/reporte-gastos`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!respuesta.ok) {
            mensajeReporte.textContent = 'No se pudo cargar el reporte de gastos.';
            return;
        }

        const datos = await respuesta.json();

        if (!Array.isArray(datos) || datos.length === 0) {
            mensajeReporte.textContent = 'Todavía no tenés gastos registrados.';
            return;
        }

        mensajeReporte.textContent = '';
        datos.forEach(function (item) {
            contenedorBarras.appendChild(crearBarraGasto(item));
        });
    } catch (error) {
        console.error('Error al cargar el reporte de gastos:', error);
        mensajeReporte.textContent = 'Error de conexión. Intentá nuevamente.';
    }
}

document.addEventListener('DOMContentLoaded', cargarReporteGastos);
