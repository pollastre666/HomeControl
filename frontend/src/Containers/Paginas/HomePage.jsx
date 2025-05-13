
import { useEffect } from "react"
import Layout from "../../hocs/layouts/layout"
import HeroSection from "../../Componentes/Home/HeroSection "
import SeccionFeatures from "../../Componentes/Home/Fatures"
import Dividir from "../../Componentes/Home/div1"
<<<<<<< HEAD

=======
import GallerySection from "../../Componentes/Home/SectionImg"
>>>>>>> bc0e0e14238914bbff5a4bebb5af473930eb46e6
function Home() {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <Layout>
            <HeroSection />
        <Dividir />
        
        <SeccionFeatures />
<<<<<<< HEAD
=======
        <GallerySection />
   
>>>>>>> bc0e0e14238914bbff5a4bebb5af473930eb46e6
        <Dividir />
        </Layout>
    )
}

export default Home
