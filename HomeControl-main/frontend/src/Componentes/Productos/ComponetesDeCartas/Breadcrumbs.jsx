import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Mapear rutas a nombres más amigables
  const pathNamesMap = {
    components: 'Componentes',
    'advanced-security': 'Seguridad Avanzada',
    persianas: 'Persianas',
    estores: 'Estores',
    'automation-hub': 'Automatización',
    'access-control': 'Control de Acceso',
    'smart-home-automation': 'Automatización del Hogar',
    lamas: 'Lamas',
    cajon: 'Cajón',
    eje: 'Eje',
    motor: 'Motor',
    guias: 'Guías',
    control: 'Control',
    camera: 'Cámara',
    'alarm-system': 'Sistema de Alarma',
    'motion-detector': 'Detector de Movimiento',
    'smart-lock': 'Cerradura Inteligente',
    'control-app': 'App de Control',
    'notification-system': 'Sistema de Notificaciones',
  };

  // Determinar la categoría basada en el segundo segmento de la URL
  const categoryPath = pathnames[0] === 'components' && pathnames[1] ? pathnames[0] : null;
  const componentId = pathnames[1]; // e.g., 'lamas', 'control-app'

  // Construir las migas de pan
  const crumbs = [];
  crumbs.push({ name: 'Inicio', path: '/' });

  if (categoryPath) {
    if (pathnames[0] === 'components') {
      // Determinar la categoría según el componentId
      const componentCategories = {
        lamas: 'persianas',
        cajon: 'persianas',
        eje: 'persianas',
        motor: 'persianas',
        guias: 'persianas',
        control: 'persianas',
        camera: 'advanced-security',
        'alarm-system': 'advanced-security',
        'motion-detector': 'advanced-security',
        'smart-lock': 'advanced-security',
        'control-app': 'advanced-security',
        'notification-system': 'advanced-security',
        // Agregar más mapeos según sea necesario
      };

      const category = componentCategories[componentId] || 'components';
      crumbs.push({ name: pathNamesMap[category] || category, path: `/${category}` });
      crumbs.push({ name: pathNamesMap[componentId] || componentId, path: location.pathname });
    } else {
      crumbs.push({ name: pathNamesMap[pathnames[0]] || pathnames[0], path: `/${pathnames[0]}` });
    }
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 mb-6">
      {crumbs.map((crumb, index) => (
        <React.Fragment key={crumb.path}>
          {index > 0 && <ChevronRight size={16} className="text-gray-400" />}
          {index === crumbs.length - 1 ? (
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {crumb.name}
            </span>
          ) : (
            <Link
              to={crumb.path}
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200"
            >
              {crumb.name}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;