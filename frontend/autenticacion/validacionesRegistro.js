const form = document.getElementById('registroForm');
const emailInput = document.getElementById('email');
const passInput = document.getElementById('password');
const nombreInput = document.getElementById('nombre');
const apellidoInput = document.getElementById('apellido');
const documentoInput = document.getElementById('documento');
const emailError = document.getElementById('emailError');
const passError = document.getElementById('passwordError');
const nombreError = document.getElementById('nombreError');
const nombreErrorVacio = document.getElementById('nombreErrorVacio');
const apellidoError = document.getElementById('apellidoError');
const apellidoErrorVacio = document.getElementById('apellidoErrorVacio');
const documentoError = document.getElementById('documentoError');
const documentoLongitudError = document.getElementById('documentoLongitudError');

form.addEventListener('submit', function(event) {
    event.preventDefault();

    let isValid = true;

    // 1. Validar Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
        emailError.style.display = 'block';
        isValid = false;
    } else {
        emailError.style.display = 'none';
    }

    // 2. Validar Contraseña
    if (passInput.value.length < 8) {
        passError.style.display = 'block';
        isValid = false;
    } else {
        passError.style.display = 'none';
    }

    // 3. Validar Nombre
    const regexLetras = /^[a-zA-ZÀ-ÿ\s]+$/;
    if(nombreInput.value === "") {
        nombreErrorVacio.style.display = 'block';
    } else if (!regexLetras.test(nombreInput.value)) {
        nombreError.style.display = 'block';
        isValid = false;
    } else {
        nombreError.style.display = 'none';
    }

    // 4. Validar Apellido
    if(apellidoInput.value === "") {
        apellidoErrorVacio.style.display = 'block';
    } else if (!regexLetras.test(apellidoInput.value)) {
        apellidoError.style.display = 'block';
        isValid = false;
    } else {
        apellidoError.style.display = 'none';
    }

    // 5. Validar Documento
    if(documentoInput.value.length === 0 || documentoInput.value.length !== 8) {
        documentoLongitudError.style.display = 'block';
        isValid = false;
    } else if (regexLetras.test(documentoInput.value)) {
        documentoError.style.display = 'block';
        isValid = false;
    } else {
        documentoError.style.display = 'none';
    }

    // 6. Si es válido, acceder
    if (isValid) {
        const userData = {
            email: emailInput.value,
            password: passInput.value
        };

        localStorage.setItem('usuarioRegistrado', JSON.stringify(userData));
        alert('Sesion Iniciada');
        form.reset();
        window.location.replace('../index.html');
    }
});