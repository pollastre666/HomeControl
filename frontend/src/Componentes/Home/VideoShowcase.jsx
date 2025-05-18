
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import FocusTrap from 'focus-trap-react';

// Animation variants
const videoCardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: 'easeOut' },
  }),
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

const iframeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, delay: 0.2 } },
};

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

  // Abrir y cerrar modal
  const openModal = (video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  const videos = [
    {
      id: 1,
      title: 'Disfruta de pausas refrescantes',
      description: 'Make the move - Disfruta de pausas refrescantes',
      youtubeId: 'EeRDJo62KbE',
      image: 'https://img.youtube.com/vi/EeRDJo62KbE/hqdefault.jpg',
    },
    {
      id: 2,
      title: 'Despierta dulcemente',
      description: 'Make the move - Despierta dulcemente',
      youtubeId: 'EeRDJo62KbE',
      image: 'https://img.youtube.com/vi/Ed_-5qlI4vY/hqdefault.jpg',
    },
    {
      id: 3,
      title: 'Conserva tu privacidad',
      description: 'Make the move - Conserva tu privacidad',
      youtubeId: 'EeRDJo62KbE',
      image: 'https://img.youtube.com/vi/EeRDJo62KbE/hqdefault.jpg',
    },
    {
      id: 4,
      title: 'Transforma tu hogar',
      description: 'Make the move - Descubre la innovación de HomeControl',
      youtubeId: 'Ed_-5qlI4vY',
      image: 'https://img.youtube.com/vi/Ed_-5qlI4vY/hqdefault.jpg',
    },
  ];

  if (isLoading) return <div className="text-center text-amber-800 text-lg">Cargando...</div>;
  if (error) return <div className="text-center text-red-600 text-lg">{error}</div>;

  return (
    <section
      className="py-20 bg-gradient-to-br from-amber-50 to-amber-100 overflow-hidden"
      aria-label="Video Showcase"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          className="text-3xl sm:text-4xl font-extrabold text-amber-800 mb-12 tracking-tight"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          Explora la Innovación de HomeControl
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {videos.map((video, index) => (
            <motion.article
              key={video.id}
              className="relative group cursor-pointer bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-amber-200/50 overflow-hidden"
              variants={videoCardVariants}
              custom={index}
              initial="hidden"
              whileInView="visible"
              whileHover={{ scale: 1.05, boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)' }}
              viewport={{ once: true }}
              onClick={() => openModal(video)}
              role="button"
              aria-labelledby={`video-title-${video.id}`}
            >
              <div
                className="w-full h-0 pb-[56.25%] bg-gray-300 rounded-t-2xl overflow-hidden border-b-2 border-amber-200 transition-all duration-300 group-hover:border-amber-600"
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
                    width: 'clamp(80px, 15vw, 90px)',
                    height: 'clamp(30px, 5vw, 35px)',
                    pointerEvents: 'none',
                    borderRadius: '6px',
                  }}
                />
                {/* Botón VER VIDEO */}
                <motion.div
                  className="absolute inset-0 bg-black bg-opacity-0 flex items-center justify-center transition-all duration-300 group-hover:bg-opacity-40"
                  whileHover={{ scale: 1.1 }}
                >
                  <span className="text-white font-semibold text-sm sm:text-base px-4 sm:px-6 py-2 rounded-full bg-amber-500 shadow-lg hover:bg-amber-600 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
                    VER VIDEO
                  </span>
                </motion.div>
              </div>
              <div className="p-4">
                <h3 id={`video-title-${video.id}`} className="text-lg font-semibold text-amber-800">
                  {video.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">{video.description}</p>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Modal para reproducir el video */}
        {isModalOpen && selectedVideo && (
          <FocusTrap>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 sm:p-6"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={modalVariants}
              onClick={closeModal}
              role="dialog"
              aria-labelledby="video-modal-title"
            >
              <motion.div
                className="relative bg-gray-900 rounded-2xl shadow-2xl w-full max-w-full sm:max-w-4xl lg:max-w-5xl aspect-video border-4 border-amber-200"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&modestbranding=1&rel=0`}
                  title={selectedVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-2xl"
                  variants={iframeVariants}
                  initial="hidden"
                  animate="visible"
                />
                {/* Overlay para cubrir la marca de agua */}
                <div
                  className="absolute bg-amber-100 opacity-90"
                  style={{
                    top: '8px',
                    right: '8px',
                    width: 'clamp(80px, 15vw, 90px)',
                    height: 'clamp(30px, 5vw, 35px)',
                    pointerEvents: 'none',
                    borderRadius: '6px',
                  }}
                />
                <motion.button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-white bg-amber-500 rounded-full w-10 h-10 flex items-center justify-center hover:bg-amber-600 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Cerrar video"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </motion.div>
            </motion.div>
          </FocusTrap>
        )}
      </div>
    </section>
  );
};

export default React.memo(VideoShowcase);
