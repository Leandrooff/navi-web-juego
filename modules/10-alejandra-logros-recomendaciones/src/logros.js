/* NAVI · Módulo 10: logros y recomendaciones */
const NaviLogros = (() => {
  const K_ESTADO = 'navi_logros_estado';   // logros guardados (localStorage)
  const K_SESION = 'navi_sesion_actual';   // lo escribe el módulo de cuentos (sessionStorage)
  const RUTA_DEMO = '../demo/logros-demo.json';

  /* Regla de estrellas: 0-9 = 1, 10-19 = 2, 20+ = 3 */
  const calcularEstrellas = (puntaje) => {
    const p = Number(puntaje) || 0;
    return p >= 20 ? 3 : p >= 10 ? 2 : 1;
  };

  const estadoVacio = () => ({ cuentos: {}, logros: {} });
  function cargarEstado() {
    try { return JSON.parse(localStorage.getItem(K_ESTADO)) || estadoVacio(); }
    catch { return estadoVacio(); }
  }
  function guardarEstado(e) {
    try { localStorage.setItem(K_ESTADO, JSON.stringify(e)); } catch { /* sin almacenamiento */ }
  }

  /* Guardar logro obtenido: devuelve true si es nuevo */
  function guardarLogro(e, id) {
    if (e.logros[id]) return false;
    e.logros[id] = new Date().toISOString().slice(0, 10);
    return true;
  }

  function registrarCuento(e, ses) {
    const prev = e.cuentos[ses.cuentoId] || {};
    const d = ses.decisiones || [];
    e.cuentos[ses.cuentoId] = {
      estrellas: Math.max(prev.estrellas || 0, calcularEstrellas(ses.puntaje)),
      puntaje: Math.max(prev.puntaje || 0, Number(ses.puntaje) || 0),
      seguras: Math.max(prev.seguras || 0, d.filter(x => x.segura).length),
      ayudas: Math.max(prev.ayudas || 0, d.filter(x => x.etiqueta === 'pedir_ayuda').length),
      fecha: new Date().toISOString().slice(0, 10)
    };
  }

  function metricas(e) {
    const c = Object.values(e.cuentos);
    const suma = (k) => c.reduce((a, x) => a + (x[k] || 0), 0);
    return {
      cuentos_completados: c.length,
      cuentos_3_estrellas: c.filter(x => x.estrellas === 3).length,
      decisiones_seguras: suma('seguras'),
      pidio_ayuda: suma('ayudas'),
      estrellas_total: suma('estrellas')
    };
  }

  /* Desbloquear logros: devuelve los logros nuevos */
  function desbloquearLogros(e, catalogo) {
    const m = metricas(e);
    return catalogo.filter(l => m[l.metrica] >= l.meta && guardarLogro(e, l.id));
  }

  /* Progreso de insignias */
  function progresoInsignias(e, catalogo) {
    const m = metricas(e);
    return catalogo.map(l => ({
      ...l,
      valor: Math.min(m[l.metrica] || 0, l.meta),
      desbloqueado: !!e.logros[l.id],
      fecha: e.logros[l.id]
    }));
  }

  const mensajePositivo = (estrellas, mensajes) => mensajes[String(estrellas)];

  /* Recomendación según decisiones (una por categoría, sin mensajes negativos) */
  function recomendar(decisiones, recs) {
    const unicas = (lista, clave) => [...new Set(lista.map(d => d.categoria))]
      .filter(c => recs[c]).map(c => recs[c][clave]);
    const bien = decisiones.filter(d => d.segura);
    const reforzar = decisiones.filter(d => !d.segura);
    return {
      aciertos: unicas(bien, 'segura'),
      reforzar: unicas(reforzar, 'reforzar'),
      cierre: reforzar.length
        ? '¡Sigue practicando! Cada cuento te ayuda a cuidarte mejor.'
        : '¡Todas tus decisiones fueron seguras! Elige otro cuento.'
    };
  }

  /* ---------- Pantallas ---------- */
  const $ = (s) => document.querySelector(s);
  const h = (tag, clase, ...hijos) => {
    const el = document.createElement(tag);
    if (clase) el.className = clase;
    el.append(...hijos);
    return el;
  };
  const mostrarError = (msg) => { const e = $('#error'); e.textContent = msg; e.hidden = false; };

  async function cargarDatos() {
    const r = await fetch(RUTA_DEMO);
    if (!r.ok) throw new Error('No se pudo leer logros-demo.json');
    const datos = await r.json();
    try {
      const real = JSON.parse(sessionStorage.getItem(K_SESION));
      if (real && real.cuentoId) datos.sesion = real;
    } catch { /* se usa la sesión demo */ }
    return datos;
  }

  function mostrarTarjetas(lista) {
    const dlg = $('#tarjeta');
    let i = 0;
    const siguiente = () => {
      if (i >= lista.length) return;
      const l = lista[i++];
      $('#t-icono').textContent = l.icono;
      $('#t-nombre').textContent = l.nombre;
      $('#t-desc').textContent = l.descripcion;
      dlg.showModal();
    };
    $('#t-cerrar').onclick = () => { dlg.close(); siguiente(); };
    siguiente();
  }

  function pantallaResultado(datos) {
    const ses = datos.sesion;
    const estrellas = calcularEstrellas(ses.puntaje);
    const estado = cargarEstado();
    registrarCuento(estado, ses);
    const nuevos = desbloquearLogros(estado, datos.logros);
    guardarEstado(estado);

    $('#cuento').textContent = ses.titulo;
    const cont = $('#estrellas');
    cont.setAttribute('aria-label', `${estrellas} de 3 estrellas`);
    for (let i = 0; i < 3; i++) {
      const s = h('span', 'estrella' + (i < estrellas ? ' on' : ''), '★');
      s.style.setProperty('--i', i);
      s.setAttribute('aria-hidden', 'true');
      cont.append(s);
    }
    $('#mensaje').textContent = mensajePositivo(estrellas, datos.mensajes);
    $('#puntaje').textContent = `Conseguiste ${ses.puntaje} puntos.`;

    const rec = recomendar(ses.decisiones || [], datos.recomendaciones);
    rec.aciertos.forEach(t => $('#aciertos').append(h('li', '', t)));
    rec.reforzar.forEach(t => $('#reforzar').append(h('li', '', t)));
    $('#bloque-aciertos').hidden = !rec.aciertos.length;
    $('#bloque-reforzar').hidden = !rec.reforzar.length;
    $('#cierre').textContent = rec.cierre;

    $('#ver-recomendacion').onclick = () => {
      const s = $('#recomendacion');
      s.hidden = false;
      s.scrollIntoView({ behavior: 'smooth' });
      s.focus();
    };
    if (nuevos.length) setTimeout(() => mostrarTarjetas(nuevos), 1300);
  }

  function pantallaLogros(datos) {
    const estado = cargarEstado();
    const prog = progresoInsignias(estado, datos.logros);
    const ganadas = prog.filter(p => p.desbloqueado).length;
    $('#resumen').textContent =
      `Tienes ${ganadas} de ${prog.length} insignias y ${metricas(estado).estrellas_total} estrellas.`;
    prog.forEach(p => {
      const icono = h('span', 'icono', p.icono);
      icono.setAttribute('aria-hidden', 'true');
      const li = h('li', 'insignia' + (p.desbloqueado ? ' ganada' : ''),
        icono, h('h2', '', p.nombre), h('p', '', p.descripcion));
      if (p.desbloqueado) {
        li.append(h('p', 'estado', `Ganada el ${p.fecha}`));
      } else {
        const rel = h('span');
        rel.style.width = `${(p.valor / p.meta) * 100}%`;
        const barra = h('div', 'barra', rel);
        barra.setAttribute('role', 'progressbar');
        barra.setAttribute('aria-label', p.nombre);
        barra.setAttribute('aria-valuemin', 0);
        barra.setAttribute('aria-valuemax', p.meta);
        barra.setAttribute('aria-valuenow', p.valor);
        li.append(barra, h('p', 'estado', `${p.valor} de ${p.meta}`));
      }
      $('#insignias').append(li);
    });
  }

  async function iniciar() {
    if (new URLSearchParams(location.search).has('reset')) localStorage.removeItem(K_ESTADO);
    try {
      const datos = await cargarDatos();
      const pantalla = document.body.dataset.pantalla;
      if (pantalla === 'resultado') pantallaResultado(datos);
      if (pantalla === 'logros') pantallaLogros(datos);
    } catch (err) {
      mostrarError('No se pudieron cargar los datos. Abre la página con un servidor local (por ejemplo Live Server).');
    }
  }

  document.addEventListener('DOMContentLoaded', iniciar);
  return { calcularEstrellas, desbloquearLogros, guardarLogro, progresoInsignias, mensajePositivo, recomendar };
})();
