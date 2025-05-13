import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TareasTable = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    try {
      return savedTasks
        ? JSON.parse(savedTasks)
        : [
            {
              id: 1,
              name: "Configurar luces sala",
              description: "Instalar y programar luces inteligentes",
              priority: "Alta",
              dueDate: "2025-05-10",
              status: "Pendiente",
              assignedTo: "Juan Pérez",
            },
            {
              id: 2,
              name: "Revisar termostato",
              description: "Comprobar funcionamiento del termostato",
              priority: "Media",
              dueDate: "2025-05-12",
              status: "En Progreso",
              assignedTo: "María López",
            },
            {
              id: 3,
              name: "Instalar alarma",
              description: "Configurar sistema de alarma",
              priority: "Baja",
              dueDate: "2025-05-15",
              status: "Completada",
              assignedTo: "Ana García",
            },
          ];
    } catch (e) {
      console.error("Error parsing localStorage tasks:", e);
      return [
        {
          id: 1,
          name: "Configurar luces sala",
          description: "Instalar y programar luces inteligentes",
          priority: "Alta",
          dueDate: "2025-05-10",
          status: "Pendiente",
          assignedTo: "Juan Pérez",
        },
        {
          id: 2,
          name: "Revisar termostato",
          description: "Comprobar funcionamiento del termostato",
          priority: "Media",
          dueDate: "2025-05-12",
          status: "En Progreso",
          assignedTo: "María López",
        },
        {
          id: 3,
          name: "Instalar alarma",
          description: "Configurar sistema de alarma",
          priority: "Baja",
          dueDate: "2025-05-15",
          status: "Completada",
          assignedTo: "Ana García",
        },
      ];
    }
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priority: "Media",
    dueDate: new Date().toISOString().split("T")[0],
    status: "Pendiente",
    assignedTo: "",
  });
  const itemsPerPage = 7;

  useEffect(() => {
    try {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (e) {
      console.error("Error al guardar tareas:", e);
      toast.error("Error al guardar tareas en localStorage");
    }
  }, [tasks]);

  const getNextId = () => {
    return tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
  };

  const openModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormData({ ...task });
    } else {
      setEditingTask(null);
      setFormData({
        name: "",
        description: "",
        priority: "Media",
        dueDate: new Date().toISOString().split("T")[0],
        status: "Pendiente",
        assignedTo: "",
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTask(null);
    setFormData({
      name: "",
      description: "",
      priority: "Media",
      dueDate: new Date().toISOString().split("T")[0],
      status: "Pendiente",
      assignedTo: "",
    });
  };

  const handleAddTask = () => {
    openModal();
  };

  const handleSaveTask = () => {
    const trimmedData = {
      ...formData,
      name: formData.name.trim(),
      description: formData.description.trim(),
      assignedTo: formData.assignedTo.trim(),
    };

    if (!trimmedData.name || !trimmedData.dueDate) {
      toast.error("Nombre y fecha de vencimiento son obligatorios!");
      return;
    }

    if (editingTask) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === editingTask.id ? { ...task, ...trimmedData } : task
        )
      );
      toast.success("Tarea actualizada con éxito!");
    } else {
      const newTask = {
        id: getNextId(),
        ...trimmedData,
      };
      setTasks((prevTasks) => [...prevTasks, newTask]);
      toast.success("Tarea añadida con éxito!");
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Seguro que quieres eliminar esta tarea?")) {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      toast.success("Tarea eliminada con éxito!");
    }
  };

  const handleToggleStatus = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status:
                task.status === "Completada" ? "Pendiente" : "Completada",
            }
          : task
      )
    );
    toast.success("Estado de la tarea actualizado!");
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / itemsPerPage));
  const indexOfLastTask = currentPage * itemsPerPage;
  const indexOfFirstTask = indexOfLastTask - itemsPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="p-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg max-w-4xl mx-auto border border-amber-200/50"
      role="region"
      aria-labelledby="tareas-heading"
    >
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2
          id="tareas-heading"
          className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight"
        >
          Control Doméstico - Tareas
        </h2>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Buscar tareas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900"
            aria-label="Buscar tareas"
          />
          <motion.button
            onClick={handleAddTask}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            + Añadir Tarea
          </motion.button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-amber-200">
          <thead className="bg-amber-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Tarea</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Descripción</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Prioridad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Asignado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-amber-100">
            {currentTasks.map((task, index) => (
              <motion.tr
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="hover:bg-amber-50"
              >
                <td className="px-6 py-4 text-sm text-gray-900">{task.id}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{task.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{task.description}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{task.priority}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{task.dueDate}</td>
                <td className="px-6 py-4">
                  <motion.button
                    onClick={() => handleToggleStatus(task.id)}
                    className={`px-3 py-1 rounded text-white ${
                      task.status === "Completada"
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`Cambiar estado de ${task.name} a ${task.status === "Completada" ? "Pendiente" : "Completada"}`}
                  >
                    {task.status}
                  </motion.button>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{task.assignedTo}</td>
                <td className="px-6 py-4 flex gap-2">
                  <motion.button
                    onClick={() => openModal(task)}
                    className="px-3 py-1 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`Editar ${task.name}`}
                  >
                    Editar
                  </motion.button>
                  <motion.button
                    onClick={() => handleDelete(task.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`Eliminar ${task.name}`}
                  >
                    Eliminar
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <motion.button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-amber-200 text-gray-800 rounded-lg disabled:opacity-50 hover:bg-amber-300 transition duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Página anterior"
        >
          Anterior
        </motion.button>
        <span className="text-gray-700">
          Página {currentPage} de {totalPages}
        </span>
        <motion.button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-amber-200 text-gray-800 rounded-lg disabled:opacity-50 hover:bg-amber-300 transition duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Página siguiente"
        >
          Siguiente
        </motion.button>
      </div>

      {/* Modal for Creating/Editing Tasks */}
      <AnimatePresence>
        {modalOpen && (
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
              className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl border border-amber-200/50"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 id="modal-title" className="text-xl font-bold text-gray-900 mb-4">
                {editingTask ? "Editar Tarea" : "Crear Tarea"}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="mt-1 w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    aria-required="true"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Descripción</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="mt-1 w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Prioridad</label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value })
                    }
                    className="mt-1 w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Alta">Alta</option>
                    <option value="Media">Media</option>
                    <option value="Baja">Baja</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fecha de Vencimiento</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                    className="mt-1 w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    aria-required="true"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Estado</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="mt-1 w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="En Progreso">En Progreso</option>
                    <option value="Completada">Completada</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Asignado a</label>
                  <input
                    type="text"
                    value={formData.assignedTo}
                    onChange={(e) =>
                      setFormData({ ...formData, assignedTo: e.target.value })
                    }
                    className="mt-1 w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex gap-3 justify-end">
                <motion.button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Cancelar"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  onClick={handleSaveTask}
                  className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={editingTask ? "Guardar cambios" : "Crear tarea"}
                >
                  {editingTask ? "Guardar" : "Crear"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TareasTable;