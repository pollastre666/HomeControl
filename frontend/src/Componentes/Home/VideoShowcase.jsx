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

  // Datos de los videos (orden invertido: izquierda a derecha)
  const videos = [
    {
      id: 1,
      title: 'Disfruta de pausas refrescantes',
      description: 'Make the move - Disfruta de pausas refrescantes',
      youtubeId: 'EeRDJo62KbE', // Placeholder, reemplaza con ID real
      image: 'https://img.youtube.com/vi/EeRDJo62KbE/hqdefault.jpg', // Miniatura real de YouTube
    },
    {
      id: 2,
      title: 'Despierta dulcemente',
      description: 'Make the move - Despierta dulcemente',
      youtubeId: 'EeRDJo62KbE', // Placeholder, reemplaza con ID real
      image: 'https://img.youtube.com/vi/EeRDJo62KbE/hqdefault.jpg', // Miniatura real de YouTube
    },
    {
      id: 3,
      title: 'Conserva tu privacidad',
      description: 'Make the move - Conserva tu privacidad',
      youtubeId: 'EeRDJo62KbE', // Placeholder, reemplaza con ID real
      image: 'https://img.youtube.com/vi/EeRDJo62KbE/hqdefault.jpg', // Miniatura real de YouTube
    },
  ];

  if (isLoading) return <div className="text-center text-amber-800">Cargando...</div>;
  if (error) return <div className="text-center text-red-700">{error}</div>;

  return (
    <section className="py-24 bg-gradient-to-br from-amber-50 to-amber-200 overflow-hidden">
      <div className="container mx-auto px-6 text-center">
        <motion.h2
          className="text-4xl md:text-6xl font-bold text-amber-800 mb-16 tracking-wider"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          Explora la Innovación de HomeControl
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {videos.map((video) => (
            <motion.div
              key={video.id}
              className="relative group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              onClick={() => openModal(video)}
            >
              {/* Portada del video con efecto futurista */}
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
                    top: '12px',
                    right: '12px',
                    width: '90px',
                    height: '35px',
                    pointerEvents: 'none',
                    borderRadius: '6px',
                  }}
                />
                {/* Botón VER VIDEO con efecto hover */}
                <motion.div
                  className="absolute inset-0 bg-black bg-opacity-0 flex items-center justify-center transition-all duration-300 group-hover:bg-opacity-40"
                  whileHover={{ scale: 1.1 }}
                >
                  <span className="text-white font-semibold text-lg py-2 px-6 rounded-full bg-amber-600 shadow-lg hover:bg-amber-700 transition-colors">
                    VER VIDEO
                  </span>
                </motion.div>
              </div>
              <p className="mt-4 text-gray-600 text-base md:text-lg font-medium">{video.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Modal para reproducir el video */}
        {isModalOpen && selectedVideo && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={closeModal}
          >
            <motion.div
              className="relative bg-gray-900 rounded-2xl shadow-2xl max-w-5xl w-full aspect-video border-4 border-amber-200"
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
                  top: '12px',
                  right: '12px',
                  width: '90px',
                  height: '35px',
                  pointerEvents: 'none',
                  borderRadius: '6px',
                }}
              />
              <motion.button
                onClick={closeModal}
                className="absolute top-6 right-6 text-white bg-amber-600 rounded-full w-12 h-12 flex items-center justify-center hover:bg-amber-700 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Cerrar video"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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