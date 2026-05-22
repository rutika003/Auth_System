// Check if user is logged in
window.onload = () => {
  const token    = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const email    = localStorage.getItem('email');

  // If not logged in redirect back to login
  if (!token || !username) {
    window.location.href = 'index.html';
    return;
  }

  // Set username in navbar
  document.getElementById('nav-username').textContent = username;
  document.getElementById('hero-username').textContent = username;
  document.getElementById('card-email').textContent   = email || 'you@company.com';

  // Set avatar initials
  const initials = username.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  document.getElementById('nav-avatar').textContent = initials;
};

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('email');
  window.location.href = 'index.html';
}