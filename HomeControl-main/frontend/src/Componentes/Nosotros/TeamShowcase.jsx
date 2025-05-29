import React from 'react';
import { motion } from 'framer-motion';

const teamMembers = [
  { name: 'Juan Pérez', role: 'CEO', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=100&h=100' },
  { name: 'María López', role: 'Ingeniera Jefe', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=100&h=100' },
  { name: 'Carlos Ruiz', role: 'Diseñador UX', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?fit=crop&w=100&h=100' },
];

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: 'easeOut' },
  }),
};

const TeamShowcase = () => (
  <section className="py-16 bg-gradient-to-br from-amber-50 to-amber-100" aria-label="Our Team">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-amber-800 mb-12 text-center tracking-tight">
        Nuestro Equipo
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {teamMembers.map((member, index) => (
          <motion.article
            key={member.name}
            className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-amber-200/50 text-center"
            variants={cardVariants}
            custom={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, rotate: 1, boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)' }}
            aria-label={`Team member ${member.name}, ${member.role}`}
          >
            <img
              src={member.image}
              alt={`${member.name}, ${member.role}`}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-amber-100"
              loading="lazy"
            />
            <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
            <p className="text-amber-700 mt-2">{member.role}</p>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

export default React.memo(TeamShowcase);