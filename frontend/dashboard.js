// Alkywall - Dashboard: lectura de rol vía JWT y render condicional

function decodificarJwt(token) {
    try {
        const payload = token.split('.')[1];
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('No se pudo decodificar el token:', error);
        return null;
    }
}

const token = localStorage.getItem('token');

if (!token) {
    window.location.href = 'autenticacion/login.html';
    throw new Error('Redirigiendo a login: no hay token.');
}

const payloadJwt = token ? decodificarJwt(token) : null;
const rolUsuario = payloadJwt ? payloadJwt.role : null;

// Se expone para que reporte.js y deposito.js sepan si deben ejecutarse
window.ALKYWALL_ROLE = rolUsuario;

const vistaCliente = document.getElementById('vista-cliente');
const vistaAdmin = document.getElementById('vista-admin');
const saldoElement = document.getElementById('saldo-disponible');
const aliasElement = document.getElementById('alias-cuenta');
const btnArs = document.getElementById('btn-ars');
const btnUsd = document.getElementById('btn-usd');
const cotizacionElement = document.getElementById('cotizacion-dolar');

// Variables para la conversion de divisas
let saldo = 0;
let saldoMostrado = 0;
let cotizacionDolar = 0;
let monedaActual = 'ARS';
let mostrandoUSD = false;

const mostrarSaldo = (animar = false) => {

    if (cotizacionDolar <= 0) {
        return;
    }

    let nuevoSaldo;
    let moneda;

    if (mostrandoUSD) {
        nuevoSaldo = saldo / cotizacionDolar;
        moneda = 'USD';
    } else {
        nuevoSaldo = saldo;
        moneda = 'ARS';
    }

    if (animar) {
        animarSaldo(saldoMostrado, nuevoSaldo, moneda);
    } else {
        saldoElement.textContent =
            formatearMoneda(nuevoSaldo, moneda);
    }

    saldoMostrado = nuevoSaldo;
};

function mostrarVistaSegunRol() {
    if (rolUsuario === 'ADMIN') {
        vistaAdmin.classList.remove('dashboard-oculto');
        vistaCliente.classList.add('dashboard-oculto');
    } else {
        vistaCliente.classList.remove('dashboard-oculto');
        vistaAdmin.classList.add('dashboard-oculto');
    }
}

const animarSaldo = (saldoInicial, saldoFinal, moneda) => {
    const duracionMs = 700;
    const inicio = performance.now();

    function paso(ahora) {
        const progreso = Math.min((ahora - inicio) / duracionMs, 1);
        const valorActual = saldoInicial + (saldoFinal - saldoInicial) * progreso;

        saldoElement.textContent = formatearMoneda(valorActual, 'ARS');

        if (progreso < 1) {
            requestAnimationFrame(paso);
        } else {
            saldoElement.textContent =
                formatearMoneda(saldoFinal, moneda);
        }
    }

    requestAnimationFrame(paso);
};

const cargarCuenta = async () => {
    try {
        const response = await fetch('http://localhost:8080/api/cuentas', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = 'autenticacion/login.html';
            return;
        }

        if (response.ok) {
            const data = await response.json();

            saldo = Number(data.saldoDisponible);
            cotizacionDolar = Number(data.cotizacionDolar);
            monedaActual = data.moneda;

            saldoMostrado = 0;

            mostrarSaldo(true);

            cotizacionElement.textContent = `1 USD = ${formatearMoneda(cotizacionDolar, 'ARS')}`;

            aliasElement.textContent = data.alias ? `Alias: ${data.alias}` : '';
        } else {
            saldoElement.textContent = 'Error al cargar';
        }
    } catch (error) {
        console.error('Error en la petición:', error);
        saldoElement.textContent = 'Error de conexión';
    }
};

btnArs.addEventListener('click', () => {

    if (!mostrandoUSD) {
        return;
    }

    mostrandoUSD = false;

    btnArs.classList.add('activo');
    btnUsd.classList.remove('activo');

    mostrarSaldo(true);
});

btnUsd.addEventListener('click', () => {

    if (mostrandoUSD || cotizacionDolar <= 0) {
        return;
    }

    mostrandoUSD = true;

    btnUsd.classList.add('activo');
    btnArs.classList.remove('activo');

    mostrarSaldo(true);
});

document.addEventListener('DOMContentLoaded', function () {
    mostrarVistaSegunRol();

    if (rolUsuario !== 'ADMIN') {
        cargarCuenta();
    }
    const btnLogoutDashboard = document.getElementById('btn-logout-dashboard');
        if (btnLogoutDashboard) {
            btnLogoutDashboard.addEventListener('click', function () {
                localStorage.removeItem('token');
                window.location.href = 'index.html';
            });
        }

        lucide.createIcons();
});