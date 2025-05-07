const WebSocket = require('ws');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const WS_PORT = 8080; // Puerto para el servidor WebSocket
let arduinoPort = null;
let webSocketServer = null;
let connectedClient = null;

console.log('Iniciando servidor proxy serial...');

// Función para encontrar el puerto Arduino automáticamente
async function findArduinoPort() {
  console.log('Buscando puerto Arduino...');
  try {
    const ports = await SerialPort.list();
    // Intenta identificar el puerto Arduino por el fabricante o el ID del producto
    // Estos valores pueden variar, ajusta según tu placa Arduino específica
    const portInfo = ports.find(p => /arduino/i.test(p.manufacturer || '') || /2341|2A03/i.test(p.productId || ''));
    if (portInfo) {
      console.log(`Puerto Arduino encontrado: ${portInfo.path}`);
      return portInfo.path;
    } else {
      console.log('No se encontró un puerto Arduino automáticamente. Asegúrate de que esté conectado.');
      // Si no se encuentra automáticamente, podrías intentar conectar al primer puerto disponible o pedir al usuario que lo especifique.
      // Por ahora, devolveremos null.
      return null;
    }
  } catch (err) {
    console.error('Error listando puertos serie:', err);
    return null;
  }
}

// Función para inicializar la conexión serial
async function setupSerialConnection() {
  const portPath = await findArduinoPort();
  if (!portPath) {
    console.log('No se pudo establecer conexión serial. Reintentando en 5 segundos...');
    setTimeout(setupSerialConnection, 5000); // Reintentar después de 5 segundos
    return;
  }

  arduinoPort = new SerialPort({ path: portPath, baudRate: 9600 });
  const parser = arduinoPort.pipe(new ReadlineParser({ delimiter: '\n' }));

  arduinoPort.on('open', () => {
    console.log(`Conexión serial establecida en ${portPath}`);
  });

  parser.on('data', (data) => {
    console.log(`Datos recibidos de Arduino: ${data}`);
    // Enviar datos al cliente WebSocket conectado
    if (connectedClient && connectedClient.readyState === WebSocket.OPEN) {
      connectedClient.send(JSON.stringify({ type: 'serial_data', payload: data.toString().trim() }));
    }
  });

  arduinoPort.on('error', (err) => {
    console.error('Error en el puerto serial:', err.message);
    arduinoPort = null; // Resetear puerto en caso de error
    console.log('Intentando reconectar al puerto serial en 5 segundos...');
    setTimeout(setupSerialConnection, 5000);
  });

  arduinoPort.on('close', () => {
    console.log('Conexión serial cerrada.');
    arduinoPort = null; // Resetear puerto
    console.log('Intentando reconectar al puerto serial en 5 segundos...');
    setTimeout(setupSerialConnection, 5000);
  });
}

// Función para inicializar el servidor WebSocket
function setupWebSocketServer() {
  webSocketServer = new WebSocket.Server({ port: WS_PORT });
  console.log(`Servidor WebSocket escuchando en el puerto ${WS_PORT}`);

  webSocketServer.on('connection', (ws) => {
    console.log('Cliente WebSocket conectado.');
    connectedClient = ws; // Almacenar la conexión del cliente

    ws.on('message', (message) => {
      let command = '';
      try {
        // Intentar parsear como JSON por si enviamos objetos más complejos en el futuro
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.type === 'command') {
          command = parsedMessage.payload;
        }
      } catch (e) {
        // Si no es JSON, tratarlo como un string simple
        command = message.toString();
      }

      console.log(`Comando recibido del cliente WebSocket: ${command}`);

      // Enviar comando al Arduino si la conexión serial está activa
      if (arduinoPort && arduinoPort.isOpen) {
        arduinoPort.write(`${command}\n`, (err) => {
          if (err) {
            return console.error('Error al escribir en el puerto serial:', err.message);
          }
          console.log(`Comando '${command}' enviado a Arduino.`);
        });
      } else {
        console.log('Puerto serial no disponible. No se pudo enviar el comando.');
        // Opcional: enviar un mensaje de error de vuelta al cliente
        ws.send(JSON.stringify({ type: 'error', payload: 'Arduino no conectado' }));
      }
    });

    ws.on('close', () => {
      console.log('Cliente WebSocket desconectado.');
      connectedClient = null; // Limpiar la referencia al cliente
    });

    ws.on('error', (error) => {
      console.error('Error en WebSocket:', error);
      if (connectedClient === ws) {
        connectedClient = null;
      }
    });

    // Enviar mensaje de bienvenida o estado inicial si es necesario
    ws.send(JSON.stringify({ type: 'status', payload: 'Conectado al servidor proxy' }));
  });

  webSocketServer.on('error', (error) => {
    console.error('Error en el servidor WebSocket:', error);
  });
}

// Iniciar todo
setupSerialConnection(); // Intentar conectar al Arduino
setupWebSocketServer(); // Iniciar el servidor WebSocket

