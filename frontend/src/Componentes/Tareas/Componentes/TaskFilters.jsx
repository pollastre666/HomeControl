import React from 'react';

const TaskFilters = ({ filterPriority, setFilterPriority, filterStatus, setFilterStatus, filterAssignedTo, setFilterAssignedTo }) => (
  <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Filtrar por Prioridad</label>
      <select
        value={filterPriority}
        onChange={(e) => setFilterPriority(e.target.value)}
        className="mt-1 w-full px-3 py-2 border border-amber-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-gray-100"
        aria-label="Filtrar por prioridad"
      >
        <option value="">Todas</option>
        <option value="Alta">Alta</option>
        <option value="Media">Media</option>
        <option value="Baja">Baja</option>
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Filtrar por Estado</label>
      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className="mt-1 w-full px-3 py-2 border border-amber-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-gray-100"
        aria-label="Filtrar por estado"
      >
        <option value="">Todos</option>
        <option value="Pendiente">Pendiente</option>
        <option value="En Progreso">En Progreso</option>
        <option value="Completada">Completada</option>
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-.smart-text-gray-300">Filtrar por Asignado</label>
      <input
        type="text"
        value={filterAssignedTo}
        onChange={(e) => setFilterAssignedTo(e.target.value)}
        className="mt-1 w-full px-3 py-2 border border-amber-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-gray-100"
        placeholder="Filtrar por asignado..."
        aria-label="Filtrar por persona asignada"
      />
    </div>
  </div>
);

export default TaskFilters;