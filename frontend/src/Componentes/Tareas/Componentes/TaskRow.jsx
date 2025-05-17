// src/Componentes/Tareas/Componentes/TaskRow.jsx
import React from 'react';
import { motion } from 'framer-motion';

const TaskRow = ({ task, index, selectedTasks, toggleSelectTask, onEdit, onDelete, onToggleStatus, onClone }) => {
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Completada';
  const isDueSoon =
    new Date(task.dueDate) <= new Date(new Date().setDate(new Date().getDate() + 2)) &&
    new Date(task.dueDate) >= new Date() &&
    task.status !== 'Completada';

  return (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`hover:bg-amber-50 dark:hover:bg-gray-700 ${isOverdue ? 'bg-red-100 dark:bg-red-900' : isDueSoon ? 'bg-yellow-100 dark:bg-yellow-900' : ''}`}
    >
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={selectedTasks.includes(task.id)}
          onChange={() => toggleSelectTask(task.id)}
          aria-label={`Seleccionar tarea ${task.name}`}
        />
      </td>
      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{task.id}</td>
      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">{task.name}</td>
      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{task.description}</td>
      <td className="px-6 py-4 text-sm">
        <span
          className={`px-2 py-1 rounded-full text-white ${
            task.priority === 'Alta' ? 'bg-red-500' : task.priority === 'Media' ? 'bg-yellow-500' : 'bg-green-500'
          }`}
        >
          {task.priority}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{task.dueDate}</td>
      <td className="px-6 py-4">
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
      </td>
      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{task.assignedTo}</td>
      <td className="px-6 py-4 flex gap-2">
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
      </td>
    </motion.tr>
  );
};

export default TaskRow;
