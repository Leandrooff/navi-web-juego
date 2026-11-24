import {dateLabel} from '../game/Journal.jsx';
import React,{useEffect,useState} from 'react';
import {request,api} from '../services/api.js';
import {Icon,Loading,ErrorNotice,Avatar} from '../components/GameUI.jsx';
export function downloadCsv(name,headers,rows){
 const escape=v=>'"'+String(v??'').replace(/^[\s=+@\-]/,"'$&").replaceAll('"','""')+'"';
 const data='\uFEFF'+[headers,...rows].map(row=>row.map(escape).join(',')).join('\r\n');
 const url=URL.createObjectURL(new Blob([data],{type:'text/csv;charset=utf-8;'}));
 const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export default function Report({child}){
 const [report,setReport]=useState(null),[progress,setProgress]=useState(null),[error,setError]=useState(''),[busy,setBusy]=useState(true),[from,setFrom]=useState(''),[to,setTo]=useState(''),[page,setPage]=useState(1);
 async function load(){setBusy(true);setError('');try{const params=new URLSearchParams({page});if(from)params.set('from',from);if(to)params.set('to',to);
 const [h,p]=await Promise.all([request('/child-profiles/'+child.id+'/history?'+params),api.progress(child.id)]);setReport(h);setProgress(p);}catch(e){setError(e.message);}finally{setBusy(false);}}
 useEffect(()=>{load();},[child.id,page,from,to]);
 return <section className="report"><div className="report-title"><Avatar name={child.avatar} color={child.navi_color}/><div><span className="eyebrow">CUADERNO DE AVENTURAS</span><h2>El camino de {child.nickname}</h2></div><button className="outline-button" onClick={()=>window.print()}><Icon name="book"/>Imprimir informe</button></div>
 <ErrorNotice error={error} retry={load}/>{progress&&<div className="stats"><div><Icon name="book"/><strong>{progress.completed}</strong><span>Aventuras completadas</span></div><div><Icon name="star"/><strong>{progress.stars}</strong><span>Estrellas de participación</span></div><div><Icon name="leaf"/><strong>{progress.attempts}</strong><span>Recorridos iniciados</span></div></div>}
 <p className="muted">Estos registros describen la participación y el recorrido. Las decisiones no son una calificación ni un diagnóstico.</p>
 <form className="report-filters" onSubmit={e=>e.preventDefault()}><label>Desde<input type="date" value={from} onChange={e=>{setFrom(e.target.value);setPage(1);}}/></label><label>Hasta<input type="date" min={from||undefined} value={to} onChange={e=>{setTo(e.target.value);setPage(1);}}/></label><button type="button" className="outline-button" disabled={!report?.data.length||busy} onClick={()=>downloadCsv('NAVI-recorridos-pagina-'+page+'.csv',['Aventura','Inicio','Estado','Escena','Elección','Consecuencia'],report.data.flatMap(s=>s.decisions.length?s.decisions.map(d=>[s.title,s.started_at,s.status,d.scene_title,d.choice_text,d.consequence_text]):[[s.title,s.started_at,s.status,'','','']]))}>Exportar esta página CSV</button></form>
 {busy?<Loading/>:report&&<><p className="muted">{report.total} recorridos en el período seleccionado.</p><div className="timeline">{report.data.map(s=><details key={s.id} className="session-record"><summary><Icon name={s.status==='completed'?'star':'book'}/><span><strong>{s.title}</strong><small>{new Date(s.started_at.replace(' ','T')+'Z').toLocaleString('es-BO',{timeZone:'America/La_Paz'})}</small></span><span className="status-pill">{s.status==='completed'?'Completada':s.status==='abandoned'?'Archivada':'En camino'}</span></summary><ol>{s.decisions.map(d=><li key={d.id}><small>{d.scene_title}</small><strong>{d.choice_text}</strong><p>{d.consequence_text}</p></li>)}</ol>{s.memories?.length>0&&<details className="report-memories"><summary>Recuerdos y aprendizajes ({s.memories.length}){s.ending_key?' · Final: '+s.ending_key:''}</summary>{s.memories.map(m=><p key={m.id}><time>{dateLabel(m.earned_at)}</time><strong>{m.title}</strong> · {m.description}</p>)}</details>}{!s.decisions.length&&<p>Todavía no hay decisiones en este recorrido.</p>}</details>)}</div>
 {!report.data.length&&<div className="empty-state"><Icon name="leaf" size={40}/><p>Los primeros pasos aparecerán aquí al jugar.</p></div>}
 <div className="pagination"><button disabled={page<=1} onClick={()=>setPage(page-1)}>Anterior</button><span>Página {page} de {report.last_page}</span><button disabled={page>=report.last_page} onClick={()=>setPage(page+1)}>Siguiente</button></div></>}
 </section>;
}
