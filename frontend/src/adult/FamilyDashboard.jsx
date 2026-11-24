import React, { useState } from "react";
import ProgressBar from "../components/ProgressBar.jsx";
import StoryCard from "../components/StoryCard.jsx";
import Alert from "../components/Alert.jsx";

export default function FamilyDashboard() {
  const [showSummary, setShowSummary] = useState(false);
  return <section aria-labelledby="family-title"><h1 id="family-title">Progreso de Sofía</h1>
    <Alert type="info" title="Resumen familiar">El progreso se actualiza al guardar una aventura.</Alert>
    <div className="dashboard-card"><h2>Esta semana</h2><ProgressBar value={3} max={5} label="Aventuras completadas" state="active" /></div>
    <StoryCard title="Me perdí en el parque" category="Seguridad" description="Sofía practicó cómo pedir ayuda en un lugar público." status="completado" actionLabel="Ver resumen" onAction={() => setShowSummary(true)} />
    {showSummary && <Alert type="success" title="Aventura completada">Sofía eligió buscar ayuda y mantenerse en un lugar visible.</Alert>}
  </section>;
}
