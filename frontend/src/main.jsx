import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

function App() {
  return (
    <main className="shell">
      <section className="intro">
        <p>NAVI Web Juego</p>
        <h1>Frontend base con React y Vite</h1>
        <span>
          Esta carpeta sera desarrollada por los modulos individuales de UI,
          biblioteca, motor de cuentos y componentes frontend. La preview
          funcional actual esta en la carpeta preview.
        </span>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
