const API_URL = process.env.REACT_APP_API_URL;

export const deviceService = {
  sendCommand: async (deviceId, uid, command ) => {
    try {
      const response = await fetch(`${API_URL}/api/dispositivos/${deviceId}/comando`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid, comando: command }),
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending command:', error);
      throw error;
    }
  },
  
  getSchedules: async (uid) => {
    try {
      const response = await fetch(`${API_URL}/api/horarios?uid=${uid}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching schedules:', error);
      throw error;
    }
  },
  
  createSchedule: async (uid, schedule) => {
    try {
      const response = await fetch(`${API_URL}/api/horarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid, ...schedule }),
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating schedule:', error);
      throw error;
    }
  },
  
  deleteSchedule: async (scheduleId, uid) => {
    try {
      const response = await fetch(`${API_URL}/api/horarios/${scheduleId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid }),
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting schedule:', error);
      throw error;
    }
  }
};
