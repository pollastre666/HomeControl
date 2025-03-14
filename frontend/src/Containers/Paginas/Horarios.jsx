import { useEffect } from "react"
import Layout from "../../hocs/layouts/layout"
import DataTable from '../../Componentes/DataTable'

function Horarios() {
    useEffect(() => {
        window.scrollTo(0, 0); // Mueve el scroll al principio cuando se carga la página
    }, []);

    return (
        <Layout>
            <p/>
            <DataTable /> {/* Asegúrate de que DataTable esté recibiendo datos correctamente */}
        </Layout>
    );
}

export default Horarios;
