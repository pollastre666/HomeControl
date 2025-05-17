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

