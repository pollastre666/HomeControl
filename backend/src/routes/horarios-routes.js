const express = require('express');
const router = express.Router();
const horariosController = require('../controllers/horarios-controller');

// Rutas para horarios
router.post('/', horariosController.crearHorario);
router.get('/usuario/:userId', horariosController.listarHorariosUsuario);
router.get('/dispositivo/:deviceId', horariosController.listarHorariosDispositivo);
router.put('/:scheduleId', horariosController.actualizarHorario);
router.delete('/:scheduleId', horariosController.eliminarHorario);

module.exports = router;
