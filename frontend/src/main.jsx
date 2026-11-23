import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import Auth from "./adult/Auth.jsx";

function App() {
  return (
    <main className="shell" style={{ padding: "20px" }}>
      <section className="intro" style={{ textAlign: "center", marginBottom: "20px" }}>
        <p style={{ letterSpacing: "2px", fontWeight: "bold", color: "#1A73E8" }}>NAVI WEB JUEGO</p>
        <h1 style={{ margin: "8px 0" }}>Módulo de Autenticación y Control de Roles</h1>
        <p style={{ color: "#555" }}>
          Entrega de Josué · Registro, inicio, recarga, cierre de sesión, expiración y permisos (Laravel + React)
        </p>
      </section>

      <Auth />
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
