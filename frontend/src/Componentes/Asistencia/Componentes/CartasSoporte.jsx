import React from "react";
import { motion } from "framer-motion";
import RepairCard from "./ComponentesSoporte/Repaircard";
import BudgetCard from "./ComponentesSoporte/BudgetCard";
import StoreLocatorCard from "./ComponentesSoporte/StoreLocatorCard";
import CustomerServiceCard from "./ComponentesSoporte/CustomerServiceCard";

const SupportCards = () => {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 p-4 sm:p-6 bg-gradient-to-b from-amber-50 to-amber-100 rounded-2xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <RepairCard />
      <BudgetCard />
      <StoreLocatorCard />
      <CustomerServiceCard />
    </motion.div>
  );
};

export default SupportCards;