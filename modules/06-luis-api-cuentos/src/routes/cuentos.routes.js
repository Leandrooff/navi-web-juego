const express = require('express');
const router = express.Router();
const cuentosController = require('../controllers/cuentos.controller');

// Endpoints requeridos en tus instrucciones:
router.get('/stories', cuentosController.listarCuentos);           // GET /api/stories
router.get('/stories/:id', cuentosController.obtenerDetalle);     // GET /api/stories/:id
router.get('/stories/:id/scenes', cuentosController.obtenerEscenas); // GET /api/stories/:id/scenes

router.post('/progress', cuentosController.guardarAvance);        // POST /api/progress
router.post('/decisions', cuentosController.guardarDecision);     // POST /api/decisions
router.post('/scores', cuentosController.guardarPuntaje);         // POST /api/scores

module.exports = router;
