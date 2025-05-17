import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../Autenticacion/AuthProvider'; // Adjust path if necessary
import { Link } from 'react-router-dom'; // For login redirect (optional)
import CheckoutForm from './CheckoutForm';

// Animation variants for the modal
const modalVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } },
};

/**
 * CheckoutModal Component
 * Displays a modal for payment processing, restricted to authenticated users.
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Callback to close the modal
 * @param {object} component - Product details for purchase
 */
const CheckoutModal = ({ isOpen, onClose, component }) => {
  const { user } = useAuth();

  console.log('CheckoutModal: User:', user); // Debug log for user object

  // Do not render if modal is closed
  if (!isOpen) return null;

  // Handle unauthenticated user
  if (!user) {
    return (
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-90 z-[1000] flex items-center justify-center p-6"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={modalVariants}
      >
        <div className="bg-white/95 dark:bg-gray-800/95 rounded-2xl p-6 sm:p-8 shadow-2xl max-w-md w-full text-center border border-amber-200/40 dark:border-amber-900/40 backdrop-blur-md">
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Autenticación Requerida
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Debes iniciar sesión para realizar una compra. Por favor,{' '}
            <Link
              to="/login"
              className="text-amber-600 dark:text-amber-400 hover:underline font-medium"
              onClick={onClose}
            >
              inicia sesión
            </Link>{' '}o regístrate.
          </p>
          <motion.button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-amber-600 to-amber-700 dark:from-amber-500 dark:to-amber-600 text-white rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all duration-300 shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cerrar
          </motion.button>
        </div>
      </motion.div>
    );
  }

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
        className="relative bg-white/95 dark:bg-gray-800/95 rounded-2xl shadow-2xl max-w-lg w-full p-0 overflow-hidden border border-amber-200/40 dark:border-amber-900/40 backdrop-blur-md"
        onClick={(e) => e.stopPropagation()}
      >
        <CheckoutForm component={component} onClose={onClose} user={user} />
      </motion.div>
    </motion.div>
  );
};

export default CheckoutModal;