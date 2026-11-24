import React, { useState } from "react";
import ProgressBar from "../components/ProgressBar.jsx";
import Alert from "../components/Alert.jsx";
import StoryCard from "../components/StoryCard.jsx";
import Button from "../components/Button.jsx";

export default function ClassroomDashboard() {
  const [notice, setNotice] = useState(false);
  return <section aria-labelledby="classroom-title"><h1 id="classroom-title">Aula · Grupo Exploradores</h1>
    <p className="navi-muted">Resumen del avance de la clase en las aventuras asignadas.</p>
    {notice && <Alert type="success" title="Resumen listo">El avance del grupo está actualizado.</Alert>}
    <div className="dashboard-card"><h2>Avance del grupo</h2><ProgressBar value={18} max={24} label="Estudiantes que completaron la aventura" state="active" /><p className="navi-muted">18 de 24 estudiantes completaron la actividad.</p><Button type="button" onClick={() => setNotice(true)}>Actualizar resumen</Button></div>
    <StoryCard title="La calle de colores" category="Seguridad vial" description="Actividad asignada esta semana para practicar cruces seguros." status="enProgreso" actionLabel="Actividad asignada" disabled />
  </section>;
}
