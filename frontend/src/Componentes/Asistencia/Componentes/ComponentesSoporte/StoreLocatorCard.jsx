import React from "react";
import SupportCard from "./SupportCard";

const StoreLocatorCard = () => {
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
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );

  return (
    <SupportCard
      title="Buscar Punto de Venta"
      description="Encuentra la tienda HomeControl más cercana a tu domicilio."
      icon={icon}
      buttonText="Buscar Punto de Venta"
      route="/buscar-punto-venta"
      ariaLabel="Buscar un punto de venta cercano"
    />
  );
};

export default StoreLocatorCard;