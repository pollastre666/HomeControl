#include <WiFi.h>
#include <WebServer.h>

const char* ssid = "Wokwi-GUEST";
const char* password = "";

#define PIN_LUZ     5   // GPIO5 (puede ser cualquier pin válido de ESP32)
#define PIN_ENCHUFE 18  // GPIO18
#define PIN_PIR     19  // GPIO19

bool estadoLuz = false;
bool estadoEnchufe = false;

WebServer server(80);

void setup() {
  Serial.begin(115200);

  pinMode(PIN_LUZ, OUTPUT);
  pinMode(PIN_ENCHUFE, OUTPUT);
  pinMode(PIN_PIR, INPUT);

  digitalWrite(PIN_LUZ, LOW);
  digitalWrite(PIN_ENCHUFE, LOW);

  WiFi.begin(ssid, password);
  Serial.print("Conectando a WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConectado. IP: " + WiFi.localIP().toString());

  // Página principal
  server.on("/", []() {
    String html = "<h1>Control de Casa Inteligente</h1>";
    html += "<p><a href='/luz/on'> Encender Luz</a> | <a href='/luz/off'>❌ Apagar Luz</a></p>";
    html += "<p><a href='/enchufe/on'>Encender Enchufe</a> | <a href='/enchufe/off'>❌ Apagar Enchufe</a></p>";
    html += "<p><a href='/movimiento'>Estado Movimiento</a></p>";
    server.send(200, "text/html", html);
  });

  // Control luz
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

  // Movimiento
  server.on("/movimiento", []() {
    int mov = digitalRead(PIN_PIR);
    String respuesta = mov == HIGH ? " MOVIMIENTO DETECTADO" : " Sin movimiento";
    server.send(200, "text/plain", respuesta);
  });

  server.begin();
}

void loop() {
  server.handleClient();
}
