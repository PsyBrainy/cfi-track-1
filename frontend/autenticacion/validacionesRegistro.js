const form = document.getElementById('registroForm');
const emailInput = document.getElementById('email');
const passInput = document.getElementById('password');
const passRepeatInput = document.getElementById('confirm-password');
const nombreInput = document.getElementById('nombre');
const apellidoInput = document.getElementById('apellido');
const documentoInput = document.getElementById('documento');
const telefonoInput = document.getElementById('telefono');
const emailError = document.getElementById('emailError');
const passError = document.getElementById('passwordError');
const passRepeatError = document.getElementById('passwordRepeatError');
const nombreError = document.getElementById('nombreError');
const nombreErrorVacio = document.getElementById('nombreErrorVacio');
const apellidoError = document.getElementById('apellidoError');
const apellidoErrorVacio = document.getElementById('apellidoErrorVacio');
const documentoError = document.getElementById('documentoError');
const documentoLongitudError = document.getElementById('documentoLongitudError');
const telefonoError = document.getElementById('telefonoError');
const telefonoLongitudError = document.getElementById('telefonoLongitudError');

const registroBtn = document.getElementById('btn-registro');
const serverError = document.getElementById('serverError');

// URL base del backend
const API_URL = 'http://localhost:8080/api/auth/register';

form.addEventListener('submit', async function(event) {
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
        passRepeatError.style.display = 'none';
        isValid = false;
    } else if (passInput.value !== passRepeatInput.value) {
        passError.style.display = 'none';
        passRepeatError.style.display = 'block';
        isValid = false;
    } else {
        passError.style.display = 'none';
    }

    // 3. Validar Nombre
     const regexLetras = /^[a-zA-ZÀ-ÿ\s]+$/;
        if(nombreInput.value === "") {
            nombreErrorVacio.style.display = 'block';
            isValid = false;
        } else if (!regexLetras.test(nombreInput.value)) {
            nombreErrorVacio.style.display = 'none';
            nombreError.style.display = 'block';
            isValid = false;
        } else {
            nombreErrorVacio.style.display = 'none';
            nombreError.style.display = 'none';
        }

    // 4. Validar Apellido
    if(apellidoInput.value === "") {
            apellidoErrorVacio.style.display = 'block';
            isValid = false;
        } else if (!regexLetras.test(apellidoInput.value)) {
            apellidoErrorVacio.style.display = 'none';
            apellidoError.style.display = 'block';
            isValid = false;
        } else {
            apellidoErrorVacio.style.display = 'none';
            apellidoError.style.display = 'none';
        }

    // 5. Validar Documento
    const regexSoloNumeros = /^\d+$/;
        if(documentoInput.value.length !== 8) {
            documentoLongitudError.style.display = 'block';
            documentoError.style.display = 'none';
            isValid = false;
        } else if (!regexSoloNumeros.test(documentoInput.value)) {
            documentoLongitudError.style.display = 'none';
            documentoError.style.display = 'block';
            isValid = false;
        } else {
            documentoLongitudError.style.display = 'none';
            documentoError.style.display = 'none';
        }

    // 6. Validar Telefono
    if(telefonoInput.value.length !== 10) {
            telefonoLongitudError.style.display = 'block';
            telefonoError.style.display = 'none';
            isValid = false;
        } else if (!regexSoloNumeros.test(telefonoInput.value)) {
            telefonoLongitudError.style.display = 'none';
            telefonoError.style.display = 'block';
            isValid = false;
        } else {
            telefonoLongitudError.style.display = 'none';
            telefonoError.style.display = 'none';
        }

    // 7. Si es válido, acceder
    if (isValid) {
            const userData = {
                nombre: nombreInput.value,
                apellido: apellidoInput.value,
                dni: documentoInput.value,
                email: emailInput.value,
                password: passInput.value,
                telefono: telefonoInput.value,
            };

        registroBtn.disabled = true;
        registroBtn.textContent = 'Registrando...';

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (response.status === 400 || response.status === 401 || response.status === 403) {
                const data = await response.json().catch(() => {});
                serverError.textContent = data.messagge || 'No se pudo completar el Registro.';
                serverError.style.display = 'block';
                return;
            }

            if (!response.ok) {
                const data = await response.json().catch(() => {});
                serverError.textContent = data.messagge || 'Ocurrio un error al registrarte.';
                serverError.style.display = 'block';
                return;
            }

            const data = await response.json();
            const token = data.token;

            if(token) {
                localStorage.setItem('token', token);
            }

            form.reset();
            window.location.replace('../index.html');
        } catch (error) {
            console.error('Error de conexion:', error);
            serverError.textContent = 'No se pudo conectar con el servidor.';
            serverError.style.display = 'block';
        } finally {
            registroBtn.disabled = false;
            registroBtn.textContent = 'Registrarse';
        }
    }
});