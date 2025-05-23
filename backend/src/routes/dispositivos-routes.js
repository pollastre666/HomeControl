const express = require('express');
const router = express.Router();
const dispositivosController = require('../controllers/dispositivos-controller');

// Rutas para dispositivos
router.post('/', dispositivosController.crearDispositivo);
router.get('/usuario/:uid', dispositivosController.listarDispositivosUsuario);
router.get('/:deviceId', dispositivosController.obtenerDispositivo);
// Actualizar un dispositivo
router.put('/:deviceId', dispositivosController.actualizarDispositivo);
// Eliminar un dispositivo
router.delete('/:deviceId', dispositivosController.eliminarDispositivo);


module.exports = router;
