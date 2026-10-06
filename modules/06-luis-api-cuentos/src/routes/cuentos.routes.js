const express = require('express');
const router = express.Router();
const cuentosController = require('../controllers/cuentos.controller');

// Endpoints de cuentos
router.get('/stories', cuentosController.listarCuentos);
router.get('/stories/:id', cuentosController.obtenerDetalle);
router.get('/stories/:id/scenes', cuentosController.obtenerEscenas);

// Endpoints de guardado y progreso
router.post('/progress', cuentosController.guardarAvance);
router.post('/decisions', cuentosController.guardarDecision);
router.post('/scores', cuentosController.guardarPuntaje);

module.exports = router;
