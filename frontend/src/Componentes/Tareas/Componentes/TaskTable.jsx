// src/Componentes/Tareas/Componentes/TaskTable.jsx
import React from 'react';
import TaskRow from './TaskRow';

const TaskTable = ({
  tasks,
  sortColumn,
  sortDirection,
  setSortColumn,
  setSortDirection,
  selectedTasks,
  setSelectedTasks,
  onEdit,
  onDelete,
  onToggleStatus,
  onClone,
}) => {
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-amber-200 dark:divide-gray-700">
        <thead className="bg-amber-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3">
              <input
                type="checkbox"
                onChange={(e) =>
                  setSelectedTasks(e.target.checked ? tasks.map((task) => task.id) : [])
                }
                checked={selectedTasks.length === tasks.length && tasks.length > 0}
                aria-label="Seleccionar todas las tareas"
              />
            </th>
            <th
              onClick={() => handleSort('id')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
              aria-sort={sortColumn === 'id' ? sortDirection : 'none'}
            >
              ID {sortColumn === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th
              onClick={() => handleSort('name')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
              aria-sort={sortColumn === 'name' ? sortDirection : 'none'}
            >
              Nombre {sortColumn === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Descripción
            </th>
            <th
              onClick={() => handleSort('priority')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
              aria-sort={sortColumn === 'priority' ? sortDirection : 'none'}
            >
              Prioridad {sortColumn === 'priority' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th
              onClick={() => handleSort('dueDate')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
              aria-sort={sortColumn === 'dueDate' ? sortDirection : 'none'}
            >
              Fecha de Vencimiento {sortColumn === 'dueDate' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Estado
            </th>
            <th
              onClick={() => handleSort('assignedTo')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
              aria-sort={sortColumn === 'assignedTo' ? sortDirection : 'none'}
            >
              Asignado a {sortColumn === 'assignedTo' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-amber-100 dark:divide-gray-700">
          {tasks.map((task, index) => (
            <TaskRow
              key={task.id}
              task={task}
              index={index}
              selectedTasks={selectedTasks}
              toggleSelectTask={(id) =>
                setSelectedTasks((prev) =>
                  prev.includes(id) ? prev.filter((taskId) => taskId !== id) : [...prev, id]
                )
              }
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
              onClone={onClone}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;