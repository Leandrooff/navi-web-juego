import React from 'react';
import Button from '../components/Button.jsx';
import {Icon,Logo,Navi,Particles,Avatar,Loading} from '../components/GameUI.jsx';

export function Welcome({onStart,onAdult,ready=true}){
 return <main className="welcome world-background">
 <Particles/><header className="welcome-header"><Logo small/><button className="glass adult-access" disabled={!ready} onClick={onAdult}><Icon name="shield" size={19}/> Familias y docentes <Icon name="arrow" size={16}/></button></header>
 <section className="welcome-copy"><span className="eyebrow light"><i/> UN MUNDO POR DESCUBRIR</span><Logo/>
 <h1>Cada pequeña decisión<br/>abre una <em>gran aventura.</em></h1>
 <p>Explora, imagina y aprende a cuidarte.<br/>Yo soy NAVI. Y voy contigo.</p>
 <Button onClick={onStart} disabled={!ready} className="begin-button"><Icon name="book" size={27}/> {ready?'¡Comenzar aventura!':'Preparando tu mundo…'} <Icon name="arrow"/></Button>
 <div className="welcome-note"><span>6–10 años</span><span>A tu ritmo</span><span>En compañía</span></div></section>
 <div className="welcome-spirit"><div className="spirit-halo"/><Navi/><span className="spirit-caption">TU COMPAÑERO DE GRANDES AVENTURAS</span></div>
 <footer className="welcome-footer"><span><Icon name="leaf" size={17}/> Navegación y Aprendizaje para la Vida Infantil</span><span>EXPLORA · APRENDE · DESCUBRE</span></footer>
 </main>;
}
export function ProfileSelection({profiles,onSelect,onAdult}){
 return <main className="world-background selection-page"><Particles/><Logo small/><section className="parchment selection-content"><span className="eyebrow">EL VIAJE ES TUYO</span><h1>¿Quién viene a explorar?</h1><p>Elige tu perfil para continuar tu aventura.</p>
 <div className="profile-grid">{profiles.map(p=><button key={p.id} className="profile-tile" onClick={()=>onSelect(p)}><Avatar name={p.avatar} color={p.navi_color}/><strong>{p.nickname}</strong><small>{p.age} años</small><Icon name="arrow"/></button>)}</div>
 {!profiles.length&&<p>Un adulto de tu familia puede crear tu perfil para empezar.</p>}
 <Button variant="secondary" onClick={onAdult}>{profiles.length?'Ir a NAVI Familias':'Crear mi primer perfil'} <Icon name="people"/></Button></section><Navi className="selection-navi"/></main>;
}
export function World({profile,stories,progress,assignments,onStory,onJournal,onAdult}){
 const featured=stories.find(s=>s.slug==='me-perdi-en-el-parque')||stories[0];
 const status=featured&&progress?.progress.find(p=>p.story_id===featured.id);
 const active=featured&&progress?.active_sessions.some(s=>s.story_id===featured.id);
 return <main className="world-map world-background"><Particles/>
 <div className="map-greeting"><Navi color={profile.navi_color}/><div className="speech parchment"><small>TU MUNDO DE AVENTURAS</small><h1>Hola, {profile.nickname}.</h1><p>Hay algo nuevo por descubrir.<br/>¿Exploramos juntos?</p></div></div>
 <div className="map-locations" aria-label="Mapa de aventuras">{featured&&<button className="map-pin park-pin" onClick={()=>onStory(featured)}><span className="pin-medallion"><Icon name="leaf" size={35}/></span><span className="parchment pin-label"><strong>El parque</strong><small>{active?'Continuar aventura':status?.status==='completed'?'Aventura completada':'Tu primera aventura'}</small></span><span className="pin-light"/></button>}
 <span className="world-label plaza-label">La plaza de los sueños</span><span className="world-label bridge-label">El puente de las nubes</span></div>
 <aside className="parchment adventure-journal"><span className="eyebrow">TU CUADERNO DE VIAJE</span><h2>Una historia te espera</h2>
 {featured?<><div className="journal-illustration"><img src={featured.cover_path||'/art/inicio.png'} alt="El parque y sus personajes"/><span>CAPÍTULO 01</span></div><h3>{featured.title}</h3><p>{featured.description}</p><div className="chapter-meta"><span><Icon name="clock" size={17}/>{featured.estimated_minutes} min aprox.</span><span><Icon name="star" size={17}/>1 estrella</span></div>
 <Button onClick={()=>onStory(featured)}>{active?'Continuar mi aventura':status?.status==='completed'?'Volver a explorar':'Vamos al parque'}<Icon name="arrow"/></Button></>:<p>Las aventuras aparecerán aquí cuando estén publicadas.</p>}
 {stories.length>1&&<div className="other-stories">{stories.filter(s=>s.id!==featured?.id).map(s=><button key={s.id} onClick={()=>onStory(s)}>{s.title}<Icon name="arrow"/></button>)}</div>}
 {assignments.length>0&&<p className="assignment-note"><Icon name="book" size={18}/>{assignments.length} aventura{assignments.length!==1?'s':''} de tu aula</p>}
 </aside>
 <footer className="map-footer"><button className="glass menu-tile" onClick={onJournal}><Icon name="trophy"/><span>Mis descubrimientos<small>{progress?.completed||0} aventuras completadas</small></span></button><button className="glass menu-tile" onClick={onAdult}><Icon name="people"/><span>Mi familia<small>Acompañamos tu camino</small></span></button></footer>
 </main>;
}
export function Chapter({story,onStart,onBack,busy,error,active}){
 return <main className="chapter-page" style={{'--scene-image':'url("'+(story.cover_path||'/art/inicio.png')+'")'}}><div className="chapter-background"/><Particles/>
 <button className="glass back-label" onClick={onBack}><Icon name="back"/> Volver al mapa</button>
 <section className="chapter-intro"><div className="chapter-number"><span>01</span><i/></div><span className="eyebrow light">EL PARQUE DE LOS FAROLES</span><h1>{story.title}</h1><p>{story.description}</p>
 <div className="chapter-meta"><span><Icon name="clock"/>{story.estimated_minutes} minutos</span><span><Icon name="leaf"/>Tú eliges el camino</span></div>
 <div className="chapter-promise"><Icon name="shield"/><span>Una historia para practicar cómo pedir ayuda.<br/>Puedes volver a intentarlo todas las veces que quieras.</span></div>
 {error&&<p className="error-notice" role="alert">{error}</p>}
 <Button disabled={busy} onClick={onStart}>{busy?'Preparando tu aventura…':active?'Continuar donde me quedé':'Entrar en la historia'}<Icon name="arrow"/></Button></section>
 </main>;
}
