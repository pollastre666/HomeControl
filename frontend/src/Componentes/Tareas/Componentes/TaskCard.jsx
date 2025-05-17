import React from 'react';
import { motion } from 'framer-motion';

const TaskCard = ({ task, selectedTasks, toggleSelectTask, onEdit, onDelete, onToggleStatus, onClone }) => {
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Completada';
  const isDueSoon =
    new Date(task.dueDate) <= new Date(new Date().setDate(new Date().getDate() + 2)) &&
    new Date(task.dueDate) >= new Date() &&
    task.status !== 'Completada';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border-l-4 ${
        isOverdue ? 'border-red-500' : isDueSoon ? 'border-yellow-500' : 'border-green-500'
      }`}
    >
      <div className="flex items-center justify-between">
        <input
          type="checkbox"
          checked={selectedTasks.includes(task.id)}
          onChange={() => toggleSelectTask(task.id)}
          aria-label={`Seleccionar tarea ${task.name}`}
        />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{task.name}</h3>
      </div>
      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{task.description}</p>
      {task.tags?.length > 0 && (
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
          <span className="font-medium">Etiquetas:</span> {task.tags.join(', ')}
        </p>
      )}
      <p className="text-sm mt-1">
        <span className="font-medium">Prioridad:</span>{' '}
        <span
          className={`px-2 py-1 rounded-full text-white ${
            task.priority === 'Alta' ? 'bg-red-500' : task.priority === 'Media' ? 'bg-yellow-500' : 'bg-green-500'
          }`}
        >
          {task.priority}
        </span>
      </p>
      <p className="text-sm mt-1">
        <span className="font-medium">Fecha:</span> {task.dueDate}
      </p>
      <p className="text-sm mt-1">
        <span className="font-medium">Estado:</span>{' '}
        <motion.button
          onClick={() => onToggleStatus(task.id)}
          className={`px-3 py-1 rounded text-white min-w-[44px] min-h-[44px] ${
            task.status === 'Completada'
              ? 'bg-green-500 hover:bg-green-600'
              : task.status === 'En Progreso'
              ? 'bg-yellow-500 hover:bg-yellow-600'
              : 'bg-red-500 hover:bg-red-600'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={`Cambiar estado de ${task.name} a ${task.status === 'Completada' ? 'Pendiente' : 'Completada'}`}
        >
          {task.status}
        </motion.button>
      </p>
      <p className="text-sm mt-1">
        <span className="font-medium">Asignado a:</span> {task.assignedTo}
      </p>
      <div className="mt-3 flex gap-2 flex-wrap">
        <motion.button
          onClick={() => onEdit(task)}
          className="px-3 py-1 bg-amber-500 text-white rounded-lg hover:bg-amber-600 min-w-[44px] min-h-[44px]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={`Editar ${task.name}`}
        >
          Editar
        </motion.button>
        <motion.button
          onClick={() => onClone(task)}
          className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 min-w-[44px] min-h-[44px]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={`Clonar ${task.name}`}
        >
          Clonar
        </motion.button>
        <motion.button
          onClick={() => onDelete(task.id)}
          className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 min-w-[44px] min-h-[44px]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={`Eliminar ${task.name}`}
        >
          Eliminar
        </motion.button>
      </div>
    </motion.div>
  );
};

export default TaskCard;