let csrf = null;
export class ApiError extends Error {
  constructor(message, status) { super(message); this.status=status; }
}
export async function request(url, {method='GET', body, signal}={}) {
  const headers={Accept:'application/json'};
  if(method!=='GET'){
    if(!csrf){const r=await fetch('/api/csrf',{credentials:'same-origin'});if(!r.ok)throw new ApiError('No pudimos conectar con NAVI. Inténtalo de nuevo.',r.status);csrf=(await r.json()).token;}
    headers['X-CSRF-TOKEN']=csrf;headers['Content-Type']='application/json';
  }
  let response;
  try { response=await fetch('/api'+url,{method,headers,credentials:'same-origin',body:body?JSON.stringify(body):undefined,signal}); }
  catch(e){if(e.name==='AbortError')throw e;throw new ApiError('La conexión se interrumpió. Tu aventura sigue guardada. Inténtalo de nuevo.',0);}
  if(response.ok && url.startsWith('/auth/'))csrf=null;
  if(response.status===204)return null;
  const payload=await response.json().catch(()=>({}));
  if(!response.ok){
    if(response.status===419)csrf=null;
    if(response.status===401) window.dispatchEvent(new Event('navi:session-expired'));
    const message=response.status===419?'La sesión cambió. Vuelve a intentarlo.':response.status===429?'Hiciste varios intentos. Espera un minuto y vuelve a probar.':
      Object.values(payload.errors||{}).flat()[0]||payload.message||'No pudimos completar esta acción.';
    throw new ApiError(message,response.status);
  }
  if(url.startsWith('/auth/'))csrf=null;
  return payload.data??payload;
}
export const api={
  me:()=>request('/auth/me'), login:body=>request('/auth/login',{method:'POST',body}),
  register:body=>request('/auth/register',{method:'POST',body}),logout:()=>request('/auth/logout',{method:'POST'}),
  profiles:()=>request('/child-profiles'),saveProfile:(body,id)=>request('/child-profiles'+(id?'/'+id:''),{method:id?'PUT':'POST',body}),
  stories:()=>request('/stories'),story:(id,version)=>request('/stories/'+id+(version?'?version='+version:'')),
  memories:(id,page=1)=>request('/child-profiles/'+id+'/memories?page='+page),
  hint:(id,sceneId)=>request('/game-sessions/'+id+'/hint',{method:'POST',body:{scene_id:Number(sceneId)}}),
  progress:id=>request('/child-profiles/'+id+'/progress'),
  assignments:id=>request('/child-profiles/'+id+'/assignments'),
  start:(childId,storyId,key)=>request('/game-sessions',{method:'POST',body:{child_profile_id:childId,story_id:storyId,request_key:key}}),
  decision:(id,body)=>request('/game-sessions/'+id+'/decisions',{method:'POST',body}),
  advance:(id,decisionId)=>request('/game-sessions/'+id+'/continue',{method:'POST',body:{decision_id:decisionId}}),
  finish:id=>request('/game-sessions/'+id+'/finish',{method:'POST'}),
};
