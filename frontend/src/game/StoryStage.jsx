import React,{useEffect,useRef,useState} from 'react';
import Button from '../components/Button.jsx';
import ChoiceButton from '../components/ChoiceButton.jsx';
import {Icon,Navi,Particles,ErrorNotice,Modal} from '../components/GameUI.jsx';
import {useVoice} from '../hooks/useVoice.js';
import './journey.css';

const ACTS=['Una luz te busca','La tarde de las hojas','Una pequeña duda','Busco mi camino','Ya viene la ayuda','Volver a encontrarnos'];
const KIND={care:'Un paso de cuidado',learning:'Algo que aprendí',discovery:'Un descubrimiento',support:'Una pista a tiempo',ending:'Un final para recordar'};
const withName=(text,profile)=>(text||'').replaceAll('{name}',profile.nickname);
export function MemoryStamp({mark,compact=false}){
 if(!mark)return null;
 return <div className={'memory-stamp mark-'+mark.kind+(compact?' compact':'')} role="status">
 <span className="memory-icon"><Icon name={mark.kind==='ending'?'star':mark.kind==='learning'?'sun':'leaf'} size={compact?24:30}/></span>
 <div><small>{KIND[mark.kind]||'Una huella en tu cuaderno'}</small><strong>{mark.title}</strong>{!compact&&<p>{mark.description}</p>}</div><Icon name="check" size={18}/></div>;
}
function Dialogue({text,line,prefs,children,consequence,cinematic,paused,choiceLabel}){
 const [count,setCount]=useState(prefs.instant||prefs.reduced?text.length:0);
 const voice=useVoice(line,paused);
 useEffect(()=>{
  if(prefs.instant||prefs.reduced){setCount(text.length);return;}
  setCount(0);const timer=setInterval(()=>setCount(n=>{if(n>=text.length){clearInterval(timer);return n;}return n+2;}),20);
  return()=>clearInterval(timer);
 },[text,prefs.instant,prefs.reduced]);
 const done=count>=text.length;
 return <section className={'dialogue-box '+(consequence?'consequence-box':'')} aria-label={consequence?'Lo que ocurre después':'Narración'}>
 <div className="speaker-label"><Icon name={cinematic&&!consequence?'leaf':'book'} size={19}/><strong>{consequence?'TU ELECCIÓN':cinematic?'NAVI':'TU HISTORIA'}</strong><span>{consequence?choiceLabel:cinematic?'Voy contigo':'Tú decides el camino'}</span></div>
 <div className="dialogue-text"><p aria-hidden="true">{text.slice(0,count)}{!done&&<span className="typing-cursor"/>}</p><p className="sr-only" aria-live="polite">{text}</p></div>
 <div className="dialogue-tools">{!done&&<button onClick={()=>setCount(text.length)}>Mostrar texto completo <Icon name="arrow" size={15}/></button>}
 {voice.available&&<button onClick={voice.toggle}><Icon name="volume" size={18}/>{voice.playing?'Pausar narración':'Escuchar narración'}</button>}
 {voice.error&&<p role="alert">{voice.error}</p>}</div>
 {done?children:<p className="reading-hint">Lee a tu ritmo. Puedes mostrar todo el texto.</p>}
 </section>;
}
function SceneArt({src,title}){
 const [status,setStatus]=useState('loading'),[retry,setRetry]=useState(0),media=useRef(null);
 useEffect(()=>{const img=media.current;setStatus(img?.complete?(img.naturalWidth>0?'ready':'error'):'loading');},[src,retry]);
 return <div className="scene-frame" key={src}>
 <img ref={media} key={src+retry} className={'scene-art '+(status==='ready'?'art-ready':'')} src={src+(retry?'?retry='+retry:'')} alt={title} onLoad={()=>setStatus('ready')} onError={()=>setStatus('error')}/>
 <div className="scene-vignette"/>
 {status==='loading'&&<div className="art-status" role="status"><Icon name="leaf"/> Abriendo el paisaje…</div>}
 {status==='error'&&<div className="art-status art-error" role="alert">No llegó esta ilustración.<button onClick={()=>setRetry(n=>n+1)}>Volver a cargar</button><small>Puedes continuar leyendo mientras tanto.</small></div>}
 </div>;
}
export function StoryStage({game,prefs,profile,onEnd,paused=false}){
 const {state,busy,error}=game,scene=state.escenaActual,isConsequence=state.fase==='consecuencia',isFinal=state.fase==='terminado';
 const decision=state.decisionActual,selected=scene.opciones.find(c=>c.id===decision?.opcionId);
 const cinematic=scene.presentacion==='cinematic';
 const target=isConsequence?game.story.scenes.find(s=>String(s.id)===selected?.siguiente):null;
 const art=target?.image_path||scene.imagen;
 const [artOpen,setArtOpen]=useState(false);
 const hintRead=game.saved.marks?.some(m=>m.event_key==='hint:'+scene.id);
 const mark=game.saved.marks?.find(m=>Number(m.decision_record_id)===Number(game.saved.pending?.id));
 const heading=useRef(null);
 useEffect(()=>{heading.current?.focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});},[scene.id,isConsequence]);
 useEffect(()=>{
  scene.opciones.forEach(o=>{const next=game.story.scenes.find(s=>String(s.id)===o.siguiente);if(next?.image_path){const img=new Image();img.src=next.image_path;}});
 },[scene.id,game.story]);
 return <main className={'story-stage journey-stage '+(cinematic?'cinematic cinematic-'+scene.clave:'')+(paused?' journey-paused':'')} data-scene={scene.clave} data-phase={state.fase}>
 <SceneArt key={art} src={art} title={target?.title||scene.titulo}/><Particles/>
 <div className="journey-canopy" aria-hidden="true"/>
 {cinematic&&<div className={'cinema-flight flight-'+scene.clave} aria-hidden="true"><span className="flight-trail"/><Navi color={profile.navi_color}/></div>}
 <div className="scene-title"><span>{cinematic?(scene.caption||'PRÓLOGO'):ACTS[scene.acto]||'TU AVENTURA'}</span><h1 ref={heading} tabIndex={-1}>{withName(scene.titulo,profile)}</h1>
 {!cinematic&&<div className="act-track" aria-label={'Momento '+scene.acto+' de 5'}>{ACTS.slice(1).map((a,i)=><i key={a} title={a} className={i+1<=scene.acto?'lit':''}/>)}</div>}</div>
 <div className="scene-side-tools"><button className="glass illustration-button" onClick={()=>setArtOpen(true)}><Icon name="sun" size={18}/> Ver ilustración</button></div>
 <div className="story-bottom">
 {!cinematic&&<div className="companion-row">{scene.pista&&!isConsequence&&!isFinal?<button className="companion-hint" disabled={busy||hintRead} onClick={game.hint} aria-label="Pedir una pista a NAVI"><Navi color={profile.navi_color}/><span>{hintRead?'Tu pista está aquí':'¿Una pista?'}</span></button>:<Navi color={profile.navi_color} className="quiet-companion"/>}
 {hintRead&&!isConsequence&&<aside className="hint-bubble" role="status"><strong>NAVI, bajito</strong><p>{scene.pista}</p></aside>}
 <span className="page-counter"><Icon name="leaf" size={16}/>{game.saved.decisions.length} huellas en este recorrido</span></div>}
 <ErrorNotice error={error}/><Dialogue key={scene.id+'-'+(decision?.opcionId||'scene')} text={withName(isConsequence?decision.consecuencia:scene.texto,profile)} line={isConsequence?selected?.voz:scene.voz} prefs={prefs} consequence={isConsequence} cinematic={cinematic} paused={paused||artOpen} choiceLabel={selected?.texto}>
 {isConsequence?<div className="consequence-actions"><MemoryStamp mark={mark}/><Button disabled={busy} onClick={game.advance}>{busy?'Guardando…':scene.clave==='encuentro'?'Entrar en mi aventura':'Continuar'}<Icon name="arrow"/></Button></div>:
 isFinal?<div className="consequence-actions"><span><Icon name="star"/> Esta hoja será un recuerdo de tu camino.</span><Button disabled={busy} onClick={onEnd}>{busy?'Guardando tu aventura…':'Guardar mi final'}<Icon name="star"/></Button></div>:
 <div className={'choice-grid choices-'+scene.opciones.length}>{scene.opciones.map((o,i)=><ChoiceButton key={o.id} disabled={busy} onClick={()=>game.choose(o.id)}><span className="choice-number">{scene.opciones.length>1?String(i+1).padStart(2,'0'):<Icon name="leaf"/>}</span><span>{o.texto}</span><Icon name="arrow" size={18}/></ChoiceButton>)}</div>}
 </Dialogue><div className="story-footnote"><span><i/>{busy?'Guardando tu camino…':'Tu aventura se guarda con cada paso'}</span><span>SIN PRISA · A TU RITMO</span></div></div>
 {artOpen&&<Modal title={withName(target?.title||scene.titulo,profile)} wide onClose={()=>setArtOpen(false)}><img className="art-preview" src={art} alt={target?.title||scene.titulo}/></Modal>}
 </main>;
}
export function Ending({game,profile,onMap,onReplay,onJournal,busy}){
 const scene=game.state.escenaActual;
 return <main className="ending-page journey-ending"><img className="ending-art" src={scene.imagen} alt={scene.titulo}/><Particles/>
 <section className="ending-panel"><div className="reward-medallion"><Icon name="star" size={64}/></div><span className="eyebrow light">UN FINAL PARA TU CUADERNO</span><h1>{scene.titulo}</h1><p>Este fue tu camino, <strong>{profile.nickname}</strong>.<br/>{game.saved.decisions.length} decisiones, una historia que llevar contigo.</p>
 <div className="reward-line"><Icon name="star"/><strong>{game.reward?.new_star?'Tu estrella de aventura ya está guardada':'Tu estrella sigue brillando'}</strong><small>El final y sus recuerdos quedaron en tu colección.</small></div>
 <div className="remember"><span>ME LLEVO CONMIGO</span><p>{scene.recuerdo||'Puedo pedir ayuda y aprender de cada decisión.'}</p></div>
 <Button onClick={onJournal}>Ver mi cuaderno <Icon name="book"/></Button><button className="text-button" onClick={onMap}>Regresar a mi mundo</button><button className="text-button" onClick={onReplay} disabled={busy}>{busy?'Preparando…':'Descubrir otro camino'}</button><ErrorNotice error={game.error}/></section>
 </main>;
}
