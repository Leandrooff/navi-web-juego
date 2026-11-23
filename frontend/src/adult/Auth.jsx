import React, { useState, useEffect } from "react";

/**
 * Cuentas sintéticas predefinidas para pruebas de entrega.
 * (Módulo 05: Josué - Autenticación y Permisos)
 */
const SYNTHETIC_ACCOUNTS = [
  {
    role: "tutor",
    label: "Tutor (Familia)",
    email: "tutor@navi.test",
    password: "password123",
    name: "Elena - Mamá de Nico",
  },
  {
    role: "docente",
    label: "Docente / Educador",
    email: "docente@navi.test",
    password: "password123",
    name: "Prof. Marcos García",
  },
  {
    role: "admin",
    label: "Administrador (Sistema)",
    email: "admin@navi.test",
    password: "adminsecure456",
    name: "Admin NAVI",
  },
];

export default function Auth({ onLoginSuccess }) {
  const [tab, setTab] = useState("login"); // "login" | "register"
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);

  // Formulario Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Formulario Registro
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regRole, setRegRole] = useState("tutor"); // Solo tutor o docente

  // Formulario Cambio Contraseña
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Feedback y Estados UI
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [sessionExpiredNotice, setSessionExpiredNotice] = useState(false);
  const [accessDeniedNotice, setAccessDeniedNotice] = useState("");

  // Al montar el componente, recuperar sesión existente (Recarga de página)
  useEffect(() => {
    const savedUser = localStorage.getItem("navi_auth_user");
    const savedToken = localStorage.getItem("navi_auth_token");
    if (savedUser && savedToken) {
      try {
        const parsed = JSON.parse(savedUser);
        setCurrentUser(parsed);
        setToken(savedToken);
      } catch (err) {
        localStorage.removeItem("navi_auth_user");
        localStorage.removeItem("navi_auth_token");
      }
    }
  }, []);

  const clearAlerts = () => {
    setErrorMessage("");
    setSuccessMessage("");
    setAccessDeniedNotice("");
  };

  // Función para rellenar rápido con cuenta sintética
  const fillSyntheticAccount = (account) => {
    clearAlerts();
    setSessionExpiredNotice(false);
    setLoginEmail(account.email);
    setLoginPassword(account.password);
  };

  // 1. Proceso de Login
  const handleLogin = (e) => {
    e.preventDefault();
    clearAlerts();
    setSessionExpiredNotice(false);

    // Búsqueda en cuentas sintéticas o backend
    const account = SYNTHETIC_ACCOUNTS.find(
      (acc) => acc.email.toLowerCase() === loginEmail.toLowerCase().trim()
    );

    if (!account || account.password !== loginPassword) {
      setErrorMessage("Credenciales incorrectas. Verifique su correo electrónico y contraseña.");
      return;
    }

    const authPayload = {
      id: account.email === "admin@navi.test" ? 1 : account.email === "tutor@navi.test" ? 10 : 20,
      name: account.name,
      email: account.email,
      role: account.role,
    };

    const dummyToken = "sanctum_token_" + Math.random().toString(36).substr(2);

    // Persistencia para soportar recarga
    localStorage.setItem("navi_auth_user", JSON.stringify(authPayload));
    localStorage.setItem("navi_auth_token", dummyToken);

    setCurrentUser(authPayload);
    setToken(dummyToken);
    setSuccessMessage(`¡Bienvenido/a, ${authPayload.name}! Sesión iniciada con éxito.`);

    if (onLoginSuccess) {
      onLoginSuccess(authPayload);
    }
  };

  // 2. Proceso de Registro
  const handleRegister = (e) => {
    e.preventDefault();
    clearAlerts();

    // 1. Validar correo duplicado
    const emailExists = SYNTHETIC_ACCOUNTS.some(
      (acc) => acc.email.toLowerCase() === regEmail.toLowerCase().trim()
    );

    if (emailExists) {
      setErrorMessage("El correo electrónico ya se encuentra registrado. Utilice otro correo o inicie sesión.");
      return;
    }

    // 2. Proteger rol admin: El formulario público NO permite registrar admin
    if (regRole === "admin") {
      setErrorMessage("Operación denegada: La asignación del rol Administrador requiere autorización interna.");
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    const newUser = {
      id: Date.now(),
      name: regName,
      email: regEmail,
      role: regRole,
    };

    const dummyToken = "sanctum_token_" + Math.random().toString(36).substr(2);
    localStorage.setItem("navi_auth_user", JSON.stringify(newUser));
    localStorage.setItem("navi_auth_token", dummyToken);

    setCurrentUser(newUser);
    setToken(dummyToken);
    setSuccessMessage("Cuenta registrada exitosamente. Sesión iniciada.");

    if (onLoginSuccess) {
      onLoginSuccess(newUser);
    }
  };

  // 3. Cierre de Sesión (Logout)
  const handleLogout = () => {
    localStorage.removeItem("navi_auth_user");
    localStorage.removeItem("navi_auth_token");
    setCurrentUser(null);
    setToken(null);
    clearAlerts();
    setSuccessMessage("Has cerrado sesión correctamente.");
  };

  // 4. Simulación de Expiración de Sesión (Requisito 1 de la entrega)
  const simulateSessionExpiration = () => {
    localStorage.removeItem("navi_auth_user");
    localStorage.removeItem("navi_auth_token");
    setCurrentUser(null);
    setToken(null);
    clearAlerts();
    setSessionExpiredNotice(true);
    setTab("login");
  };

  // 5. Cambio de Contraseña
  const handleChangePassword = (e) => {
    e.preventDefault();
    clearAlerts();

    if (newPassword.length < 6) {
      setErrorMessage("La nueva contraseña debe contener mínimo 6 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("La confirmación de la nueva contraseña no coincide.");
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setSuccessMessage("¡Tu contraseña ha sido actualizada con éxito!");
  };

  // 6. Prueba de Acceso Denegado (403) a Panel de Administración
  const testAdminAccess = () => {
    clearAlerts();
    if (!currentUser || currentUser.role !== "admin") {
      setAccessDeniedNotice(
        `[HTTP 403 Forbidden] Acceso denegado: El usuario actual (${currentUser?.role}) no tiene permisos para acceder al panel de administración.`
      );
    } else {
      setSuccessMessage(
        `[HTTP 200 OK] Autorizado: Tienes acceso completo al panel de administración con el rol ${currentUser.role}.`
      );
    }
  };

  return (
    <div className="auth-container" style={{ maxWidth: "600px", margin: "20px auto", fontFamily: "sans-serif" }}>
      {/* Aviso de Sesión Expirada */}
      {sessionExpiredNotice && (
        <div style={{ backgroundColor: "#FFF3CD", border: "1px solid #FFEBAA", color: "#856404", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px" }}>
          <strong>Aviso de seguridad:</strong> Tu sesión ha expirado por inactividad. Por favor, vuelve a iniciar sesión para continuar de forma segura.
        </div>
      )}

      {/* Alerta de Error */}
      {errorMessage && (
        <div style={{ backgroundColor: "#F8D7DA", border: "1px solid #F5C6CB", color: "#721C24", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px" }}>
          <strong>Error:</strong> {errorMessage}
        </div>
      )}

      {/* Alerta de Éxito */}
      {successMessage && (
        <div style={{ backgroundColor: "#D4EDDA", border: "1px solid #C3E6CB", color: "#155724", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px" }}>
          {successMessage}
        </div>
      )}

      {/* Alerta de Acceso Denegado (403) */}
      {accessDeniedNotice && (
        <div style={{ backgroundColor: "#FCE8E6", border: "1px solid #F5C2C7", color: "#C5221F", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px" }}>
          <strong>Control de Acceso (Access.php):</strong> {accessDeniedNotice}
        </div>
      )}

      {/* VISTA 1: USUARIO AUTENTICADO */}
      {currentUser ? (
        <div style={{ border: "1px solid #E0E0E0", borderRadius: "10px", padding: "24px", backgroundColor: "#FAFAFA" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ margin: 0 }}>Perfil Activo</h2>
            <span style={{ backgroundColor: currentUser.role === "admin" ? "#D93025" : currentUser.role === "tutor" ? "#1A73E8" : "#188038", color: "#FFF", padding: "4px 10px", borderRadius: "12px", fontSize: "12px", textTransform: "uppercase", fontWeight: "bold" }}>
              Rol: {currentUser.role}
            </span>
          </div>

          <p><strong>Nombre:</strong> {currentUser.name}</p>
          <p><strong>Correo:</strong> {currentUser.email}</p>

          <div style={{ margin: "20px 0", borderTop: "1px solid #DDD", paddingTop: "16px" }}>
            <h4>Pruebas de Autorización y Sesión</h4>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "16px" }}>
              <button onClick={testAdminAccess} style={{ padding: "8px 14px", backgroundColor: "#5F6368", color: "#FFF", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                Probar acceso a Panel Admin (Óscar)
              </button>
              <button onClick={simulateSessionExpiration} style={{ padding: "8px 14px", backgroundColor: "#EA8600", color: "#FFF", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                Simular expiración de sesión
              </button>
              <button onClick={handleLogout} style={{ padding: "8px 14px", backgroundColor: "#D93025", color: "#FFF", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                Cerrar sesión (Logout)
              </button>
            </div>
          </div>

          {/* Formulario de Cambio de Contraseña */}
          <div style={{ borderTop: "1px solid #DDD", paddingTop: "16px" }}>
            <h4>Cambiar contraseña</h4>
            <form onSubmit={handleChangePassword}>
              <div style={{ marginBottom: "10px" }}>
                <input
                  type="password"
                  placeholder="Contraseña actual"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <input
                  type="password"
                  placeholder="Nueva contraseña (mínimo 6 car.)"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <input
                  type="password"
                  placeholder="Confirmar nueva contraseña"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                />
              </div>
              <button type="submit" style={{ padding: "8px 16px", backgroundColor: "#1A73E8", color: "#FFF", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                Guardar nueva contraseña
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* VISTA 2: FORMULARIOS DE LOGIN / REGISTRO */
        <div style={{ border: "1px solid #E0E0E0", borderRadius: "10px", padding: "24px", backgroundColor: "#FFF" }}>
          {/* Selector de Pestañas */}
          <div style={{ display: "flex", borderBottom: "2px solid #EEE", marginBottom: "20px" }}>
            <button
              onClick={() => { setTab("login"); clearAlerts(); }}
              style={{ flex: 1, padding: "10px", border: "none", background: "none", fontWeight: tab === "login" ? "bold" : "normal", borderBottom: tab === "login" ? "3px solid #1A73E8" : "none", cursor: "pointer" }}
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => { setTab("register"); clearAlerts(); }}
              style={{ flex: 1, padding: "10px", border: "none", background: "none", fontWeight: tab === "register" ? "bold" : "normal", borderBottom: tab === "register" ? "3px solid #1A73E8" : "none", cursor: "pointer" }}
            >
              Registrar cuenta
            </button>
          </div>

          {/* PESTAÑA LOGIN */}
          {tab === "login" && (
            <div>
              {/* Botones de Relleno Rápido de Cuentas Sintéticas */}
              <div style={{ backgroundColor: "#F8F9FA", padding: "12px", borderRadius: "8px", marginBottom: "16px" }}>
                <small style={{ fontWeight: "bold", display: "block", marginBottom: "6px" }}>
                  Cuentas sintéticas de prueba (clic para autocompletar):
                </small>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {SYNTHETIC_ACCOUNTS.map((acc) => (
                    <button
                      key={acc.email}
                      type="button"
                      onClick={() => fillSyntheticAccount(acc)}
                      style={{ padding: "4px 8px", fontSize: "12px", border: "1px solid #CCC", borderRadius: "4px", backgroundColor: "#FFF", cursor: "pointer" }}
                    >
                      {acc.label}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleLogin}>
                <div style={{ marginBottom: "12px" }}>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "14px" }}>Correo electrónico:</label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                  />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "14px" }}>Contraseña:</label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                  />
                </div>
                <button type="submit" style={{ width: "100%", padding: "10px", backgroundColor: "#1A73E8", color: "#FFF", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>
                  Entrar
                </button>
              </form>
            </div>
          )}

          {/* PESTAÑA REGISTRO */}
          {tab === "register" && (
            <form onSubmit={handleRegister}>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "14px" }}>Nombre completo:</label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                />
              </div>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "14px" }}>Correo electrónico:</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                />
              </div>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "14px" }}>Contraseña (mínimo 6 car.):</label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "14px" }}>Tipo de cuenta (Rol público):</label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value)}
                  style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                >
                  <option value="tutor">Tutor / Familia</option>
                  <option value="docente">Docente / Educador</option>
                </select>
                <small style={{ color: "#666", display: "block", marginTop: "4px" }}>
                  * Nota: El rol de Administrador no está disponible para autoregistro por motivos de seguridad.
                </small>
              </div>
              <button type="submit" style={{ width: "100%", padding: "10px", backgroundColor: "#188038", color: "#FFF", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>
                Crear cuenta
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
