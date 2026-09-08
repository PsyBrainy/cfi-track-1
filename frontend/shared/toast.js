// Alkywall - Notificacion flotante compartida (toast)
// Uso: mostrarToast('Mensaje', 'exito' | 'error' | 'info')
// Reemplaza a alert()/confirm() para que el feedback no interrumpa al
// usuario con un popup nativo del navegador.

function obtenerContenedorToast() {
    let contenedor = document.getElementById('toast-contenedor');

    if (!contenedor) {
        contenedor = document.createElement('div');
        contenedor.id = 'toast-contenedor';
        contenedor.className = 'toast-contenedor';
        document.body.appendChild(contenedor);
    }

    return contenedor;
}

function mostrarToast(mensaje, tipo) {
    const iconos = {
        exito: '✅',
        error: '⚠️',
        info: 'ℹ️'
    };

    const contenedor = obtenerContenedorToast();

    const toast = document.createElement('div');
    toast.className = `toast toast-${tipo || 'info'}`;

    const icono = document.createElement('span');
    icono.className = 'toast-icono';
    icono.textContent = iconos[tipo] || iconos.info;

    const texto = document.createElement('span');
    texto.textContent = mensaje;

    toast.appendChild(icono);
    toast.appendChild(texto);
    contenedor.appendChild(toast);

    setTimeout(function () {
        toast.classList.add('toast-saliendo');
        toast.addEventListener('animationend', function () {
            toast.remove();
        });
    }, 3200);
}
