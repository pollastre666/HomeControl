import React from "react";
import SupportCard from "./SupportCard";

const RepairCard = () => {
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
        d="M3 12l2-2m0 0l7-7 7 7m-9 2v7a2 2 0 002 2h2a2 2 0 002-2v-7m-4 0l2 2m0 0l7-7 7 7"
      />
    </svg>
  );

  return (
    <SupportCard
      title="Solicitar Reparación"
      description="¿Tienes un problema? Agenda una reparación en casa con nuestro equipo técnico."
      icon={icon}
      buttonText="Solicitar Reparación"
      route="/solicitar-reparacion"
      ariaLabel="Solicitar reparación en casa"
    />
  );
};

export default RepairCard;