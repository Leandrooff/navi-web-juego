import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import Layout from "./components/Layout.jsx";
import { Button } from "./components/Button.jsx";
import Alert from "./components/Alert.jsx";
import ProgressBar from "./components/ProgressBar.jsx";
import StoryCard from "./components/StoryCard.jsx";
import AchievementCard from "./components/AchievementCard.jsx";
import Modal from "./components/Modal.jsx";
import StoryStage from "./game/StoryStage.jsx";
import FamilyDashboard from "./adult/FamilyDashboard.jsx";
import ClassroomDashboard from "./adult/ClassroomDashboard.jsx";
import "./components/componentes.css";
import "./styles.css";

function App() {
  const [screen, setScreen] = useState("Inicio");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [confirm, setConfirm] = useState(false);

  function saveProgress() {
    if (saving) return;
    setSaving(true); setSaveError(false); setSaved(false);
    window.setTimeout(() => {
      try {
        window.localStorage.setItem("navi-progress", JSON.stringify({ story: "me-perdi-en-el-parque", scenesCompleted: 2, savedAt: new Date().toISOString() }));
        setSaved(true);
      } catch {
        setSaveError(true);
      } finally {
        setSaving(false);
      }
    }, 250);
  }

  return <Layout active={screen} userName="Sofía" onNavigate={setScreen}>
    <div className="app-content">
      <p className="navi-eyebrow">NAVI · Aprender jugando</p>
      {screen === "Inicio" && <>
        <h1>¡Hola, Sofía!</h1><p className="navi-muted">Elige una aventura y sigue aprendiendo a tu ritmo.</p>
        <StoryCard title="Me perdí en el parque" category="Seguridad" description="Descubre cómo encontrar a una persona adulta de confianza." age={6} status="enProgreso" onAction={() => setScreen("Aventuras")} />
        <div className="save-panel"><h2>Progreso de hoy</h2><ProgressBar value={2} max={4} label="Escenas completadas" />
          <Button type="button" disabled={saving} aria-busy={saving} onClick={saveProgress}>{saving ? "Guardando…" : "Guardar progreso"}</Button>
          {saving && <span role="status" className="sr-only">Guardando progreso</span>}
          {saved && <Alert type="success" title="Progreso guardado">Puedes continuar cuando quieras.</Alert>}
          {saveError && <Alert type="error" title="No se pudo guardar">Comprueba el almacenamiento del navegador e inténtalo de nuevo.</Alert>}
        </div>
        <Button type="button" variant="secondary" onClick={() => setConfirm(true)}>Salir de la aventura</Button>
      </>}
      {screen === "Aventuras" && <StoryStage onSave={saveProgress} saving={saving} saved={saved} saveError={saveError} />}
      {screen === "Mi progreso" && <FamilyDashboard />}
      {screen === "Aula" && <ClassroomDashboard />}
      {screen === "Logros" && <><h1>Mis logros</h1><div className="demo-grid"><AchievementCard title="Exploradora valiente" description="Terminaste tu primera aventura." completed /><AchievementCard title="Gran exploradora" description="Completa tres aventuras para desbloquearlo." /></div></>}
      <Modal open={confirm} title="¿Quieres salir del cuento?" onCancel={() => setConfirm(false)} onConfirm={() => { setConfirm(false); setScreen("Inicio"); }} confirmLabel="Salir del cuento" cancelLabel="Seguir jugando">Tu progreso se guarda antes de salir.</Modal>
    </div>
  </Layout>;
}

createRoot(document.getElementById("root")).render(<App />);
