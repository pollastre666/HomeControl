import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const VideoShowcase = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simular carga de datos
  useEffect(() => {
    const loadData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsLoading(false);
      } catch (err) {
        setError('Error al cargar los videos');
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Abrir modal y establecer el video seleccionado
  const openModal = (video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };
  // Cerrar modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  // Datos de los videos (actualizados con IDs reales si es posible)
  const videos = [
    {
      id: 1,
      title: 'Disfruta de pausas refrescantes',
      description: 'Make the move - Disfruta de pausas refrescantes',
      youtubeId: 'EeRDJo62KbE', // Placeholder, reemplaza con ID real
      image: 'https://img.youtube.com/vi/EeRDJo62KbE/hqdefault.jpg',
    },
    {
      id: 2,
      title: 'Despierta dulcemente',
      description: 'Make the move - Despierta dulcemente',
      youtubeId: 'EeRDJo62KbE', // Placeholder, reemplaza con ID real
      image: 'https://img.youtube.com/vi/EeRDJo62KbE/hqdefault.jpg',
    },
    {
      id: 3,
      title: 'Conserva tu privacidad',
      description: 'Make the move - Conserva tu privacidad',
      youtubeId: 'EeRDJo62KbE', // Placeholder, reemplaza con ID real
      image: 'https://img.youtube.com/vi/EeRDJo62KbE/hqdefault.jpg',
    },
  ];

  if (isLoading) return <div className="text-center text-amber-800 text-sm sm:text-base">Cargando...</div>;
  if (error) return <div className="text-center text-red-700 text-sm sm:text-base">{error}</div>;

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-amber-50 to-amber-200 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-800 mb-8 sm:mb-10 lg:mb-12 tracking-wider"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          Explora la Innovación de HomeControl
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 max-w-6xl mx-auto">
          {videos.map((video) => (
            <motion.div
              key={video.id}
              className="relative group cursor-pointer"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              onClick={() => openModal(video)}
              role="button"
              aria-label={`Ver video: ${video.title}`}
            >
              {/* Portada del video */}
              <div
                className="w-full h-0 pb-[56.25%] bg-gray-300 rounded-2xl overflow-hidden border-2 border-amber-200 transition-all duration-300 group-hover:border-amber-600"
                style={{
                  backgroundImage: `url(${video.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {/* Overlay para cubrir la marca de agua */}
                <div
                  className="absolute bg-amber-100 opacity-90"
                  style={{
                    top: '8px',
                    right: '8px',
                    width: 'clamp(70px, 15vw, 80px)',
                    height: 'clamp(25px, 5vw, 30px)',
                    pointerEvents: 'none',
                    borderRadius: '6px',
                  }}
                />
                {/* Botón VER VIDEO */}
                <motion.div
                  className="absolute inset-0 bg-black bg-opacity-0 flex items-center justify-center transition-all duration-300 group-hover:bg-opacity-40"
                  whileHover={{ scale: 1.1 }}
                >
                  <span className="text-white font-semibold text-sm sm:text-base px-4 sm:px-6 py-2 rounded-full bg-amber-600 shadow-lg hover:bg-amber-700 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
                    VER VIDEO
                  </span>
                </motion.div>
              </div>
              <p className="mt-3 sm:mt-4 text-gray-600 text-sm sm:text-base lg:text-lg font-medium">{video.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Modal para reproducir el video */}
        {isModalOpen && selectedVideo && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={closeModal}
            role="dialog"
            aria-labelledby="video-modal-title"
          >
            <motion.div
              className="relative bg-gray-900 rounded-2xl shadow-2xl w-full max-w-[90%] sm:max-w-4xl lg:max-w-5xl aspect-video border-4 border-amber-200"
              initial={{ scale: 0.8, y: 60 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 60 }}
              transition={{ duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&modestbranding=1&rel=0`}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-2xl"
              />
              {/* Overlay en la modal */}
              <div
                className="absolute bg-amber-100 opacity-90"
                style={{
                  top: '8px',
                  right: '8px',
                  width: 'clamp(70px, 15vw, 80px)',
                  height: 'clamp(25px, 5vw, 30px)',
                  pointerEvents: 'none',
                  borderRadius: '6px',
                }}
              />
              <motion.button
                onClick={closeModal}
                className="absolute top-4 sm:top-6 right-4 sm:right-6 text-white bg-amber-600 rounded-full w-10 sm:w-12 h-10 sm:h-12 flex items-center justify-center hover:bg-amber-700 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Cerrar video"
              >
                <svg className="w-5 sm:w-6 h-5 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default VideoShowcase;