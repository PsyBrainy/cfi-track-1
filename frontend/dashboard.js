// Referenciamos el contenedor HTML
const saldoElement = document.getElementById('saldo-disponible');

const formatearMoneda = (monto) => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
    }).format(monto);
};

// Animacion de conteo: sube desde 0 hasta el saldo real en vez de aparecer de golpe.
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

const cargarSaldo = async () => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            saldoElement.textContent = 'Usuario no autenticado';
            return;
        }

        // Peticion al endpoint protegido
        const response = await fetch('http://localhost:8080/api/cuentas/balance', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if(response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = 'autenticacion/login.html';
        }

        if (response.ok) {
            const data = await response.json();
            animarSaldo(Number(data.saldoDisponible));
        } else {
            saldoElement.textContent = 'Error al cargar';
        }
    } catch (error) {
        console.error("Error en la petición:", error);
        saldoElement.textContent = 'Error de conexión';
    }
};

document.addEventListener('DOMContentLoaded', cargarSaldo);