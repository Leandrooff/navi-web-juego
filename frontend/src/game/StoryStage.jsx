import React, { useState } from "react";
import { Button } from "../components/Button.jsx";
import ChoiceButton from "../components/ChoiceButton.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import Alert from "../components/Alert.jsx";

const options = ["Buscar a una persona adulta de confianza", "Quedarme en un lugar seguro y pedir ayuda"];

export default function StoryStage({ onSave, saving, saved, saveError }) {
  const [choice, setChoice] = useState(-1);
  const [feedback, setFeedback] = useState(false);
  return <section className="screen-card" aria-labelledby="story-title">
    <p className="navi-eyebrow">Aventura · Seguridad</p><h1 id="story-title">Me perdí en el parque</h1>
    <ProgressBar value={2} max={4} label="Progreso del cuento" />
    <p className="story-text">Hay muchas personas en el parque y no ves a tu familia. ¿Qué puedes hacer para estar a salvo?</p>
    <div className="choice-list" role="group" aria-label="Elige qué hacer">{options.map((option, i) => <ChoiceButton key={option} selected={choice === i} onClick={() => { setChoice(i); setFeedback(false); }}>{option}</ChoiceButton>)}</div>
    {feedback && <Alert type="success" title="Buena decisión">Busca a una persona que trabaje en el parque y quédate en un lugar visible.</Alert>}
    {saved && <Alert type="success" title="Progreso guardado">Puedes continuar esta aventura cuando quieras.</Alert>}
    {saveError && <Alert type="error" title="No se pudo guardar">Revisa el almacenamiento del navegador e inténtalo de nuevo.</Alert>}
    <div className="screen-actions"><Button type="button" disabled={choice < 0} onClick={() => setFeedback(true)}>Comprobar respuesta</Button><Button type="button" variant="secondary" disabled={saving} aria-busy={saving} onClick={onSave}>{saving ? "Guardando…" : "Guardar y salir"}</Button></div>
  </section>;
}
