window.onload = () => {
  const token    = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const email    = localStorage.getItem('email');

  if (!token || !username) {
    window.location.href = 'index.html';
    return;
  }

  const initials = username.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  document.getElementById('nav-avatar').textContent   = initials;
  document.getElementById('nav-username').textContent = username;
  document.getElementById('dash-username').textContent = username;
  document.getElementById('dash-email').textContent   = email || 'N/A';
  document.getElementById('member-since').textContent = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  document.getElementById('created-time').textContent = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
};

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('email');
  window.location.href = 'index.html';
}