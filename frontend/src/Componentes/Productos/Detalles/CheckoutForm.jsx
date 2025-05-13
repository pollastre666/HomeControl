import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, User, CreditCard } from 'lucide-react';

// Variantes de animación
const formVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const inputVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.2 } },
  focus: { scale: 1.01, borderColor: '#d4af37', transition: { duration: 0.3 } },
  error: { borderColor: '#e11d48', transition: { duration: 0.3 } },
  success: { borderColor: '#10b981', transition: { duration: 0.3 } },
};

const buttonVariants = {
  hover: { scale: 1.05, boxShadow: '0px 8px 20px rgba(212, 175, 55, 0.3)', transition: { duration: 0.3 } },
  tap: { scale: 0.98, transition: { duration: 0.1 } },
};

const CheckoutForm = ({ component, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [holderName, setHolderName] = useState('');
  const [nameError, setNameError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setError(null);

    if (!stripe || !elements) {
      setError('Stripe no está inicializado. Intenta de nuevo.');
      setProcessing(false);
      return;
    }

    if (!holderName.trim()) {
      setNameError('El nombre del titular es obligatorio.');
      setProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      const response = await fetch('http://localhost:4242/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(component.price * 100), // En centavos
          currency: 'usd',
        }),
      });

      const { clientSecret } = await response.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name: holderName },
        },
      });

      if (result.error) {
        setError(result.error.message);
        setProcessing(false);
      } else if (result.paymentIntent.status === 'succeeded') {
        alert('¡Pago exitoso!');
        onClose();
      }
    } catch (err) {
      setError('Error al procesar el pago. Intenta de nuevo.');
      setProcessing(false);
    }
  };

  const handleCardChange = (event) => {
    setCardComplete(event.complete);
    if (event.error) {
      setError(event.error.message);
    } else {
      setError(null);
    }
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setHolderName(value);
    if (!value.trim()) {
      setNameError('El nombre del titular es obligatorio.');
    } else {
      setNameError('');
    }
  };

  return (
    <motion.div
      className="relative p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl max-w-lg w-full mx-auto overflow-hidden"
      variants={formVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Fondo con partículas doradas */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg className="w-full h-full">
          <defs>
            <filter id="glow">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {[...Array(10)].map((_, i) => (
            <circle
              key={i}
              cx={`${Math.random() * 100}%`}
              cy={`${Math.random() * 100}%`}
              r="2"
              fill="#d4af37"
              filter="url(#glow)"
              className="animate-pulse"
            />
          ))}
        </svg>
      </div>

      {/* Contenido del formulario */}
      <div className="relative z-10 space-y-8">
        {/* Título y descripción */}
        <div className="text-center">
          <h3 className="text-3xl font-serif font-semibold text-gray-100 tracking-wide">
            Finalizar Compra
          </h3>
          <p className="text-sm text-gray-400 mt-2">
            Completa tu compra de <span className="text-amber-400">{component.name}</span> con seguridad
          </p>
          <p className="text-lg font-bold text-amber-400 mt-1">
            Total: ${component.price} USD
          </p>
        </div>

        {/* Campo de nombre del titular */}
        <motion.div
          className="relative p-4 border-2 border-gray-700 rounded-lg bg-gray-800/50 backdrop-blur-sm"
          variants={inputVariants}
          initial="hidden"
          animate="visible"
          whileFocus="focus"
          whileHover="focus"
          custom={0}
        >
          <label className="flex items-center text-gray-300 text-sm font-medium mb-2">
            <User size={16} className="mr-2 text-amber-400" />
            Nombre y apellido del titular
          </label>
          <input
            type="text"
            value={holderName}
            onChange={handleNameChange}
            className="w-full p-3 bg-transparent border-0 text-gray-100 focus:ring-0 focus:outline-none placeholder-gray-500"
            placeholder="Ej. Juan Pérez"
          />
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-400 to-transparent transition-all duration-300" />
          <AnimatePresence>
            {nameError && (
              <motion.div
                className="flex items-center text-rose-600 text-sm mt-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <AlertCircle size={16} className="mr-1" />
                {nameError}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Campo de tarjeta */}
        <motion.div
          className="relative p-4 border-2 border-gray-700 rounded-lg bg-gray-800/50 backdrop-blur-sm"
          variants={inputVariants}
          initial="hidden"
          animate="visible"
          whileFocus="focus"
          whileHover="focus"
          custom={1}
        >
          <label className="flex items-center text-gray-300 text-sm font-medium mb-2">
            <CreditCard size={16} className="mr-2 text-amber-400" />
            Detalles de la tarjeta
          </label>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#e5e7eb',
                  '::placeholder': { color: '#6b7280' },
                  fontFamily: '"Inter", sans-serif',
                },
                invalid: { color: '#e11d48' },
              },
              hidePostalCode: true,
            }}
            onChange={handleCardChange}
            className="w-full p-3 bg-transparent"
          />
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-400 to-transparent transition-all duration-300" />
          <AnimatePresence>
            {error && (
              <motion.div
                className="flex items-center text-rose-600 text-sm mt-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <AlertCircle size={16} className="mr-1" />
                {error}
              </motion.div>
            )}
            {cardComplete && !error && (
              <motion.div
                className="flex items-center text-emerald-500 text-sm mt-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <CheckCircle size={16} className="mr-1" />
                Datos válidos
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-4">
          <motion.button
            type="submit"
            disabled={!stripe || !cardComplete || !!nameError || processing}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="relative w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-700 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg overflow-hidden group"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10">{processing ? 'Procesando...' : `Pagar $${component.price}`}</span>
          </motion.button>
          <motion.button
            onClick={onClose}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="w-full sm:w-auto bg-gray-700 text-gray-300 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-600 transition-colors duration-300"
          >
            Cancelar
          </motion.button>
        </div>

        {/* Nota de tarjeta de prueba */}
        <p className="text-center text-gray-500 text-xs">
          Usa la tarjeta de prueba: 4242 4242 4242 4242 (fecha futura, CVV cualquiera)
        </p>
      </div>

      {/* Estilo adicional */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.6; }
          }
          .animate-pulse {
            animation: pulse 3s ease-in-out infinite;
          }
        `}
      </style>
    </motion.div>
  );
};

export default CheckoutForm;