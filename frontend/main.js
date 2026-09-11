// Alkywall - Script Inicial de la Aplicación

document.addEventListener('DOMContentLoaded', function () {
  console.log('Aplicación Alkywall cargada correctamente.');

  const btnLogin = document.getElementById('btn-login');
  const btnRegister = document.getElementById('btn-register');
  const btnLogout = document.getElementById('btn-logout');
  const btnWallet = document.getElementById('btn-wallet');

  if (localStorage.getItem('token') !== null) {
    if (btnLogin) btnLogin.style.display = 'none';
    if (btnRegister) btnRegister.style.display = 'none';
    if (btnLogout) btnLogout.style.display = 'inline-block';
    if (btnWallet) btnWallet.style.display = 'inline-block';
  }

  if (btnLogout) {
    btnLogout.addEventListener('click', function () {
      localStorage.removeItem('token');
      window.location.href = 'autenticacion/login.html';
    });
  }
});