import {useEffect,useRef,useState} from 'react';
// Sin síntesis de voz ni recursos de audio provisionales. Solo archivos locales aprobados.
export function useVoice(line,paused=false){
 const player=useRef(null),[playing,setPlaying]=useState(false),[error,setError]=useState('');
 const available=typeof line?.audioPath==='string' && /^\/audio\/[a-zA-Z0-9_./-]+\.(mp3|ogg|wav)$/.test(line.audioPath) && !line.audioPath.includes('..');
 useEffect(()=>{player.current?.pause();player.current=null;setPlaying(false);setError('');return()=>player.current?.pause();},[line?.dialogueId,line?.audioPath]);
 useEffect(()=>{if(paused){player.current?.pause();setPlaying(false);}},[paused]);
 async function toggle(){
   if(!available||paused)return;
   if(playing){player.current.pause();setPlaying(false);return;}
   if(!player.current){player.current=new Audio(line.audioPath);player.current.onended=()=>setPlaying(false);}
   try{await player.current.play();setPlaying(true);}catch{setError('No se pudo reproducir esta narración. Puedes seguir leyendo.');}
 }
 return {available,playing,toggle,error};
}
