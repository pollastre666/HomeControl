require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { admin, db } = require('./src/firebase');
const mqttService = require('./src/services/mqtt-service');
const dispositivosRoutes = require('./src/Routes/dispositivos-routes');

// Configuración del servidor Express
const app = express();
app.use(cors());
app.use(express.json());

// Conectar al broker MQTT
mqttService.connect();

// Manejar mensajes MQTT recibidos
mqttService.onMessage(async (topic, message) => {
  try {
    // Parsear el tópico para extraer userId, deviceId y tipo
    const topicParts = topic.split('/');
    if (topicParts.length !== 4) return;
    
    const [prefix, userId, deviceId, type] = topicParts;
    
    // Parsear el mensaje
    const payload = JSON.parse(message.toString());
    
    // Si es un mensaje de estado, actualizar Firestore
    if (type === 'state') {
      await db.collection('Dispositivos').doc(deviceId).update({
        estadoActual: payload.status || payload,
        online: true,
        ultimaConexion: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`Estado actualizado para dispositivo ${deviceId}`);
    }
    
    // Si es un evento, procesarlo según el tipo
    if (type === 'event') {
      // Aquí puedes añadir lógica para diferentes tipos de eventos
      console.log(`Evento recibido para dispositivo ${deviceId}: ${payload.type}`);
    }
  } catch (error) {
    console.error('Error al procesar mensaje MQTT:', error);
  }
});

// Rutas API
app.get('/', (req, res) => {
  res.send('Servidor HomeControl funcionando');
});

// Ruta para enviar comandos a dispositivos
app.post('/api/dispositivos/:deviceId/comando', async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { comando, uid } = req.body;
    
    if (!deviceId || !comando || !uid) {
      return res.status(400).json({ 
        success: false, 
        message: 'Se requiere deviceId, comando y uid' 
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
    if (deviceData.userId !== uid) {
      return res.status(403).json({ 
        success: false, 
        message: 'No tienes permiso para controlar este dispositivo' 
      });
    }
    
    // Construir el mensaje de comando
    const comandoMsg = {
      ...comando,
      timestamp: Date.now()
    };
    
    // Construir el tópico MQTT
    const topic = mqttService.buildTopic(uid, deviceId, mqttService.constructor.TOPIC_TYPES.COMMAND);
    
    // Publicar el comando en el tópico MQTT
    try {
      await mqttService.publishMessage(topic, comandoMsg);
        
      // Actualizar el estado deseado en Firestore
      await db.collection('devices').doc(deviceId).update({
        desiredState: comando.action,
        lastCommand: admin.firestore.FieldValue.serverTimestamp()
      });
        
      res.json({ 
        success: true, 
        message: 'Comando enviado con éxito' 
      });
    } catch (error) {
      console.error('Error al enviar comando:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error al enviar comando: ' + error.message 
      });
    }
  } catch (error) {
    console.error('Error al procesar solicitud:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor' 
    });
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});

// Ruta de prueba
app.post('/api/test', (req, res) => {
  res.json({ message: 'Test route works!' });
});

