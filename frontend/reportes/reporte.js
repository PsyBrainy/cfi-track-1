// Alkywall - Sistema Visual de Gestión de Gastos
//
// Endpoint real: GET /api/transacciones/reporte-gastos
// Devuelve un array de ReporteGastosDTO: { tipoTransaccion, total }
// (agrupa EGRESO/EXTRACCION/PAGO). El backend NO manda el porcentaje,
// asi que se calcula aca en base al total de cada categoria sobre la
// suma de todas.

const contenedorBarras = document.getElementById('reporte-barras');
const mensajeReporte = document.getElementById('reporte-mensaje');

const etiquetasTipo = {
    EGRESO: 'Transferencias enviadas',
    EXTRACCION: 'Extracciones',
    PAGO: 'Pagos'
};

function calcularPorcentajes(datos) {
    const totalGeneral = datos.reduce((acumulado, item) => acumulado + Number(item.total), 0);

    return datos.map(function (item) {
        return {
            etiqueta: etiquetasTipo[item.tipoTransaccion] || item.tipoTransaccion,
            total: Number(item.total),
            porcentaje: totalGeneral > 0 ? (Number(item.total) / totalGeneral) * 100 : 0
        };
    });
}

function crearBarraGasto(item) {
    const fila = document.createElement('div');
    fila.className = 'reporte-fila';

    const etiqueta = document.createElement('div');
    etiqueta.className = 'reporte-etiqueta';

    const nombreCategoria = document.createElement('span');
    nombreCategoria.textContent = item.etiqueta;

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
    if (window.ALKYWALL_ROLE === 'ADMIN') {
        return;
    }

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
        calcularPorcentajes(datos).forEach(function (item) {
            contenedorBarras.appendChild(crearBarraGasto(item));
        });
    } catch (error) {
        console.error('Error al cargar el reporte de gastos:', error);
        mensajeReporte.textContent = 'Error de conexión. Intentá nuevamente.';
    }
}

document.addEventListener('DOMContentLoaded', cargarReporteGastos);