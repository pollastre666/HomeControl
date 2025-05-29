/*
 * HomeControl - Firmware básico para ESP8266
 * 
 * Este firmware permite al ESP8266 conectarse a WiFi, comunicarse con el broker MQTT,
 * y responder a comandos básicos enviando confirmaciones.
 */

#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

// Configuración WiFi
const char* ssid = "TU_SSID_WIFI";
const char* password = "TU_PASSWORD_WIFI";

// Configuración MQTT
const char* mqtt_server = "TU_BROKER_MQTT"; // Ej: abcdef123456.s2.eu.hivemq.cloud
const int mqtt_port = 8883;
const char* mqtt_user = "TU_USUARIO_MQTT";
const char* mqtt_password = "TU_PASSWORD_MQTT";

// Identificadores del dispositivo
const char* deviceId = "esp8266_test"; // ID único para este dispositivo
const char* userId = "ID_DEL_USUARIO"; // ID del usuario propietario en Firestore

// Tópicos MQTT
String topicPrefix = "homecontrol";
String commandTopic;
String stateTopic;
String eventTopic;
String heartbeatTopic;

// Cliente WiFi y MQTT
WiFiClient espClient;
PubSubClient client(espClient);

// Variables para control de tiempo
unsigned long lastHeartbeat = 0;
const long heartbeatInterval = 60000; // 1 minuto

// LED incorporado para indicación visual
const int ledPin = LED_BUILTIN;

void setup() {
  // Inicializar puerto serie
  Serial.begin(115200);
  Serial.println("\nIniciando HomeControl ESP8266...");
  
  // Configurar pin del LED
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, HIGH); // LED apagado (lógica invertida en ESP8266)
  
  // Configurar tópicos MQTT
  commandTopic = topicPrefix + "/" + userId + "/" + deviceId + "/command";
  stateTopic = topicPrefix + "/" + userId + "/" + deviceId + "/state";
  eventTopic = topicPrefix + "/" + userId + "/" + deviceId + "/event";
  heartbeatTopic = topicPrefix + "/" + userId + "/" + deviceId + "/heartbeat";
  
  // Conectar a WiFi
  setup_wifi();
  
  // Configurar servidor MQTT
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

void loop() {
  // Mantener conexión MQTT
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  
  // Enviar heartbeat periódicamente
  unsigned long now = millis();
  if (now - lastHeartbeat > heartbeatInterval) {
    lastHeartbeat = now;
    sendHeartbeat();
  }
}

// Función para conectar a WiFi
void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Conectando a ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    digitalWrite(ledPin, LOW); // LED encendido
    delay(250);
    digitalWrite(ledPin, HIGH); // LED apagado
    delay(250);
    Serial.print(".");
  }
  
  Serial.println("");
  Serial.println("WiFi conectado");
  Serial.println("Dirección IP: ");
  Serial.println(WiFi.localIP());
}

// Función para manejar mensajes MQTT recibidos
void callback(char* topic, byte* payload, unsigned int length) {
  // Encender LED para indicar recepción de mensaje
  digitalWrite(ledPin, LOW);
  
  Serial.print("Mensaje recibido [");
  Serial.print(topic);
  Serial.print("] ");
  
  // Convertir payload a string
  String message;
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  Serial.println(message);
  
  // Procesar el comando recibido
  processCommand(message);
  
  // Apagar LED después de procesar
  digitalWrite(ledPin, HIGH);
}

// Función para procesar comandos recibidos
void processCommand(String message) {
  // Crear buffer para JSON
  StaticJsonDocument<256> doc;
  
  // Parsear JSON
  DeserializationError error = deserializeJson(doc, message);
  
  // Verificar si hubo error al parsear
  if (error) {
    Serial.print("Error al parsear JSON: ");
    Serial.println(error.c_str());
    return;
  }
  
  // Extraer acción del comando
  const char* action = doc["action"];
  if (!action) {
    Serial.println("Comando sin acción definida");
    return;
  }
  
  Serial.print("Acción recibida: ");
  Serial.println(action);
  
  // Responder con confirmación de recepción
  sendState(action);
  
  // Aquí se añadiría la lógica para controlar dispositivos físicos
  // Por ahora, solo simulamos la acción
  if (strcmp(action, "ON") == 0) {
    // Simular encendido
    Serial.println("Simulando ENCENDIDO del dispositivo");
    // Aquí iría el código para activar un relé, LED, etc.
  } 
  else if (strcmp(action, "OFF") == 0) {
    // Simular apagado
    Serial.println("Simulando APAGADO del dispositivo");
    // Aquí iría el código para desactivar un relé, LED, etc.
  }
}

// Función para reconectar al broker MQTT
void reconnect() {
  // Intentar hasta lograr conexión
  while (!client.connected()) {
    Serial.print("Intentando conexión MQTT...");
    
    // Crear ID de cliente aleatorio
    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);
    
    // Intentar conectar
    if (client.connect(clientId.c_str(), mqtt_user, mqtt_password)) {
      Serial.println("conectado");
      
      // Suscribirse al tópico de comandos
      client.subscribe(commandTopic.c_str());
      
      // Enviar estado inicial
      sendState("OFF");
    } else {
      Serial.print("falló, rc=");
      Serial.print(client.state());
      Serial.println(" intentando de nuevo en 5 segundos");
      
      // Esperar antes de reintentar
      for (int i = 0; i < 10; i++) {
        digitalWrite(ledPin, LOW);
        delay(250);
        digitalWrite(ledPin, HIGH);
        delay(250);
      }
    }
  }
}

// Función para enviar estado actual
void sendState(const char* state) {
  // Crear buffer para JSON
  StaticJsonDocument<128> doc;
  
  // Añadir datos al JSON
  doc["status"] = state;
  doc["online"] = true;
  doc["timestamp"] = millis();
  
  // Serializar JSON a string
  String jsonString;
  serializeJson(doc, jsonString);
  
  // Publicar en tópico de estado
  client.publish(stateTopic.c_str(), jsonString.c_str());
  Serial.print("Estado enviado: ");
  Serial.println(jsonString);
}

// Función para enviar heartbeat
void sendHeartbeat() {
  // Crear buffer para JSON
  StaticJsonDocument<64> doc;
  
  // Añadir timestamp al JSON
  doc["timestamp"] = millis();
  
  // Serializar JSON a string
  String jsonString;
  serializeJson(doc, jsonString);
  
  // Publicar en tópico de heartbeat
  client.publish(heartbeatTopic.c_str(), jsonString.c_str());
  Serial.println("Heartbeat enviado");
}
