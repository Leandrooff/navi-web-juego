import React,{useState} from 'react';
import {Logo,Icon,Modal,ErrorNotice} from '../components/GameUI.jsx';
import {request} from '../services/api.js';
import Button from '../components/Button.jsx';
import Family from './Family.jsx';
import Classroom from './Classroom.jsx';
function Password({onClose}){
 const [error,setError]=useState(''),[done,setDone]=useState(false),[busy,setBusy]=useState(false);
 async function save(e){e.preventDefault();setBusy(true);try{await request('/auth/password',{method:'PUT',body:Object.fromEntries(new FormData(e.currentTarget))});setDone(true);}catch(e){setError(e.message);}finally{setBusy(false);}}
 return <Modal title="Cuidar tu cuenta" onClose={onClose}>{done?<><p>Tu contraseña se actualizó. Las demás sesiones se cerraron.</p><Button onClick={onClose}>Listo</Button></>:<form onSubmit={save}><label>Contraseña actual<input name="current_password" type="password" required autoComplete="current-password"/></label><label>Nueva contraseña<input name="password" type="password" required minLength={10} autoComplete="new-password"/></label><label>Repite la nueva contraseña<input name="password_confirmation" type="password" required minLength={10} autoComplete="new-password"/></label><small>10 caracteres como mínimo, con letras y números.</small><ErrorNotice error={error}/><Button disabled={busy}>Actualizar contraseña</Button></form>}</Modal>;
}
export default function AdultShell({user,profiles,stories,reloadProfiles,onPlay,onHome,onLogout}){
 const [account,setAccount]=useState(false);
 return <main className={'adult-shell '+(user.role==='docente'?'academy':'family')}><header className="adult-header"><button onClick={onHome} className="brand-button"><Logo small/><span>{user.role==='docente'?'AULA':'FAMILIAS'}</span></button><div className="adult-user"><span>{user.name}</span><button onClick={()=>setAccount(true)}><Icon name="settings" size={19}/>Mi cuenta</button><button onClick={onLogout}>Cerrar sesión</button></div></header><div className="adult-body">{user.role==='docente'?<Classroom stories={stories}/>:user.role==='tutor'?<Family profiles={profiles} reloadProfiles={reloadProfiles} onPlay={onPlay}/>:<p>Tu cuenta no tiene un espacio familiar o docente asignado. Contacta con la administración del proyecto.</p>}</div><footer className="adult-footer"><Icon name="leaf" size={18}/>NAVI · Acompañar sus decisiones, celebrar sus descubrimientos.</footer>{account&&<Password onClose={()=>setAccount(false)}/>}</main>;
}
