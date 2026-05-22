window.onload = () => {
  const token    = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const email    = localStorage.getItem('email');

  if (!token || !username) {
    window.location.href = 'index.html';
    return;
  }

  const initials = username.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  document.getElementById('nav-avatar').textContent     = initials;
  document.getElementById('nav-username').textContent   = username;
  document.getElementById('profile-avatar').textContent = initials;
  document.getElementById('profile-name').textContent   = username;
  document.getElementById('profile-email-sub').textContent = email || 'N/A';
  document.getElementById('info-name').textContent      = username;
  document.getElementById('info-email').textContent     = email || 'N/A';
  document.getElementById('info-login').textContent     = new Date().toLocaleString('en-IN');
};

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('email');
  window.location.href = 'index.html';
}