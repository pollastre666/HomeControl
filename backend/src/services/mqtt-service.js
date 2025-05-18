const mqtt = require('mqtt');

class MqttService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.topicPrefix = 'homecontrol';
    this.messageHandlers = [];
  }

  connect() {
    if (this.client) return;

    this.client = mqtt.connect(process.env.MQTT_BROKER_URL, {
      username: process.env.MQTT_USERNAME,
      password: process.env.MQTT_PASSWORD,
      protocol: 'mqtts',
      rejectUnauthorized: false // Solo para desarrollo
    });

    this.client.on('connect', () => {
      console.log('Conectado al broker MQTT');
      this.isConnected = true;
      
      // Suscribirse a todos los tópicos de estado y eventos
      this.client.subscribe(`${this.topicPrefix}/+/+/state`);
      this.client.subscribe(`${this.topicPrefix}/+/+/event`);
    });

    this.client.on('message', (topic, message) => {
      console.log(`Mensaje recibido en tópico ${topic}: ${message.toString()}`);
      
      // Notificar a todos los manejadores registrados
      this.messageHandlers.forEach(handler => {
        handler(topic, message);
      });
    });

    this.client.on('error', (error) => {
      console.error('Error en conexión MQTT:', error);
      this.isConnected = false;
    });

    this.client.on('close', () => {
      console.log('Conexión MQTT cerrada');
      this.isConnected = false;
    });
  }

  buildTopic(userId, deviceId, type) {
    return `${this.topicPrefix}/${userId}/${deviceId}/${type}`;
  }

  publishMessage(topic, message) {
    return new Promise((resolve, reject) => {
      if (!this.isConnected) {
        return reject(new Error('No hay conexión al broker MQTT'));
      }

      this.client.publish(topic, JSON.stringify(message), (err) => {
        if (err) {
          console.error('Error al publicar mensaje MQTT:', err);
          return reject(err);
        }
        resolve(true);
      });
    });
  }

  onMessage(handler) {
    if (typeof handler === 'function') {
      this.messageHandlers.push(handler);
    }
  }

  // Constantes para tipos de tópicos
  static get TOPIC_TYPES() {
    return {
      COMMAND: 'command',
      STATE: 'state',
      EVENT: 'event'
    };
  }
}

// Exportar una instancia única
const mqttService = new MqttService();
module.exports = mqttService;
