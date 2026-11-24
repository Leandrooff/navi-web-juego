import React, { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { request } from '../services/api.js';
import { Avatar, ErrorNotice, Icon, Loading } from '../components/GameUI.jsx';

const SESSION_STATUS = {
  completed: 'Completada',
  abandoned: 'Archivada',
  in_progress: 'En camino',
};

const BOLIVIA_DATE = new Intl.DateTimeFormat('es-BO', {
  timeZone: 'America/La_Paz',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
});

function localDate(value) {
  if (!value) return '';
  const normalized = value.replace(' ', 'T');
  const iso = /Z$|[+-]\d{2}:?\d{2}$/i.test(normalized) ? normalized : normalized + 'Z';
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? 'Fecha no disponible' : BOLIVIA_DATE.format(date);
}

function filterDate(value) {
  return value.split('-').reverse().join('/');
}

// El separador punto y coma permite abrir las columnas en Excel en español.
export function downloadCsv(name, headers, rows) {
  const escape = value => {
    const text = String(value ?? '').replace(/^[\s=+@\-]/, "'$&");
    return '"' + text.replaceAll('"', '""') + '"';
  };
  const data = '\uFEFF' + [headers, ...rows]
    .map(row => row.map(escape).join(';'))
    .join('\r\n');
  const url = URL.createObjectURL(new Blob([data], { type: 'text/csv;charset=utf-8;' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = name;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const REPORT_STYLES = `

      .navi-progress-report .report-period .report-print-page {
    display: none;
  }

  @media print {
    .navi-progress-report .report-period .report-print-page {
      display: block;
    }

    .navi-progress-report .session-record ol {
      margin: 14px 0 8px 11px;
    }

    .navi-progress-report .session-record li {
      margin-bottom: 12px;
    }

    .navi-progress-report .session-record li small {
      margin-bottom: 4px;
    }

    .navi-progress-report .session-record li p {
      margin: 5px 0;
      line-height: 1.4;
    }

    .navi-progress-report .report-memories > p {
      margin: 0 0 7px;
      line-height: 1.4;
    }
  }
  .navi-progress-report .report-period { font-size: 13px; margin: 12px 0; }
  .navi-progress-report .report-period span { display: block; margin-top: 4px; }
  .navi-progress-report .report-print-page { display: none; }
  .navi-progress-report .report-ending { font-size: 14px; margin: 16px 0; }
  @media print {
    .navi-progress-report { color: #182b23; background: white; }
    .navi-progress-report .report-period { display: block !important; }
    .navi-progress-report .report-print-page { display: block; }
    .navi-progress-report .report-filters,
    .navi-progress-report .pagination,
    .navi-progress-report .report-title button,
    .navi-progress-report .error-notice { display: none !important; }
    .navi-progress-report .session-record { break-inside: auto; }
    .navi-progress-report .session-record > summary { break-after: avoid; }
    .navi-progress-report .session-record li,
    .navi-progress-report .report-memories > p,
    .navi-progress-report .report-ending { break-inside: avoid; }
    .navi-progress-report .session-record li { page-break-inside: avoid; }
    .navi-progress-report .report-memories > summary { break-after: avoid; }
    .navi-progress-report p { orphans: 3; widows: 3; }
    [data-report-print-ancestor] > :not([data-report-print-ancestor]):not(.navi-progress-report[data-printing="true"]) {
      display: none !important;
    }
    [data-report-print-ancestor] {
      display: block !important;
      position: static !important;
      width: auto !important;
      max-width: none !important;
      height: auto !important;
      min-height: 0 !important;
      max-height: none !important;
      overflow: visible !important;
      margin: 0 !important;
      padding: 0 !important;
      border: 0 !important;
      box-shadow: none !important;
      background: white !important;
    }
  }
`;

export default function Report({ child }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(null);
  const activeRequest = useRef(null);
  const reportElement = useRef(null);
  const invalidDate = [from, to].some(value => value && !/^\d{4}-\d{2}-\d{2}$/.test(value));
  const reversedRange = Boolean(from && to && from > to);
  const invalidRange = invalidDate || reversedRange;
  const key = JSON.stringify([child.id, from, to, page]);
  const current = result?.key === key ? result : null;
  const busy = !current || current.busy;
  const report = current?.report;
  const progress = current?.progress;
  const denied = [401, 403, 404].includes(current?.status);
  const filterError = invalidDate? 'Usa una fecha válida con un año de cuatro dígitos.': reversedRange? 'La fecha Hasta debe ser igual o posterior a Desde.': '';
  const error = filterError || current?.error;
  const load = useCallback(async () => {
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;
    // El estado pertenece a una única combinación de perfil, filtros y página.
    setResult({ key, busy: true, report: null, progress: null, error: '' });
    if (invalidRange) {
      setResult({ key, busy: false, report: null, progress: null, error: '' });
      return null;
    }
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (from) params.set('from', from);
      if (to) params.set('to', to);
      const base = '/child-profiles/' + child.id;
      const [history, totals] = await Promise.all([
        request(base + '/history?' + params, { signal: controller.signal }),
        request(base + '/progress', { signal: controller.signal }),
      ]);
      if (controller.signal.aborted) return null;
      const snapshot = { key, busy: false, report: history, progress: totals, error: '' };
      setResult(snapshot);
      return snapshot;
    } catch (failure) {
      if (controller.signal.aborted) return null;
      // Una consulta rechazada también retira las cifras y filas ya cargadas.
      controller.abort();
      setResult({ key, busy: false, report: null, progress: null,
        status: failure.status, error: failure.message });
      return null;
    }
  }, [child.id, from, to, page, key, invalidRange]);

  useEffect(() => {
    load();
    // Volver de la ventana familiar vuelve a comprobar el permiso vigente.
    const refreshOnFocus = () => { load(); };
    window.addEventListener('focus', refreshOnFocus);
    return () => {
      activeRequest.current?.abort();
      window.removeEventListener('focus', refreshOnFocus);
    };
  }, [load]);

  const personalize = value => String(value ?? '').replace(/\{name\}/gi, () => child.nickname);
  const period = from || to
    ? 'Período de inicio: ' + (from ? filterDate(from) : 'sin límite inicial')
      + ' — ' + (to ? filterDate(to) : 'sin límite final')
    : 'Período de inicio: todas las fechas';

  async function exportPage() {
    const fresh = await load();
    if (!fresh || !fresh.report.data.length) return;
    const rows = fresh.report.data.flatMap(session => {
      const context = [personalize(session.title), localDate(session.started_at),
        SESSION_STATUS[session.status] ?? session.status];
      const decisions = session.decisions ?? [];
      return decisions.length
        ? decisions.map(decision => [...context, personalize(decision.scene_title),
          personalize(decision.choice_text), personalize(decision.consequence_text)])
        : [[...context, '', '', '']];
    });
    downloadCsv('NAVI-recorridos-pagina-' + page + '.csv',
      ['Aventura', 'Inicio (Bolivia, UTC-4)', 'Estado', 'Escena', 'Elección', 'Consecuencia'], rows);
  }

  async function printReport() {
    const fresh = await load();
    if (!fresh) return;
    // La impresión se abre después de pintar los datos recién autorizados.
    flushSync(() => setResult(fresh));
    const element = reportElement.current;
    const details = [...element.querySelectorAll('details')].map(node => [node, node.open]);
    const ancestors = [];
    for (let node = element.parentElement; node; node = node.parentElement) {
      ancestors.push(node);
      node.setAttribute('data-report-print-ancestor', '');
    }
    element.dataset.printing = 'true';
    details.forEach(([node]) => { node.open = true; });
    try {
      window.print();
    } finally {
      details.forEach(([node, wasOpen]) => { node.open = wasOpen; });
      ancestors.forEach(node => node.removeAttribute('data-report-print-ancestor'));
      delete element.dataset.printing;
    }
  }

  return (
    <section className="report navi-progress-report" ref={reportElement} aria-busy={busy}>
      <style>{REPORT_STYLES}</style>
      <div className="report-title">
        {!denied && <Avatar name={child.avatar} color={child.navi_color} />}
        <div>
          <span className="eyebrow">CUADERNO DE AVENTURAS</span>
          <h2>{denied ? 'Informe no disponible' : 'El camino de ' + child.nickname}</h2>
        </div>
        <button type="button" className="outline-button" disabled={busy || !report || Boolean(error)} onClick={printReport}>
          <Icon name="book" />Imprimir informe
        </button>
      </div>
      <ErrorNotice error={error} retry={load} />
      {progress && (
        <>
          <div className="stats" aria-label="Totales acumulados del perfil">
            <div><Icon name="book" /><strong>{progress.completed}</strong><span>Aventuras completadas</span></div>
            <div><Icon name="star" /><strong>{progress.stars}</strong><span>Estrellas de participación</span></div>
            <div><Icon name="leaf" /><strong>{progress.attempts}</strong><span>Recorridos iniciados</span></div>
          </div>
          <p className="muted">Totales acumulados del perfil. El filtro de fechas se aplica al historial.</p>
        </>
      )}
      <p className="muted">Estos registros describen la participación y el recorrido. Las decisiones no son una calificación ni un diagnóstico.</p>
      <form className="report-filters" onSubmit={event => event.preventDefault()}>
        <label>
          Desde
          <input type="date" value={from} onChange={event => { setFrom(event.target.value); setPage(1); }} />
        </label>
        <label>
          Hasta
          <input type="date" min={from || undefined} value={to}
            onChange={event => { setTo(event.target.value); setPage(1); }} />
        </label>
        <button type="button" className="outline-button" disabled={busy || !report?.data.length || Boolean(error)} onClick={exportPage}>
          Exportar esta página CSV
        </button>
      </form>
      {busy && !invalidRange && <Loading text="Consultando el informe…" />}
      {report && (
        <>
          <p className="report-period">
            {period}
            <span>Horas en Bolivia (UTC-4).</span>
            <span className="report-print-page">Página {page} de {report.last_page}. Incluye los recorridos de esta página del historial.</span>
          </p>
          <p className="muted">{report.total} recorridos en el período seleccionado.</p>
          <div className="timeline">
            {report.data.map(session => {
              const decisions = session.decisions ?? [];
              const memories = session.memories ?? [];
              const ending = memories.find(memory => memory.kind === 'ending')?.title
                ?? progress?.endings?.find(item => item.ending_key === session.ending_key)?.title
                ?? session.ending_key;
              return (
                <details key={session.id} className="session-record">
                  <summary>
                    <Icon name={session.status === 'completed' ? 'star' : 'book'} />
                    <span>
                      <strong>{personalize(session.title)}</strong>
                      <small>Inicio: {localDate(session.started_at)}</small>
                      {session.completed_at && <small>Finalización: {localDate(session.completed_at)}</small>}
                    </span>
                    <span className="status-pill">{SESSION_STATUS[session.status] ?? session.status}</span>
                  </summary>
                  <ol>
                    {decisions.map(decision => (
                      <li key={decision.id}>
                        <small>{personalize(decision.scene_title)}</small>
                        <strong>{personalize(decision.choice_text)}</strong>
                        <p>{personalize(decision.consequence_text)}</p>
                      </li>
                    ))}
                  </ol>
                  {!decisions.length && <p>Todavía no hay decisiones en este recorrido.</p>}
                  {session.ending_key && <p className="report-ending"><strong>Final: </strong>{personalize(ending)}</p>}
                  {memories.length > 0 && (
                    <details className="report-memories">
                      <summary>Recuerdos y aprendizajes ({memories.length})</summary>
                      {memories.map(memory => (
                        <p key={memory.id}>
                          <time>{localDate(memory.earned_at)}</time>
                          <strong>{personalize(memory.title)}</strong> · {personalize(memory.description)}
                        </p>
                      ))}
                    </details>
                  )}
                </details>
              );
            })}
          </div>
          {!report.data.length && (
            <div className="empty-state">
              <Icon name="leaf" size={40} />
              <p>{from || to ? 'No hay recorridos en el período seleccionado.' : 'Los primeros pasos aparecerán aquí al jugar.'}</p>
            </div>
          )}
          <div className="pagination">
            <button type="button" disabled={busy || page <= 1} onClick={() => setPage(value => value - 1)}>Anterior</button>
            <span>Página {page} de {report.last_page}</span>
            <button type="button" disabled={busy || page >= report.last_page} onClick={() => setPage(value => value + 1)}>Siguiente</button>
          </div>
        </>
      )}
    </section>
  );
}
