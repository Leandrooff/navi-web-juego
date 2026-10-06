/**
 * NAVI — BIBLIOTECA Y NAVEGACIÓN
 * Módulo 02 — Benjamin
 * biblioteca.js
 *
 * Funcionalidades:
 *  - Carga de cuentos desde cuentos-demo.json (con fallback embebido)
 *  - Renderizado de tarjetas de cuentos
 *  - Filtro por categoría
 *  - Búsqueda por nombre
 *  - Mostrar estado: nuevo / en progreso / completado
 *  - Botón Jugar / Continuar / Completado (usando el campo `id` del cuento)
 *  - jugarCuento(id)    → preparado para conectar con el Motor de Cuentos (Módulo 03 - Brayan)
 *  - continuarCuento(id) → preparado para conectar con el Motor de Cuentos (Módulo 03 - Brayan)
 *  - Vista de detalle de cuento
 *  - Vista de cuento en progreso (demo de navegación)
 *  - Navegación entre: inicio, biblioteca, perfil, progreso
 */

'use strict';

// =====================================================
// DATOS DE RESPALDO (fallback por si fetch() falla
// al abrir el HTML directamente desde el sistema de archivos)
// =====================================================
const CUENTOS_FALLBACK = [
  {
    id: 1,
    titulo: "El semáforo valiente",
    categoria: "calle",
    estado: "nuevo",
    descripcion: "Aprende a cruzar la calle de forma segura siguiendo las señales del semáforo. ¡El semáforo rojo te protege!",
    imagen: "https://cdn-icons-png.flaticon.com/512/2491/2491324.png"
  },
  {
    id: 2,
    titulo: "La cocina y sus secretos",
    categoria: "casa",
    estado: "en progreso",
    descripcion: "Descubre qué objetos de la cocina pueden ser peligrosos y cómo pedir ayuda a un adulto cuando los necesitas.",
    imagen: "https://cdn-icons-png.flaticon.com/512/3175/3175148.png"
  },
  {
    id: 3,
    titulo: "El extraño en la puerta",
    categoria: "seguridad",
    estado: "completado",
    descripcion: "¿Qué haces si alguien desconocido toca la puerta? Aprende a protegerte y cuándo llamar a un adulto de confianza.",
    imagen: "https://cdn-icons-png.flaticon.com/512/1717/1717945.png"
  },
  {
    id: 4,
    titulo: "Amigos en el recreo",
    categoria: "escuela",
    estado: "nuevo",
    descripcion: "¿Qué haces cuando alguien no te trata bien? Aprende a decir 'no' y a pedir ayuda a tu maestra o maestro.",
    imagen: "https://cdn-icons-png.flaticon.com/512/3048/3048127.png"
  },
  {
    id: 5,
    titulo: "El parque seguro",
    categoria: "otra",
    estado: "en progreso",
    descripcion: "Jugar en el parque es divertido. Aprende cuáles son los lugares seguros y cómo mantenerte cerca de tu familia.",
    imagen: "https://cdn-icons-png.flaticon.com/512/2972/2972185.png"
  },
  {
    id: 6,
    titulo: "¡Fuego, fuego!",
    categoria: "casa",
    estado: "nuevo",
    descripcion: "Aprende qué hacer si hay un incendio en casa: cómo salir, a quién llamar y dónde encontrarse con tu familia.",
    imagen: "https://cdn-icons-png.flaticon.com/512/785/785116.png"
  },
  {
    id: 7,
    titulo: "El camino a la escuela",
    categoria: "calle",
    estado: "completado",
    descripcion: "Sigue a Lucía en su camino diario a la escuela y aprende las reglas para caminar seguro por la calle.",
    imagen: "https://cdn-icons-png.flaticon.com/512/3076/3076170.png"
  }
];

// =====================================================
// ESTADO GLOBAL
// =====================================================
let todosLosCuentos   = [];   // Lista completa de cuentos
let categoriaActiva   = 'todas';
let cuentoSeleccionado = null; // Cuento actual en detalle/progreso

// =====================================================
// INICIALIZACIÓN
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
  cargarCuentos();
  mostrarVista('inicio');
});

/**
 * Intenta cargar los cuentos desde ../demo/cuentos-demo.json.
 * Si falla (p.ej. al abrir el HTML directamente), usa el fallback embebido.
 */
async function cargarCuentos() {
  try {
    const respuesta = await fetch('../demo/cuentos-demo.json');
    if (!respuesta.ok) throw new Error('No se pudo cargar el JSON');
    todosLosCuentos = await respuesta.json();
  } catch (_err) {
    console.warn('NAVI: usando datos de respaldo (fallback).');
    todosLosCuentos = CUENTOS_FALLBACK;
  }

  actualizarEstadisticas();
  renderizarCuentos(todosLosCuentos);
  renderizarProgresoPerfil();
}

