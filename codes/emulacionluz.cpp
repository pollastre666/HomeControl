#define LUZ_PIN        3
#define ENCHUFE_PIN    4
#define BTN_LUZ        5
#define BTN_ENCHUFE    6

Dispositivo luz = {LUZ_PIN, BTN_LUZ, false, HIGH, 0, "LUZ"};
Dispositivo enchufe = {ENCHUFE_PIN, BTN_ENCHUFE, false, HIGH, 0, "ENCHUFE"};

void setup() {
    pinMode(luz.pinSalida, OUTPUT);
    pinMode(enchufe.pinSalida, OUTPUT);
    pinMode(luz.pinBoton, INPUT_PULLUP);
    pinMode(enchufe.pinBoton, INPUT_PULLUP);

    Serial.begin(9600);
    Serial.println("Sistema de LUZ y ENCHUFE listo.");
}

void loop() {
    unsigned long t = millis();
    manejarDispositivo(luz, t);
    manejarDispositivo(enchufe, t);
}
