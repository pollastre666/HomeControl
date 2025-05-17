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

