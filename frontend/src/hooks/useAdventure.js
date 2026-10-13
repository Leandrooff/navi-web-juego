import {useMemo,useRef,useState} from 'react';
import {MotorCuentos} from '../engine/motor-cuentos.js';
import {adaptarHistoriaApi,restaurarMotor} from '../services/storyAdapter.js';
import {api} from '../services/api.js';
export function useAdventure(){
 const motor=useMemo(()=>new MotorCuentos(),[]);
 const [state,setState]=useState(null),[saved,setSaved]=useState(null),[story,setStory]=useState(null),[busy,setBusy]=useState(false),[error,setError]=useState(''),[reward,setReward]=useState(null);
 const lock=useRef(false),adapted=useRef(null),operation=useRef(null);
 const run=async action=>{if(lock.current)return false;lock.current=true;setBusy(true);setError('');try{await action();return true;}catch(e){setError(e.message);return false;}finally{lock.current=false;setBusy(false);}};
 function sync(data){setState(restaurarMotor(motor,adapted.current,data));setSaved(data);}
 const start=(child,selected)=>run(async()=>{
   const action='start:'+child.id+':'+selected.id;
   if(operation.current?.action!==action)operation.current={action,key:crypto.randomUUID()};
   const data=await api.start(child.id,selected.id,operation.current.key);
   const detail=await api.story(selected.id,data.session.story_version);adapted.current=adaptarHistoriaApi(detail);
   sync(data);setStory(detail);setReward(null);operation.current=null;
 });
 const choose=choice=>run(async()=>{
   const action='decision:'+saved.session.id+':'+state.escenaActual.id+':'+choice;
   if(operation.current?.action!==action)operation.current={action,key:crypto.randomUUID()};
   const data=await api.decision(saved.session.id,{scene_id:Number(state.escenaActual.id),choice_id:Number(choice),request_key:operation.current.key});
   sync(data);operation.current=null;
 });
 const hint=()=>run(async()=>sync(await api.hint(saved.session.id,state.escenaActual.id)));
 const advance=()=>run(async()=>sync(await api.advance(saved.session.id,saved.pending.id)));
 const finish=()=>run(async()=>setReward(await api.finish(saved.session.id)));
 return {state,saved,story,busy,error,reward,start,choose,advance,finish,hint};
}
