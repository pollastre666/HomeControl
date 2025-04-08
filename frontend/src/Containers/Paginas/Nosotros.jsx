import { useEffect } from "react";
import Layout from "../../hocs/layouts/layout";

function Nosotros() {
    useEffect(() => {
        window.scrollTo(0, 0); // Mueve el scroll al principio cuando se carga la página
    }, []);

    return (
        <Layout>
            <p>Faltan componentes de la pagina</p>
        </Layout>
    );
}

export default Nosotros;

