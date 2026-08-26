// Alkywall - Script Inicial de la Aplicación

document.addEventListener('DOMContentLoaded', function () {
  console.log('Aplicación Alkywall cargada correctamente.');

  // Selección de botones de login y registro
  const btnLogin = document.getElementById('btn-login');
  const btnRegister = document.getElementById('btn-register');

  if (btnLogin) {
    btnLogin.addEventListener('click', function () {
      alert('Funcionalidad de Inicio de Sesión (En desarrollo).');
    });
  }

  if (btnRegister) {
    btnRegister.addEventListener('click', function () {
      alert('Funcionalidad de Registro de Cuenta (En desarrollo).');
    });
  }
});
