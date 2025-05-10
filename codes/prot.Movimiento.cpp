#define PIR_PIN 7      // Pin del sensor de movimiento PIR
#define LUZ_PIN 3      // Pin para la luz inteligente (LED o relé)
unsigned long tiempoUltimaDeteccion = 0;
const int tiempoApagado = 5000; // Tiempo en ms para apagar la luz

void setup() {
    pinMode(PIR_PIN, INPUT);
    pinMode(LUZ_PIN, OUTPUT);
    Serial.begin(9600);
    Serial.println("Sistema de detección de movimiento listo.");
}

void loop() {
    int estadoPIR = digitalRead(PIR_PIN);
    unsigned long tiempoActual = millis();

    if (estadoPIR == HIGH) {
        digitalWrite(LUZ_PIN, HIGH);
        Serial.println("Movimiento detectado - LUZ ENCENDIDA");
        tiempoUltimaDeteccion = tiempoActual;
    } else if ((tiempoActual - tiempoUltimaDeteccion) > tiempoApagado) {
        digitalWrite(LUZ_PIN, LOW);
        Serial.println("Sin movimiento - LUZ APAGADA");
    }
}
