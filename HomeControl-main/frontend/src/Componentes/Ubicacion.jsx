import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { toast } from 'react-toastify';
import Layout from '../hocs/layouts/layout';

const MapContactSection = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 800], [0, -100]);

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
      setError('Please fill out all fields.');
      toast.error('Please fill out all fields.');
      setIsSubmitting(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Invalid email format.');
      toast.error('Invalid email format.');
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('Request sent:', { name, email, message });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess(true);
      toast.success('Request sent successfully. We’ll contact you soon.');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('Error sending request:', err);
      setError('There was an error sending your request. Please try again.');
      toast.error('There was an error sending your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <section className="relative min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100 flex items-center justify-center p-6 md:p-12 overflow-hidden">
        {/* Map Background with Parallax */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y: parallaxY }}
        >
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
            title="mapa"
            scrolling="no"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2993.014232740924!2d2.1629749758790555!3d41.39549727129892!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a4a2ec494ec9cf%3A0xb7573398fb87b56d!2sPrat%20FP!5e0!3m2!1ses!2ses!4v1743971401973!5m2!1ses!2ses"
            style={{ filter: 'grayscale(0.5) contrast(1.1) opacity(0.6)' }}
            className="absolute inset-0"
          />
        </motion.div>

        {/* Decorative Gradient Overlay */}
        <div className="absolute inset-x-0 top-0 z-0 transform-gpu overflow-hidden blur-3xl h-96">
          <div
            className="relative aspect-[1155/678] w-full bg-gradient-to-tr from-amber-200 to-amber-500 opacity-20"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
            }}
          />
        </div>

        {/* Header */}
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center drop-shadow-lg absolute top-12 z-10"
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          Contactanos
        </motion.h2>

        {/* Form Container */}
        <motion.div
          className="w-full max-w-lg bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-amber-200/50 z-10"
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
              <p className="text-amber-600 font-semibold text-lg">
                Request Sent Successfully!
              </p>
              <p className="text-gray-600">
                Thank you for reaching out. We’ll get back to you soon.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="inline-block px-6 py-2 text-sm font-semibold text-amber-600 hover:text-amber-800 bg-amber-100/50 rounded-lg hover:bg-amber-200/50 transition-all duration-300"
              >
                Send Another Request
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm transition-all duration-300"
                  placeholder="Enter your name"
                  disabled={isSubmitting}
                />
              </motion.div>

              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm transition-all duration-300"
                  placeholder="Enter your email"
                  disabled={isSubmitting}
                />
              </motion.div>

              {/* Message Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm resize-none transition-all duration-300"
                  placeholder="What information would you like to receive?"
                  disabled={isSubmitting}
                />
              </motion.div>

              {/* Error Message */}
              {error && (
                <motion.p
                  className="text-red-500 text-sm text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {error}
                </motion.p>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-3 px-4 rounded-lg text-sm font-semibold text-white ${
                  isSubmitting
                    ? 'bg-amber-400/50 cursor-not-allowed'
                    : 'bg-amber-600 hover:bg-amber-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-300`}
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
                      className="animate-spin h-5 w-5 text-white"
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
                  'Send Request'
                )}
              </motion.button>
            </form>
          )}
          <p className="text-xs text-gray-500 mt-4 text-center">Home Control Solutions</p>
        </motion.div>

        {/* Bottom Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 z-0 transform-gpu overflow-hidden blur-3xl h-96">
          <div
            className_above = "relative aspect-[1155/678] w-full bg-gradient-to-tr from-amber-200 to-amber-500 opacity-20"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
            }}
          />
        </div>
      </section>
    </Layout>
  );
};

export default MapContactSection;