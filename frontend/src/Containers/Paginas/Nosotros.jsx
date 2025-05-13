import { useEffect } from "react";
import Layout from "../../hocs/layouts/layout";
<<<<<<< HEAD

=======
import FeatureSection from "../../Componentes/Nosotros/FeatureSection";
<<<<<<< HEAD
>>>>>>> bc0e0e14238914bbff5a4bebb5af473930eb46e6
=======
import MissionStatement from "../../Componentes/Nosotros/MissionStatement";
import TeamShowcase from "../../Componentes/Nosotros/TeamShowcase";
import ValuePillars from "../../Componentes/Nosotros/ValuePillars";
//import ContactUsSection from "../../Componentes/Nosotros/ContactUsSection";
>>>>>>> Mohamed
function Nosotros() {
  useEffect(() => {
    window.scrollTo(0, 0); 
  }, []);

<<<<<<< HEAD
    return (
        <Layout>
<<<<<<< HEAD
            <p>Faltan componentes de la pagina</p>
=======
           <FeatureSection/>
>>>>>>> bc0e0e14238914bbff5a4bebb5af473930eb46e6
        </Layout>
    );
=======
  return (
    <Layout>
      <MissionStatement />
      <FeatureSection />
      <TeamShowcase />
      <ValuePillars />
      
    </Layout>
  );
>>>>>>> Mohamed
}

export default Nosotros;