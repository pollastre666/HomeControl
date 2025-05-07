// Definiciones de pines (ejemplo)
const int ledPin = 13; // Usaremos el LED incorporado para pruebas iniciales

String command = ""; // String para almacenar los comandos recibidos

void setup() {
  Serial.begin(9600); // Iniciar comunicación serial a 9600 baudios
  pinMode(ledPin, OUTPUT); // Configurar el pin del LED como salida
  digitalWrite(ledPin, LOW); // Asegurarse de que el LED esté apagado al inicio
  Serial.println("Arduino listo para recibir comandos.");
}

void loop() {
  // Leer comandos desde el puerto serial
  while (Serial.available() > 0) {
    char receivedChar = Serial.read();
    if (receivedChar == '\n') { // Fin del comando (nueva línea)
      processCommand(command);
      command = ""; // Limpiar el comando para el siguiente
    } else {
      command += receivedChar; // Añadir caracter al comando
    }
    delay(2); // Pequeña pausa para estabilidad
  }
}

void processCommand(String cmd) {
  Serial.print("Comando recibido: ");
  Serial.println(cmd);

  // Procesar comandos simples
  if (cmd.equalsIgnoreCase("ON")) {
    digitalWrite(ledPin, HIGH); // Encender LED
    Serial.println("LED Encendido");
  } else if (cmd.equalsIgnoreCase("OFF")) {
    digitalWrite(ledPin, LOW); // Apagar LED
    Serial.println("LED Apagado");
  } else {
    Serial.println("Comando no reconocido.");
  }
}

