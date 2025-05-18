export const componentData = {
  'motorized-shutters': {
    id: 'motorized-shutters',
    name: 'Persianas Motorizadas',
    image: 'https://www.cortinadecor.com/public/productos/persianas-enrollables-exterior-con-cajon/motorizada-a-bateria-con-placa-solar/gris-7012/ambientes/persiana-enrollable-motorizada-gris-7012-frontal.jpg.webp', // Imagen placeholder
    description: 'Control automático de persianas para comodidad y eficiencia.',
    features: ['Motor silencioso', 'Control remoto', 'Programación horaria', 'Compatibilidad con app'],
    specs: { 'Velocidad': '15 cm/s', 'Peso máximo': '50 kg', 'Alimentación': '110-240V' },
    installationTips: 'Instale en un marco estable y asegure una conexión eléctrica adecuada.',
    price: 199.99,
    stock: 10,
  },
  'smart-lighting': {
    id: 'smart-lighting',
    name: 'Iluminación Inteligente',
    image: 'https://www.lampamania.es/ImgGalery/Img1/Clanky/aktuality-home/inteligentni_osvetleni.jpg', // Imagen placeholder
    description: 'Luces ajustables con automatización y control remoto.',
    features: ['Control por voz', 'Colores personalizables', 'Programación', 'Integración con app'],
    specs: { 'Potencia': '10W', 'Lúmenes': '800 lm', 'Conectividad': 'Wi-Fi' },
    installationTips: 'Coloque las bombillas en lámparas compatibles con smart lighting.',
    price: 49.99,
    stock: 8,
  },
  'climate-control': {
    id: 'climate-control',
    name: 'Control de Clima',
    image: 'https://www.windowo.es/data/thumb_cache/_data_prod_img_somfy-telis-pure-telecomando-a-16-canali-radio-rts_jpg_r_800_800.jpg', // Imagen placeholder
    description: 'Regulación automática de temperatura y ventilación.',
    features: ['Termostato inteligente', 'Control remoto', 'Sensores de humedad', 'Programación'],
    specs: { 'Rango': '10-30°C', 'Conectividad': 'Wi-Fi', 'Batería': '24h de respaldo' },
    installationTips: 'Asegure una ventilación adecuada cerca del dispositivo.',
    price: 129.99,
    stock: 5,
  },
  'smart-plugs': {
    id: 'smart-plugs',
    name: 'Enchufes Inteligentes',
    image: 'https://www.fluxs.es/wp-content/uploads/2020/09/enchufe-NAOS-dest.png', // Imagen placeholder
    description: 'Controla dispositivos desde tu smartphone.',
    features: ['Encendido/apagado remoto', 'Programación', 'Compatibilidad con app', 'Consumo monitoreado'],
    specs: { 'Potencia máxima': '1800W', 'Conectividad': 'Wi-Fi', 'Dimensiones': '5x5x5 cm' },
    installationTips: 'Conecte a una toma de corriente segura y configure en la app.',
    price: 29.99,
    stock: 12,
  },
  'automation-controller': {
    id: 'automation-controller',
    name: 'Controlador de Automatización',
    image: 'https://srprosecure.com/46984-large_default/neptune-2.jpg', // Imagen placeholder
    description: 'Centraliza la gestión de automatismos del hogar.',
    features: ['Control centralizado', 'Integración con dispositivos', 'Actualizaciones OTA', 'Interfaz web'],
    specs: { 'Conectividad': 'Wi-Fi/Zigbee', 'Almacenamiento': 'Nube', 'Procesador': 'Quad-core' },
    installationTips: 'Coloque en un lugar con buena señal Wi-Fi.',
    price: 149.99,
    stock: Infinity,
  },

};

export const getCompatibilityMessage = (componentId) => {
  const compatibleProducts = {
    'motorized-shutters': ['smart-lighting', 'climate-control', 'automation-controller', 'scene-scheduler'],
    'smart-lighting': ['motorized-shutters', 'climate-control', 'automation-controller', 'scene-scheduler'],
    'climate-control': ['motorized-shutters', 'smart-lighting', 'automation-controller', 'scene-scheduler'],
    'smart-plugs': ['automation-controller', 'scene-scheduler'],
    'automation-controller': ['motorized-shutters', 'smart-lighting', 'climate-control', 'smart-plugs', 'scene-scheduler'],
    'scene-scheduler': ['motorized-shutters', 'smart-lighting', 'climate-control', 'automation-controller', 'smart-plugs'],
  };
  const compatible = compatibleProducts[componentId] || [];
  return compatible.length > 0
    ? `Este producto es compatible con: ${compatible.map(id => componentData[id]?.name || id).join(', ')}.`
    : 'No hay información de compatibilidad disponible.';
};
