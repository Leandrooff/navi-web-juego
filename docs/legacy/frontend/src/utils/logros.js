export function obtenerValorMetrica(logro, progreso) {
  switch (logro.metrica) {
    case "cuentos_completados":
      return progreso.cuentosCompletados || 0;

    case "estrellas_total":
      return progreso.estrellas || 0;

    case "cuentos_3_estrellas":
      /*
       * NAVI ya no entrega estrellas según
       * decisiones correctas/incorrectas.
       * Esta métrica queda desactivada por ahora.
       */
      return 0;

    case "decisiones_seguras":
      /*
       * Las decisiones preventivas no se califican
       * automáticamente como correctas o incorrectas.
       */
      return 0;

    case "pidio_ayuda":
      return progreso.pidioAyuda || 0;

    default:
      return 0;
  }
}

export function calcularLogrosDesbloqueados(
  progreso,
  catalogoLogros,
) {
  return catalogoLogros
    .filter((logro) => {
      const valor = obtenerValorMetrica(
        logro,
        progreso,
      );

      return valor >= logro.meta;
    })
    .map((logro) => ({
      id: logro.id,
      nombre: logro.nombre,
      descripcion: logro.descripcion,
      icono: logro.icono,
      desbloqueado: true,
    }));
}

export function contarLogrosDesbloqueados(
  progreso,
  catalogoLogros,
) {
  return calcularLogrosDesbloqueados(
    progreso,
    catalogoLogros,
  ).length;
}