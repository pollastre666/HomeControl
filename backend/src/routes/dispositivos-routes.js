const express = require('express');
const router = express.Router();
const dispositivosController = require('../controllers/dispositivos-controller');

// Rutas para dispositivos
router.post('/', dispositivosController.crearDispositivo);
router.get('/usuario/:uid', dispositivosController.listarDispositivosUsuario);
router.get('/:deviceId', dispositivosController.obtenerDispositivo);

module.exports = router;
