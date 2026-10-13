import {chromium,expect} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {randomUUID} from 'node:crypto';
const out=new URL('../../docs/evidencias-mision/',import.meta.url);await mkdir(out,{recursive:true});
const executablePath=process.env.NAVI_BROWSER_PATH||(existsSync('C:/Program Files/Google/Chrome/Application/chrome.exe')?'C:/Program Files/Google/Chrome/Application/chrome.exe':undefined);
const browser=await chromium.launch({headless:true,executablePath});
const errors=[],checks=[],audio=[],suffix=Date.now(),password='NaviPrueba-'+randomUUID();
const ctx=await browser.newContext({viewport:{width:1440,height:960},reducedMotion:'reduce'});
const page=await ctx.newPage();page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/\/audio\/|\.(mp3|wav|ogg)/.test(r.url()))audio.push(r.url());});
const base=process.env.NAVI_TEST_URL||'http://127.0.0.1:5173';
async function snap(name,p=page){
 await p.locator('.scene-art').evaluateAll(es=>Promise.all(es.map(e=>e.decode().catch(()=>{}))));
 if(await p.locator('.scene-art').count())await expect(p.locator('.scene-art')).toHaveClass(/art-ready/);
 await p.screenshot({path:new URL(name+'.png',out).pathname.replace(/^\/([A-Za-z]:)/,'$1'),fullPage:true});
}
async function register(p,role,email){
 await p.goto(base);await p.getByRole('button',{name:'Familias y docentes'}).click();
 await p.getByRole('button',{name:'Crear una cuenta de familia o docente'}).click();
 if(role==='docente')await p.getByRole('button',{name:'Docente',exact:true}).click();
 await p.getByLabel('Tu nombre',{exact:true}).fill(role==='docente'?'Docente de prueba':'Familia de prueba');
 await p.getByLabel('Correo electrónico').fill(email);await p.getByLabel('Contraseña',{exact:true}).fill(password);
 await p.getByLabel('Repite la contraseña').fill(password);await p.getByRole('button',{name:'Crear mi cuenta',exact:true}).click();
 await expect(p.locator('.adult-welcome')).toBeVisible();
}
async function advance(){
 const previous=await page.locator('.journey-stage').getAttribute('data-scene');
 await page.locator('.consequence-actions .navi-button').click();
 await expect(page.locator('.journey-stage')).not.toHaveAttribute('data-scene',previous);
}
async function choose(index=0){
 await page.locator('.navi-choice').nth(index).click();await expect(page.locator('.journey-stage')).toHaveAttribute('data-phase','consecuencia');
 await expect(page.locator('.memory-stamp')).toBeVisible();await advance();
}
async function route(choices={},ending,snapshots=false){
 for(let i=0;i<40;i++){
  const key=await page.locator('.journey-stage').getAttribute('data-scene');
  const phase=await page.locator('.journey-stage').getAttribute('data-phase');
  if(phase==='terminado'){expect(key).toBe('final_'+ending);break;}
  if(snapshots&&['silencio','mapa','caseta','oferta','reencuentro_arbol'].includes(key))await snap('escena-'+key);
  await choose(choices[key]??0);
 }
 await page.getByRole('button',{name:'Guardar mi final',exact:true}).click();
 await expect(page.locator('.ending-page')).toBeVisible();
 await snap('final-'+ending);
}
try{
 await register(page,'tutor','familia-mision-'+suffix+'@example.test');
 await page.getByRole('button',{name:'Crear primer perfil',exact:true}).click();await page.getByLabel('Alias del niño o niña').fill('Luna');
 await page.getByRole('button',{name:'Guardar perfil',exact:true}).click();
 await page.getByRole('button',{name:'Abrir su mundo'}).click();
 await expect(page.locator('.journey-stage')).toHaveAttribute('data-scene','cielo');await snap('01-apertura');
 checks.push('Perfil nuevo entra directamente a la apertura cinematográfica.');
 await page.route('**/api/game-sessions/*/decisions',r=>r.abort());
 await page.locator('.navi-choice').first().click();await expect(page.getByRole('alert')).toContainText('conexión');
 await expect(page.locator('.journey-stage')).toHaveAttribute('data-phase','jugando');
 await page.unroute('**/api/game-sessions/*/decisions');
 await page.locator('.navi-choice').first().click();await expect(page.locator('.consequence-box')).toBeVisible();
 await page.reload();await page.getByRole('button',{name:'¡Comenzar aventura!'}).click();
 await page.getByRole('button',{name:/Luna.*8 años/}).click();
 await expect(page.locator('.journey-stage')).toHaveAttribute('data-phase','consecuencia');await advance();
 checks.push('Interrupción de red y recarga recuperan la consecuencia pendiente del prólogo.');
 await choose();await expect(page.locator('.journey-stage')).toHaveAttribute('data-scene','encuentro');await snap('02-encuentro');
 await page.locator('.navi-choice').first().click();await expect(page.locator('.memory-stamp')).toContainText('Primer encuentro');await snap('03-primer-logro');await advance();
 await expect(page.locator('.journey-stage')).toHaveAttribute('data-scene','entrada');
 await page.getByRole('button',{name:'Pedir una pista a NAVI'}).click();await expect(page.locator('.hint-bubble')).toBeVisible();
 await snap('04-pista-opcional');await page.getByRole('button',{name:'Luna',exact:true}).click();
 await expect(page.getByRole('dialog')).toHaveAccessibleName('Mi cuaderno de viaje');
 await expect(page.locator('.achievement')).toContainText('Primer encuentro');await page.keyboard.press('Escape');
 await expect(page.getByRole('dialog')).toHaveCount(0);
 checks.push('Primer encuentro guardado y visible antes de terminar; pistas opcionales registradas.');
 await page.getByRole('button',{name:'Ver ilustración'}).click();await expect(page.locator('.art-preview')).toBeVisible();await page.keyboard.press('Escape');
 await page.setViewportSize({width:360,height:800});
 await page.getByRole('button',{name:'Ajustes',exact:true}).click();await page.getByLabel('Letras más grandes').check();await page.keyboard.press('Escape');
 await snap('05-movil-letra-grande');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 expect(await page.locator('.navi-choice').evaluateAll(es=>es.every(e=>e.getBoundingClientRect().height>=44))).toBeTruthy();
 await page.getByRole('button',{name:'Ajustes',exact:true}).click();await page.getByLabel('Letras más grandes').uncheck();await page.keyboard.press('Escape');
 await page.setViewportSize({width:1440,height:960});
 await route({},'farol',true);
 await expect(page.getByText('Tu estrella de aventura ya está guardada')).toBeVisible();
 await page.getByRole('button',{name:'Descubrir otro camino',exact:true}).click();
 await route({fuente:1,respiro:1,mapa:0,caseta:1,identificacion:1,radio:1},'caseta',true);
 await expect(page.getByText('Tu estrella sigue brillando')).toBeVisible();
 await page.getByRole('button',{name:'Descubrir otro camino',exact:true}).click();
 await route({silencio:1,cruce:1,limite:1,oferta:1,umbral:1},'arbol',true);
 checks.push('Tres recorridos completos: farol, caseta y vuelta al árbol; el error permite recuperarse.');
 await page.getByRole('button',{name:'Ver mi cuaderno'}).click();
 await expect(page.locator('.ending-card:not(.undiscovered)')).toHaveCount(3);await expect(page.locator('.achievement')).toHaveCount(5);await snap('06-tres-finales');
 await page.getByRole('tab',{name:'Mis huellas'}).click();await expect(page.locator('.memory-timeline li')).toHaveCount(20);await snap('07-recuerdos');
 await page.getByRole('button',{name:'Siguiente',exact:true}).click();await expect(page.getByText(/Página 2 de/)).toBeVisible();
 expect(await page.locator('.memory-context time').first().textContent()).not.toContain('Invalid');
 await page.getByRole('button',{name:'Cerrar',exact:true}).click();
 await page.getByRole('button',{name:'Regresar a mi mundo'}).click();await snap('08-mundo');
 await page.getByRole('button',{name:/Mi familia/}).click();await expect(page.locator('.session-record')).toHaveCount(3);
 await page.locator('.session-record>summary').first().click();await page.locator('.report-memories>summary').first().click();await snap('09-familia');
 const tctx=await browser.newContext({viewport:{width:1440,height:960},reducedMotion:'reduce'});
 const teacher=await tctx.newPage();teacher.on('pageerror',e=>errors.push(e.message));
 await register(teacher,'docente','docente-mision-'+suffix+'@example.test');
 await teacher.getByRole('button',{name:'+ Crear grupo',exact:true}).click();await teacher.getByLabel('Nombre del grupo').fill('Exploradores de los Faroles');
 await teacher.getByRole('button',{name:'Crear grupo',exact:true}).click();await expect(teacher.locator('.join-code strong')).toBeVisible();
 const code=await teacher.locator('.join-code strong').textContent();
 await page.getByLabel('Código del aula').fill(code);await page.getByRole('button',{name:'Revisar grupo'}).click();
 await page.getByRole('checkbox',{name:/Autorizo/}).check();await page.getByRole('button',{name:'Autorizar vinculación'}).click();
 await expect(page.locator('.linked-class')).toContainText('Exploradores de los Faroles');
 await teacher.reload();await teacher.getByRole('button',{name:'Familias y docentes'}).click();await expect(teacher.locator('.student-row')).toContainText('Luna');
 await teacher.getByRole('button',{name:'Asignar aventura',exact:true}).click();await expect(teacher.locator('.linked-class')).toContainText('Me perdí en el parque');await snap('10-docente',teacher);
 await teacher.locator('.student-row').click();await expect(teacher.locator('dialog .session-record')).toHaveCount(3);await teacher.keyboard.press('Escape');
 await page.getByRole('button',{name:'Abrir su mundo'}).click();await page.getByRole('button',{name:/Mis descubrimientos/}).click();await expect(page.locator('.assignment-link')).toContainText('Me perdí en el parque');await page.keyboard.press('Escape');
 await page.getByRole('button',{name:/Mi familia/}).click();await page.getByRole('button',{name:'Retirar autorización'}).click();
 await teacher.reload();await teacher.getByRole('button',{name:'Familias y docentes'}).click();await expect(teacher.locator('.student-row')).toHaveCount(0);
 checks.push('Familia y docente: consentimiento, informe completo, asignación y revocación siguen funcionando.');
 await page.getByRole('button',{name:'Cerrar sesión',exact:true}).click();await page.getByRole('button',{name:'Familias y docentes'}).click();
 await page.getByLabel('Correo electrónico').fill('familia-mision-'+suffix+'@example.test');await page.getByLabel('Contraseña',{exact:true}).fill(password);await page.getByRole('button',{name:'Entrar',exact:true}).click();
 await expect(page.locator('.session-record')).toHaveCount(3);
 expect(await page.evaluate(()=>Object.keys(localStorage))).toEqual(['navi.preferences']);
 expect((await ctx.cookies()).some(c=>c.name.includes('session')&&c.httpOnly)).toBeTruthy();
 expect(audio).toEqual([]);expect(errors).toEqual([]);
 await ctx.storageState({path:new URL('../../../tmp/mission-qa-state.json',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1')});
 await writeFile(new URL('browser-results.json',out),JSON.stringify({passed:true,checks,pageErrors:errors,audioRequests:audio,viewports:[[1440,960],[360,800]],date:new Date().toISOString()},null,2));
 console.log(JSON.stringify({passed:true,checks,pageErrors:errors,audioRequests:audio},null,2));
}catch(e){await snap('error-browser');await writeFile(new URL('browser-results.json',out),JSON.stringify({passed:false,checks,error:e.message,pageErrors:errors},null,2));throw e;}
finally{await browser.close();}
