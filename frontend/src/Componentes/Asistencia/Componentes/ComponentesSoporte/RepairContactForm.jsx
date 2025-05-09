import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const RepairContactForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    contactType: "Repair",
    name: "",
    email: "",
    phone: "",
    address: "",
    issue: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "El nombre es obligatorio";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Correo electrónico inválido";
    if (!formData.phone || !/^\+?\d{9,15}$/.test(formData.phone))
      newErrors.phone = "Teléfono inválido (9-15 dígitos)";
    if (!formData.address) newErrors.address = "La dirección es obligatoria";
    if (!formData.issue) newErrors.issue = "Describe el problema";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Form Submission:", formData);
      setSubmitted(true);
      setTimeout(() => navigate("/"), 2000);
    }
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto p-4 sm:p-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      role="form"
      aria-label="Formulario de solicitud de reparación"
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
            Solicitar Reparación
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mb-6">
            Completa el formulario para agendar una reparación en casa.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="hidden" name="contactType" value="Repair" />
            <div className="flex flex-col lg:flex-row gap-6">
              <motion.div
                className="flex-1 space-y-4"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
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
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-amber-400 focus:border-amber-400 bg-amber-50"
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
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-amber-400 focus:border-amber-400 bg-amber-50"
                    aria-required="true"
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-amber-400 focus:border-amber-400 bg-amber-50"
                    aria-required="true"
                  />
                  {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                </div>
              </motion.div>
              <motion.div
                className="flex-1 space-y-4"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Dirección
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-amber-400 focus:border-amber-400 bg-amber-50"
                    aria-required="true"
                  />
                  {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
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
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-amber-400 focus:border-amber-400 bg-amber-50"
                    rows="6"
                    aria-required="true"
                  />
                  {errors.issue && <p className="text-red-500 text-sm">{errors.issue}</p>}
                </div>
              </motion.div>
            </div>
            <motion.button
              type="submit"
              className="w-full py-2 px-4 bg-amber-400 text-white font-semibold rounded-full hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
              aria-label="Enviar solicitud de reparación"
            >
              Enviar
            </motion.button>
          </form>
        </>
      )}
    </motion.div>
  );
};

export default RepairContactForm;