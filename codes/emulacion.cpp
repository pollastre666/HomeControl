struct Dispositivo {
    uint8_t pinSalida;
    uint8_t pinBoton;
    bool estado;
    bool estadoPrevioBoton;
    unsigned long ultimoCambio;
    const char* nombre;
};

const unsigned long DEBOUNCE_DELAY = 50;

void manejarDispositivo(Dispositivo& d, unsigned long tiempoActual) {
    bool estadoBoton = digitalRead(d.pinBoton);

    if (estadoBoton == LOW && d.estadoPrevioBoton == HIGH && 
        (tiempoActual - d.ultimoCambio) > DEBOUNCE_DELAY) {
        
        d.estado = !d.estado;
        digitalWrite(d.pinSalida, d.estado ? HIGH : LOW);
        Serial.print(d.nombre);
        Serial.println(d.estado ? " ENCENDIDO" : " APAGADO");
        d.ultimoCambio = tiempoActual;
    }

    d.estadoPrevioBoton = estadoBoton;.
}
