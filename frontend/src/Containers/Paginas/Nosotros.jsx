import { useEffect } from "react";
import Layout from "../../hocs/layouts/layout";
<<<<<<< HEAD

=======
import FeatureSection from "../../Componentes/Nosotros/FeatureSection";
>>>>>>> bc0e0e14238914bbff5a4bebb5af473930eb46e6
function Nosotros() {
    useEffect(() => {
        window.scrollTo(0, 0); // Mueve el scroll al principio cuando se carga la página
    }, []);

    return (
        <Layout>
<<<<<<< HEAD
            <p>Faltan componentes de la pagina</p>
=======
           <FeatureSection/>
>>>>>>> bc0e0e14238914bbff5a4bebb5af473930eb46e6
        </Layout>
    );
}

export default Nosotros;

