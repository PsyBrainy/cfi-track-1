const API_BASE_URL = 'http://localhost:8080/api';

function formatearMoneda(monto, moneda = 'ARS') {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: moneda
    }).format(monto);
}