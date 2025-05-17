import { componentData as estoresData } from '../Productos/Estores/estoresData';
import { componentData as accessControlData } from '../Productos/ControlDeAcceso/accessControlData';
import { componentData as automationHubData } from '../Productos/Automatizacion/automationHubData';
import { componentData as persianasData } from '../Productos/Persianas/persianasData';
import { componentData as smartHomeAutomationData } from '../Productos/SmartHomeAutomatismos/smartHomeAutomationData';
import { componentData as advancedSecurityData } from '../Productos/SeguridadAvanzada/advancedSecurityData';

// Combine all component data into a single object
export const allComponents = {
  ...estoresData,
  ...accessControlData,
  ...automationHubData,
  ...persianasData,
  ...smartHomeAutomationData,
  ...advancedSecurityData,
};

// Create an array of component options for dropdowns, including category metadata
export const componentOptions = Object.values(allComponents).map(component => ({
  id: component.id,
  name: component.name,
  description: component.description,
  image: component.image,
  price: component.price,
  specs: component.specs,
  category:
    component.id in estoresData ? 'Estores' :
    component.id in accessControlData ? 'Access Control' :
    component.id in automationHubData ? 'Automation Hub' :
    component.id in persianasData ? 'Persianas' :
    component.id in advancedSecurityData ? 'Advanced Security' :
    'Smart Home Automation',
}));