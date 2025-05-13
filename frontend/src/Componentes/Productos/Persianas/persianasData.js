export const componentData = {
  lamasAluminio: {
    id: 'lamasAluminio',
    name: 'Lamas de Aluminio Premium',
    description: 'Lamas de aluminio anodizado, resistentes a la corrosión y personalizables en colores.',
    image: 'https://www.somfy.es/common/img/library///500x370_cover/Connexoon_Window_Stephane_Rambaud_18_web2.jpg',
    alt: 'Lamas de persiana para control de luz',
    features: ['Resistencia al clima extremo', 'Acabado en 10 colores', 'Ajuste motorizado opcional'],
    specs: { Material: 'Aluminio Anodizado', Ancho: '35-55mm', Peso: '0.6kg/m²', Garantía: '5 años' },
    installationTips: 'Asegure las lamas al cajón con tornillos de acero inoxidable.',
    price: 12.99,
    stock: 150,
  },
  cajonPVC: {
    id: 'cajonPVC',
    name: 'Cajón de PVC Termoaislante',
    description: 'Cajón robusto con aislamiento térmico y acústico para persianas de alta eficiencia.',
    image: 'https://www.somfy.es/common/img/library//500x370_cover/blinds-and-curtains.jpg',
    alt: 'Cajón protector de persiana',
    features: ['Aislamiento R-12', 'Instalación sin herramientas complejas', 'Diseño ergonómico'],
    specs: { Material: 'PVC reforzado', Dimensiones: '250x250mm', Compatibilidad: 'Persianas hasta 3m' },
    installationTips: 'Alinee el cajón con un nivel para evitar desequilibrios.',
    price: 19.99,
    stock: 200,
  },
  ejeAcero: {
    id: 'ejeAcero',
    name: 'Eje de Acero Galvanizado',
    description: 'Eje de alta resistencia para persianas de gran tamaño, con lubricación preinstalada.',
    image: 'https://www.somfy.es/common/img/library//500x370_cover/heating-and-lighting.jpg',
    alt: 'Eje de persiana para movimiento estable',
    features: ['Capacidad de 150kg', 'Silencioso en operación', 'Ajustable en longitud'],
    specs: { Material: 'Acero Galvanizado', Diámetro: '70mm', 'Longitud máxima': '4m' },
    installationTips: 'Aplique lubricante adicional cada 6 meses.',
    price: 25.50,
    stock: 100,
  },
  motorSmart: {
    id: 'motorSmart',
    name: 'Motor Smart Wi-Fi',
    description: 'Motor eléctrico con control remoto y compatibilidad con asistentes de voz.',
    image: 'https://www.somfy.es/common/img/library//500x370_cover/gates-and-door-phones.jpg',
    alt: 'Motor eléctrico para persianas',
    features: ['Control por app', 'Silencioso <40dB', 'Programación automática'],
    specs: { Potencia: '50Nm', Voltaje: '230V', Conectividad: 'Wi-Fi/Bluetooth' },
    installationTips: 'Conecte a una toma con protección contra sobretensiones.',
    price: 69.99,
    stock: 75,
  },
  guiasLaterales: {
    id: 'guiasLaterales',
    name: 'Guías Laterales de Aluminio',
    description: 'Guías reforzadas para un deslizamiento suave y seguro de persianas grandes.',
    image: 'https://www.somfy.es/common/img/library//500x370_cover/cameras-and-alarms.jpg',
    alt: 'Guías laterales para persianas',
    features: ['Anticorrosión', 'Ajuste telescópico', 'Reducción de vibraciones'],
    specs: { Material: 'Aluminio', Longitud: 'Hasta 3m', Ancho: '30mm' },
    installationTips: 'Verifique la verticalidad con un nivel láser.',
    price: 14.99,
    stock: 180,
  },
  controlRemoto: {
    id: 'controlRemoto',
    name: 'Control Remoto Avanzado',
    description: 'Control inalámbrico con pantalla LCD para gestionar múltiples persianas.',
    image: 'https://www.somfy.es/common/img/library///500x370_cover/yslo-swing-shutters-motor-tahoma-compatible.jpg',
    alt: 'Sistema de control para persianas',
    features: ['Rango 50m', 'Compatibilidad multi-dispositivo', 'Batería recargable'],
    specs: { Frecuencia: '2.4GHz', Alcance: '50m', 'Duración batería': '6 meses' },
    installationTips: 'Coloque el control lejos de fuentes de interferencia.',
    price: 39.99,
    stock: 120,
  },
};

export const getCompatibilityMessage = (componentId) => {
  const compatibleProducts = {
    lamasAluminio: ['cajonPVC', 'ejeAcero', 'motorSmart', 'guiasLaterales', 'controlRemoto'],
    cajonPVC: ['lamasAluminio', 'ejeAcero', 'motorSmart', 'guiasLaterales'],
    ejeAcero: ['lamasAluminio', 'cajonPVC', 'motorSmart', 'guiasLaterales'],
    motorSmart: ['lamasAluminio', 'cajonPVC', 'ejeAcero', 'controlRemoto'],
    guiasLaterales: ['lamasAluminio', 'cajonPVC', 'ejeAcero'],
    controlRemoto: ['motorSmart', 'lamasAluminio'],
  };

  const compatible = compatibleProducts[componentId] || [];
  if (!compatible.length) {
    return 'No hay información de compatibilidad disponible.';
  }

  return `Compatible con: ${compatible
    .map((id) => componentData[id]?.name || id)
    .filter(Boolean)
    .join(', ')}.`;
};