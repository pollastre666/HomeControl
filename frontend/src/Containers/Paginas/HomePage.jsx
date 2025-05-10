
import { useEffect } from "react"

import HeroSection from "../../Componentes/Home/HeroSection "
import SeccionFeatures from "../../Componentes/Home/Fatures";
import Dividir from "../../Componentes/Home/div1";
import GallerySection from "../../Componentes/Home/SectionImg";

function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {/* Sección Hero */}
      <HeroSection />

      {/* Primer Dividir */}
      <Dividir />

      {/* Sección de Características */}
      <SeccionFeatures />

      {/* Galería */}
      <GallerySection />

      {/* Segundo Dividir */}
      <Dividir />

      {/* Nota: No se incluye un footer aquí, debería estar solo en Layout.js */}
    </>
  );
}

export default Home;
