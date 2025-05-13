import React from 'react';
import { motion } from 'framer-motion';
import CheckoutForm from './CheckoutForm';

// Variantes de animación para el modal
const modalVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } },
};

const CheckoutModal = ({ isOpen, onClose, component }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-90 z-[1000] flex items-center justify-center p-6"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={modalVariants}
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-transparent pointer-events-none"></div>
      <motion.div
        className="relative rounded-2xl shadow-2xl max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <CheckoutForm component={component} onClose={onClose} />
      </motion.div>
    </motion.div>
  );
};

export default CheckoutModal;