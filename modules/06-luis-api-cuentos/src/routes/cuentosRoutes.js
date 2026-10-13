const express = require('express');
const router = express.Router();
const cuentosController = require('../controllers/cuentosController');

// Rutas GET
router.get('/', cuentosController.listarCuentos);
router.get('/:id', cuentosController.obtenerDetalle);
router.get('/:id/escenas', cuentosController.obtenerEscenas);

// Rutas POST
router.post('/avance', cuentosController.guardarAvance);
router.post('/decision', cuentosController.guardarDecision);
router.post('/puntaje', cuentosController.guardarPuntaje);

module.exports = router;