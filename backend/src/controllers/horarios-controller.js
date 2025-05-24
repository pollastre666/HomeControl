const { admin, db } = require('../firebase');
const mqttService = require('../services/mqtt-service');

// Crear un nuevo horario
exports.crearHorario = async (req, res) => {
  try {
    const { nombre, deviceId, userId, dias, horaInicio, accion, activo } = req.body;
    
    // Validar datos de entrada
    if (!nombre || !deviceId || !userId || !dias || !horaInicio || !accion) {
      return res.status(400).json({ 
        success: false, 
        message: 'Faltan campos requeridos para crear el horario' 
      });
    }
    
    // Verificar que el dispositivo existe y pertenece al usuario
    const deviceDoc = await db.collection('devices').doc(deviceId).get();
    
    if (!deviceDoc.exists) {
      return res.status(404).json({ 
        success: false, 
        message: 'El dispositivo no existe' 
      });
    }
    
    const deviceData = deviceDoc.data();
    if (deviceData.userId !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'No tienes permiso para crear horarios para este dispositivo' 
      });
    }
    
    // Crear un nuevo documento en la colección schedules
    const scheduleRef = db.collection('schedules').doc();
    const scheduleId = scheduleRef.id;
    
    const timestamp = admin.firestore.FieldValue.serverTimestamp();
    
    const nuevoHorario = {
      scheduleId: scheduleId,
      name: nombre,
      deviceId: deviceId,
      userId: userId,
      days: dias,
      startTime: horaInicio,
      action: accion,
      active: activo !== undefined ? activo : true,
      createdAt: timestamp
    };

    await scheduleRef.set(nuevoHorario);
    
    return res.status(201).json({ 
      success: true, 
      message: "Horario creado con éxito", 
      horario: {
        id: scheduleId,
        ...nuevoHorario
      }
    });
  } catch (error) {
    console.error("Error al crear horario:", error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error al crear el horario: ' + error.message 
    });
  }
};

// Obtener todos los horarios de un usuario
exports.listarHorariosUsuario = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Se requiere el ID del usuario' 
      });
    }
    
    // Consultar horarios donde el usuario es propietario
    const snapshot = await db.collection('schedules')
      .where('userId', '==', userId)
      .get();
    
    if (snapshot.empty) {
      return res.json({ 
        success: true,
        horarios: [] 
      });
    }
    
    // Transformar los documentos en un array de objetos
    const horarios = [];
    snapshot.forEach(doc => {
      horarios.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return res.json({ 
      success: true,
      horarios 
    });
  } catch (error) {
    console.error("Error al listar horarios:", error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error al obtener la lista de horarios: ' + error.message 
    });
  }
};

// Obtener horarios de un dispositivo específico
exports.listarHorariosDispositivo = async (req, res) => {
  try {
    const { deviceId } = req.params;
    
    if (!deviceId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Se requiere el ID del dispositivo' 
      });
    }
    
    // Consultar horarios para el dispositivo específico
    const snapshot = await db.collection('schedules')
      .where('deviceId', '==', deviceId)
      .get();
    
    if (snapshot.empty) {
      return res.json({ 
        success: true,
        horarios: [] 
      });
    }
    
    // Transformar los documentos en un array de objetos
    const horarios = [];
    snapshot.forEach(doc => {
      horarios.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return res.json({ 
      success: true,
      horarios 
    });
  } catch (error) {
    console.error("Error al listar horarios del dispositivo:", error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error al obtener la lista de horarios: ' + error.message 
    });
  }
};

// Actualizar un horario
exports.actualizarHorario = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const { nombre, dias, horaInicio, accion, activo, userId } = req.body;
    
    // Validar datos de entrada
    if (!scheduleId || !userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Se requiere el ID del horario y el ID del usuario' 
      });
    }
    
    // Verificar que el horario existe
    const scheduleRef = db.collection('schedules').doc(scheduleId);
    const scheduleDoc = await scheduleRef.get();
    
    if (!scheduleDoc.exists) {
      return res.status(404).json({ 
        success: false, 
        message: 'El horario no existe' 
      });
    }
    
    // Verificar que el usuario es el propietario
    const scheduleData = scheduleDoc.data();
    if (scheduleData.userId !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'No tienes permiso para actualizar este horario' 
      });
    }
    
    // Preparar datos para actualización
    const updateData = {};
    
    // Solo actualizar campos proporcionados
    if (nombre !== undefined) updateData.name = nombre;
    if (dias !== undefined) updateData.days = dias;
    if (horaInicio !== undefined) updateData.startTime = horaInicio;
    if (accion !== undefined) updateData.action = accion;
    if (activo !== undefined) updateData.active = activo;
    
    // Añadir timestamp de actualización
    updateData.updatedAt = admin.firestore.FieldValue.serverTimestamp();
    
    // Actualizar el documento
    await scheduleRef.update(updateData);
    
    return res.json({ 
      success: true, 
      message: "Horario actualizado con éxito",
      horario: {
        id: scheduleId,
        ...scheduleData,
        ...updateData
      }
    });
  } catch (error) {
    console.error("Error al actualizar horario:", error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error al actualizar el horario: ' + error.message 
    });
  }
};

// Eliminar un horario
exports.eliminarHorario = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const { userId } = req.body;
    
    // Validar datos de entrada
    if (!scheduleId || !userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Se requiere el ID del horario y el ID del usuario' 
      });
    }
    
    // Verificar que el horario existe
    const scheduleRef = db.collection('schedules').doc(scheduleId);
    const scheduleDoc = await scheduleRef.get();
    
    if (!scheduleDoc.exists) {
      return res.status(404).json({ 
        success: false, 
        message: 'El horario no existe' 
      });
    }
    
    // Verificar que el usuario es el propietario
    const scheduleData = scheduleDoc.data();
    if (scheduleData.userId !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'No tienes permiso para eliminar este horario' 
      });
    }
    
    // Eliminar el documento
    await scheduleRef.delete();
    
    return res.json({ 
      success: true, 
      message: "Horario eliminado con éxito" 
    });
  } catch (error) {
    console.error("Error al eliminar horario:", error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar el horario: ' + error.message 
    });
  }
};
