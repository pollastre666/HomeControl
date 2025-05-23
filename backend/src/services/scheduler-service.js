const { db } = require('../../firebase');
const mqttService = require('./mqtt-service');

class SchedulerService {
  constructor() {
    this.intervalId = null;
    this.checkInterval = 60000; // Verificar cada minuto
  }

  start() {
    if (this.intervalId) return;
    
    console.log('Iniciando servicio de programación de horarios');
    
    this.intervalId = setInterval(() => {
      this.checkSchedules();
    }, this.checkInterval);
    
    // Ejecutar inmediatamente la primera vez
    this.checkSchedules();
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('Servicio de programación de horarios detenido');
    }
  }

  async checkSchedules() {
    try {
      const now = new Date();
      const currentHour = now.getHours().toString().padStart(2, '0');
      const currentMinute = now.getMinutes().toString().padStart(2, '0');
      const currentTime = `${currentHour}:${currentMinute}`;
      
      // Obtener el día de la semana actual (0 = domingo, 1 = lunes, ..., 6 = sábado)
      const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const currentDay = daysOfWeek[now.getDay()];
      
      console.log(`Verificando horarios para ${currentDay} a las ${currentTime}`);
      
      // Buscar horarios que coincidan con la hora actual
      const snapshot = await db.collection('schedules')
        .where('active', '==', true)
        .where('startTime', '==', currentTime)
        .get();
      
      if (snapshot.empty) {
        console.log('No hay horarios programados para este momento');
        return;
      }
      
      // Procesar cada horario
      snapshot.forEach(async (doc) => {
        const schedule = doc.data();
        
        // Verificar si el horario aplica para el día actual
        if (schedule.days.includes(currentDay)) {
          console.log(`Ejecutando horario: ${schedule.name} para dispositivo ${schedule.deviceId}`);
          
          try {
            // Obtener información del dispositivo
            const deviceDoc = await db.collection('devices').doc(schedule.deviceId).get();
            
            if (!deviceDoc.exists) {
              console.error(`El dispositivo ${schedule.deviceId} no existe`);
              return;
            }
            
            const deviceData = deviceDoc.data();
            
            // Construir el comando según la acción programada
            const comando = {
              action: schedule.action,
              timestamp: Date.now()
            };
            
            // Si hay parámetros adicionales en la acción (ej. brightness, color)
            if (typeof schedule.actionParams === 'object') {
              Object.assign(comando, schedule.actionParams);
            }
            
            // Construir el tópico MQTT
            const topic = mqttService.buildTopic(
              schedule.userId, 
              schedule.deviceId, 
              mqttService.constructor.TOPIC_TYPES.COMMAND
            );
            
            // Publicar el comando en el tópico MQTT
            await mqttService.publishMessage(topic, comando);
            
            // Actualizar el estado deseado en Firestore
            await db.collection('devices').doc(schedule.deviceId).update({
              desiredState: schedule.action,
              lastCommand: new Date(),
              lastSchedule: schedule.scheduleId
            });
            
            console.log(`Comando enviado con éxito para horario ${schedule.name}`);
          } catch (error) {
            console.error(`Error al ejecutar horario ${schedule.name}:`, error);
          }
        }
      });
    } catch (error) {
      console.error('Error al verificar horarios:', error);
    }
  }
}

// Exportar una instancia única
const schedulerService = new SchedulerService();
module.exports = schedulerService;
