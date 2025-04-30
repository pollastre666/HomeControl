// Código Arduino (C++) para ESP8266 con Sensor PIR
// Este código lee un sensor PIR y envía una notificación a un servidor intermediario cuando detecta movimiento.

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

// --- Configuración de WiFi ---
const char* ssid = "TU_NOMBRE_DE_WIFI";         // Reemplaza con el nombre de tu red WiFi
const char* password = "TU_CONTRASEÑA_WIFI"; // Reemplaza con tu contraseña de WiFi

// --- Configuración del Servidor Intermediario ---
const char* serverIp = "IP_DEL_SERVIDOR_PYTHON"; // Reemplaza con la IP de la máquina que ejecutará el script Python
const int serverPort = 5000;                 // Puerto en el que escuchará el servidor Python (puede ser otro)
String serverPath = "/motion";               // Ruta en el servidor para notificar movimiento

// --- Configuración de Pines ---
const int pirPin = D1; // Pin GPIO al que está conectado el sensor PIR (D1 = GPIO5 en Wemos D1 Mini)

// --- Variables de Estado ---
int pirState = LOW;             // Estado actual del sensor
int lastPirState = LOW;         // Estado anterior del sensor
unsigned long lastMotionTime = 0; // Tiempo del último movimiento detectado
const unsigned long motionDebounceDelay = 2000; // Tiempo (ms) para evitar envíos repetidos muy seguidos

void setup() {
  Serial.begin(115200);
  pinMode(pirPin, INPUT);

  // Conectar a WiFi
  Serial.println();
  Serial.print("Conectando a ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi conectado");
  Serial.println("Dirección IP: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  pirState = digitalRead(pirPin); // Leer el estado del sensor PIR

  // Verificar si el estado ha cambiado y si ha pasado el tiempo de debounce
  if (pirState != lastPirState && millis() - lastMotionTime > motionDebounceDelay) {
    if (pirState == HIGH) {
      Serial.println("Movimiento detectado!");
      sendMotionNotification(); // Enviar notificación al servidor
      lastMotionTime = millis(); // Registrar el tiempo del evento
    } else {
      Serial.println("Movimiento terminado.");
      // Opcional: podrías enviar otra notificación aquí si necesitas saber cuándo termina el movimiento
    }
    lastPirState = pirState; // Actualizar el último estado conocido
  }
  
  // Pequeña pausa para no saturar el loop
  delay(100); 
}

// Función para enviar notificación de movimiento al servidor Python
void sendMotionNotification() {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;

    String serverUrl = "http://" + String(serverIp) + ":" + String(serverPort) + serverPath;
    
    Serial.print("Enviando petición a: ");
    Serial.println(serverUrl);

    // Iniciar conexión HTTP
    http.begin(client, serverUrl);
    http.addHeader("Content-Type", "application/json"); // Opcional, si envías datos JSON

    // Enviar petición POST (o GET, según definas tu servidor)
    // Puedes enviar datos adicionales en el cuerpo si es necesario, ej: {"sensor_id":"pir_sala"}
    int httpResponseCode = http.POST(""); // Envía un POST vacío, o ajusta según tu API

    if (httpResponseCode > 0) {
      Serial.print("Código de respuesta HTTP: ");
      Serial.println(httpResponseCode);
      String payload = http.getString(); // Opcional: obtener respuesta del servidor
      Serial.println(payload);
    } else {
      Serial.print("Error en la petición HTTP: ");
      Serial.println(httpResponseCode);
      Serial.println(http.errorToString(httpResponseCode));
    }

    // Liberar recursos
    http.end();
  } else {
    Serial.println("WiFi desconectado. No se puede enviar la notificación.");
  }
}

