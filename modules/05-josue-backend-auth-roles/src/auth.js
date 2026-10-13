// Cargar y almacenar usuarios demo en localStorage
document.addEventListener('DOMContentLoaded', () => {
  initUsersDemo();
  setupAuthListeners();
  checkSession();
});

function initUsersDemo() {
  if (!localStorage.getItem('navi_users')) {
    fetch('../demo/usuarios-demo.json')
      .then(res => res.json())
      .then(users => {
        localStorage.setItem('navi_users', JSON.stringify(users));
      })
      .catch(() => {
        const defaultUsers = [
          { id: 1, nombre: "Lucas Niño", email: "nino@navi.com", password: "123", rol: "nino" },
          { id: 2, nombre: "Carlos Tutor", email: "tutor@navi.com", password: "123", rol: "tutor" },
          { id: 3, nombre: "Prof. Ana Educadora", email: "educador@navi.com", password: "123", rol: "educador" },
          { id: 4, nombre: "Admin Principal", email: "admin@navi.com", password: "123", rol: "admin" }
        ];
        localStorage.setItem('navi_users', JSON.stringify(defaultUsers));
      });
  }
}

function setupAuthListeners() {
  const loginForm = document.getElementById('form-login');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      loginUser();
    });
  }

  const registerForm = document.getElementById('form-register');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      registerUser();
    });
  }
}

// Iniciar sesión
function loginUser() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const errorAlert = document.getElementById('login-error');

  const users = JSON.parse(localStorage.getItem('navi_users')) || [];
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    if (errorAlert) errorAlert.classList.add('d-none');
    saveActiveUser(user);
    checkSession();
  } else {
    if (errorAlert) {
      errorAlert.innerText = 'Error: Credenciales incorrectas o usuario no registrado.';
      errorAlert.classList.remove('d-none');
    }
  }
}

// Registrar usuario
function registerUser() {
  const nombre = document.getElementById('reg-nombre').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;
  const rol = document.getElementById('reg-rol').value;

  const users = JSON.parse(localStorage.getItem('navi_users')) || [];

  const newUser = {
    id: Date.now(),
    nombre,
    email,
    password,
    rol
  };

  users.push(newUser);
  localStorage.setItem('navi_users', JSON.stringify(users));
  saveActiveUser(newUser);

  window.location.href = 'login.html';
}

// Guardar usuario activo
function saveActiveUser(user) {
  localStorage.setItem('navi_active_user', JSON.stringify(user));
}

// Obtener usuario activo
function getActiveUser() {
  return JSON.parse(localStorage.getItem('navi_active_user'));
}

// Cerrar sesión
function logout() {
  localStorage.removeItem('navi_active_user');
  window.location.href = 'login.html';
}

// Verificar sesión
function checkSession() {
  const activeUser = getActiveUser();
  const loginView = document.getElementById('view-login');
  const dashboardView = document.getElementById('view-dashboard');

  if (activeUser && dashboardView) {
    if (loginView) loginView.classList.add('d-none');
    dashboardView.classList.remove('d-none');

    document.getElementById('user-welcome').innerText = `Hola, ${activeUser.nombre}`;
    document.getElementById('user-role-badge').innerText = `Rol actual: ${activeUser.rol.toUpperCase()}`;
  } else if (!activeUser && dashboardView) {
    if (loginView) loginView.classList.remove('d-none');
    dashboardView.classList.add('d-none');
  }
}
