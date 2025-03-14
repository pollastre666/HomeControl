
import { useEffect } from "react"
import Footer from '../../Componentes/Navigacion/Footer'
import Layout from "../../hocs/layouts/layout"
import Navbar from '../../Componentes/Navigacion/NavBar'
import DataTable from '../../Componentes/DataTable'
function Horarios() {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <Layout>
           <Navbar />
              <DataTable />
            <Footer />
        </Layout>
    )
}

export default Horarios
