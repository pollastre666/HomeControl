// src/AdvancedSecurity/advancedSecurityData.js

export const componentData = {
  camera: {
    id: 'camera',
    name: 'Cámara de Seguridad',
    image: 'https://www.somfy.es/common/img/library///500x600_cover/category-camera-security-preview2.jpg', // Imagen real de Somfy
    description: 'Cámara de alta definición con visión nocturna y detección de movimiento.',
    features: ['Resolución 1080p', 'Visión nocturna', 'Detección de movimiento', 'Conexión Wi-Fi'],
    specs: { Resolución: '1080p', 'Ángulo de visión': '120°', Almacenamiento: 'Nube o tarjeta SD' },
    installationTips: 'Instale la cámara a una altura de 2-3 metros para una mejor cobertura.',
    price: 149.99,
    stock: 10,
  },
  'alarm-system': {
    id: 'alarm-system',
    name: 'Sistema de Alarma',
    image: 'https://www.somfy.es/common/img/library///500x600_cover/category-camera-security-preview2.jpg', // Imagen real de Somfy
    description: 'Sistema de alarma con notificaciones en tiempo real y sensores avanzados.',
    features: ['Notificaciones push', 'Sensores de puerta/ventana', 'Alarma sonora de 100dB'],
    specs: { Volumen: '100dB', Conectividad: 'Wi-Fi', Batería: '24h de respaldo' },
    installationTips: 'Coloque los sensores en todas las entradas principales.',
    price: 199.99,
    stock: 8,
  },
  'motion-detector': {
    id: 'motion-detector',
    name: 'Detector de Movimiento',
    image: 'https://www.somfy.es/common/img/library///500x600_cover/category-camera-security-preview2.jpg', // Imagen real de Somfy
    description: 'Detector de movimiento con sensores infrarrojos para mayor seguridad.',
    features: ['Infrarrojos pasivos', 'Rango de 10m', 'Ajuste de sensibilidad'],
    specs: { Rango: '10m', 'Ángulo de detección': '90°', Alimentación: 'Batería AA' },
    installationTips: 'Evite colocarlo cerca de fuentes de calor para reducir falsas alarmas.',
    price: 79.99,
    stock: 15,
  },
  'smart-lock': {
    id: 'smart-lock',
    name: 'Cerradura Inteligente',
    image: 'https://www.somfy.es/common/img/library///500x600_cover/category-camera-security-preview2.jpg', // Imagen real de Somfy
    description: 'Cerradura con acceso remoto y control mediante aplicación móvil.',
    features: ['Acceso por app', 'Código temporal', 'Notificaciones de apertura'],
    specs: { Conectividad: 'Bluetooth/Wi-Fi', Batería: '6 meses', Material: 'Acero inoxidable' },
    installationTips: 'Asegure una instalación firme en puertas de grosor estándar.',
    price: 129.99,
    stock: 5,
  },
  'control-app': {
    id: 'control-app',
    name: 'App de Control',
    image: 'https://www.somfy.es/common/img/library///500x600_cover/category-camera-security-preview2.jpg', // Imagen real de Somfy
    description: 'Aplicación móvil para gestionar todos tus dispositivos de seguridad.',
    features: ['Control remoto', 'Notificaciones en tiempo real', 'Integración con dispositivos'],
    specs: { Compatibilidad: 'iOS y Android', Conectividad: 'Wi-Fi', Idiomas: 'Múltiples' },
    installationTips: 'Descargue la app desde App Store o Google Play y siga las instrucciones.',
    price: 0.00, // Gratis
    stock: 0, // No aplica stock para apps
  },
  'notification-system': {
    id: 'notification-system',
    name: 'Sistema de Notificaciones',
    image: 'https://www.somfy.es/content/dam/somfy/website/products/notifications/notification-system.jpg', // Imagen real de Somfy
    description: 'Sistema de alertas personalizadas para eventos de seguridad.',
    features: ['Alertas por email', 'Notificaciones push', 'Historial de eventos'],
    specs: { Conectividad: 'Wi-Fi', Almacenamiento: 'Nube', Frecuencia: 'En tiempo real' },
    installationTips: 'Configure las preferencias de notificación en la app de control.',
    price: 49.99,
    stock: 20,
  },
};

export const getCompatibilityMessage = (componentId) => {
  const compatibleProducts = {
    camera: ['alarm-system', 'motion-detector', 'smart-lock', 'control-app', 'notification-system'],
    'alarm-system': ['camera', 'motion-detector', 'control-app', 'notification-system'],
    'motion-detector': ['camera', 'alarm-system', 'control-app', 'notification-system'],
    'smart-lock': ['camera', 'control-app', 'notification-system'],
    'control-app': ['camera', 'alarm-system', 'motion-detector', 'smart-lock', 'notification-system'],
    'notification-system': ['camera', 'alarm-system', 'motion-detector', 'smart-lock', 'control-app'],
  };
  const compatible = compatibleProducts[componentId] || [];
  return compatible.length > 0
    ? `Este producto es compatible con: ${compatible.map(id => componentData[id]?.name || id).join(', ')}.`
    : 'No hay información de compatibilidad disponible.';
};