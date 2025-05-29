import React, { useState, useCallback } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, User, CreditCard } from 'lucide-react';
import { db } from '../../../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; // Firestore functions
import { toast } from 'react-toastify'; // For user feedback

// Animation variants (unchanged)
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

const CheckoutForm = ({ component, onClose, user }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [holderName, setHolderName] = useState('');
  const [nameError, setNameError] = useState('');

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      console.log('Payment submission started. User:', user?.uid, 'Stripe:', !!stripe, 'Elements:', !!elements);

      setProcessing(true);
      setError(null);

      // Validate Stripe initialization
      if (!stripe || !elements) {
        setError('Stripe no está inicializado. Por favor, recarga la página.');
        setProcessing(false);
        console.error('Stripe or Elements not initialized');
        return;
      }

      // Validate user authentication
      if (!user) {
        setError('Debes estar autenticado para realizar la compra. Inicia sesión.');
        setProcessing(false);
        console.error('User not authenticated');
        return;
      }

      // Validate holder name
      if (!holderName.trim()) {
        setNameError('El nombre del titular es obligatorio.');
        setProcessing(false);
        console.error('Holder name is empty');
        return;
      }

      // Validate card element
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setError('No se pudo acceder al elemento de la tarjeta.');
        setProcessing(false);
        console.error('CardElement not found');
        return;
      }

      // Validate card completion
      if (!cardComplete) {
        setError('Por favor, completa los detalles de la tarjeta.');
        setProcessing(false);
        console.error('Card details incomplete');
        return;
      }

      try {
        console.log('Requesting payment intent from server at http://localhost:4242/create-payment-intent...');
        const response = await fetch('http://localhost:4242/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: Math.round(component.price * 100), // Convert to cents
            currency: 'usd',
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Server response error:', errorText);
          throw new Error(`No se pudo conectar con el servidor: ${response.status} - ${errorText}`);
        }

        const { clientSecret } = await response.json();
        console.log('Payment intent client secret received:', clientSecret);

        console.log('Confirming card payment with Stripe...');
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: { name: holderName },
          },
        });

        if (result.error) {
          setError(`Error al procesar el pago: ${result.error.message}`);
          console.error('Payment error:', result.error);
        } else if (result.paymentIntent.status === 'succeeded') {
          console.log('Payment succeeded:', result.paymentIntent);

          // Save purchase to Firestore
          try {
            await addDoc(collection(db, 'purchases'), {
              userId: user.uid,
              componentId: component.id,
              componentName: component.name,
              amount: component.price,
              currency: 'usd',
              paymentIntentId: result.paymentIntent.id,
              createdAt: serverTimestamp(),
            });
            console.log('Purchase saved to Firestore');
            toast.success('¡Compra guardada exitosamente!');
          } catch (firestoreError) {
            console.error('Error saving purchase to Firestore:', firestoreError);
            toast.error('Pago exitoso, pero no se pudo guardar la compra. Contacta al soporte.');
          }

          alert('¡Pago exitoso! Gracias por tu compra.');
          onClose();
        }
      } catch (err) {
        if (err.message.includes('Failed to fetch')) {
          setError('No se pudo conectar con el servidor de pagos. Asegúrate de que el servidor esté funcionando y vuelve a intentarlo.');
        } else {
          setError(`Error al procesar el pago: ${err.message}`);
        }
        console.error('Payment processing error:', err);
      } finally {
        setProcessing(false);
      }
    },
    [stripe, elements, user, holderName, component, onClose, cardComplete]
  );

  const handleCardChange = (event) => {
    setCardComplete(event.complete);
    if (event.error) {
      setError(event.error.message);
    } else {
      setError(null);
    }
    console.log('Card change detected. Complete:', event.complete, 'Error:', event.error?.message);
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setHolderName(value);
    if (!value.trim()) {
      setNameError('El nombre del titular es obligatorio.');
    } else {
      setNameError('');
    }
    console.log('Holder name updated:', value);
  };

  // Rest of the JSX remains unchanged
  return (
    <motion.div
      className="relative p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl max-w-lg w-full mx-auto overflow-hidden"
      variants={formVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Golden particle background */}
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

      {/* Form content */}
      <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
        <div className="text-center">
          <h3 className="text-3xl font-serif font-semibold text-gray-100 tracking-wide">
            Finalizar Compra
          </h3>
          <p className="text-sm text-gray-400 mt-2">
            Completa tu compra de <span className="text-amber-400">{component.name}</span> de forma segura
          </p>
          <p className="text-lg font-bold text-amber-400 mt-1">
            Total: ${component.price.toFixed(2)} USD
          </p>
        </div>

        {/* Holder Name Input */}
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
            placeholder="Tu nombre completo"
            aria-label="Nombre del titular"
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

        {/* Card Details Input */}
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
            aria-label="Detalles de la tarjeta"
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

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <motion.button
            type="submit"
            disabled={!stripe || !cardComplete || !!nameError || processing || !user}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="relative w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-700 text-white px-6 py-3 rounded-lg font-semibold text-lg shadow-lg overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={`Pagar ${component.price.toFixed(2)} USD`}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10">{processing ? 'Procesando...' : `Pagar $${component.price.toFixed(2)}`}</span>
          </motion.button>
          <motion.button
            onClick={onClose}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="w-full sm:w-auto bg-gray-700 text-gray-300 px-6 py-3 rounded-lg font-semibold text-lg hover:bg-gray-600 transition-colors duration-300"
            aria-label="Cancelar compra"
          >
            Cancelar
          </motion.button>
        </div>

        {/* Test Card Note */}
        <p className="text-center text-gray-500 text-xs">
          Usa la tarjeta de prueba: 4242 4242 4242 4242 (fecha futura, CVV cualquiera)
        </p>
      </form>

      {/* Additional Styles */}
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