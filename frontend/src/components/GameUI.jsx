import React,{useEffect,useRef,useId} from 'react';
import Button from './Button.jsx';
export function Icon({name='leaf',size=24,...props}){
 const shapes={
 leaf:<><path d="M20 3C7 2 3 7 5 14c2 7 13 7 15-11Z"/><path d="M4 21 16 8M8 16l-1-6m4 3 5 1"/></>,
 star:<path d="m12 2 3 6.3 7 1-5 5 1.2 7-6.2-3.4-6.2 3.4 1.2-7-5-5 7-1Z"/>,
 book:<><path d="M12 5C8 2 5 3 2 4v16c4-2 7-1 10 1 3-2 6-3 10-1V4c-3-1-6-2-10 1Z"/><path d="M12 5v16M5 8h3m-3 4h3m8-4h3m-3 4h3"/></>,
 arrow:<path d="m9 5 7 7-7 7"/>,
 back:<path d="m15 5-7 7 7 7"/>,
 settings:<><path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1M5.6 18.4l2.1-2.1m8.6-8.6 2.1-2.1"/><circle cx="12" cy="12" r="5"/></>,
 people:<><circle cx="8" cy="7" r="3"/><circle cx="17" cy="8" r="2.5"/><path d="M2 21v-5a6 6 0 0 1 12 0v5m1-8c4-1 7 1 7 5v3"/></>,
 shield:<><path d="m12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6Z"/><path d="m8 12 3 3 5-6"/></>,
 home:<><path d="m2 11 10-9 10 9M5 9v13h14V9M9 22v-8h6v8"/></>,
 close:<path d="m6 6 12 12M6 18 18 6"/>,
 moon:<path d="M21 14A9 9 0 0 1 10 3a9 9 0 1 0 11 11Z"/>,
 sun:<><circle cx="12" cy="12" r="4"/><path d="M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2"/></>,
 river:<><path d="M3 7c4-5 5 5 9 0s5 5 9 0M3 12c4-5 5 5 9 0s5 5 9 0M3 17c4-5 5 5 9 0s5 5 9 0"/></>,
 trophy:<><path d="M7 3h10v7a5 5 0 0 1-10 0Zm-1 2H3v4c0 3 3 4 5 4m10-8h3v4c0 3-3 4-5 4M12 15v6m-5 0h10"/></>,
 clock:<><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></>,
 check:<path d="m4 12 5 5L20 6"/>,
 help:<><circle cx="12" cy="12" r="9"/><path d="M9 8a3 3 0 0 1 6 0c0 3-3 2-3 5m0 3v1"/></>,
 volume:<><path d="m3 9 5 0 5-5v16l-5-5H3Zm14-1c3 3 3 5 0 8m3-11c5 5 5 9 0 14"/></>
 };
 return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{shapes[name]||shapes.leaf}</svg>;
}
export function Logo({small=false}){return <div className={'brand '+(small?'brand-small':'')} aria-label="NAVI"><span>Navi</span><Icon name="leaf"/>{!small&&<small>PEQUEÑAS DECISIONES. GRANDES AVENTURAS.</small>}</div>;}
export function Navi({color='green',className=''}){return <img className={'navi-spirit spirit-'+color+' '+className} src="/art/navi.png" alt="NAVI, tu compañero de aventuras" draggable="false"/>;}
export function Avatar({name='leaf',color='green'}){return <span className={'avatar avatar-'+color}><Icon name={name} size={30}/></span>;}
export function Particles(){return <div className="particles" aria-hidden="true">{Array.from({length:16},(_,i)=><i key={i} style={{'--x':(i*31%100)+'%','--delay':-i*1.7+'s','--duration':12+i%5+'s'}}/>)}</div>;}
export function ErrorNotice({error,retry}){return error?<div className="error-notice" role="alert"><Icon name="help"/><span>{error}</span>{retry&&<button onClick={retry}>Reintentar</button>}</div>:null;}
export function Loading({text='Abriendo un nuevo camino…'}){return <div className="loading" role="status"><Icon name="leaf" size={32}/><p>{text}</p></div>;}
export function Modal({title,onClose,children,wide=false}){
 const ref=useRef(null),titleId=useId();
 useEffect(()=>{const previous=document.activeElement;const dialog=ref.current;dialog.showModal();return()=>{dialog.close();previous?.focus();};},[]);
 return <dialog ref={ref} aria-labelledby={titleId} className={'parchment modal '+(wide?'modal-wide':'')} onCancel={e=>{e.preventDefault();onClose();}}>
 <header className="modal-header"><h2 id={titleId}>{title}</h2><button className="icon-button" onClick={onClose} aria-label="Cerrar"><Icon name="close"/></button></header>{children}</dialog>;
}
export function Settings({prefs,setPrefs,onClose}){return <Modal title="A tu ritmo" onClose={onClose}>
 <p>Haz que esta aventura se sienta cómoda para ti.</p>
 <label className="toggle"><input type="checkbox" checked={prefs.reduced} onChange={e=>setPrefs({...prefs,reduced:e.target.checked})}/> Reducir movimiento</label>
 <label className="toggle"><input type="checkbox" checked={prefs.instant} onChange={e=>setPrefs({...prefs,instant:e.target.checked})}/> Mostrar el texto completo</label>
 <label className="toggle"><input type="checkbox" checked={prefs.large} onChange={e=>setPrefs({...prefs,large:e.target.checked})}/> Letras más grandes</label>
 <p className="muted">Puedes leer con alguien de confianza. No hay prisa por elegir.</p><Button onClick={onClose}>Seguir explorando <Icon name="arrow"/></Button>
 </Modal>;}
export function GameHeader({profile,stars=0,onProfile,onSettings,onBack,title}){
 return <header className="game-header">
 <div className="header-left">{onBack?<button className="glass icon-button" onClick={onBack} aria-label="Volver"><Icon name="back"/></button>:<Logo small/>}{title&&<div className="chapter-tag"><Icon name="book"/><span><small>EL PARQUE DE LOS FAROLES</small><strong>{title}</strong></span></div>}</div>
 <div className="glass hud"><span className="star-count"><Icon name="star"/>{stars}<span className="sr-only">estrellas</span></span>{profile&&<button className="profile-button" onClick={onProfile}><Avatar name={profile.avatar} color={profile.navi_color}/><span>{profile.nickname}</span></button>}<button className="icon-button" onClick={onSettings} aria-label="Ajustes"><Icon name="settings"/></button></div>
 </header>;
}
