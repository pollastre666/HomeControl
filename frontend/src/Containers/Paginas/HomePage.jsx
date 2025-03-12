
import { useEffect } from "react"
import Footer from '../../Componentes/Navigacion/Footer'
import Layout from "../../hocs/layouts/layout"
import Navbar from '../../Componentes/Navigacion/NavBar'

function Home() {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <Layout>
           <Navbar />
           
            <Footer />
        </Layout>
    )
}

export default Home
