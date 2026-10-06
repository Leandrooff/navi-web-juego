// Controlador de la API de Cuentos - NAVI

exports.listarCuentos = async (req, res) => {
  res.status(200).json({
    ok: true,
    data: [
      { id: "1", titulo: "El paseo de Lucas", tema: "Prevención en lugares públicos" }
    ]
  });
};

exports.obtenerDetalle = async (req, res) => {
  const { id } = req.params;
  res.status(200).json({
    ok: true,
    data: { id, titulo: "El paseo de Lucas", autor: "NAVI" }
  });
};

exports.obtenerEscenas = async (req, res) => {
  const { id } = req.params;
  res.status(200).json({
    ok: true,
    escenas: [
      { id: "escena_1", texto: "Lucas está en la feria..." }
    ]
  });
};

exports.guardarAvance = async (req, res) => {
  res.status(200).json({ ok: true, mensaje: "Avance guardado" });
};

exports.guardarDecision = async (req, res) => {
  res.status(201).json({ ok: true, mensaje: "Decisión registrada" });
};

exports.guardarPuntaje = async (req, res) => {
  const { puntaje } = req.body;
  res.status(200).json({
    ok: true,
    puntajeFinal: puntaje,
    recomendacion: "Excelente toma de decisiones sobre adultos de confianza."
  });
};
