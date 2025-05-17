// src/Componentes/Tareas/Componentes/TaskActions.jsx
import React from 'react';
import { motion } from 'framer-motion';

const TaskActions = ({ selectedTasks, bulkDelete, bulkUpdateStatus }) => (
  selectedTasks.length > 0 && (
    <div className="mb-8 flex gap-3 flex-wrap">
      <motion.button
        onClick={bulkDelete}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 min-w-[44px] min-h-[44px]"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={`Eliminar ${selectedTasks.length} tareas seleccionadas`}
      >
        Eliminar Seleccionados ({selectedTasks.length})
      </motion.button>
      <motion.button
        onClick={() => bulkUpdateStatus('Completada')}
        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 min-w-[44px] min-h-[44px]"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Marcar seleccionadas como Completadas"
      >
        Marcar Completadas
      </motion.button>
      <motion.button
        onClick={() => bulkUpdateStatus('En Progreso')}
        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 min-w-[44px] min-h-[44px]"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Marcar seleccionadas como En Progreso"
      >
        Marcar En Progreso
      </motion.button>
      <motion.button
        onClick={() => bulkUpdateStatus('Pendiente')}
        className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 min-w-[44px] min-h-[44px]"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Marcar seleccionadas como Pendientes"
      >
        Marcar Pendientes
      </motion.button>
    </div>
  )
);

export default TaskActions;