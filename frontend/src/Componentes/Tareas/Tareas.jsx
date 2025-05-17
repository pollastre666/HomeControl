import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../Autenticacion/AuthProvider';
import Layout from '../../hocs/layouts/layout';
import { useTasks } from '../../hocs/useTasks';
import TaskModal from './Componentes/TaskModal';
import TaskTable from './Componentes/TaskTable';
import TaskListMobile from './Componentes/TaskListMobile';
import TaskFilters from './Componentes/TaskFilters';
import TaskActions from './Componentes/TaskActions';

const Tareas = () => {
  const { user } = useAuth();
  const {
    tasks,
    sortedAndFilteredTasks,
    searchTerm,
    setSearchTerm,
    filterPriority,
    setFilterPriority,
    filterStatus,
    setFilterStatus,
    filterAssignedTo,
    setFilterAssignedTo,
    sortColumn,
    setSortColumn,
    sortDirection,
    setSortDirection,
    selectedTasks,
    setSelectedTasks,
    isLoading,
    addTask,
    updateTask,
    deleteTask,
    bulkDelete,
    bulkUpdateStatus,
    cloneTask,
    exportToCSV,
  } = useTasks();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const itemsPerPage = 7;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(sortedAndFilteredTasks.length / itemsPerPage));
  const currentTasks = sortedAndFilteredTasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const openModal = (task = null) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  const handleSaveTask = (taskData) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
  };

  // Task summary
  const taskSummary = {
    total: tasks.length,
    overdue: tasks.filter(
      (task) => new Date(task.dueDate) < new Date() && task.status !== 'Completada'
    ).length,
    highPriority: tasks.filter((task) => task.priority === 'Alta').length,
    completed: tasks.filter((task) => task.status === 'Completada').length,
  };

  if (!user) {
    return (
      <Layout>
        <div className="text-center text-gray-600 dark:text-gray-300 py-8">
          Por favor, inicia sesión para gestionar tus tareas.
        </div>
      </Layout>
    );
  }

  return (

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="p-8 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-xl max-w-6xl mx-auto border border-amber-200/50 dark:border-amber-700/50 mt-8 mb-8"
        role="region"
        aria-labelledby="tareas-heading"
      >
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2
            id="tareas-heading"
            className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight"
          >
            Control Doméstico - Tareas
          </h2>
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Buscar tareas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-amber-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 dark:text-gray-100 dark:bg-gray-700"
              aria-label="Buscar tareas"
            />
            <motion.button
              onClick={() => openModal()}
              className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition duration-200 min-w-[44px] min-h-[44px]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Añadir nueva tarea"
            >
              + Añadir Tarea
            </motion.button>
            <motion.button
              onClick={() => exportToCSV()}
              className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition duration-200 min-w-[44px] min-h-[44px]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Exportar tareas a CSV"
            >
              Exportar CSV
            </motion.button>
          </div>
        </div>

        {/* Task Summary */}
        <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-amber-50 dark:bg-gray-800 p-4 rounded-lg">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Total</p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{taskSummary.total}</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Vencidas</p>
            <p className="text-lg font-bold text-red-500">{taskSummary.overdue}</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Alta Prioridad</p>
            <p className="text-lg font-bold text-yellow-500">{taskSummary.highPriority}</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Completadas</p>
            <p className="text-lg font-bold text-green-500">{taskSummary.completed}</p>
          </div>
        </div>

        {/* Filters */}
        <TaskFilters
          filterPriority={filterPriority}
          setFilterPriority={setFilterPriority}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterAssignedTo={filterAssignedTo}
          setFilterAssignedTo={setFilterAssignedTo}
        />

        {/* Bulk Actions */}
        <TaskActions
          selectedTasks={selectedTasks}
          bulkDelete={bulkDelete}
          bulkUpdateStatus={bulkUpdateStatus}
        />

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <svg
              className="animate-spin h-8 w-8 text-amber-500 mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Cargando tareas...</p>
          </div>
        )}

        {/* Task Display */}
        {!isLoading && tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-600 dark:text-gray-300">
            No hay tareas. Crea una nueva tarea para comenzar.
          </div>
        ) : (
          <>
            <div className="hidden md:block">
              <TaskTable
                tasks={currentTasks}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                setSortColumn={setSortColumn}
                setSortDirection={setSortDirection}
                selectedTasks={selectedTasks}
                setSelectedTasks={setSelectedTasks}
                onEdit={openModal}
                onDelete={deleteTask}
                onToggleStatus={(id) => {
                  const task = tasks.find((t) => t.id === id);
                  updateTask(id, {
                    status: task.status === 'Completada' ? 'Pendiente' : 'Completada',
                  });
                }}
                onClone={cloneTask}
              />
            </div>
            <div className="md:hidden">
              <TaskListMobile
                tasks={currentTasks}
                selectedTasks={selectedTasks}
                setSelectedTasks={setSelectedTasks}
                onEdit={openModal}
                onDelete={deleteTask}
                onToggleStatus={(id) => {
                  const task = tasks.find((t) => t.id === id);
                  updateTask(id, {
                    status: task.status === 'Completada' ? 'Pendiente' : 'Completada',
                  });
                }}
                onClone={cloneTask}
              />
            </div>
            {/* Pagination */}
            <div className="mt-8 flex justify-between items-center">
              <motion.button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-amber-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg disabled:opacity-50 hover:bg-amber-300 dark:hover:bg-gray-600 transition duration-200 min-w-[44px] min-h-[44px]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Página anterior"
              >
                Anterior
              </motion.button>
              <span className="text-gray-700 dark:text-gray-300">
                Página {currentPage} de {totalPages}
              </span>
              <motion.button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-amber-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg disabled:opacity-50 hover:bg-amber-300 dark:hover:bg-gray-600 transition duration-200 min-w-[44px] min-h-[44px]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Página siguiente"
              >
                Siguiente
              </motion.button>
            </div>
          </>
        )}

        {/* Modal */}
        <TaskModal
          isOpen={modalOpen}
          onClose={closeModal}
          onSave={handleSaveTask}
          task={editingTask}
        />
      </motion.div>

  );
};

export default Tareas;