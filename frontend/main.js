// Alkywall - Script Inicial de la Aplicación

document.addEventListener('DOMContentLoaded', function () {
  console.log('Aplicación Alkywall cargada correctamente.');

  // Selección de botones de login y registro
  const btnLogin = document.getElementById('btn-login');
  const btnRegister = document.getElementById('btn-register');
  const btnLogout = document.getElementById('btn-logout');

  if(localStorage.getItem('usuarioRegistrado') !== null) {
    btnLogin.style.display = 'none';
    btnRegister.style.display = 'none';
    btnLogout.style.display = 'block';
  }

  if (btnLogin) {
    btnLogin.addEventListener('click', function () {
      window.location.href = 'autenticacion/login.html';
    });
  }

  if (btnRegister) {
    btnRegister.addEventListener('click', function () {
      window.location.href = 'autenticacion/registro.html';
    });
  }

  if(btnLogout) {
    btnLogout.addEventListener('click', function () {
      localStorage.removeItem('usuarioRegistrado');
      window.location.href = 'autenticacion/login.html';
    })
  }
});
