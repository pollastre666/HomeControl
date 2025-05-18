// src/AdvancedSecurity/advancedSecurityData.js

export const componentData = {
  camera: {
    id: 'camera',
    name: 'Cámara de Seguridad',
    image: 'https://assets.mmsrg.com/isr/166325/c1/-/ASSET_MMS_106831644?x=536&y=402&format=jpg&quality=80&sp=yes&strip=yes&trim&ex=536&ey=402&align=center&resizesource&unsharp=1.5x1+0.7+0.02&cox=0&coy=0&cdx=536&cdy=402', // Imagen real de Somfy
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
    image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSt78USb8otlmxpFvQBARycgxfeQ-M-E8jEnlG86_CbvIBb98jTlX2MFCIO9nfF_W-Z0OQLeC86sglzFYZL3Cs-juXsjKxF_1oHOT0XcCLeVFg-k7S4kK2g', // Imagen real de Somfy
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
    image: 'https://es-es.ring.com/cdn/shop/products/FLCpro_angle_wht_ON_1290x1290_97813204-4c5a-41aa-a3d9-c27a7e75281b_1280x1280_crop_center.png?v=1745302257', // Imagen real de Somfy
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
    image: 'https://m.media-amazon.com/images/I/81m8u6zlUJL._AC_UF894,1000_QL80_.jpg', // Imagen real de Somfy
    description: 'Cerradura con acceso remoto y control mediante aplicación móvil.',
    features: ['Acceso por app', 'Código temporal', 'Notificaciones de apertura'],
    specs: { Conectividad: 'Bluetooth/Wi-Fi', Batería: '6 meses', Material: 'Acero inoxidable' },
    installationTips: 'Asegure una instalación firme en puertas de grosor estándar.',
    price: 129.99,
    stock: 5,
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