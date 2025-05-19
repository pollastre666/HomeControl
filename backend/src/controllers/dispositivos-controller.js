const admin = require('firebase-admin');
const db = admin.firestore();

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
