const devices = [
  {
    id: 'luz_1',
    name: 'Luz Sala',
    type: 'light',
    status: false,
    category: 'Iluminación',
    image: 'https://via.placeholder.com/128?text=Luz+Sala',
    description: 'Luz LED inteligente para la sala',
    specs: { power: '10W', lumens: 800 },
  },
  {
    id: 'enchufe_1',
    name: 'Enchufe Cocina',
    type: 'plug',
    status: false,
    category: 'Enchufe Inteligente',

    image: 'https://via.placeholder.com/128?text=Enchufe+Cocina',
    description: 'Enchufe WiFi para la cocina',
    specs: { maxPower: '2000W', voltage: '220V' },
  },
];

export default devices;