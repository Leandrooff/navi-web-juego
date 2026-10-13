import React,{useState} from 'react';
import {api} from '../services/api.js';
import Button from '../components/Button.jsx';
import {Logo,Navi,Icon,ErrorNotice} from '../components/GameUI.jsx';
export default function Auth({onSuccess,onBack}){
 const [register,setRegister]=useState(false),[role,setRole]=useState('tutor'),[busy,setBusy]=useState(false),[error,setError]=useState('');
 async function submit(e){e.preventDefault();if(busy)return;setBusy(true);setError('');const body=Object.fromEntries(new FormData(e.currentTarget));body.role=role;
 try{onSuccess(await(register?api.register(body):api.login(body)));}catch(e){setError(e.message);}finally{setBusy(false);}}
 return <main className="auth-page world-background"><button className="glass back-label" onClick={onBack}><Icon name="back"/> Volver a NAVI</button><div className="auth-story"><Logo/><Navi/><h1>Las grandes aventuras<br/>empiezan en compañía.</h1><p>Un espacio para acompañar lo que descubren,<br/>a su ritmo y con confianza.</p></div>
 <section className="parchment auth-form"><span className="eyebrow">FAMILIAS Y DOCENTES</span><h2>{register?'Creemos tu cuenta':'Qué bueno verte'}</h2><p>{register?'Prepara un mundo de aprendizaje compartido.':'Entra para acompañar sus aventuras.'}</p>
 <form onSubmit={submit}>{register&&<><fieldset className="role-switch"><legend>Soy</legend><button type="button" aria-pressed={role==='tutor'} onClick={()=>setRole('tutor')}><Icon name="people"/>Familiar o tutor</button><button type="button" aria-pressed={role==='docente'} onClick={()=>setRole('docente')}><Icon name="book"/>Docente</button></fieldset><label>Tu nombre<input name="name" autoComplete="name" required maxLength={120}/></label></>}
 <label>Correo electrónico<input name="email" type="email" autoComplete="email" required maxLength={160}/></label>
 <label>Contraseña<input name="password" type="password" autoComplete={register?'new-password':'current-password'} required minLength={register?10:undefined}/></label>
 {register&&<><small>Al menos 10 caracteres, con letras y números.</small><label>Repite la contraseña<input name="password_confirmation" type="password" autoComplete="new-password" required minLength={10}/></label></>}
 <ErrorNotice error={error}/><Button disabled={busy}>{busy?'Un momento…':register?'Crear mi cuenta':'Entrar'}<Icon name="arrow"/></Button></form>
 <button className="text-button" onClick={()=>{setRegister(!register);setError('');}}>{register?'Ya tengo una cuenta':'Crear una cuenta de familia o docente'}</button>
 <div className="privacy-note"><Icon name="shield" size={20}/><p>Los perfiles infantiles se crean desde una cuenta familiar. El tutor decide si los vincula a un aula.</p></div></section></main>;
}
