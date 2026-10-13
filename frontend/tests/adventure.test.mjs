import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {MotorCuentos,validarCuento} from '../src/engine/motor-cuentos.js';
import {adaptarHistoriaApi,restaurarMotor} from '../src/services/storyAdapter.js';
const content=JSON.parse(await readFile(new URL('../../backend/database/content/park.json',import.meta.url),'utf8'));
const keys=new Map(content.scenes.map((s,i)=>[s.key,i+40]));
const story={id:23,title:content.title,initial_scene_id:keys.get(content.initial),scenes:content.scenes.map(s=>({
 id:keys.get(s.key),title:s.title,body:s.body,is_final:!!s.final,image_path:s.image,scene_key:s.key,dialogue_id:'park.'+s.key+'.narration',speaker_id:s.speaker,locale:'es-BO',audio_path:null,
 choices:s.choices.map((c,i)=>({id:keys.get(s.key)*10+i,label:c.label,consequence:c.consequence,target_scene_id:keys.get(c.to),points:0}))
}))};
const adapted=adaptarHistoriaApi(story);
function allPaths(id=adapted.escenaInicial,route=[]){
 const scene=adapted.escenas.find(s=>s.id===id);
 return scene.esFinal?[route]:scene.opciones.flatMap(c=>allPaths(c.siguiente,[...route,c.id]));
}
test('La historia ampliada tiene un grafo válido, tres finales y todos sus destinos',()=>{
 assert.equal(adapted.escenas.length,34);assert.equal(adapted.escenas.reduce((n,s)=>n+s.opciones.length,0),53);
 assert.equal(validarCuento(adapted),true);assert.ok(allPaths().length>100);assert.equal(content.scenes.filter(s=>s.final).length,3);
});
test('Cada recorrido termina, muestra cada consecuencia y reconoce participación sin puntuación',()=>{
 for(const route of allPaths()){
  const motor=new MotorCuentos();motor.cargarCuento(adapted);
  for(const choice of route){
   const state=motor.elegirOpcion(choice);assert.equal(state.fase,'consecuencia');assert.ok(state.decisionActual.consecuencia);
   assert.throws(()=>motor.elegirOpcion(choice));motor.continuar();
  }
  assert.equal(motor.obtenerEstado().fase,'terminado');assert.equal(motor.obtenerResultado().tipoFinal,'participacion');assert.equal(motor.obtenerResultado().puntos,0);
 }
});
test('Reanudar una consecuencia no la salta y rechaza historiales alterados',()=>{
 const route=allPaths()[0],first=adapted.escenas[0].opciones.find(c=>c.id===route[0]);
 const session={id:1,current_scene_id:40,pending_decision_id:1};
 const saved={session,decisions:[{id:1,scene_id:40,choice_id:Number(first.id),acknowledged_at:null}]};
 const motor=new MotorCuentos();const s=restaurarMotor(motor,adapted,saved);assert.equal(s.fase,'consecuencia');
 saved.decisions[0].acknowledged_at='2026-10-13';session.current_scene_id=Number(first.siguiente);session.pending_decision_id=null;
 assert.equal(restaurarMotor(motor,adapted,saved).escenaActual.id,first.siguiente);
 session.current_scene_id=999;assert.throws(()=>restaurarMotor(motor,adapted,saved));
});
test('Cada escena usa una ilustración local real; voces opcionales ausentes',async()=>{
 for(const s of story.scenes){await access(new URL('../public'+s.image_path,import.meta.url));assert.equal(s.audio_path,null);assert.ok(s.dialogue_id);}
});

test('Cada elección tiene recuerdo propio y NAVI solo narra el prólogo',()=>{for(const s of content.scenes){if(s.act>0)assert.notEqual(s.speaker,'navi');for(const c of s.choices){assert.ok(c.mark.title&&c.mark.text);assert.ok(['care','learning','discovery'].includes(c.mark.kind));}}});
console.log('Recorridos posibles:',allPaths().length,'· Longitud:',Math.min(...allPaths().map(p=>p.length)),'a',Math.max(...allPaths().map(p=>p.length)),'elecciones');
