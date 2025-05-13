import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { db } from "../../../../config/firebase";
import { collection, addDoc } from "firebase/firestore";

const ContactForm = () => {
  const { contactType } = useParams();
  const navigate = useNavigate();

  const typeMap = {
    "solicitar-reparacion": "Repair",
    "solicitar-presupuesto": "Budget",
    "buscar-punto-venta": "StoreLocator",
    "contacto-atencion-cliente": "CustomerService",
  };

  const currentType = typeMap[contactType] || "CustomerService";

  const [formData, setFormData] = useState({
    contactType: currentType,
    name: "",
    email: "",
    phone: "",
    address: "",
    issue: "",
    product: "",
    postalCode: "",
    orderNumber: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "El nombre es obligatorio";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Correo electrónico inválido";
    if (currentType === "Repair" || currentType === "Budget") {
      if (!formData.phone) newErrors.phone = "El teléfono es obligatorio";
    }
    if (currentType === "Repair") {
      if (!formData.address) newErrors.address = "La dirección es obligatoria";
      if (!formData.issue) newErrors.issue = "Describe el problema";
    }
    if (currentType === "Budget") {
      if (!formData.product) newErrors.product = "Describe el producto o servicio";
    }
    if (currentType === "StoreLocator") {
      if (!formData.postalCode) newErrors.postalCode = "El código postal es obligatorio";
    }
    if (currentType === "CustomerService") {
      if (!formData.orderNumber) newErrors.orderNumber = "El número de pedido es obligatorio";
      if (!formData.issue) newErrors.issue = "Describe el problema";
    }
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
        const docData = {
          type: formData.contactType,
          name: formData.name,
          email: formData.email,
          timestamp: new Date(),
        };
        if (currentType === "Repair" || currentType === "Budget") {
          docData.phone = formData.phone;
        }
        if (currentType === "Repair") {
          docData.address = formData.address;
          docData.issue = formData.issue;
        }
        if (currentType === "Budget") {
          docData.product = formData.product;
        }
        if (currentType === "StoreLocator") {
          docData.postalCode = formData.postalCode;
        }
        if (currentType === "CustomerService") {
          docData.orderNumber = formData.orderNumber;
          docData.issue = formData.issue;
        }
        await addDoc(collection(db, "contacts"), docData);
        console.log("Formulario enviado a Firestore:", docData);
        setSubmitted(true);
        setSubmitError(null);
        setTimeout(() => navigate("/"), 2000);
      } catch (error) {
        console.error("Error al enviar el formulario a Firestore: ", error);
        setSubmitError("Error al enviar el formulario. Inténtalo de nuevo.");
      }
    }
  };

  const formConfig = {
    Repair: {
      title: "Solicitar Reparación",
      description: "Completa el formulario para agendar una reparación en casa.",
    },
    Budget: {
      title: "Solicitar Presupuesto",
      description: "Obtén un presupuesto personalizado para nuestros productos o servicios.",
    },
    StoreLocator: {
      title: "Buscar Punto de Venta",
      description: "Encuentra la tienda HomeControl más cercana con tu código postal.",
    },
    CustomerService: {
      title: "Contacto con Atención al Cliente",
      description: "Contacta con nuestro equipo para resolver cualquier duda o problema.",
    },
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto p-4 sm:p-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-md"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      role="form"
      aria-label={`Formulario de ${formConfig[currentType].title}`}
    >
      {submitted ? (
        <motion.div
          className="text-center text-amber-600 font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          ¡Formulario enviado con éxito! Redirigiendo...
        </motion.div>
      ) : (
        <>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight mb-4">
            {formConfig[currentType].title}
          </h2>
          <p className="text-gray-600 mb-6">{formConfig[currentType].description}</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="hidden" name="contactType" value={currentType} />
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
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-amber-400 focus:border-amber-400"
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
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-amber-400 focus:border-amber-400"
                aria-required="true"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            {(currentType === "Repair" || currentType === "Budget") && (
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
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-amber-400 focus:border-amber-400"
                  aria-required="true"
                />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
              </div>
            )}
            {currentType === "Repair" && (
              <>
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
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-amber-400 focus:border-amber-400"
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
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-amber-400 focus:border-amber-400"
                    rows="4"
                    aria-required="true"
                  />
                  {errors.issue && <p className="text-red-500 text-sm">{errors.issue}</p>}
                </div>
              </>
            )}
            {currentType === "Budget" && (
              <div>
                <label htmlFor="product" className="block text-sm font-medium text-gray-700">
                  Producto o Servicio
                </label>
                <textarea
                  id="product"
                  name="product"
                  value={formData.product}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-amber-400 focus:border-amber-400"
                  rows="4"
                  aria-required="true"
                />
                {errors.product && <p className="text-red-500 text-sm">{errors.product}</p>}
              </div>
            )}
            {currentType === "StoreLocator" && (
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                  Código Postal
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-amber-400 focus:border-amber-400"
                  aria-required="true"
                />
                {errors.postalCode && <p className="text-red-500 text-sm">{errors.postalCode}</p>}
              </div>
            )}
            {currentType === "CustomerService" && (
              <>
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
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-amber-400 focus:border-amber-400"
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
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-amber-400 focus:border-amber-400"
                    rows="4"
                    aria-required="true"
                  />
                  {errors.issue && <p className="text-red-500 text-sm">{errors.issue}</p>}
                </div>
              </>
            )}
            {submitError && <p className="text-red-500 text-sm text-center">{submitError}</p>}
            <motion.button
              type="submit"
              className="w-full py-3 bg-amber-400 text-gray-800 font-semibold rounded-full hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Enviar formulario"
            >
              Enviar
            </motion.button>
          </form>
        </>
      )}
    </motion.div>
  );
};

export default ContactForm;