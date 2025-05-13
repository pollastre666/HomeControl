import { componentData as smartHomeAutomationData } from '../../Componentes/Productos/SmartHomeAutomatismos/smartHomeAutomationData';
import { Link } from 'react-router-dom'; // Add this import

const FeaturedProducts = () => (
  <section className="py-12">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-amber-700 mb-6">Productos Destacados</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.values(smartHomeAutomationData).slice(0, 3).map(product => (
          <div key={product.id} className="bg-white p-4 rounded-lg shadow">
            <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
            <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
            <Link to={`/components/${product.id}`} className="text-amber-600 hover:underline">Ver más</Link>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturedProducts;