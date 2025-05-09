import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TareasPage = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    try {
      return savedTasks
        ? JSON.parse(savedTasks)
        : [
            {
              id: 1,
              name: "Tarea 1",
              description: "Configurar luces sala",
              priority: "Alta",
              dueDate: "2025-05-10",
              status: "Pendiente",
              assignedTo: "Juan Pérez",
            },
            {
              id: 2,
              name: "Tarea 2",
              description: "Revisar termostato",
              priority: "Media",
              dueDate: "2025-05-12",
              status: "En Progreso",
              assignedTo: "María López",
            },
            {
              id: 3,
              name: "Tarea 3",
              description: "Instalar alarma",
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
          name: "Tarea 1",
          description: "Configurar luces sala",
          priority: "Alta",
          dueDate: "2025-05-10",
          status: "Pendiente",
          assignedTo: "Juan Pérez",
        },
        {
          id: 2,
          name: "Tarea 2",
          description: "Revisar termostato",
          priority: "Media",
          dueDate: "2025-05-12",
          status: "En Progreso",
          assignedTo: "María López",
        },
        {
          id: 3,
          name: "Tarea 3",
          description: "Instalar alarma",
          priority: "Baja",
          dueDate: "2025-05-15",
          status: "Completada",
          assignedTo: "Ana García",
        },
      ];
    }
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 7;

  useEffect(() => {
    try {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (e) {
      console.error("Error al guardar tareas:", e);
    }
  }, [tasks]);

  const getNextId = () => {
    return tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
  };

  const handleAddTask = () => {
    const newId = getNextId();
    const newTask = {
      id: newId,
      name: `Tarea ${newId}`,
      description: "Nueva tarea",
      priority: "Media",
      dueDate: new Date().toISOString().split("T")[0],
      status: "Pendiente",
      assignedTo: "Sin asignar",
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
    toast.success("Tarea añadida con éxito!");
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Seguro que quieres eliminar esta tarea?")) {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      setEditingId(null);
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

  const handleSave = (id, updatedFields) => {
    const trimmedFields = {
      ...updatedFields,
      name: updatedFields.name.trim(),
      description: updatedFields.description.trim(),
      priority: updatedFields.priority.trim(),
      dueDate: updatedFields.dueDate.trim(),
      status: updatedFields.status.trim(),
      assignedTo: updatedFields.assignedTo.trim(),
    };

    if (!trimmedFields.name || !trimmedFields.dueDate) {
      toast.error("Nombre y fecha de vencimiento son obligatorios!");
      return;
    }

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, ...trimmedFields } : task
      )
    );
    setEditingId(null);
    toast.success("Tarea guardada con éxito!");
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
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900"
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
                <td className="px-6 py-4">
                  {editingId === task.id ? (
                    <input
                      type="text"
                      className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      defaultValue={task.name}
                      onBlur={(e) =>
                        handleSave(task.id, { ...task, name: e.target.value })
                      }
                    />
                  ) : (
                    <span className="text-sm font-medium text-gray-900">
                      {task.name}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === task.id ? (
                    <input
                      type="text"
                      className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      defaultValue={task.description}
                      onBlur={(e) =>
                        handleSave(task.id, {
                          ...task,
                          description: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <span className="text-sm text-gray-700">
                      {task.description}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === task.id ? (
                    <select
                      className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      defaultValue={task.priority}
                      onChange={(e) =>
                        handleSave(task.id, {
                          ...task,
                          priority: e.target.value,
                        })
                      }
                    >
                      <option value="Alta">Alta</option>
                      <option value="Media">Media</option>
                      <option value="Baja">Baja</option>
                    </select>
                  ) : (
                    <span className="text-sm text-gray-700">{task.priority}</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === task.id ? (
                    <input
                      type="date"
                      className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      defaultValue={task.dueDate}
                      onBlur={(e) =>
                        handleSave(task.id, {
                          ...task,
                          dueDate: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <span className="text-sm text-gray-700">{task.dueDate}</span>
                  )}
                </td>
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
                  >
                    {task.status}
                  </motion.button>
                </td>
                <td className="px-6 py-4">
                  {editingId === task.id ? (
                    <input
                      type="text"
                      className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      defaultValue={task.assignedTo}
                      onBlur={(e) =>
                        handleSave(task.id, {
                          ...task,
                          assignedTo: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <span className="text-sm text-gray-700">
                      {task.assignedTo}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 flex gap-2">
                  {editingId === task.id ? (
                    <motion.button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Guardar
                    </motion.button>
                  ) : (
                    <motion.button
                      onClick={() => setEditingId(task.id)}
                      className="px-3 py-1 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Editar
                    </motion.button>
                  )}
                  <motion.button
                    onClick={() => handleDelete(task.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
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
        >
          Siguiente
        </motion.button>
      </div>
    </motion.div>
  );
};

export default TareasPage;