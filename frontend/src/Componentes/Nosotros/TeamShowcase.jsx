// src/Componentes/Nosotros/TeamShowcase.js
import React from 'react';
import { motion } from 'framer-motion';

const teamMembers = [
  { name: 'Juan Pérez', role: 'CEO', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=100&h=100' },
  { name: 'María López', role: 'Ingeniera Jefe', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=100&h=100' },
  { name: 'Carlos Ruiz', role: 'Diseñador UX', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?fit=crop&w=100&h=100' },
];

const TeamShowcase = () => (
  <section className="py-12 bg-gradient-to-br from-amber-50 to-white">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-extrabold text-amber-700 mb-10 text-center tracking-tight">Nuestro Equipo</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {teamMembers.map((member, index) => (
          <motion.div
            key={member.name}
            className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-amber-200/50 text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            whileHover={{ scale: 1.05, boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)" }}
          >
            <img src={member.image} alt={member.name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-amber-100" />
            <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
            <p className="text-amber-700 mt-2">{member.role}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TeamShowcase;