import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { db } from "../../../../config/firebase";
import { collection, addDoc } from "firebase/firestore";

const CustomerServiceContactForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    contactType: "CustomerService",
    name: "",
    email: "",
    orderNumber: "",
    issue: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "El nombre es obligatorio";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Correo electrónico inválido";
    if (!formData.orderNumber) newErrors.orderNumber = "El número de pedido es obligatorio";
    if (!formData.issue) newErrors.issue = "Describe el problema";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        await addDoc(collection(db, "contacts"), {
          type: formData.contactType,
          name: formData.name,
          email: formData.email,
          orderNumber: formData.orderNumber,
          issue: formData.issue,
          timestamp: new Date(),
        });
        console.log("Formulario enviado a Firestore:", formData);
        setSubmitted(true);
        setSubmitError(null);
        setTimeout(() => navigate("/"), 2000);
      } catch (error) {
        console.error("Error al enviar el formulario a Firestore: ", error);
        setSubmitError("Error al enviar el formulario. Inténtalo de nuevo.");
      }
    }
  };

  return (
    <motion.div
      className="max-w-md mx-auto p-4 sm:p-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      role="form"
      aria-label="Formulario de atención al cliente"
    >
      {submitted ? (
        <motion.div
          className="text-center text-amber-600 font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          ¡Solicitud enviada! Redirigiendo...
        </motion.div>
      ) : (
        <>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 tracking-tight mb-4">
            Atención al Cliente
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mb-6">
            Contacta con nuestro equipo para resolver cualquier duda o problema.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input type="hidden" name="contactType" value="CustomerService" />
            <motion.div
              className="p-4 bg-amber-50 rounded-lg"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <h3 className="text-sm font-medium text-gray-700 mb-2">Información Personal</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-amber-400 focus:border-amber-400 bg-white"
                    aria-required="true"
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-amber-400 focus:border-amber-400 bg-white"
                    aria-required="true"
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>
              </div>
            </motion.div>
            <motion.div
              className="p-4 bg-amber-50 rounded-lg"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <h3 className="text-sm font-medium text-gray-700 mb-2">Detalles del Pedido</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700">
                    Número de Pedido
                  </label>
                  <input
                    type="text"
                    id="orderNumber"
                    name="orderNumber"
                    value={formData.orderNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-amber-400 focus:border-amber-400 bg-white"
                    aria-required="true"
                  />
                  {errors.orderNumber && <p className="text-red-500 text-sm">{errors.orderNumber}</p>}
                </div>
                <div>
                  <label htmlFor="issue" className="block text-sm font-medium text-gray-700">
                    Descripción del Problema
                  </label>
                  <textarea
                    id="issue"
                    name="issue"
                    value={formData.issue}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-amber-400 focus:border-amber-400 bg-white"
                    rows="4"
                    aria-required="true"
                  />
                  {errors.issue && <p className="text-red-500 text-sm">{errors.issue}</p>}
                </div>
              </div>
            </motion.div>
            {submitError && <p className="text-red-500 text-sm text-center">{submitError}</p>}
            <motion.button
              type="submit"
              className="w-full py-2 px-4 bg-amber-400 text-white font-semibold rounded-full hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
              aria-label="Enviar solicitud de atención al cliente"
            >
              Enviar
            </motion.button>
          </form>
        </>
      )}
    </motion.div>
  );
};

export default CustomerServiceContactForm;