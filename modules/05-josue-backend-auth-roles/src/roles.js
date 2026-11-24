// Validación de permisos y protección de pantalla
function validateRole(requiredRole) {
  const activeUser = getActiveUser();
  if (!activeUser) return false;

  // El rol 'admin' tiene permiso a todos los módulos
  if (activeUser.rol === 'admin') return true;

  return activeUser.rol === requiredRole;
}

function navigateAndProtect(requiredRole) {
  const hasAccess = validateRole(requiredRole);

  const dashboardView = document.getElementById('view-dashboard');
  const deniedView = document.getElementById('view-access-denied');

  if (hasAccess) {
    alert(`✅ Acceso AUTORIZADO al módulo de ${requiredRole.toUpperCase()}`);
  } else {
    dashboardView.classList.add('d-none');
    deniedView.classList.remove('d-none');
  }
}

function showDashboard() {
  document.getElementById('view-access-denied').classList.add('d-none');
  document.getElementById('view-dashboard').classList.remove('d-none');
}
