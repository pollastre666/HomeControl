import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const TaskModal = ({ isOpen, onClose, onSave, task }) => {
  const [formData, setFormData] = useState({
    name: task?.name || '',
    description: task?.description || '',
    priority: task?.priority || 'Media',
    dueDate: task?.dueDate || new Date().toISOString().split('T')[0],
    status: task?.status || 'Pendiente',
    assignedTo: task?.assignedTo || '',
    tags: task?.tags || [],
  });
  const [formErrors, setFormErrors] = useState({});
  const nameInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) nameInputRef.current?.focus();
  }, [isOpen]);

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'El nombre es obligatorio';
    if (!formData.dueDate) errors.dueDate = 'La fecha de vencimiento es obligatoria';
    if (new Date(formData.dueDate) < new Date().setHours(0, 0, 0, 0)) {
      errors.dueDate = 'La fecha no puede ser anterior a hoy';
    }
    if (!formData.assignedTo.trim()) errors.assignedTo = 'Asignar a alguien es obligatorio';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    onSave({
      ...formData,
      name: formData.name.trim(),
      description: formData.description.trim(),
      assignedTo: formData.assignedTo.trim(),
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        role="dialog"
        aria-labelledby="modal-title"
      >
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-md mx-4 shadow-xl border border-amber-200/50 dark:border-amber-700/50"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 id="modal-title" className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            {task ? 'Editar Tarea' : 'Crear Tarea'}
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
              <input
                ref={nameInputRef}
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 ${
                  formErrors.name ? 'border-red-500' : 'border-amber-300'
                }`}
                aria-required="true"
                aria-invalid={!!formErrors.name}
                aria-label="Nombre de la tarea"
              />
              {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-2 w-full px-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                rows="3"
                aria-label="Descripción de la tarea"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Prioridad</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="mt-2 w-full px-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                aria-label="Prioridad de la tarea"
              >
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de Vencimiento</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className={`mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 ${
                  formErrors.dueDate ? 'border-red-500' : 'border-amber-300'
                }`}
                aria-required="true"
                aria-invalid={!!formErrors.dueDate}
                aria-label="Fecha de vencimiento"
              />
              {formErrors.dueDate && <p className="text-red-500 text-sm mt-1">{formErrors.dueDate}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Estado</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="mt-2 w-full px-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                aria-label="Estado de la tarea"
              >
                <option value="Pendiente">Pendiente</option>
                <option value="En Progreso">En Progreso</option>
                <option value="Completada">Completada</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Asignado a</label>
              <input
                type="text"
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                className={`mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 ${
                  formErrors.assignedTo ? 'border-red-500' : 'border-amber-300'
                }`}
                aria-required="true"
                aria-invalid={!!formErrors.assignedTo}
                aria-label="Persona asignada"
              />
              {formErrors.assignedTo && <p className="text-red-500 text-sm mt-1">{formErrors.assignedTo}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Etiquetas</label>
              <input
                type="text"
                value={formData.tags.join(', ')}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(tag => tag.trim()) })}
                className="mt-2 w-full px-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                placeholder="Etiqueta1, Etiqueta2, ..."
                aria-label="Etiquetas de la tarea"
              />
            </div>
          </div>
          <div className="mt-8 flex gap-4 justify-end">
            <motion.button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition duration-200 min-w-[44px] min-h-[44px]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Cancelar"
            >
              Cancelar
            </motion.button>
            <motion.button
              onClick={handleSave}
              className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition duration-200 min-w-[44px] min-h-[44px]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={task ? 'Guardar cambios' : 'Crear tarea'}
            >
              {task ? 'Guardar' : 'Crear'}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TaskModal;