
import { useEffect } from "react"
import Layout from "../../hocs/layouts/layout"
import HeroSection from "../../Componentes/Home/HeroSection "
import SeccionFeatures from "../../Componentes/Home/Fatures"
import Dividir from "../../Componentes/Home/div1"
import GallerySection from "../../Componentes/Home/SectionImg"
function Home() {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <Layout>
            <HeroSection />
        <Dividir />
        
        <SeccionFeatures />
        <GallerySection />
   
        <Dividir />
        </Layout>
    )
}

export default Home
