import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaMapPin, FaPhone, FaClock, FaChevronDown, FaChevronUp } from "react-icons/fa";

const StoreLocatorContactForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    contactType: "StoreLocator",
    name: "",
    email: "",
    postalCode: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stores, setStores] = useState([]);
  const [expandedStore, setExpandedStore] = useState(null);
  const [countdown, setCountdown] = useState(5); // New state for countdown
  const nameInputRef = useRef(null);

  const mockStores = [
    {
      id: 1,
      name: "HomeControl Madrid Centro",
      address: "Calle Gran Vía, 28, 28013 Madrid",
      phone: "+34 910 123 456",
      hours: "Lun-Vie: 9:00-18:00, Sáb: 10:00-14:00",
      distance: "0.5 km",
    },
    {
      id: 2,
      name: "HomeControl Barcelona Eixample",
      address: "Passeig de Gràcia, 43, 08007 Barcelona",
      phone: "+34 930 456 789",
      hours: "Lun-Vie: 10:00-19:00, Sáb: 10:00-15:00",
      distance: "1.2 km",
    },
    {
      id: 3,
      name: "HomeControl Valencia Ciutat Vella",
      address: "Plaça de l'Ajuntament, 5, 46002 Valencia",
      phone: "+34 960 789 123",
      hours: "Lun-Vie: 9:30-18:30",
      distance: "0.8 km",
    },
  ];

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  // Countdown effect when form is submitted
  useEffect(() => {
    if (submitted && !loading) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate("/"); // Redirect when countdown reaches 0
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Cleanup interval on unmount or when form is reset
      return () => clearInterval(timer);
    }
  }, [submitted, loading, navigate]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "El nombre es obligatorio";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Correo electrónico inválido";
    if (!formData.postalCode || !/^\d{5}$/.test(formData.postalCode))
      newErrors.postalCode = "El código postal debe tener 5 dígitos";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "postalCode") {
      if (value && !/^\d{5}$/.test(value)) {
        setErrors((prev) => ({ ...prev, postalCode: "El código postal debe tener 5 dígitos" }));
      } else {
        setErrors((prev) => ({ ...prev, postalCode: undefined }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      setTimeout(() => {
        console.log("Form Submission:", formData);
        setStores(mockStores);
        setLoading(false);
        setSubmitted(true);
        setCountdown(50); // Reset countdown on submit
      }, 2000);
    }
  };

  const resetForm = () => {
    setFormData({ contactType: "StoreLocator", name: "", email: "", postalCode: "" });
    setErrors({});
    setSubmitted(false);
    setStores([]);
    setExpandedStore(null);
    setCountdown(5); // Reset countdown
    nameInputRef.current?.focus();
  };

  const toggleStoreDetails = (id) => {
    setExpandedStore(expandedStore === id ? null : id);
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto p-4 sm:p-6 bg-white/90 backdrop-blur-md rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-b from-amber-50 to-white"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      role="form"
      aria-label="Formulario de búsqueda de punto de venta"
    >
      <AnimatePresence>
        {submitted && !loading ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 tracking-tight mb-4 text-center">
              Tiendas Cercanas
            </h2>
            <p className="text-gray-600 text-base mb-6 text-center">
              Encontramos {stores.length} tiendas cerca del código postal {formData.postalCode}.
            </p>
            {stores.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="list" aria-label="Lista de tiendas cercanas">
                {stores.map((store) => (
                  <motion.div
                    key={store.id}
                    className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-amber-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * store.id }}
                    onClick={() => toggleStoreDetails(store.id)}
                    role="listitem"
                    aria-label={`Tienda ${store.name}`}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && toggleStoreDetails(store.id)}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-800">{store.name}</h3>
                      <motion.div
                        animate={{ rotate: expandedStore === store.id ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {expandedStore === store.id ? <FaChevronUp className="text-amber-400" /> : <FaChevronDown className="text-amber-400" />}
                      </motion.div>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">{store.distance} desde tu ubicación</p>
                    <AnimatePresence>
                      {expandedStore === store.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-2 space-y-2"
                        >
                          <p className="text-gray-600 text-sm flex items-center">
                            <FaMapPin className="text-amber-400 mr-2" aria-hidden="true" /> Dirección: {store.address}
                          </p>
                          <p className="text-gray-600 text-sm flex items-center">
                            <FaPhone className="text-amber-400 mr-2" aria-hidden="true" /> Teléfono: {store.phone}
                          </p>
                          <p className="text-gray-600 text-sm flex items-center">
                            <FaClock className="text-amber-400 mr-2" aria-hidden="true" /> Horario: {store.hours}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center">No se encontraron tiendas.</p>
            )}
            <div className="mt-6 flex justify-center">
              <motion.button
                onClick={resetForm}
                className="py-2 px-6 bg-amber-400 text-white font-semibold rounded-full hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Buscar otra vez"
              >
                Buscar Otra Vez
              </motion.button>
            </div>
            <p className="text-center text-amber-600 font-semibold mt-4" aria-live="polite">
              Redirigiendo a la página principal en {countdown} segundo{countdown !== 1 ? "s" : ""}...
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 tracking-tight mb-4 text-center">
              Buscar Punto de Venta
            </h2>
            <p className="text-gray-600 text-base mb-6 text-center">
              Ingresa tu código postal para encontrar la tienda HomeControl más cercana.
            </p>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6" noValidate>
              <input type="hidden" name="contactType" value="StoreLocator" />
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nombre
                  <span className="text-gray-500 text-xs ml-1">(para contactarte)</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-amber-400 focus:border-amber-400 bg-amber-50 transition-all duration-200"
                  aria-required="true"
                  aria-describedby="name-error"
                  ref={nameInputRef}
                  placeholder="Ej: Ana Gómez"
                />
                {errors.name && (
                  <p id="name-error" className="text-red-500 text-sm mt-1" aria-live="assertive">
                    {errors.name}
                  </p>
                )}
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Correo Electrónico
                  <span className="text-gray-500 text-xs ml-1">(para enviarte detalles)</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-amber-400 focus:border-amber-400 bg-amber-50 transition-all duration-200"
                  aria-required="true"
                  aria-describedby="email-error"
                  placeholder="Ej: ana@example.com"
                />
                {errors.email && (
                  <p id="email-error" className="text-red-500 text-sm mt-1" aria-live="assertive">
                    {errors.email}
                  </p>
                )}
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                  Código Postal
                  <span className="text-gray-500 text-xs ml-1">(5 dígitos, ej: 28001)</span>
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-amber-400 focus:border-amber-400 bg-amber-50 transition-all duration-200"
                  aria-required="true"
                  aria-describedby="postalCode-error"
                  placeholder="Ej: 28001"
                  maxLength={5}
                />
                {errors.postalCode && (
                  <p id="postalCode-error" className="text-red-500 text-sm mt-1" aria-live="assertive">
                    {errors.postalCode}
                  </p>
                )}
              </motion.div>
              <motion.button
                type="submit"
                className="w-full py-3 px-4 bg-amber-400 text-white font-semibold rounded-full hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-colors duration-200 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                aria-label="Buscar tiendas"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
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
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    Buscando tiendas...
                  </>
                ) : (
                  "Buscar Tiendas"
                )}
              </motion.button>
            </form>
            {loading && (
              <motion.div
                className="mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                aria-live="polite"
              >
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <motion.div
                    className="bg-amber-400 h-2.5 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default StoreLocatorContactForm;