
import { useEffect } from "react"
import Layout from "../../hocs/layouts/layout"
import HeroSection from "../../Componentes/Home/HeroSection "
import SeccionFeatures from "../../Componentes/Home/Fatures"
function Home() {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <Layout>

           
        <HeroSection />
        <SeccionFeatures />
        </Layout>
    )
}

export default Home
