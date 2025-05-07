import React, { useState } from 'react';

function ContactBanner() {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const handleContactClick = () => {
    alert('Redirigiendo al formulario de contacto...');
    // Uncomment to redirect
    // window.location.href = '/contacto';
  };

  return (
    <div
      className="relative bg-cover bg-center h-80 sm:h-96 flex items-center justify-end px-6 sm:px-12 rounded-xl shadow-2xl overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.2)), url('https://media.istockphoto.com/id/2177743104/es/foto/una-mujer-de-negocios-vestida-de-traje-llama-a-un-cliente-por-tel%C3%A9fono-mientras-est%C3%A1-en-el.jpg?s=2048x2048&w=is&k=20&c=OWjKgEUiN_bHlZI4XG6nsS3Cobyw7g3GgGMDUSsC6fM=')",
        backgroundPosition: isHovered ? 'center 60%' : 'center 50%',
        transition: 'background-position 0.5s ease-in-out',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center space-x-4 sm:space-x-6 z-10">
        <div
          className={`relative w-12 h-12 sm:w-16 sm:h-16 bg-yellow-400 rounded-full border-4 border-white flex items-center justify-center transform transition-all duration-300 ${
            isHovered ? 'scale-110 rotate-12' : ''
          }`}
        >
 
        </div>
        <div className="flex flex-col space-y-3 sm:space-y-4">


        </div>
      </div>
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
}

export default ContactBanner;