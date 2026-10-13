export function adaptarHistoriaApi(story) {
  if(!story?.scenes?.length)throw new Error('Esta aventura todavía no tiene escenas.');
  return {
    id:String(story.id),titulo:story.title,descripcion:story.description,modo:'narrativo',escenaInicial:String(story.initial_scene_id),
    escenas:story.scenes.map(s=>({
      id:String(s.id),titulo:s.title,texto:s.body,esFinal:Boolean(s.is_final),imagen:s.image_path,
      clave:s.scene_key,presentacion:s.presentation,acto:s.act,pista:s.hint,caption:s.caption,finalClave:s.ending_key,recuerdo:s.takeaway,voz:{dialogueId:s.dialogue_id,speakerId:s.speaker_id,locale:s.locale,audioPath:s.audio_path},
      opciones:(s.choices||[]).map(c=>({id:String(c.id),texto:c.label,puntos:0,siguiente:String(c.target_scene_id),consecuencia:c.consequence,
        voz:{dialogueId:c.dialogue_id,speakerId:'narrator',locale:s.locale,audioPath:c.audio_path}}))
    }))
  };
}
export function restaurarMotor(motor,story,saved) {
  motor.cargarCuento(story);
  for(const d of saved.decisions){
    const state=motor.obtenerEstado();
    if(state.escenaActual.id!==String(d.scene_id))throw new Error('El recorrido guardado necesita revisión. No se modificó tu progreso.');
    motor.elegirOpcion(String(d.choice_id));
    if(d.acknowledged_at || Number(d.id)!==Number(saved.session.pending_decision_id))motor.continuar();
  }
  const state=motor.obtenerEstado();
  if(state.escenaActual.id!==String(saved.session.current_scene_id))throw new Error('La escena guardada cambió. Vuelve al mapa y abre la aventura.');
  return state;
}
