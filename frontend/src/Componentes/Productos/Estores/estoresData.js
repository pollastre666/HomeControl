export const componentData = {
  tejido: {
    id: 'tejido',
    name: 'Tejido Ligero',
    image: 'https://www.ikea.com/es/es/images/products/tretur-estor-opaco-gris-claro__0892632_pe653525_s5.jpg?f=xl',
    description: 'Tejido transpirable y elegante para control de luz suave, ideal para ambientes luminosos.',
    features: ['Opacidad ajustable', 'Resistente a la decoloración', 'Fácil limpieza'],
    specs: { Material: 'Poliéster', Ancho: '100-300cm', Peso: '200g/m²' },
    installationTips: 'Mida el tejido con precisión antes de cortarlo para un ajuste perfecto.',
    price: 29.99,
    stock: 15,
  },
  tubo: {
    id: 'tubo',
    name: 'Tubo de Aluminio',
    image: 'https://tubefittings.eu/866-home_default/aluminiowa-rura-o-420-mm-x-20-mm.jpg',
    description: 'Tubo ligero y resistente para un enrollado perfecto, diseñado para durabilidad.',
    features: ['Acero reforzado', 'Diámetro adaptable', 'Bajo mantenimiento'],
    specs: { Material: 'Aluminio', Diámetro: '40-60mm', Longitud: 'Ajustable hasta 3m' },
    installationTips: 'Asegure el tubo firmemente en los soportes para evitar vibraciones.',
    price: 45.50,
    stock: 20,
  },
  'motor-estores': {
    id: 'motor-estores',
    name: 'Motor Eléctrico',
    image: 'https://persianasamedida.com/594-large_default/-motor-logos-1016-radio-0-a-15-kg.jpg',
    description: 'Motor silencioso para automatización de estores, con tecnología avanzada.',
    features: ['Control remoto', 'Silencioso', 'Programación horaria'],
    specs: { Potencia: '20Nm', Voltaje: '220V', Conectividad: 'Wi-Fi opcional' },
    installationTips: 'Conecte el motor a una fuente de alimentación estable y pruebe antes de instalar.',
    price: 89.99,
    stock: 10,
  },
  rieles: {
    id: 'rieles',
    name: 'Rieles',
    image: 'https://m.media-amazon.com/images/I/61mopminV5L._AC_SX679_.jpg',
    description: 'Rieles laterales que aseguran un movimiento suave y estable del estor.',
    features: ['Material anticorrosivo', 'Fácil instalación', 'Diseño elegante'],
    specs: { Material: 'Aluminio', Longitud: 'Ajustable', Ancho: '20mm' },
    installationTips: 'Alinee los rieles verticalmente para evitar que el estor se desvíe.',
    price: 34.75,
    stock: 25,
  },
  'control-estores': {
    id: 'control-estores',
    name: 'Control',
    image: 'https://shop.somfy.es/media/catalog/product/cache/015b82a7a09e482677d845fe81ecb38c/m/a/mando-situo-5-io.jpg',
    description: 'Control inteligente para gestionar estores manual o automáticamente.',
    features: ['Interruptor de pared', 'Control remoto', 'Integración con app'],
    specs: { Conectividad: 'Wi-Fi/Bluetooth', Compatibilidad: 'Motores estándar', Alimentación: 'Batería o 220V' },
    installationTips: 'Coloque el control en un lugar accesible cerca del estor.',
    price: 59.99,
    stock: 12,
  },
  contrapeso: {
    id: 'contrapeso',
    name: 'Contrapeso',
    image: 'https://media.adeo.com/media/2174040/media.png?width=650&height=650&format=jpg&quality=80&fit=bounds',
    description: 'Contrapeso que asegura un enrollamiento uniforme y estable del estor.',
    features: ['Ajuste de peso', 'Diseño discreto', 'Fácil instalación'],
    specs: { Material: 'Plomo recubierto', Peso: '0.5-2kg', Longitud: 'Ajustable' },
    installationTips: 'Equilibre el contrapeso según el peso total del estor.',
    price: 19.95,
    stock: 30,
  },
};

export const getCompatibilityMessage = (componentId) => {
  const compatibleProducts = {
    tejido: ['tubo', 'motor-estores', 'rieles', 'control-estores', 'contrapeso'],
    tubo: ['tejido', 'motor-estores', 'rieles', 'control-estores'],
    'motor-estores': ['tejido', 'tubo', 'control-estores'],
    rieles: ['tejido', 'tubo', 'motor-estores'],
    'control-estores': ['motor-estores', 'tejido'],
    contrapeso: ['tejido', 'tubo'],
  };
  const compatible = compatibleProducts[componentId] || [];
  return compatible.length > 0
    ? `Este producto es compatible con: ${compatible.map(id => componentData[id]?.name || id).join(', ')}.`
    : 'No hay información de compatibilidad disponible.';
};