import { motion } from "framer-motion";
import Navbar from "../../Componentes/Navigacion/NavBar";
import Footer from "../../Componentes/Navigacion/Footer";

function Layout({ children, mainClassName = "" }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header role="navigation">
        <Navbar />
      </header>

      {/* Main Content with Animation */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className={`flex-grow ${mainClassName}`}
      >
        {children}
      </motion.main>

      {/* Footer */}
      <footer role="contentinfo">
        <Footer />
      </footer>
    </div>
  );
}

export default Layout;