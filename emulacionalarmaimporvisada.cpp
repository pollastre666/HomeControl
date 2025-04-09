#define PIR_PIN     2   // Pin de salida del sensor PIR
#define BUZZER_PIN  8   // Pin del buzzer o altavoz

bool alarmaActivada = true;
bool movimientoDetectado = false;

void setup() {
    pinMode(PIR_PIN, INPUT);
    pinMode(BUZZER_PIN, OUTPUT);

    Serial.begin(9600);
    Serial.println("Alarma lista. Esperando movimiento...");
}

void loop() {
    int lectura = digitalRead(PIR_PIN);

    if (alarmaActivada && lectura == HIGH) {
        if (!movimientoDetectado) {
            movimientoDetectado = true;
            activarAlarma();
        }
    } else {
        if (movimientoDetectado) {
            movimientoDetectado = false;
            desactivarAlarma();
        }
    }

    delay(100); // Evita lecturas excesivas
}

void activarAlarma() {
    digitalWrite(BUZZER_PIN, HIGH); // Si tienes un buzzer activo
    Serial.println("¡MOVIMIENTO DETECTADO! Alarma activada.");
}

void desactivarAlarma() {
    digitalWrite(BUZZER_PIN, LOW);
    Serial.println("Zona segura. Alarma desactivada.");
}
