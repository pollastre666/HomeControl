import React, { useEffect } from 'react';
import ContactBanner from './Componentes/banner';
import SupportCards from './Componentes/CartasSoporte';

function Contacto() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Banner de contacto */}
            <ContactBanner />

            {/* Título y descripción de contacto */}
            <div className="flex flex-col items-center justify-center py-10">
                <h1 className="text-3xl font-bold text-gray-800">Contáctanos</h1>
                <p className="mt-4 text-lg text-gray-600">Estamos aquí para ayudarte. Completa el formulario y nos pondremos en contacto contigo.</p>
            </div> 

            {/* Cartas de soporte */}
            <SupportCards />
        </div>
    );
}

export default Contacto;
