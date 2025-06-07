#include <WiFi.h>
#include <PubSubClient.h>

// Configuración WiFi
const char* ssid = "TuSSID";
const char* password = "TuPassword";
const char* mqtt_server = "broker.hivemq.com";

WiFiClient espClient;
PubSubClient client(espClient);

const char* TOPIC_SENSORES = "homecontrol/sensores";
const char* TOPIC_ENCHUFES = "homecontrol/enchufes";
const char* TOPIC_BOMBILLAS = "homecontrol/bombillas";

void setup_wifi() {
    delay(10);
    Serial.println("Conectando a WiFi...");
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("WiFi conectado");
}

void callback(char* topic, byte* payload, unsigned int length) {
    Serial.print("Mensaje recibido en ");
    Serial.print(topic);
    Serial.print(": ");
    String message = "";
    for (int i = 0; i < length; i++) {
        message += (char)payload[i];
    }
    Serial.println(message);
    
    if (strcmp(topic, TOPIC_SENSORES) == 0) {
        manejarSensores(message);
    } else if (strcmp(topic, TOPIC_ENCHUFES) == 0) {
        manejarEnchufes(message);
    } else if (strcmp(topic, TOPIC_BOMBILLAS) == 0) {
        manejarBombillas(message);
    }
}

void manejarSensores(String data) {
    if (data == "presencia_detectada") {
        Serial.println("Movimiento detectado, encendiendo luces");
        client.publish(TOPIC_BOMBILLAS, "encender");
    } else {
        Serial.println("Sin movimiento");
    }
}

void manejarEnchufes(String data) {
    Serial.print("Control de enchufes: ");
    Serial.println(data);
}

void manejarBombillas(String data) {
    Serial.print("Control de bombillas: ");
    Serial.println(data);
}

void reconnect() {
    while (!client.connected()) {
        Serial.print("Intentando conexión MQTT...");
        if (client.connect("HomeControlClient")) {
            Serial.println("Conectado");
            client.subscribe(TOPIC_SENSORES);
            client.subscribe(TOPIC_ENCHUFES);
            client.subscribe(TOPIC_BOMBILLAS);
        } else {
            Serial.print("Falló, rc=");
            Serial.print(client.state());
            Serial.println(" Intentando de nuevo en 5s");
            delay(5000);
        }
    }
}

void setup() {
    Serial.begin(115200);
    setup_wifi();
    client.setServer(mqtt_server, 1883);
    client.setCallback(callback);
}

void loop() {
    if (!client.connected()) {
        reconnect();
    }
    client.loop();
}
