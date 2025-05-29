import React from "react";
import SupportCard from "./SupportCard";

const CustomerServiceCard = () => {
  const icon = (
    <svg
      className="w-8 h-8"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );

  return (
    <SupportCard
      title="Atención al Cliente"
      description="¿Necesitas ayuda con un producto comprado online? Contacta con nuestro equipo."
      icon={icon}
      buttonText="Contactar Atención al Cliente"
      route="/contacto-atencion-cliente"
      ariaLabel="Contactar con atención al cliente"
    />
  );
};

export default CustomerServiceCard;