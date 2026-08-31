const form = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passInput = document.getElementById('password');
const emailError = document.getElementById('emailError');
const passError = document.getElementById('passwordError');

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



    // 3. Si es válido, acceder
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