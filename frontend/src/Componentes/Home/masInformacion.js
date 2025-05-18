import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { toast } from 'react-toastify';

const MasInformacion = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false); // Estado para la carga de la imagen

  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 800], [0, -100]);

  // Manejo de la carga de la imagen
  useEffect(() => {
    const img = new Image();
    img.src = 'https://www.somfy.es/common/img/library///2000x600_cover/port-enery-winter.jpg';
    img.onload = () => setIsImageLoaded(true);
    img.onerror = () => setIsImageLoaded(true); // Si falla, mostramos el componente sin la imagen
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    const { name, email, message } = formData;

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Por favor, completa todos los campos.');
      toast.error('Por favor, completa todos los campos.');
      setIsSubmitting(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Formato de correo inválido.');
      toast.error('Formato de correo inválido.');
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('Solicitud enviada:', { name, email, message });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess(true);
      toast.success('Solicitud enviada con éxito. Te contactaremos pronto.');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('Error al enviar la solicitud:', err);
      setError('Hubo un error al enviar tu solicitud. Por favor, inténtalo de nuevo.');
      toast.error('Hubo un error al enviar tu solicitud. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-light-100 via-light-50 to-amber-100 dark:from-dark-900 dark:via-dark-800 dark:to-amber-900/20 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-12 overflow-hidden">
      {/* Fondo con efecto parallax */}
      {isImageLoaded ? (
        <motion.div
          className="absolute inset-0 -z-10 bg-cover bg-center opacity-10"
          style={{
            backgroundImage: `url('https://www.somfy.es/common/img/library///2000x600_cover/port-enery-winter.jpg')`,
            y: parallaxY,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 0.5 }}
        />
      ) : (
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-amber-200/20 to-amber-100/20 dark:from-amber-800/10 dark:to-amber-600/10" />
      )}

      {/* Efecto decorativo superior */}
      <div className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl h-96">
        <div
          className="relative aspect-[1155/678] w-full bg-gradient-to-tr from-amber-200 to-amber-500 opacity-20 dark:from-amber-800/50 dark:to-amber-600/50"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      {/* Indicador de carga inicial */}
      {!isImageLoaded ? (
        <div className="flex flex-col items-center justify-center h-full">
          <svg
            className="animate-spin h-8 w-8 text-amber-500 dark:text-amber-400 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="text-dark-600 dark:text-light-300 text-sm sm:text-base">Cargando...</p>
        </div>
      ) : (
        <>
          <motion.h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-dark-900 dark:text-light-100 mb-10 sm:mb-12 lg:mb-16 text-center drop-shadow-lg"
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            viewport={{ once: true }}
          >
            Contáctanos
          </motion.h2>
          <motion.div
            className="w-full max-w-md sm:max-w-lg lg:max-w-xl bg-light-50/90 dark:bg-dark-800/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-xl border border-amber-200/50 dark:border-amber-700/50"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {success ? (
              <motion.div
                className="text-center space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-amber-600 dark:text-amber-400 font-semibold text-base sm:text-lg lg:text-xl">
                  ¡Solicitud enviada con éxito!
                </p>
                <p className="text-dark-600 dark:text-light-300 text-sm sm:text-base lg:text-lg">
                  Gracias por contactarnos. Te responderemos pronto.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="inline-block px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 bg-amber-100/50 dark:bg-amber-900/30 rounded-lg hover:bg-amber-200/50 dark:hover:bg-amber-800/50 transition-all duration-300"
                >
                  Enviar otra solicitud
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <label htmlFor="name" className="block text-sm sm:text-base font-medium text-dark-700 dark:text-light-200 mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-light-50 dark:bg-dark-700 border border-dark-300 dark:border-dark-500 rounded-lg text-dark-900 dark:text-light-100 placeholder-dark-400 dark:placeholder-light-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm sm:text-base transition-all duration-300"
                    placeholder="Ingresa tu nombre"
                    disabled={isSubmitting}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <label htmlFor="email" className="block text-sm sm:text-base font-medium text-dark-700 dark:text-light-200 mb-2">
                    Correo
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-light-50 dark:bg-dark-700 border border-dark-300 dark:border-dark-500 rounded-lg text-dark-900 dark:text-light-100 placeholder-dark-400 dark:placeholder-light-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm sm:text-base transition-all duration-300"
                    placeholder="Ingresa tu correo"
                    disabled={isSubmitting}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  <label htmlFor="message" className="block text-sm sm:text-base font-medium text-dark-700 dark:text-light-200 mb-2">
                    Mensaje
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-light-50 dark:bg-dark-700 border border-dark-300 dark:border-dark-500 rounded-lg text-dark-900 dark:text-light-100 placeholder-dark-400 dark:placeholder-light-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm sm:text-base resize-none transition-all duration-300"
                    placeholder="¿Qué información te gustaría recibir?"
                    disabled={isSubmitting}
                  />
                </motion.div>
                {error && (
                  <motion.p
                    className="text-secondary-500 dark:text-secondary-400 text-sm sm:text-base text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {error}
                  </motion.p>
                )}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex justify-center py-2 sm:py-3 px-4 sm:px-6 rounded-lg text-sm sm:text-base font-semibold text-light-50 dark:text-dark-50 ${
                    isSubmitting
                      ? 'bg-amber-400/50 cursor-not-allowed'
                      : 'bg-amber-600 dark:bg-amber-500 hover:bg-amber-700 dark:hover:bg-amber-600'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 shadow-button hover:shadow-hover transition-all duration-300`}
                  whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  viewport={{ once: true }}
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <svg
                        className="animate-spin h-5 w-5 text-light-50 dark:text-dark-50"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Enviando...</span>
                    </div>
                  ) : (
                    'Enviar Solicitud'
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>
          <div className="absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl h-96">
            <div
              className="relative aspect-[1155/678] w-full bg-gradient-to-tr from-amber-200 to-amber-500 opacity-20 dark:from-amber-800/50 dark:to-amber-600/50"
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
            />
          </div>
        </>
      )}
    </section>
  );
};

export default MasInformacion;