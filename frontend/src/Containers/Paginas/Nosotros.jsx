import { useEffect } from "react";
import Layout from "../../hocs/layouts/layout";
import FeatureSection from "../../Componentes/Nosotros/FeatureSection";
function Nosotros() {
    useEffect(() => {
        window.scrollTo(0, 0); // Mueve el scroll al principio cuando se carga la página
    }, []);

    return (
        <Layout>
           <FeatureSection/>
        </Layout>
    );
}

export default Nosotros;

