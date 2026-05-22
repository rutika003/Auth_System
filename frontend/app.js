let isLogin = true;

function switchTab(mode) {
  isLogin = mode === 'login';
  document.querySelectorAll('.tab-btn').forEach((b, i) => {
    b.classList.toggle('active', isLogin ? i === 0 : i === 1);
  });
  document.getElementById('username-field').style.display = isLogin ? 'none' : 'block';
  document.getElementById('form-title').textContent  = isLogin ? 'Sign in to your account' : 'Create your account';
  document.getElementById('form-sub').textContent    = isLogin ? 'Enter your credentials to continue' : 'Fill in your details to register';
  document.getElementById('submit-btn').textContent  = isLogin ? 'Sign In' : 'Create Account';
  clearMsg();
}

function showMsg(text, type) {
  const el = document.getElementById('msg');
  el.textContent   = text;
  el.className     = 'msg ' + type;
  el.style.display = 'block';
}

function clearMsg() {
  document.getElementById('msg').style.display = 'none';
}

async function submitForm() {
  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const username = document.getElementById('username').value.trim();

  if (!email || !password)   return showMsg('Please fill in all fields.', 'error');
  if (!isLogin && !username) return showMsg('Please enter your full name.', 'error');
  if (password.length < 6)   return showMsg('Password must be at least 6 characters.', 'error');

  const btn = document.getElementById('submit-btn');
  btn.disabled    = true;
  btn.textContent = 'Please wait...';

  const url  = isLogin
    ? 'http://192.168.1.19:5000/api/auth/login'
    : 'http://192.168.1.19:5000/api/auth/signup';

  const body = isLogin
    ? { email, password }
    : { username, email, password };

  try {
    const res  = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();

    if (data.token) {

      if (isLogin) {
        // ✅ LOGIN → go to dashboard directly
        localStorage.setItem('token',    data.token);
        localStorage.setItem('username', data.username);
        showDashboard(data.username);

      } else {
        // ✅ SIGNUP → show success message, switch to login tab
        showMsg('✅ Account created successfully! Please log in.', 'success');
        setTimeout(() => {
          switchTab('login');
          document.getElementById('email').value    = email;
          document.getElementById('password').value = '';
        }, 1500);
      }

    } else {
      showMsg(data.error || 'Something went wrong.', 'error');
    }

  } catch (e) {
    showMsg('Cannot connect to server. Make sure backend is running.', 'error');
  }

  btn.disabled    = false;
  btn.textContent = isLogin ? 'Sign In' : 'Create Account';
}

function showDashboard(name) {
  window.location.href = 'home.html';
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  document.getElementById('auth-section').style.display = 'block';
  document.getElementById('dashboard').style.display    = 'none';
  clearMsg();
}

window.onload = () => {
  const token = localStorage.getItem('token');
  const name  = localStorage.getItem('username');
  if (token && name) showDashboard(name);
};