// =====================================================
// NAVEGACIÓN ENTRE VISTAS
// =====================================================

/**
 * Muestra la vista indicada y oculta el resto.
 * @param {string} nombreVista - 'inicio' | 'biblioteca' | 'perfil' | 'progreso' | 'detalle' | 'progreso-cuento'
 */
function mostrarVista(nombreVista) {
  const vistas = [
    'inicio', 'biblioteca', 'perfil', 'progreso',
    'detalle', 'progreso-cuento'
  ];

  vistas.forEach(v => {
    const el = document.getElementById(`vista-${v}`);
    if (el) {
      el.classList.toggle('oculta', v !== nombreVista);
    }
  });

  // Actualizar botones del navbar
  const navMap = {
    'inicio':          'nav-inicio',
    'biblioteca':      'nav-biblioteca',
    'perfil':          'nav-perfil',
    'progreso':        'nav-progreso',
    'detalle':         'nav-biblioteca',
    'progreso-cuento': 'nav-biblioteca'
  };

  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  const btnActivo = document.getElementById(navMap[nombreVista]);
  if (btnActivo) btnActivo.classList.add('active');

  // Scroll al inicio
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// =====================================================
// ESTADÍSTICAS (vista Inicio)
// =====================================================
function actualizarEstadisticas() {
  const enProgreso  = todosLosCuentos.filter(c => c.estado === 'en progreso').length;
  const completados = todosLosCuentos.filter(c => c.estado === 'completado').length;

  setTexto('total-cuentos',     todosLosCuentos.length);
  setTexto('en-progreso-count', enProgreso);
  setTexto('completados-count', completados);
  setTexto('perfil-completados', completados);
}

// =====================================================
// RENDERIZAR TARJETAS DE CUENTOS
// =====================================================

/**
 * Renderiza la lista de tarjetas de cuentos en el contenedor.
 * @param {Array} cuentos
 */
function renderizarCuentos(cuentos) {
  const contenedor    = document.getElementById('lista-cuentos');
  const sinResultados = document.getElementById('sin-resultados');

  contenedor.innerHTML = '';

  if (cuentos.length === 0) {
    sinResultados.classList.remove('oculto');
    return;
  }

  sinResultados.classList.add('oculto');

  cuentos.forEach(cuento => {
    const tarjeta = crearTarjeta(cuento);
    contenedor.appendChild(tarjeta);
  });
}

/**
 * Crea el elemento DOM de una tarjeta de cuento.
 * @param {Object} cuento
 * @returns {HTMLElement}
 */
function crearTarjeta(cuento) {
  const div = document.createElement('article');
  div.className = 'tarjeta-cuento';
  div.setAttribute('role', 'button');
  div.setAttribute('tabindex', '0');
  div.setAttribute('aria-label', `Cuento: ${cuento.titulo}`);

  const { icono: iconoEstado, texto: textoEstado, clase: claseEstado } = obtenerInfoEstado(cuento.estado);
  const claseCategoria = `cat-${cuento.categoria}`;
  const iconoCategoria = obtenerIconoCategoria(cuento.categoria);

  div.innerHTML = `
    <div class="tarjeta-imagen-container">
      <img
        class="tarjeta-imagen"
        src="${cuento.imagen}"
        alt="Imagen de ${cuento.titulo}"
        loading="lazy"
        onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📖</text></svg>'"
      />
    </div>
    <div class="tarjeta-cuerpo">
      <div class="tarjeta-meta">
        <span class="categoria-badge ${claseCategoria}">${iconoCategoria} ${cuento.categoria}</span>
        <span class="estado-badge ${claseEstado}">${iconoEstado} ${textoEstado}</span>
      </div>
      <h2 class="tarjeta-titulo">${cuento.titulo}</h2>
      <p class="tarjeta-descripcion">${cuento.descripcion}</p>
      <div class="tarjeta-pie">
        ${crearBotonAccion(cuento)}
      </div>
    </div>
  `;

  // Clic en la tarjeta → detalle
  div.addEventListener('click', (e) => {
    // Si hizo clic en el botón, manejar la acción específica
    if (e.target.classList.contains('btn-accion-tarjeta')) return;
    abrirDetalle(cuento);
  });

  // Teclado
  div.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      abrirDetalle(cuento);
    }
  });

  // Listener del botón de acción dentro de la tarjeta
  const btnAccion = div.querySelector('.btn-accion-tarjeta');
  if (btnAccion) {
    btnAccion.addEventListener('click', (e) => {
      e.stopPropagation();
      accionCuento(cuento);
    });
  }

  return div;
}

