
import { connect } from "react-redux";
import { motion } from "framer-motion";
import Footer from "../../Componentes/Navigacion/Footer";
import Navbar from "../../Componentes/Navigacion/NavBar";
function Layout({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, transition: { duration: 1 } }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1 } }}
      className="flex flex-col min-h-screen"
    >
      {/* Navbar */}

        <Navbar />
      {/* Contenido principal */}
      <main className="flex-grow p-6">{children}</main>

      {/* Footer importado */}
      <Footer />
    </motion.div>
  );
}

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {})(Layout);

