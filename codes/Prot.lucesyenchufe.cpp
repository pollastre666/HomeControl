#define LUZ_PIN        3  // Pin para la luz inteligente (LED o relé)
#define ENCHUFE_PIN    4  // Pin para el enchufe inteligente (relé)
#define BTN_LUZ        5  // Botón para encender/apagar la luz
#define BTN_ENCHUFE    6  // Botón para encender/apagar el enchufe

const unsigned long DEBOUNCE_DELAY = 50; // Tiempo de antirrebote en ms

struct Dispositivo {
    uint8_t pinSalida;
    uint8_t pinBoton;
    bool estado;
    bool estadoPrevioBoton;
    unsigned long ultimoCambio;
    const char* nombre;
};

Dispositivo luz = {LUZ_PIN, BTN_LUZ, false, HIGH, 0, "LUZ"};
Dispositivo enchufe = {ENCHUFE_PIN, BTN_ENCHUFE, false, HIGH, 0, "ENCHUFE"};

void setup() {
    pinMode(luz.pinSalida, OUTPUT);
    pinMode(enchufe.pinSalida, OUTPUT);
    pinMode(luz.pinBoton, INPUT_PULLUP);
    pinMode(enchufe.pinBoton, INPUT_PULLUP);

    Serial.begin(9600);
    Serial.println("Sistema de luces y enchufes listo.");
}

void loop() {
    unsigned long tiempoActual = millis();

    manejarDispositivo(luz, tiempoActual);
    manejarDispositivo(enchufe, tiempoActual);
}

void manejarDispositivo(Dispositivo& d, unsigned long tiempoActual) {
    bool estadoBoton = digitalRead(d.pinBoton);

    if (estadoBoton == LOW && d.estadoPrevioBoton == HIGH && (tiempoActual - d.ultimoCambio) > DEBOUNCE_DELAY) {
        d.estado = !d.estado;
        digitalWrite(d.pinSalida, d.estado ? HIGH : LOW);
        Serial.print(d.nombre);
        Serial.println(d.estado ? " ENCENDIDO" : " APAGADO");
        d.ultimoCambio = tiempoActual;
    }

    d.estadoPrevioBoton = estadoBoton;
}
