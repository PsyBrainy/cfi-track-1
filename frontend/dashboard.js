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
}

const payloadJwt = token ? decodificarJwt(token) : null;
const rolUsuario = payloadJwt ? payloadJwt.role : null;

// Se expone para que reporte.js y deposito.js sepan si deben ejecutarse
window.ALKYWALL_ROLE = rolUsuario;

const vistaCliente = document.getElementById('vista-cliente');
const vistaAdmin = document.getElementById('vista-admin');
const saldoElement = document.getElementById('saldo-disponible');
const aliasElement = document.getElementById('alias-cuenta');

function mostrarVistaSegunRol() {
    if (rolUsuario === 'ADMIN') {
        vistaAdmin.classList.remove('dashboard-oculto');
        vistaCliente.classList.add('dashboard-oculto');
    } else {
        vistaCliente.classList.remove('dashboard-oculto');
        vistaAdmin.classList.add('dashboard-oculto');
    }
}

const animarSaldo = (saldoFinal) => {
    const duracionMs = 700;
    const inicio = performance.now();

    function paso(ahora) {
        const progreso = Math.min((ahora - inicio) / duracionMs, 1);
        const valorActual = saldoFinal * progreso;
        saldoElement.textContent = formatearMoneda(valorActual);

        if (progreso < 1) {
            requestAnimationFrame(paso);
        } else {
            saldoElement.textContent = formatearMoneda(saldoFinal);
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
            animarSaldo(Number(data.saldoDisponible));
            aliasElement.textContent = data.alias ? `Alias: ${data.alias}` : '';
        } else {
            saldoElement.textContent = 'Error al cargar';
        }
    } catch (error) {
        console.error('Error en la petición:', error);
        saldoElement.textContent = 'Error de conexión';
    }
};

document.addEventListener('DOMContentLoaded', function () {
    mostrarVistaSegunRol();

    if (rolUsuario !== 'ADMIN') {
        cargarCuenta();
    }
});