/**
 * Genera el HTML del botón de acción según el estado del cuento.
 */
function crearBotonAccion(cuento) {
  if (cuento.estado === 'completado') {
    return `<span class="estado-badge estado-completado">✅ Completado</span>`;
  }
  if (cuento.estado === 'en progreso') {
    return `<button class="btn-continuar btn-accion-tarjeta">▶ Continuar</button>`;
  }
  return `<button class="btn-principal btn-accion-tarjeta">🎮 Jugar</button>`;
}

// =====================================================
// ACCIONES DE CUENTO
// =====================================================

/**
 * Acción principal al hacer clic en Jugar/Continuar en una tarjeta.
 * Utiliza cuento.id como identificador único — no depende del título ni
 * de la posición del array.
 */
function accionCuento(cuento) {
  cuentoSeleccionado = cuento;
  if (cuento.estado === 'en progreso') {
    continuarCuento(cuento.id);
  } else if (cuento.estado === 'nuevo') {
    jugarCuento(cuento.id);
  }
}

/**
 * Acción del botón en la vista de detalle.
 * También pasa el ID del cuento seleccionado.
 */
function accionCuentoDetalle() {
  if (!cuentoSeleccionado) return;
  if (cuentoSeleccionado.estado === 'completado') return;
  if (cuentoSeleccionado.estado === 'en progreso') {
    continuarCuento(cuentoSeleccionado.id);
  } else {
    jugarCuento(cuentoSeleccionado.id);
  }
}

// =====================================================
// INTEGRACIÓN CON MOTOR DE CUENTOS (Módulo 03 - Brayan)
// =====================================================

/**
 * Inicia un cuento nuevo usando su ID único.
 *
 * PENDIENTE DE INTEGRACIÓN:
 * Brayan (Módulo 03) deberá reemplazar el cuerpo de esta función
 * con la llamada real al motor de cuentos, por ejemplo:
 *
 *   motorDeCuentos.iniciar(id);
 *
 * @param {number} id - ID único del cuento a iniciar (campo `id` de cuentos-demo.json)
 */
function jugarCuento(id) {
  console.log('[Módulo 02] Iniciar cuento con ID:', id);
  // Mostrar vista de progreso como demo de navegación
  const cuento = todosLosCuentos.find(c => c.id === id);
  if (cuento) abrirProgresosCuento(cuento);
}

/**
 * Continúa un cuento en progreso usando su ID único.
 *
 * PENDIENTE DE INTEGRACIÓN:
 * Brayan (Módulo 03) deberá reemplazar el cuerpo de esta función
 * con la llamada real al motor de cuentos, por ejemplo:
 *
 *   motorDeCuentos.continuar(id);
 *
 * @param {number} id - ID único del cuento a continuar (campo `id` de cuentos-demo.json)
 */
function continuarCuento(id) {
  console.log('[Módulo 02] Continuar cuento con ID:', id);
  // Mostrar vista de progreso como demo de navegación
  const cuento = todosLosCuentos.find(c => c.id === id);
  if (cuento) abrirProgresosCuento(cuento);
}

// =====================================================
// VISTA: DETALLE DE CUENTO
// =====================================================
function abrirDetalle(cuento) {
  cuentoSeleccionado = cuento;

  const { icono, texto, clase } = obtenerInfoEstado(cuento.estado);
  const claseCategoria = `cat-${cuento.categoria}`;
  const iconoCategoria = obtenerIconoCategoria(cuento.categoria);

  document.getElementById('detalle-imagen').src        = cuento.imagen;
  document.getElementById('detalle-imagen').alt        = cuento.titulo;
  document.getElementById('detalle-titulo').textContent = cuento.titulo;
  document.getElementById('detalle-descripcion').textContent = cuento.descripcion;

  const catBadge = document.getElementById('detalle-categoria');
  catBadge.textContent = `${iconoCategoria} ${cuento.categoria}`;
  catBadge.className   = `detalle-categoria-badge categoria-badge ${claseCategoria}`;

  const estadoBadge = document.getElementById('detalle-estado-badge');
  estadoBadge.textContent = `${icono} ${texto}`;
  estadoBadge.className   = `estado-badge ${clase}`;

  const btnAccion = document.getElementById('detalle-btn-accion');
  if (cuento.estado === 'completado') {
    btnAccion.textContent = '✅ Ya completaste este cuento';
    btnAccion.disabled    = true;
    btnAccion.className   = 'btn-secundario';
  } else if (cuento.estado === 'en progreso') {
    btnAccion.textContent = '▶ Continuar aventura';
    btnAccion.disabled    = false;
    btnAccion.className   = 'btn-continuar';
  } else {
    btnAccion.textContent = '🎮 Jugar';
    btnAccion.disabled    = false;
    btnAccion.className   = 'btn-principal';
  }

  mostrarVista('detalle');
}

