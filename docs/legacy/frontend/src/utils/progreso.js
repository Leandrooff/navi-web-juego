const CLAVE_PROGRESO = "navi_progreso";

export function cargarProgreso() {
  try {
    const guardado = localStorage.getItem(CLAVE_PROGRESO);

    if (!guardado) {
      return {
        estrellas: 0,
        cuentosCompletados: 0,
        cuentos: {},
        logros: [],
      };
    }

    return JSON.parse(guardado);
  } catch {
    return {
      estrellas: 0,
      cuentosCompletados: 0,
      cuentos: {},
      logros: [],
    };
  }
}

export function guardarProgreso(progreso) {
  localStorage.setItem(
    CLAVE_PROGRESO,
    JSON.stringify(progreso),
  );
}

export function registrarCuentoCompletado(
  progresoActual,
  cuentoId,
) {
  const yaCompletado =
    progresoActual.cuentos?.[cuentoId]?.completado;

  const nuevosCuentos = {
    ...progresoActual.cuentos,
    [cuentoId]: {
      completado: true,
      fecha: new Date().toISOString(),
    },
  };

  return {
    ...progresoActual,
    cuentos: nuevosCuentos,

    cuentosCompletados: yaCompletado
      ? progresoActual.cuentosCompletados
      : progresoActual.cuentosCompletados + 1,

    estrellas: yaCompletado
      ? progresoActual.estrellas
      : progresoActual.estrellas + 1,
  };
}

export function reiniciarProgreso() {
  localStorage.removeItem(CLAVE_PROGRESO);
}