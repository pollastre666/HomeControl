import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../Componentes/Navigacion/NavBar';
import Footer from '../../Componentes/Navigacion/Footer';

function Layout({ children, mainClassName = "" }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar */}
      <header role="navigation" className="fixed top-0 left-0 w-full z-50 bg-gray-800 text-white shadow-md">
        <Navbar />
      </header>

      {/* Main Content with Animation */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className={`flex-grow ${mainClassName} px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-32 pb-6`}
      >
        {children}
      </motion.main>

      {/* Footer */}
      <footer role="contentinfo" className="mt-auto bg-gray-800 text-white text-center p-4 sm:p-6">
        <Footer />
      </footer>
    </div>
  );
}

export default Layout;