// =====================================================
// VISTA: CUENTO EN PROGRESO
// =====================================================
function abrirProgresosCuento(cuento) {
  cuentoSeleccionado = cuento;

  const { icono, texto, clase } = obtenerInfoEstado(cuento.estado);

  document.getElementById('progreso-imagen').src        = cuento.imagen;
  document.getElementById('progreso-imagen').alt        = cuento.titulo;
  document.getElementById('progreso-titulo').textContent = cuento.titulo;

  const estadoBadge = document.getElementById('progreso-estado-badge');
  estadoBadge.textContent = `${icono} ${texto}`;
  estadoBadge.className   = `estado-badge ${clase}`;

  // Porcentaje de progreso demo
  const porcentaje = cuento.estado === 'completado' ? 100
                   : cuento.estado === 'en progreso' ? 45
                   : 0;

  document.getElementById('progreso-barra-fill').style.width = `${porcentaje}%`;
  document.getElementById('progreso-porcentaje').textContent = `${porcentaje}% completado`;

  mostrarVista('progreso-cuento');
}

// =====================================================
// FILTRO POR CATEGORÍA
// =====================================================
function seleccionarCategoria(btn) {
  document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('activo'));
  btn.classList.add('activo');
  categoriaActiva = btn.dataset.categoria;
  aplicarFiltros();
}

// =====================================================
// BÚSQUEDA + FILTRO (combinados)
// =====================================================
function aplicarFiltros() {
  const terminoBusqueda = document.getElementById('buscador').value.trim().toLowerCase();

  let resultado = todosLosCuentos;

  // Filtrar por categoría
  if (categoriaActiva !== 'todas') {
    resultado = resultado.filter(c => c.categoria === categoriaActiva);
  }

  // Filtrar por búsqueda de texto
  if (terminoBusqueda.length > 0) {
    resultado = resultado.filter(c =>
      c.titulo.toLowerCase().includes(terminoBusqueda)
    );
  }

  renderizarCuentos(resultado);
}

function limpiarFiltros() {
  // Resetear buscador
  document.getElementById('buscador').value = '';

  // Resetear filtro de categoría
  categoriaActiva = 'todas';
  document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('activo'));
  const btnTodas = document.querySelector('.filtro-btn[data-categoria="todas"]');
  if (btnTodas) btnTodas.classList.add('activo');

  renderizarCuentos(todosLosCuentos);
}

// =====================================================
// VISTA PROGRESO — LISTA DEMO
// =====================================================
function renderizarProgresoPerfil() {
  const contenedor = document.getElementById('demo-progreso-lista');
  if (!contenedor) return;

  contenedor.innerHTML = '';
  todosLosCuentos.forEach(cuento => {
    const { icono, texto, clase } = obtenerInfoEstado(cuento.estado);
    const item = document.createElement('div');
    item.className = 'demo-progreso-item';
    item.innerHTML = `
      <span>${cuento.titulo}</span>
      <span class="estado-badge ${clase}">${icono} ${texto}</span>
    `;
    contenedor.appendChild(item);
  });
}

// =====================================================
// UTILIDADES
// =====================================================

/**
 * Devuelve icono, texto y clase CSS según el estado del cuento.
 */
function obtenerInfoEstado(estado) {
  switch (estado) {
    case 'en progreso':
      return { icono: '🔄', texto: 'En progreso', clase: 'estado-en-progreso' };
    case 'completado':
      return { icono: '✅', texto: 'Completado',  clase: 'estado-completado' };
    default:
      return { icono: '🆕', texto: 'Nuevo',       clase: 'estado-nuevo' };
  }
}

/**
 * Devuelve emoji de ícono según la categoría.
 */
function obtenerIconoCategoria(categoria) {
  const iconos = {
    seguridad: '🔒',
    casa:      '🏠',
    calle:     '🚗',
    escuela:   '🏫',
    otra:      '🌟'
  };
  return iconos[categoria] || '📖';
}

/**
 * Asigna texto a un elemento por ID de forma segura.
 */
function setTexto(id, texto) {
  const el = document.getElementById(id);
  if (el) el.textContent = texto;
}
