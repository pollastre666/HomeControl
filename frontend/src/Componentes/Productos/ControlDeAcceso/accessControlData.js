// src/AccessControl/accessControlData.js

export const componentData = {
  keypad: {
    id: 'keypad',
    name: 'Teclado',
    image: 'https://www.zoominformatica.com/img-datos/ASC01N_3.jpg',
    description: 'Acceso seguro mediante códigos personalizados.',
    features: ['Códigos personalizables', 'Retroiluminación LED', 'Resistente al agua', 'Compatibilidad con app'],
    specs: { 'Dimensiones': '15x5x3 cm', 'Alimentación': 'Batería AA', 'Conectividad': 'Bluetooth' },
    installationTips: 'Instale en una superficie plana cerca de la entrada principal.',
    price: 99.99,
    stock: 10,
  },
  'rfid-reader': {
    id: 'rfid-reader',
    name: 'Lector RFID',
    image: 'https://thumb.pccomponentes.com/w-530-530/articles/20/207686/6.jpg',
    description: 'Entrada con tarjetas de proximidad para mayor seguridad.',
    features: ['Lectura rápida', 'Tarjetas programables', 'Rango de 5 cm', 'Integración con sistemas'],
    specs: { 'Rango de lectura': '5 cm', 'Frecuencia': '13.56 MHz', 'Alimentación': '12V DC' },
    installationTips: 'Coloque a una altura accesible y lejos de metales que puedan interferir.',
    price: 129.99,
    stock: 8,
  },
  'door-lock': {
    id: 'door-lock',
    name: 'Cerradura',
    image: 'https://www.somfy.es/common/img/library//500x600_cover/category-camera-security-preview2.jpg',
    description: 'Cerradura electrónica de alta seguridad con control remoto.',
    features: ['Control remoto', 'Cerradura biométrica', 'Notificaciones', 'Batería de respaldo'],
    specs: { 'Material': 'Acero inoxidable', 'Conectividad': 'Wi-Fi', 'Batería': '6 meses' },
    installationTips: 'Asegure una instalación firme en puertas de grosor estándar.',
    price: 199.99,
    stock: 5,
  },
  intercom: {
    id: 'intercom',
    name: 'Interfono',
    image: 'https://es.maisonic.com/media/catalog/product/cache/c0db1c895faaa6d6d4be1c5e86a4cfd5/5/3/531036ecrans-35804.jpg',
    description: 'Comunicación bidireccional con visitantes.',
    features: ['Video HD', 'Audio bidireccional', 'Visión nocturna', 'Control por app'],
    specs: { 'Resolución': '720p', 'Ángulo de visión': '90°', 'Conectividad': 'Wi-Fi' },
    installationTips: 'Instale a una altura de 1.5 metros para un uso cómodo.',
    price: 149.99,
    stock: 12,
  },

  'security-panel': {
    id: 'security-panel',
    name: 'Panel de Seguridad',
    image: 'https://media.mundoextintor.com/product/central-de-deteccion-y-alarma-analogica-compact-lyon-800x800.jpg?width=1200',
    description: 'Gestión centralizada de accesos y alarmas.',
    features: ['Pantalla táctil', 'Control multi-dispositivo', 'Alarma integrada', 'Notificaciones'],
    specs: { 'Pantalla': '7 pulgadas', 'Conectividad': 'Wi-Fi/Zigbee', 'Alimentación': '220V' },
    installationTips: 'Coloque en una ubicación central con acceso fácil.',
    price: 249.99,
    stock: 3,
  },
};

export const getCompatibilityMessage = (componentId) => {
  const compatibleProducts = {
    keypad: ['door-lock', 'intercom', 'mobile-access', 'security-panel'],
    'rfid-reader': ['door-lock', 'mobile-access', 'security-panel'],
    'door-lock': ['keypad', 'rfid-reader', 'mobile-access', 'security-panel'],
    intercom: ['keypad', 'mobile-access', 'security-panel'],
    'mobile-access': ['keypad', 'rfid-reader', 'door-lock', 'intercom', 'security-panel'],
    'security-panel': ['keypad', 'rfid-reader', 'door-lock', 'intercom', 'mobile-access'],
  };
  const compatible = compatibleProducts[componentId] || [];
  return compatible.length > 0
    ? `Este producto es compatible con: ${compatible.map(id => componentData[id]?.name || id).join(', ')}.`
    : 'No hay información de compatibilidad disponible.';
};