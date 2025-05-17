const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// Cloud Function que se activa al crear un nuevo usuario en Firebase Authentication
exports.crearPerfilUsuario = functions.auth.user().onCreate(async (user) => {
  const { uid, email, displayName, photoURL } = user;
  const fechaCreacion = admin.firestore.FieldValue.serverTimestamp();

  const nuevoPerfil = {
    uid: uid,
    email: email || '', // Asegurar que email no sea undefined
    nombreMostrado: displayName || '', // Usar displayName si está disponible
    fotoURL: photoURL || '', // Usar photoURL si está disponible
    rol: "cliente", // Rol por defecto
    fechaCreacion: fechaCreacion,
  };

  try {
    await admin.firestore().collection("users").doc(uid).set(nuevoPerfil);
    console.log(`Perfil creado para el usuario ${uid} con email ${email}`);
    return null;
  } catch (error) {
    console.error(`Error al crear perfil para usuario ${uid}:`, error);
    return null;
  }
});

// Cloud Function para crear un nuevo dispositivo
exports.crearDispositivo = functions.https.onCall(async (data, context)  => {
  // Verificar si el usuario está autenticado
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'El usuario debe estar autenticado para crear un dispositivo.'
    ) ;
  }

  const uid = context.auth.uid;
  
  // Validar datos de entrada
  if (!data.nombre || !data.tipo) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Se requiere nombre y tipo de dispositivo.'
    ) ;
  }

  try {
    // Crear un nuevo documento en la colección Dispositivos
    const deviceRef = admin.firestore().collection('Dispositivos').doc();
    const deviceId = deviceRef.id;
    
    const timestamp = admin.firestore.FieldValue.serverTimestamp();
    
    const nuevoDispositivo = {
      deviceId: deviceId,
      nombre: data.nombre,
      tipo: data.tipo,
      idUsuarioPropietario: uid,
      estadoActual: data.estadoInicial || "apagado",
      online: false,
      ultimaConexion: timestamp,
      ubicacion: data.ubicacion || "",
      configuracion: data.configuracion || {},
      fechaCreacion: timestamp
    };

    await deviceRef.set(nuevoDispositivo);
    
    return { 
      success: true, 
      message: "Dispositivo creado con éxito", 
      deviceId: deviceId 
    };
  } catch (error) {
    console.error("Error al crear dispositivo:", error);
    throw new functions.https.HttpsError(
      'internal',
      'Error al crear el dispositivo. Por favor, inténtalo de nuevo.'
    ) ;
  }
});

// Cloud Function para listar dispositivos de un usuario
exports.listarDispositivosUsuario = functions.https.onCall(async (data, context)  => {
  // Verificar si el usuario está autenticado
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'El usuario debe estar autenticado para listar sus dispositivos.'
    ) ;
  }

  const uid = context.auth.uid;
  
  try {
    // Consultar dispositivos donde el usuario es propietario
    const snapshot = await admin.firestore()
      .collection('Dispositivos')
      .where('idUsuarioPropietario', '==', uid)
      .get();
    
    if (snapshot.empty) {
      return { dispositivos: [] };
    }
    
    // Transformar los documentos en un array de objetos
    const dispositivos = [];
    snapshot.forEach(doc => {
      dispositivos.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { dispositivos };
  } catch (error) {
    console.error("Error al listar dispositivos:", error);
    throw new functions.https.HttpsError(
      'internal',
      'Error al obtener la lista de dispositivos. Por favor, inténtalo de nuevo.'
    ) ;
  }
});

// Cloud Function para actualizar un dispositivo existente
exports.actualizarDispositivo = functions.https.onCall(async (data, context)  => {
  // Verificar si el usuario está autenticado
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'El usuario debe estar autenticado para actualizar un dispositivo.'
    ) ;
  }

  const uid = context.auth.uid;
  
  // Validar datos de entrada
  if (!data.deviceId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Se requiere el ID del dispositivo a actualizar.'
    ) ;
  }

  try {
    // Verificar que el dispositivo existe y pertenece al usuario
    const deviceRef = admin.firestore().collection('Dispositivos').doc(data.deviceId);
    const deviceDoc = await deviceRef.get();
    
    if (!deviceDoc.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        'El dispositivo no existe.'
      ) ;
    }
    
    const deviceData = deviceDoc.data();
    if (deviceData.idUsuarioPropietario !== uid) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'No tienes permiso para actualizar este dispositivo.'
      ) ;
    }
    
    // Preparar datos para actualización
    const updateData = {};
    
    // Solo actualizar campos permitidos
    if (data.nombre !== undefined) updateData.nombre = data.nombre;
    if (data.ubicacion !== undefined) updateData.ubicacion = data.ubicacion;
    if (data.configuracion !== undefined) updateData.configuracion = data.configuracion;
    
    // Añadir timestamp de actualización
    updateData.ultimaActualizacion = admin.firestore.FieldValue.serverTimestamp();
    
    // Actualizar el documento
    await deviceRef.update(updateData);
    
    return { 
      success: true, 
      message: "Dispositivo actualizado con éxito" 
    };
  } catch (error) {
    console.error("Error al actualizar dispositivo:", error);
    throw new functions.https.HttpsError(
      'internal',
      'Error al actualizar el dispositivo: ' + error.message
    ) ;
  }
});

// Cloud Function para eliminar un dispositivo
exports.eliminarDispositivo = functions.https.onCall(async (data, context)  => {
  // Verificar si el usuario está autenticado
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'El usuario debe estar autenticado para eliminar un dispositivo.'
    ) ;
  }

  const uid = context.auth.uid;
  
  // Validar datos de entrada
  if (!data.deviceId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Se requiere el ID del dispositivo a eliminar.'
    ) ;
  }

  try {
    // Verificar que el dispositivo existe y pertenece al usuario
    const deviceRef = admin.firestore().collection('Dispositivos').doc(data.deviceId);
    const deviceDoc = await deviceRef.get();
    
    if (!deviceDoc.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        'El dispositivo no existe.'
      ) ;
    }
    
    const deviceData = deviceDoc.data();
    if (deviceData.idUsuarioPropietario !== uid) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'No tienes permiso para eliminar este dispositivo.'
      ) ;
    }
    
    // Eliminar el documento
    await deviceRef.delete();
    
    return { 
      success: true, 
      message: "Dispositivo eliminado con éxito" 
    };
  } catch (error) {
    console.error("Error al eliminar dispositivo:", error);
    throw new functions.https.HttpsError(
      'internal',
      'Error al eliminar el dispositivo: ' + error.message
    ) ;
  }
});
