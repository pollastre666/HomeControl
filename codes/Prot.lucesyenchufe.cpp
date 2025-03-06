#define LUZ_PIN 3     // Pin para la luz inteligente (LED o relé)
#define ENCHUFE_PIN 4 // Pin para el enchufe inteligente (relé)
#define BTN_LUZ 5     // Botón para encender/apagar la luz
#define BTN_ENCHUFE 6 // Botón para encender/apagar el enchufe

bool estado_luz = false;
bool estado_enchufe = false;

void setup() {
    pinMode(LUZ_PIN, OUTPUT);
    pinMode(ENCHUFE_PIN, OUTPUT);
    pinMode(BTN_LUZ, INPUT_PULLUP);
    pinMode(BTN_ENCHUFE, INPUT_PULLUP);

    Serial.begin(9600);
    Serial.println("Sistema de luces y enchufes listo.");
}

void loop() {
    // Control manual con botones
    if (digitalRead(BTN_LUZ) == LOW) {
        delay(200); // Antirrebote
        estado_luz = !estado_luz;
        digitalWrite(LUZ_PIN, estado_luz ? HIGH : LOW);
        Serial.println(estado_luz ? "LUZ ENCENDIDA" : "LUZ APAGADA");
        delay(500);
    }

    if (digitalRead(BTN_ENCHUFE) == LOW) {
        delay(200); // Antirrebote
        estado_enchufe = !estado_enchufe;
        digitalWrite(ENCHUFE_PIN, estado_enchufe ? HIGH : LOW);
        Serial.println(estado_enchufe ? "ENCHUFE ACTIVADO" : "ENCHUFE DESACTIVADO");
        delay(500);
    }
}