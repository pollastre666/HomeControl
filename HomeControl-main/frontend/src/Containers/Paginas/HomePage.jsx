// src/Containers/Paginas/HomePage.jsx
import { useEffect } from "react";
import { Link } from "react-router-dom";
import HeroSection from "../../Componentes/Home/HeroSection "
import SeccionFeatures from "../../Componentes/Home/Fatures";
import Dividir from "../../Componentes/Home/div1";
import GallerySection from "../../Componentes/Home/SectionImg";
import FeaturedProducts from "../../Componentes/Home/FeaturedProducts";
import CallToActionBanner from "../../Componentes/Home/CallToActionBanner";
import StatsSection from "../../Componentes/Home/StatsSection";
import VirtualTourButton from "../../Componentes/Home/VirtualTourButton";
import EcoImpactVisualizer from "../../Componentes/Home/EcoImpactVisualizer";
import Testimonials from "../../Componentes/Home/Testimonials";
import VideoShowcase from "../../Componentes/Home/VideoShowcase";
import SmartHomeTimeline from "../../Componentes/Home/SmartHomeTimeline";
//import InteractiveDemo from "../../Componentes/Home/InteractiveDemo";

function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
<HeroSection />
      <Dividir />
      <SeccionFeatures />
      <VideoShowcase />
      <SmartHomeTimeline />
      <StatsSection />
      <EcoImpactVisualizer />
      <FeaturedProducts />
      <GallerySection />
      <Testimonials />
      <VirtualTourButton />
      <CallToActionBanner />
      <Dividir />
    </>
  );
}

export default Home;