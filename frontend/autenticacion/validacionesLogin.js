const form = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passInput = document.getElementById('password');
const emailError = document.getElementById('emailError');
const passError = document.getElementById('passwordError');
const loginBtn = document.getElementById('btn-login');
const serverError = document.getElementById('serverError');

// URL del backend.
const API_URL = 'http://localhost:8080/api/auth/login';

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
        isValid = false;
    } else {
        passError.style.display = 'none';
    }

    // 3. Si es válido, acceder
    if (isValid) {
        const userData = {
            email: emailInput.value,
            password: passInput.value
        };

        loginBtn.disabled = true;
        loginBtn.textContent = 'Ingresando...'

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if(response.status === 401 || response.status === 403) {
                const data = await response.json().catch(() => ({}));
                console.log(data)
                serverError.textContent = data.message || 'Email o contrasena incorrectos.)';
                serverError.style.display = 'block';
                return
            }

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                console.log(data);
                serverError.textContent = data.message || 'Ocurrio un error al iniciar sesion.'
                serverError.style.display = 'block';
                return;
            }

            //EXITO
            const data = await response.json();
            const token = data.token;

            if(token) {
                localStorage.setItem('token', token);
            }

            form.reset();
            window.location.replace('../index.html');

        } catch(error) {
            console.error('Error de conexion: ', error);
            serverError.textContent = 'No se pudo conectar al servidor.';
            serverError.style.display = 'block';
        } finally {
            loginBtn.disabled = false;
            loginBtn.textContent = 'Iniciar Sesion';
        }
    }
});