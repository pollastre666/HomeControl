#define LUZ_PIN 3     // Pin para la luz inteligente (LED o relé)
#define ENCHUFE_PIN 4 // Pin para el enchufe inteligente (relé)
#define BTN_LUZ 5     // Botón para encender/apagar la luz
#define BTN_ENCHUFE 6 // Botón para encender/apagar el enchufe

bool estado_luz = false;
bool estado_enchufe = false;
bool btnLuzPrevio = HIGH;
bool btnEnchufePrevio = HIGH;
unsigned long tiempoUltimoCambioLuz = 0;
unsigned long tiempoUltimoCambioEnchufe = 0;
const int debounceDelay = 50; // Tiempo de antirrebote en ms

void setup() {
    pinMode(LUZ_PIN, OUTPUT);
    pinMode(ENCHUFE_PIN, OUTPUT);
    pinMode(BTN_LUZ, INPUT_PULLUP);
    pinMode(BTN_ENCHUFE, INPUT_PULLUP);

    Serial.begin(9600);
    Serial.println("Sistema de luces y enchufes listo.");
}

void loop() {
    unsigned long tiempoActual = millis(); // Capturar el tiempo actual

    // Comprobación de botón de luz con debounce
    if (digitalRead(BTN_LUZ) == LOW && btnLuzPrevio == HIGH && (tiempoActual - tiempoUltimoCambioLuz) > debounceDelay) {
        estado_luz = !estado_luz;
        digitalWrite(LUZ_PIN, estado_luz ? HIGH : LOW);
        Serial.println(estado_luz ? "LUZ ENCENDIDA" : "LUZ APAGADA");
        tiempoUltimoCambioLuz = tiempoActual;
    }
    btnLuzPrevio = digitalRead(BTN_LUZ);

    // Comprobación de botón de enchufe con debounce
    if (digitalRead(BTN_ENCHUFE) == LOW && btnEnchufePrevio == HIGH && (tiempoActual - tiempoUltimoCambioEnchufe) > debounceDelay) {
        estado_enchufe = !estado_enchufe;
        digitalWrite(ENCHUFE_PIN, estado_enchufe ? HIGH : LOW);
        Serial.println(estado_enchufe ? "ENCHUFE ACTIVADO" : "ENCHUFE DESACTIVADO");
        tiempoUltimoCambioEnchufe = tiempoActual;
    }
    btnEnchufePrevio = digitalRead(BTN_ENCHUFE);
}
