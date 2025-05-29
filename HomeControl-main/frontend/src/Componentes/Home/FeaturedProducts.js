import { componentData as smartHomeAutomationData } from '../../Componentes/Productos/SmartHomeAutomatismos/smartHomeAutomationData';
import { Link } from 'react-router-dom';

const FeaturedProducts = () => (
  <section className="py-8 sm:py-12 lg:py-16">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-700 mb-6 sm:mb-8 lg:mb-10">Productos Destacados</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
        {Object.values(smartHomeAutomationData).slice(0, 3).map(product => (
          <div key={product.id} className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <img src={product.image} alt={product.name} className="w-full h-40 sm:h-48 lg:h-56 object-cover rounded-md" />
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold mt-3 sm:mt-4">{product.name}</h3>
            <Link to={`/components/${product.id}`} className="text-amber-600 hover:underline text-sm sm:text-base">Ver más</Link>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturedProducts;