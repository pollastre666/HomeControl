const mqtt = require("mqtt");
const functions = require("firebase-functions");

// Configuración del broker MQTT
const MQTT_BROKER_URL =
  (functions.config().mqtt && functions.config().mqtt.broker_url) ||
  "51104778e7764f889d456bcb731d54a8.s1.eu.hivemq.cloud";
const MQTT_USERNAME =
  (functions.config().mqtt && functions.config().mqtt.username) ||
  "Admin";
const MQTT_PASSWORD =
  (functions.config().mqtt && functions.config().mqtt.password) ||
  "Administrador1";

// Estructura de tópicos MQTT
const TOPIC_PREFIX = "homecontrol";

// Función para construir tópicos
const buildTopic = (userId, deviceId, type) => {
  return `${TOPIC_PREFIX}/${userId}/${deviceId}/${type}`;
};

// Función para publicar un mensaje en un tópico
const publishMessage = async (topic, message) => {
  return new Promise((resolve, reject) => {
    try {
      const client = mqtt.connect(MQTT_BROKER_URL, {
        username: MQTT_USERNAME,
        password: MQTT_PASSWORD,
        protocol: "mqtts", // Usar "mqtt" para conexiones no seguras
        // Solo para desarrollo, eliminar en producción
        rejectUnauthorized: false,
      });

      client.on("connect", () => {
        client.publish(topic, JSON.stringify(message), (err) => {
          client.end();
          if (err) {
            reject(err);
          } else {
            resolve(true);
          }
        });
      });

      client.on("error", (err) => {
        client.end();
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
};

// Exportar funciones y constantes útiles
module.exports = {
  buildTopic,
  publishMessage,
  TOPIC_TYPES: {
    COMMAND: "command",
    STATE: "state",
    EVENT: "event",
  },
};
