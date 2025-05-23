const { admin, db } = require('../firebase');

// Crear un nuevo dispositivo
exports.crearDispositivo = async (req, res) => {
  try {
    const { nombre, tipo, ubicacion, configuracion, uid } = req.body;
    
    // Validar datos de entrada
    if (!nombre || !tipo || !uid) {
      return res.status(400).json({ 
        success: false, 
        message: 'Se requiere nombre, tipo y uid del usuario propietario' 
      });
    }
    
    // Crear un nuevo documento en la colección devices
    const deviceRef = db.collection('devices').doc();
    const deviceId = deviceRef.id;
    
    const timestamp = admin.firestore.FieldValue.serverTimestamp();
    
    const nuevoDispositivo = {
      deviceId: deviceId,
      name: nombre,
      type: tipo,
      userId: uid,
      currentState: "off",
      online: false,
      lastConnection: timestamp,
      location: ubicacion || "",
      configuration: configuracion || {},
      createdAt: timestamp
    };

    await deviceRef.set(nuevoDispositivo);
    
    return res.status(201).json({ 
      success: true, 
      message: "Dispositivo creado con éxito", 
      dispositivo: {
        id: deviceId,
        ...nuevoDispositivo
      }
    });
  } catch (error) {
    console.error("Error al crear dispositivo:", error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error al crear el dispositivo: ' + error.message 
    });
  }
};

// Obtener todos los dispositivos de un usuario
exports.listarDispositivosUsuario = async (req, res) => {
  try {
    const { uid } = req.params;
    
    if (!uid) {
      return res.status(400).json({ 
        success: false, 
        message: 'Se requiere el ID del usuario' 
      });
    }
    
    // Consultar dispositivos donde el usuario es propietario
    const snapshot = await db.collection('devices')
      .where('userId', '==', uid)
      .get();
    
    if (snapshot.empty) {
      return res.json({ 
        success: true,
        dispositivos: [] 
      });
    }
    
    // Transformar los documentos en un array de objetos
    const dispositivos = [];
    snapshot.forEach(doc => {
      dispositivos.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return res.json({ 
      success: true,
      dispositivos 
    });
  } catch (error) {
    console.error("Error al listar dispositivos:", error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error al obtener la lista de dispositivos: ' + error.message 
    });
  }
};

// Obtener un dispositivo específico
exports.obtenerDispositivo = async (req, res) => {
  try {
    const { deviceId } = req.params;
    
    // Obtener el documento del dispositivo
    const deviceDoc = await db.collection('devices').doc(deviceId).get();
    
    if (!deviceDoc.exists) {
      return res.status(404).json({ 
        success: false, 
        message: 'El dispositivo no existe' 
      });
    }
    
    return res.json({ 
      success: true,
      dispositivo: {
        id: deviceDoc.id,
        ...deviceDoc.data()
      }
    });
  } catch (error) {
    console.error("Error al obtener dispositivo:", error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error al obtener el dispositivo: ' + error.message 
    });
  }
};

// Actualizar un dispositivo existente
exports.actualizarDispositivo = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { nombre, ubicacion, configuracion, uid } = req.body;
    
    // Validar datos de entrada
    if (!deviceId || !uid) {
      return res.status(400).json({ 
        success: false, 
        message: 'Se requiere el ID del dispositivo y el ID del usuario' 
      });
    }
    
    // Verificar que el dispositivo existe
    const deviceRef = db.collection('devices').doc(deviceId);
    const deviceDoc = await deviceRef.get();
    
    if (!deviceDoc.exists) {
      return res.status(404).json({ 
        success: false, 
        message: 'El dispositivo no existe' 
      });
    }
    
    // Verificar que el usuario es el propietario
    const deviceData = deviceDoc.data();
    if (deviceData.userId !== uid) {
      return res.status(403).json({ 
        success: false, 
        message: 'No tienes permiso para actualizar este dispositivo' 
      });
    }
    
    // Preparar datos para actualización
    const updateData = {};
    
    // Solo actualizar campos proporcionados
    if (nombre !== undefined) updateData.name = nombre;
    if (ubicacion !== undefined) updateData.location = ubicacion;
    if (configuracion !== undefined) updateData.configuration = configuracion;
    
    // Añadir timestamp de actualización
    updateData.updatedAt = admin.firestore.FieldValue.serverTimestamp();
    
    // Actualizar el documento
    await deviceRef.update(updateData);
    
    return res.json({ 
      success: true, 
      message: "Dispositivo actualizado con éxito",
      dispositivo: {
        id: deviceId,
        ...deviceData,
        ...updateData
      }
    });
  } catch (error) {
    console.error("Error al actualizar dispositivo:", error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error al actualizar el dispositivo: ' + error.message 
    });
  }
};

// Eliminar un dispositivo
exports.eliminarDispositivo = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { uid } = req.body;
    
    // Validar datos de entrada
    if (!deviceId || !uid) {
      return res.status(400).json({ 
        success: false, 
        message: 'Se requiere el ID del dispositivo y el ID del usuario' 
      });
    }
    
    // Verificar que el dispositivo existe
    const deviceRef = db.collection('devices').doc(deviceId);
    const deviceDoc = await deviceRef.get();
    
    if (!deviceDoc.exists) {
      return res.status(404).json({ 
        success: false, 
        message: 'El dispositivo no existe' 
      });
    }
    
    // Verificar que el usuario es el propietario
    const deviceData = deviceDoc.data();
    if (deviceData.userId !== uid) {
      return res.status(403).json({ 
        success: false, 
        message: 'No tienes permiso para eliminar este dispositivo' 
      });
    }
    
    // Eliminar el documento
    await deviceRef.delete();
    
    return res.json({ 
      success: true, 
      message: "Dispositivo eliminado con éxito" 
    });
  } catch (error) {
    console.error("Error al eliminar dispositivo:", error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar el dispositivo: ' + error.message 
    });
  }
};