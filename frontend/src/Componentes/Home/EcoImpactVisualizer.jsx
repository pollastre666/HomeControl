import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const EcoImpactVisualizer = ({ co2Reduced = '5,000t' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Canvas 2D context not supported');
      return;
    }

    const updateCanvasSize = () => {
      const container = canvas.parentElement;
      canvas.width = Math.min(container.clientWidth - 32, 600); // Max 600px
      canvas.height = canvas.width / 2;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, 'rgba(245, 158, 66, 0.8)');
      gradient.addColorStop(1, 'rgba(251, 191, 36, 0.5)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(width * 0.125, height - 50);
      ctx.quadraticCurveTo(width * 0.375, height - 150, width * 0.625, height - 50);
      ctx.lineTo(width * 0.625, height);
      ctx.lineTo(width * 0.125, height);
      ctx.fill();

      ctx.fillStyle = 'white';
      ctx.font = `bold ${clamp(12, width * 0.05, 16)}px Arial`;
      ctx.fillText(`CO2 Reducido: ${co2Reduced}`, width * 0.125, 30);
    };

    draw();

    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [co2Reduced]);

  const clamp = (min, val, max) => Math.min(Math.max(val, min), max);

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-amber-700 mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Impacto Ecológico
        </motion.h2>
        <motion.canvas
          ref={canvasRef}
          className="mx-auto border-2 border-amber-200 rounded-lg shadow-md w-full max-w-[600px]"
          aria-label={`Visualización de impacto ecológico: CO2 reducido ${co2Reduced}`}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />
        <p className="mt-4 text-sm sm:text-base lg:text-lg text-gray-600">Nuestras soluciones ahorran miles de toneladas de CO2 anualmente.</p>
      </div>
    </section>
  );
};

export default EcoImpactVisualizer;