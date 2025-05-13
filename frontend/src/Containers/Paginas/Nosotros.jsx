import { useEffect } from "react";
import Layout from "../../hocs/layouts/layout";
import FeatureSection from "../../Componentes/Nosotros/FeatureSection";
import MissionStatement from "../../Componentes/Nosotros/MissionStatement";
import TeamShowcase from "../../Componentes/Nosotros/TeamShowcase";
import ValuePillars from "../../Componentes/Nosotros/ValuePillars";
//import ContactUsSection from "../../Componentes/Nosotros/ContactUsSection";
function Nosotros() {
  useEffect(() => {
    window.scrollTo(0, 0); 
  }, []);

  return (
    <Layout>
      <MissionStatement />
      <FeatureSection />
      <TeamShowcase />
      <ValuePillars />
      
    </Layout>
  );
}

export default Nosotros;