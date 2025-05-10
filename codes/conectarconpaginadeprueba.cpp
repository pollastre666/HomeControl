#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>

const char* ssid = "TU_SSID";
const char* password = "TU_PASSWORD";

#define PIN_LUZ     D1
#define PIN_ENCHUFE D2
#define PIN_PIR     D5

bool estadoLuz = false;
bool estadoEnchufe = false;

ESP8266WebServer server(80);

void setup() {
  Serial.begin(115200);

  pinMode(PIN_LUZ, OUTPUT);
  pinMode(PIN_ENCHUFE, OUTPUT);
  pinMode(PIN_PIR, INPUT);

  digitalWrite(PIN_LUZ, LOW);
  digitalWrite(PIN_ENCHUFE, LOW);

  WiFi.begin(ssid, password);
  Serial.print("Conectando a WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nConectado. IP:");
  Serial.println(WiFi.localIP());

  // Ruta principal
  server.on("/", manejarPagina);

  // Control luces
  server.on("/luz/on", []() {
    digitalWrite(PIN_LUZ, HIGH);
    estadoLuz = true;
    server.send(200, "text/plain", "Luz encendida");
  });

  server.on("/luz/off", []() {
    digitalWrite(PIN_LUZ, LOW);
    estadoLuz = false;
    server.send(200, "text/plain", "Luz apagada");
  });

  // Control enchufe
  server.on("/enchufe/on", []() {
    digitalWrite(PIN_ENCHUFE, HIGH);
    estadoEnchufe = true;
    server.send(200, "text/plain", "Enchufe encendido");
  });

  server.on("/enchufe/off", []() {
    digitalWrite(PIN_ENCHUFE, LOW);
    estadoEnchufe = false;
    server.send(200, "text/plain", "Enchufe apagado");
  });

  // Sensor movimiento
  server.on("/movimiento", []() {
    int sensor = digitalRead(PIN_PIR);
    String estado = sensor == HIGH ? "MOVIMIENTO DETECTADO" : "Sin movimiento";
    server.send(200, "text/plain", estado);
  });

  server.begin();
}

void loop() {
  server.handleClient();
}

void manejarPagina() {
  String html = "<h1>Control de Casa Inteligente</h1>";
  html += "<p><a href='/luz/on'>Encender Luz</a> | <a href='/luz/off'>Apagar Luz</a></p>";
  html += "<p><a href='/enchufe/on'>Encender Enchufe</a> | <a href='/enchufe/off'>Apagar Enchufe</a></p>";
  html += "<p><a href='/movimiento'>Ver Movimiento</a></p>";
  server.send(200, "text/html", html);
}
