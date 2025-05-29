// src/AutomationHub/automationHubData.js

export const componentData = {
  'central-unit': {
    id: 'central-unit',
    name: 'Unidad Central',
    image: 'https://images.wiautomation.com/public/images/landing/anticipa/product/RxQJmWf025vrqW6XYIlC1JyeU6u2iIr1R0iztf4OaD3XtLlry1Lp0jnI7Ve2.jpg',
    description: 'Núcleo de control para todos los dispositivos del hogar.',
    features: ['Control centralizado', 'Conexión multi-dispositivo', 'Actualizaciones OTA', 'Interfaz web'],
    specs: { 'Procesador': 'Quad-core', 'Memoria': '2GB RAM', 'Conectividad': 'Wi-Fi/Zigbee' },
    installationTips: 'Coloque en un lugar ventilado y con buena señal Wi-Fi.',
    price: 299.99,
    stock: 7,
  },
  'connectivity-module': {
    id: 'connectivity-module',
    name: 'Módulo de Conectividad',
    image: 'https://www.myamplifiers.com/img/products/134/main.jpg',
    description: 'Conexión Wi-Fi y Bluetooth para dispositivos inteligentes.',
    features: ['Wi-Fi 2.4G/5G', 'Bluetooth 5.0', 'Rango extendido', 'Compatibilidad universal'],
    specs: { 'Frecuencia': '2.4/5 GHz', 'Rango': '50m', 'Alimentación': '5V USB' },
    installationTips: 'Conecte cerca de un enrutador para optimizar la señal.',
    price: 79.99,
    stock: 15,
  },
  sensors: {
    id: 'sensors',
    name: 'Sensores',
    image: 'https://es-es.ring.com/cdn/shop/products/FLCpro_angle_wht_ON_1290x1290_97813204-4c5a-41aa-a3d9-c27a7e75281b_1280x1280_crop_center.png?v=1745302257',
    description: 'Detectores de movimiento y temperatura avanzados.',
    features: ['Detección de movimiento', 'Sensor de temperatura', 'Batería recargable', 'Alarma integrada'],
    specs: { 'Rango': '10m', 'Batería': '1 año', 'Conectividad': 'Zigbee' },
    installationTips: 'Coloque a 2 metros de altura para mejor cobertura.',
    price: 49.99,
    stock: 20,
  },

  'voice-control': {
    id: 'voice-control',
    name: 'Control por Voz',
    image: 'https://es-es.ring.com/cdn/shop/products/Alarm2.05-PieceKit_1290x1290_b501c637-7893-4724-8570-6c645941a520_1280x1280_crop_center.png?v=1745302259',
    description: 'Integración con asistentes de voz como Alexa y Google.',
    features: ['Compatibilidad con Alexa', 'Google Assistant', 'Comandos personalizados', 'Respuesta rápida'],
    specs: { 'Conectividad': 'Wi-Fi', 'Micrófono': 'Sensibilidad 360°', 'Alimentación': 'USB' },
    installationTips: 'Conecte al hub y configure en la app asociada.',
    price: 59.99,
    stock: 10,
  },
  'power-supply': {
    id: 'power-supply',
    name: 'Fuente de Alimentación',
    image: 'https://www.cetronic.es/sqlcommerce/ficheros/dk_93/productos/999441008-25.jpg',
    description: 'Energía eficiente y estable para el hub.',
    features: ['Salida estable', 'Protección contra sobrecarga', 'Diseño compacto', 'Batería de respaldo'],
    specs: { 'Voltaje': '12V/5A', 'Eficiencia': '85%', 'Dimensiones': '10x5x3 cm' },
    installationTips: 'Conecte a un tomacorriente cercano al hub.',
    price: 39.99,
    stock: 25,
  },
};

export const getCompatibilityMessage = (componentId) => {
  const compatibleProducts = {
    'central-unit': ['connectivity-module', 'sensors', 'app-interface', 'voice-control', 'power-supply'],
    'connectivity-module': ['central-unit', 'sensors', 'app-interface', 'voice-control'],
    sensors: ['central-unit', 'connectivity-module', 'app-interface', 'voice-control'],
    'app-interface': ['central-unit', 'connectivity-module', 'sensors', 'voice-control', 'power-supply'],
    'voice-control': ['central-unit', 'connectivity-module', 'sensors', 'app-interface'],
    'power-supply': ['central-unit', 'app-interface'],
  };
  const compatible = compatibleProducts[componentId] || [];
  return compatible.length > 0
    ? `Este producto es compatible con: ${compatible.map(id => componentData[id]?.name || id).join(', ')}.`
    : 'No hay información de compatibilidad disponible.';
};