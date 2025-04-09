
import { useEffect } from "react"
import Layout from "../../hocs/layouts/layout"
import HeroSection from "../../Componentes/Home/HeroSection "
import SeccionFeatures from "../../Componentes/Home/Fatures"
import Dividir from "../../Componentes/Home/div1"

function Home() {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <Layout>
            <HeroSection />
        <Dividir />
        
        <SeccionFeatures />
        <Dividir />
        </Layout>
    )
}

export default Home
