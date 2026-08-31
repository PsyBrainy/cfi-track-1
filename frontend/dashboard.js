// Referenciamos el contenedor HTML
const saldoElement = document.getElementById('saldo-disponible');

const formatearMoneda = (monto) => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
    }).format(monto);
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

        if (response.ok) {
            const data = await response.json();
            saldoElement.textContent = formatearMoneda(data.saldoDisponible);
        } else {
            saldoElement.textContent = 'Error al cargar';
        }
    } catch (error) {
        console.error("Error en la petición:", error);
        saldoElement.textContent = 'Error de conexión';
    }
};

document.addEventListener('DOMContentLoaded', cargarSaldo);