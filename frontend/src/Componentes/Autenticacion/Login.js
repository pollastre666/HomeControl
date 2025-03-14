import React, { useState } from 'react';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    usuario: '',
    contrasena: '',
    recordar: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica de autenticación
    console.log('Datos enviados:', formData);
  };

  return (
    <div className="bg-gray-100 flex justify-center items-center h-screen">
      {/* Sección de imagen */}
      <section className="w-1/2 h-screen hidden lg:block" aria-hidden="true">
        <img 
          src="https://img.freepik.com/foto-gratis/hombre-usando-tableta-su-casa-inteligente_23-2149036898.jpg?t=st=1741905175~exp=1741908775~hmac=bfcd211d203a49863c24afec5d23ec1ba528a94b20ac4af06d18b88026a98b53&w=1380" 
          alt="Imagen decorativa de fondo" 
          className="object-cover w-full h-full"
          loading="lazy"
        />
      </section>

      {/* Sección de formulario */}
      <main className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
      <h1 className="text-2xl bg-[#0E3BB0] font-semibold mb-4 border-2 border-[#0E3BB0] p-4">
    Inicio de sesión
</h1>
        
        <form onSubmit={handleSubmit} role="form">
          {/* Campo de usuario */}
          <div className="mb-4">
            <label htmlFor="usuario" className="block text-gray-600">
              Nombre de usuario
            </label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              value={formData.usuario}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Campo de contraseña */}
          <div className="mb-4">
            <label htmlFor="contrasena" className="block text-gray-600">
              Contraseña
            </label>
            <input
              type="password"
              id="contrasena"
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Recordar sesión */}
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="recordar"
              name="recordar"
              checked={formData.recordar}
              onChange={handleChange}
              className="text-blue-500"
              role="checkbox"
            />
            <label htmlFor="recordar" className="text-gray-600 ml-2">
              Recordar sesión
            </label>
          </div>

          {/* Enlace de recuperación */}
          <div className="mb-6 text-blue-500">
            <a href="#" className="hover:underline" role="link">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {/* Botón de envío */}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
            role="button"
          >
            Iniciar sesión
          </button>
        </form>

        {/* Enlace de registro */}
        <div className="mt-6 text-blue-500 text-center">
          <a href="#" className="hover:underline" role="link">
            Regístrate aquí
          </a>
        </div>
      </main>
    </div>
  );
};

export default LoginForm;