import React,{useEffect,useState} from 'react';
import {api} from './services/api.js';
import {Welcome,ProfileSelection,World,Chapter} from './game/World.jsx';
import {StoryStage,Ending} from './game/StoryStage.jsx';
import {useAdventure} from './hooks/useAdventure.js';
import {GameHeader,Modal,Settings,ErrorNotice,Icon,Avatar,Loading,Navi} from './components/GameUI.jsx';
import Button from './components/Button.jsx';
import Journal from './game/Journal.jsx';
import Auth from './adult/Auth.jsx';
import AdultShell from './adult/AdultShell.jsx';

const EMPTY={progress:[],stars:0,completed:0,attempts:0,achievements:[],active_sessions:[],memories:[],memories_count:0,endings:[]};
function initialPrefs(){try{return {reduced:matchMedia('(prefers-reduced-motion: reduce)').matches,instant:false,large:false,...JSON.parse(localStorage.getItem('navi.preferences')||'{}')};}catch{return {reduced:true,instant:true,large:false};}}
export default function App(){
 const [view,setView]=useState('welcome'),[user,setUser]=useState(null),[profiles,setProfiles]=useState([]),[profile,setProfile]=useState(null),[stories,setStories]=useState([]),[story,setStory]=useState(null),[progress,setProgress]=useState(EMPTY),[assignments,setAssignments]=useState([]),[error,setError]=useState(''),[busy,setBusy]=useState(false),[authReady,setAuthReady]=useState(false),[modal,setModal]=useState(null),[prefs,setPrefs]=useState(initialPrefs),[intro,setIntro]=useState(0);
 const game=useAdventure();
 useEffect(()=>{const heading=document.querySelector('main h1,main h2');if(heading){heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});}},[view]);
 const go=next=>{setView(next);setIntro(n=>n+1);setError('');window.scrollTo({top:0,behavior:'instant'});};
 useEffect(()=>{localStorage.setItem('navi.preferences',JSON.stringify(prefs));},[prefs]);
 async function loadStories(){try{setStories(await api.stories());}catch(e){setError('No se pudieron cargar las aventuras. Comprueba que NAVI esté conectado.');}}
 async function reloadProfiles(){const list=await api.profiles();setProfiles(list);setProfile(p=>p?list.find(x=>x.id===p.id)||null:null);return list;}
 useEffect(()=>{let live=true;api.me().then(async u=>{if(!live)return;setUser(u);if(u.role==='tutor')await reloadProfiles();}).catch(()=>{}).finally(()=>{if(live)setAuthReady(true);});loadStories();
 const expired=()=>{setUser(null);setProfiles([]);setProfile(null);setProgress(EMPTY);setModal(null);setView(v=>v==='welcome'?v:'auth');};
 window.addEventListener('navi:session-expired',expired);return()=>{live=false;window.removeEventListener('navi:session-expired',expired);};},[]);
 async function authSuccess(u){setUser(u);try{if(u.role==='tutor')await reloadProfiles();await loadStories();go('adult');}catch(e){setError(e.message);}}
 async function chooseProfile(p){setBusy(true);setError('');try{const [data,tasks]=await Promise.all([api.progress(p.id),api.assignments(p.id)]);setProfile(p);setProgress(data);setAssignments(tasks);
 const featured=stories.find(s=>s.slug==='me-perdi-en-el-parque')||stories[0];
 if(featured&&featured.version>=2&&!data.achievements.some(a=>a.name==='Primer encuentro')){
   setStory(featured);if(await game.start(p,featured))go('play');else go('chapter');
 }else go('world');}catch(e){setError(e.message);}finally{setBusy(false);}}
 async function refresh(){if(profile){const [p,t]=await Promise.all([api.progress(profile.id),api.assignments(profile.id)]);setProgress(p);setAssignments(t);}}
 async function openJournal(){try{await refresh();setModal('journal');}catch(e){setError(e.message);}}
 async function returnMap(){setBusy(true);try{await refresh();setModal(null);go('world');}catch(e){setError(e.message);}finally{setBusy(false);}}
 async function start(){if(await game.start(profile,story))go('play');}
 async function complete(){if(await game.finish()){await refresh().catch(()=>{});go('ending');}}
 async function logout(){setBusy(true);try{await api.logout();setUser(null);setProfiles([]);setProfile(null);setProgress(EMPTY);setAssignments([]);go('welcome');}catch(e){setError(e.message);}finally{setBusy(false);}}
 function begin(){if(!authReady)return;if(!user)go('auth');else if(user.role==='tutor')go(profiles.length?'profiles':'adult');else go('adult');}
 const gameView=['world','play'].includes(view);
 return <div className={'app '+(prefs.reduced?'reduced-motion ':'')+(prefs.large?'large-text':'')}><div key={intro} className="screen-enter" aria-hidden="true"/>
 {view==='welcome'&&<Welcome ready={authReady} onStart={begin} onAdult={()=>go(user?'adult':'auth')}/>}
 {view==='auth'&&<Auth onSuccess={authSuccess} onBack={()=>go('welcome')}/>}
 {view==='profiles'&&<ProfileSelection profiles={profiles} onSelect={chooseProfile} onAdult={()=>go('adult')}/>}
 {view==='adult'&&user&&<AdultShell user={user} profiles={profiles} stories={stories} reloadProfiles={reloadProfiles} onPlay={chooseProfile} onHome={()=>go('welcome')} onLogout={logout}/>}
 {view==='world'&&profile&&<World profile={profile} stories={stories} progress={progress} assignments={assignments} onStory={s=>{setStory(s);go('chapter');}} onJournal={openJournal} onAdult={()=>go('adult')}/>}
 {view==='chapter'&&story&&<Chapter story={story} active={progress.active_sessions.some(s=>s.story_id===story.id)} onStart={start} onBack={()=>go('world')} busy={game.busy} error={game.error}/>}
 {view==='play'&&game.state&&<StoryStage game={game} prefs={prefs} profile={profile} paused={Boolean(modal)} onEnd={complete}/>}
 {view==='ending'&&<Ending game={game} profile={profile} onMap={returnMap} onJournal={openJournal} onReplay={start} busy={game.busy}/>}
 {gameView&&<GameHeader profile={profile} stars={progress.stars} onProfile={openJournal} onSettings={()=>setModal('settings')} onBack={view==='play'?()=>setModal('pause'):undefined} title={view==='play'?game.story?.title:undefined}/>}
 {error&&<div className="global-error"><ErrorNotice error={error} retry={loadStories}/></div>}
 {busy&&<div className="busy-overlay"><Loading/></div>}
 {modal==='settings'&&<Settings prefs={prefs} setPrefs={setPrefs} onClose={()=>setModal(null)}/>}
 {modal==='pause'&&<Modal title="Tu aventura puede esperar" onClose={()=>setModal(null)}><Navi className="pause-navi"/><p>Cada decisión está guardada. Puedes volver al mapa y seguir después desde este mismo lugar.</p><Button onClick={()=>setModal(null)}>Seguir en la historia <Icon name="arrow"/></Button><button className="text-button" onClick={returnMap}>Volver al mapa</button></Modal>}
 {modal==='journal'&&profile&&<Journal profile={profile} progress={progress} assignments={assignments} onStory={id=>{const s=stories.find(s=>s.id===id);if(s){setStory(s);setModal(null);go('chapter');}}} onClose={()=>setModal(null)} onSwitch={()=>{setModal(null);go('profiles');}}/>}
 </div>;
}
