import React, { useEffect } from 'react'
import Layout from "../../hocs/layouts/layout"

function Asistencia() {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <Layout>
            <p>Faltan Componentes </p>
        </Layout>
    )
}

export default Asistencia