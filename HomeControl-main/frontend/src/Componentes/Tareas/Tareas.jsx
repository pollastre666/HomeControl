import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../Autenticacion/AuthProvider";
import { db } from "../../config/firebase";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import Layout from "../../hocs/layouts/layout";
import debounce from "lodash/debounce";

const TareasTable = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterAssignedTo, setFilterAssignedTo] = useState("");
  const [sortColumn, setSortColumn] = useState("dueDate");
  const [sortDirection, setSortDirection] = useState("asc");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priority: "Media",
    category: "Trabajo",
    dueDate: new Date().toISOString().split("T")[0],
    status: "Pendiente",
    assignedTo: "",
    sharedWith: [],
  });
  const [formErrors, setFormErrors] = useState({});
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notifiedTasks, setNotifiedTasks] = useState(() => {
    return JSON.parse(localStorage.getItem(`notifiedTasks_${user?.uid}`) || "{}");
  });
  const itemsPerPage = 7;

  // Default form data for resets
  const getDefaultFormData = () => ({
    name: "",
    description: "",
    priority: "Media",
    category: "Trabajo",
    dueDate: new Date().toISOString().split("T")[0],
    status: "Pendiente",
    assignedTo: "",
    sharedWith: [],
  });

  // Validation rules
  const validateForm = useCallback(() => {
    const errors = {};
    const nameRegex = /^[a-zA-Z0-9\s]{3,50}$/;
    if (!formData.name.trim()) {
      errors.name = "El nombre es obligatorio";
    } else if (!nameRegex.test(formData.name.trim())) {
      errors.name = "El nombre debe tener 3-50 caracteres alfanuméricos";
    }
    if (formData.description.length > 500) {
      errors.description = "La descripción no puede exceder 500 caracteres";
    }
    if (!formData.dueDate) {
      errors.dueDate = "La fecha de vencimiento es obligatoria";
    } else if (new Date(formData.dueDate) < new Date().setHours(0, 0, 0, 0)) {
      errors.dueDate = "La fecha no puede ser anterior a hoy";
    }
    if (!formData.assignedTo.trim()) {
      errors.assignedTo = "Asignar a alguien es obligatorio";
    }
    if (!formData.category) {
      errors.category = "La categoría es obligatoria";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  // Real-time task fetching from Firestore
  useEffect(() => {
    if (!user) return;

    setIsLoading(true);
    const tasksRef = collection(db, `users/${user.uid}/tasks`);
    const unsubscribe = onSnapshot(
      tasksRef,
      (snapshot) => {
        const fetchedTasks = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          sharedWith: doc.data().sharedWith || [],
        }));
        setTasks(fetchedTasks);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error listening to tasks:", error);
        toast.error("Error al cargar las tareas en tiempo real");
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Notify about overdue tasks
  useEffect(() => {
    if (!user) return;

    const today = new Date();
    tasks.forEach((task) => {
      const dueDate = new Date(task.dueDate);
      if (
        dueDate < today &&
        task.status !== "Completada" &&
        !notifiedTasks[task.id]
      ) {
        toast.warn(`Tarea "${task.name}" está vencida! Fecha límite: ${task.dueDate}`);
        setNotifiedTasks((prev) => {
          const updated = { ...prev, [task.id]: true };
          localStorage.setItem(`notifiedTasks_${user.uid}`, JSON.stringify(updated));
          return updated;
        });
      }
    });
  }, [tasks, user, notifiedTasks]);

  // Utility functions
  const isTaskOverdue = (dueDate, status) => {
    const today = new Date();
    const taskDate = new Date(dueDate);
    return taskDate < today && status !== "Completada";
  };

  const isTaskDueSoon = (dueDate, status) => {
    const today = new Date();
    const taskDate = new Date(dueDate);
    const diffDays = (taskDate - today) / (1000 * 60 * 60 * 24);
    return diffDays <= 2 && diffDays >= 0 && status !== "Completada";
  };

  // Modal handlers
  const openModal = useCallback((task = null) => {
    if (task) {
      setFormData({
        name: task.name,
        description: task.description,
        priority: task.priority,
        category: task.category,
        dueDate: task.dueDate,
        status: task.status,
        assignedTo: task.assignedTo,
        sharedWith: task.sharedWith,
      });
      setEditingTask(task);
    } else {
      setFormData(getDefaultFormData());
      setEditingTask(null);
    }
    setFormErrors({});
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditingTask(null);
    setFormData(getDefaultFormData());
    setFormErrors({});
  }, []);

  const handleSaveTask = async () => {
    if (!validateForm()) return;
    if (!user) {
      toast.error("Usuario no autenticado. Por favor, inicia sesión.");
      return;
    }

    setIsLoading(true);
    const trimmedData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      category: formData.category,
      dueDate: formData.dueDate,
      status: formData.status,
      assignedTo: formData.assignedTo.trim(),
      sharedWith: formData.sharedWith,
    };

    try {
      const tasksRef = collection(db, `users/${user.uid}/tasks`);
      if (editingTask) {
        const taskDocRef = doc(db, `users/${user.uid}/tasks`, editingTask.id);
        await updateDoc(taskDocRef, trimmedData);
        toast.success("Tarea actualizada con éxito!");
      } else {
        await addDoc(tasksRef, trimmedData);
        toast.success("Tarea añadida con éxito!");
      }
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error(`Error al guardar la tarea: ${error.message}`);
    } finally {
      setIsLoading(false);
      closeModal();
    }
  };

  const handleDelete = async (id) => {
    if (!user) {
      toast.error("Usuario no autenticado");
      return;
    }
    if (window.confirm("¿Seguro que quieres eliminar esta tarea?")) {
      try {
        const taskDocRef = doc(db, `users/${user.uid}/tasks`, id);
        await deleteDoc(taskDocRef);
        setNotifiedTasks((prev) => {
          const updated = { ...prev };
          delete updated[id];
          localStorage.setItem(`notifiedTasks_${user.uid}`, JSON.stringify(updated));
          return updated;
        });
        toast.success("Tarea eliminada con éxito!");
      } catch (error) {
        console.error("Error deleting task:", error);
        toast.error("Error al eliminar la tarea");
      }
    }
  };

  const handleBulkDelete = async () => {
    if (!user) {
      toast.error("Usuario no autenticado");
      return;
    }
    if (selectedTasks.length === 0) {
      toast.warn("Selecciona al menos una tarea para eliminar");
      return;
    }
    if (
      window.confirm(
        `¿Seguro que quieres eliminar ${selectedTasks.length} tareas?`
      )
    ) {
      try {
        const deletePromises = selectedTasks.map((id) =>
          deleteDoc(doc(db, `users/${user.uid}/tasks`, id))
        );
        await Promise.all(deletePromises);
        setNotifiedTasks((prev) => {
          const updated = { ...prev };
          selectedTasks.forEach((id) => delete updated[id]);
          localStorage.setItem(`notifiedTasks_${user.uid}`, JSON.stringify(updated));
          return updated;
        });
        setSelectedTasks([]);
        toast.success("Tareas eliminadas con éxito!");
      } catch (error) {
        console.error("Error bulk deleting tasks:", error);
        toast.error("Error al eliminar las tareas");
      }
    }
  };

  const handleBulkStatusChange = async (status) => {
    if (!user) {
      toast.error("Usuario no autenticado");
      return;
    }
    if (selectedTasks.length === 0) {
      toast.warn("Selecciona al menos una tarea para actualizar");
      return;
    }
    try {
      const updatePromises = selectedTasks.map((id) =>
        updateDoc(doc(db, `users/${user.uid}/tasks`, id), { status })
      );
      await Promise.all(updatePromises);
      setSelectedTasks([]);
      toast.success("Estado de las tareas actualizado!");
    } catch (error) {
      console.error("Error bulk updating tasks:", error);
      toast.error("Error al actualizar las tareas");
    }
  };

  const handleToggleStatus = async (id) => {
    if (!user) {
      toast.error("Usuario no autenticado");
      return;
    }
    const task = tasks.find((t) => t.id === id);
    const newStatus = task.status === "Completada" ? "Pendiente" : "Completada";
    try {
      const taskDocRef = doc(db, `users/${user.uid}/tasks`, id);
      await updateDoc(taskDocRef, { status: newStatus });
      toast.success("Estado de la tarea actualizado!");
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Error al actualizar el estado");
    }
  };

  const toggleSelectTask = useCallback((id) => {
    setSelectedTasks((prev) =>
      prev.includes(id) ? prev.filter((taskId) => taskId !== id) : [...prev, id]
    );
  }, []);

  // Export functions
  const exportToCSV = useCallback(() => {
    const headers = [
      "ID,Nombre,Descripción,Prioridad,Categoría,Fecha de Vencimiento,Estado,Asignado a,Compartido con",
    ];
    const rows = tasks.map((task) =>
      [
        task.id,
        `"${task.name.replace(/"/g, '""')}"`,
        `"${task.description.replace(/"/g, '""')}"`,
        task.priority,
        task.category,
        task.dueDate,
        task.status,
        task.assignedTo,
        task.sharedWith.join(";"),
      ].join(",")
    );
    const csvContent = [...headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "tareas.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Tareas exportadas a CSV!");
  }, [tasks]);

  const exportToJSON = useCallback(() => {
    const jsonContent = JSON.stringify(tasks, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "tareas.json");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Tareas exportadas a JSON!");
  }, [tasks]);

  // Task summary
  const taskSummary = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "Completada").length;
    const overdue = tasks.filter((t) => isTaskOverdue(t.dueDate, t.status)).length;
    const byPriority = {
      Alta: tasks.filter((t) => t.priority === "Alta").length,
      Media: tasks.filter((t) => t.priority === "Media").length,
      Baja: tasks.filter((t) => t.priority === "Baja").length,
    };
    const byCategory = tasks.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    }, {});
    return { total, completed, overdue, byPriority, byCategory };
  }, [tasks]);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((value) => setSearchTerm(value), 300),
    []
  );

  // Sorting and Filtering
  const sortedAndFilteredTasks = useMemo(() => {
    let filtered = tasks.filter(
      (task) =>
        (task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterPriority ? task.priority === filterPriority : true) &&
        (filterStatus ? task.status === filterStatus : true) &&
        (filterCategory ? task.category === filterCategory : true) &&
        (filterAssignedTo
          ? task.assignedTo.toLowerCase().includes(filterAssignedTo.toLowerCase())
          : true)
    );

    return filtered.sort((a, b) => {
      const valueA = a[sortColumn];
      const valueB = b[sortColumn];
      if (sortColumn === "dueDate") {
        return sortDirection === "asc"
          ? new Date(valueA) - new Date(valueB)
          : new Date(valueB) - new Date(valueA);
      }
      return sortDirection === "asc"
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
    });
  }, [
    tasks,
    searchTerm,
    filterPriority,
    filterStatus,
    filterCategory,
    filterAssignedTo,
    sortColumn,
    sortDirection,
  ]);

  const totalPages = Math.max(1, Math.ceil(sortedAndFilteredTasks.length / itemsPerPage));
  const indexOfLastTask = currentPage * itemsPerPage;
  const indexOfFirstTask = indexOfLastTask - itemsPerPage;
  const currentTasks = sortedAndFilteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  const handleSort = useCallback((column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  }, [sortColumn, sortDirection]);

  const handlePageChange = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  }, [totalPages]);

  if (!user) {
    return (
      <Layout>
        <div className="text-center text-gray-600 py-8">
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
      className="p-4 sm:p-6 md:p-8 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl max-w-6xl mx-auto border border-amber-200/50 mt-8 mb-8"
      role="region"
      aria-labelledby="tareas-heading"
    >
      {/* Task Summary Dashboard */}
      <div className="mb-6 p-4 sm:p-6 bg-amber-50 rounded-lg shadow-inner">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Resumen de Tareas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Total Tareas</p>
            <p className="text-xl sm:text-2xl font-semibold text-gray-900">{taskSummary.total}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Completadas</p>
            <p className="text-xl sm:text-2xl font-semibold text-green-600">{taskSummary.completed}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Vencidas</p>
            <p className="text-xl sm:text-2xl font-semibold text-red-600">{taskSummary.overdue}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Por Prioridad</p>
            <p className="text-sm">
              Alta: {taskSummary.byPriority.Alta} | Media: {taskSummary.byPriority.Media} | Baja: {taskSummary.byPriority.Baja}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Por Categoría</p>
            <p className="text-sm">
              {Object.entries(taskSummary.byCategory)
                .map(([cat, count]) => `${cat}: ${count}`)
                .join(" | ")}
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2
          id="tareas-heading"
          className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight"
        >
          Control Doméstico - Tareas
        </h2>
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Buscar tareas..."
            onChange={(e) => debouncedSearch(e.target.value)}
            className="px-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 shadow-sm"
            aria-label="Buscar tareas"
          />
          <motion.button
            onClick={() => openModal()}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition duration-200 shadow-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            + Añadir Tarea
          </motion.button>
          <motion.button
            onClick={exportToCSV}
            className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition duration-200 shadow-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Exportar CSV
          </motion.button>
          <motion.button
            onClick={exportToJSON}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 shadow-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Exportar JSON
          </motion.button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Filtrar por Prioridad</label>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
          >
            <option value="">Todas</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Filtrar por Estado</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
          >
            <option value="">Todos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="En Progreso">En Progreso</option>
            <option value="Completada">Completada</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Filtrar por Categoría</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
          >
            <option value="">Todas</option>
            <option value="Trabajo">Trabajo</option>
            <option value="Personal">Personal</option>
            <option value="Urgente">Urgente</option>
            <option value="Otros">Otros</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Filtrar por Asignado</label>
          <input
            type="text"
            value={filterAssignedTo}
            onChange={(e) => setFilterAssignedTo(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
            placeholder="Filtrar por asignado..."
          />
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedTasks.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-3">
          <motion.button
            onClick={handleBulkDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Eliminar Seleccionados ({selectedTasks.length})
          </motion.button>
          <motion.button
            onClick={() => handleBulkStatusChange("Completada")}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Marcar Completados
          </motion.button>
          <motion.button
            onClick={() => handleBulkStatusChange("Pendiente")}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 shadow-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Marcar Pendientes
          </motion.button>
        </div>
      )}

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
          <p className="mt-2 text-gray-600">Cargando tareas...</p>
        </div>
      )}

      {/* Table for Desktop / Cards for Mobile */}
      {!isLoading && (
        <>
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              No hay tareas. Crea una nueva tarea para comenzar.
            </div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-amber-200">
                  <thead className="bg-amber-50">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          onChange={(e) =>
                            setSelectedTasks(
                              e.target.checked ? currentTasks.map((task) => task.id) : []
                            )
                          }
                          checked={selectedTasks.length === currentTasks.length && currentTasks.length > 0}
                        />
                      </th>
                      <th
                        onClick={() => handleSort("id")}
                        className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                      >
                        ID {sortColumn === "id" && (sortDirection === "asc" ? "↑" : "↓")}
                      </th>
                      <th
                        onClick={() => handleSort("name")}
                        className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                      >
                        Tarea {sortColumn === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Descripción
                      </th>
                      <th
                        onClick={() => handleSort("priority")}
                        className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                      >
                        Prioridad {sortColumn === "priority" && (sortDirection === "asc" ? "↑" : "↓")}
                      </th>
                      <th
                        onClick={() => handleSort("category")}
                        className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                      >
                        Categoría {sortColumn === "category" && (sortDirection === "asc" ? "↑" : "↓")}
                      </th>
                      <th
                        onClick={() => handleSort("dueDate")}
                        className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                      >
                        Fecha {sortColumn === "dueDate" && (sortDirection === "asc" ? "↑" : "↓")}
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Estado
                      </th>
                      <th
                        onClick={() => handleSort("assignedTo")}
                        className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                      >
                        Asignado {sortColumn === "assignedTo" && (sortDirection === "asc" ? "↑" : "↓")}
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-amber-100">
                    {currentTasks.map((task, index) => (
                      <motion.tr
                        key={task.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`hover:bg-amber-50 ${
                          isTaskOverdue(task.dueDate, task.status)
                            ? "bg-red-100"
                            : isTaskDueSoon(task.dueDate, task.status)
                            ? "bg-yellow-100"
                            : ""
                        }`}
                      >
                        <td className="px-4 sm:px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedTasks.includes(task.id)}
                            onChange={() => toggleSelectTask(task.id)}
                          />
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{task.id}</td>
                        <td className="px-4 sm:px-6 py-4 text-sm font-medium text-gray-900">{task.name}</td>
                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-700">{task.description}</td>
                        <td className="px-4 sm:px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-white ${
                              task.priority === "Alta"
                                ? "bg-red-500"
                                : task.priority === "Media"
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }`}
                          >
                            {task.priority}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-700">{task.category}</td>
                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-700">{task.dueDate}</td>
                        <td className="px-4 sm:px-6 py-4">
                          <motion.button
                            onClick={() => handleToggleStatus(task.id)}
                            className={`px-3 py-1 rounded text-white ${
                              task.status === "Completada"
                                ? "bg-green-500 hover:bg-green-600"
                                : task.status === "En Progreso"
                                ? "bg-yellow-500 hover:bg-yellow-600"
                                : "bg-red-500 hover:bg-red-600"
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label={`Cambiar estado de ${task.name} a ${
                              task.status === "Completada" ? "Pendiente" : "Completada"
                            }`}
                          >
                            {task.status}
                          </motion.button>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-700">{task.assignedTo}</td>
                        <td className="px-4 sm:px-6 py-4 flex gap-2">
                          <motion.button
                            onClick={() => openModal(task)}
                            className="px-3 py-1 bg-amber-500 text-white rounded-lg hover:bg-amber-600 shadow-sm"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label={`Editar ${task.name}`}
                          >
                            Editar
                          </motion.button>
                          <motion.button
                            onClick={() => handleDelete(task.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-sm"
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

              {/* Mobile View: Card Layout */}
              <div className="md:hidden space-y-4">
                {currentTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`p-4 bg-white rounded-lg shadow-md border-l-4 ${
                      isTaskOverdue(task.dueDate, task.status)
                        ? "border-red-500"
                        : isTaskDueSoon(task.dueDate, task.status)
                        ? "border-yellow-500"
                        : "border-green-500"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <input
                        type="checkbox"
                        checked={selectedTasks.includes(task.id)}
                        onChange={() => toggleSelectTask(task.id)}
                      />
                      <h3 className="text-lg font-semibold text-gray-900">{task.name}</h3>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{task.description}</p>
                    <p className="text-sm mt-1">
                      <span className="font-medium">Prioridad:</span>{" "}
                      <span
                        className={`px-2 py-1 rounded-full text-white ${
                          task.priority === "Alta"
                            ? "bg-red-500"
                            : task.priority === "Media"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                      >
                        {task.priority}
                      </span>
                    </p>
                    <p className="text-sm mt-1">
                      <span className="font-medium">Categoría:</span> {task.category}
                    </p>
                    <p className="text-sm mt-1">
                      <span className="font-medium">Fecha:</span> {task.dueDate}
                    </p>
                    <p className="text-sm mt-1">
                      <span className="font-medium">Estado:</span>{" "}
                      <motion.button
                        onClick={() => handleToggleStatus(task.id)}
                        className={`px-3 py-1 rounded text-white ${
                          task.status === "Completada"
                            ? "bg-green-500 hover:bg-green-600"
                            : task.status === "En Progreso"
                            ? "bg-yellow-500 hover:bg-yellow-600"
                            : "bg-red-500 hover:bg-red-600"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {task.status}
                      </motion.button>
                    </p>
                    <p className="text-sm mt-1">
                      <span className="font-medium">Asignado:</span> {task.assignedTo}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <motion.button
                        onClick={() => openModal(task)}
                        className="px-3 py-1 bg-amber-500 text-white rounded-lg hover:bg-amber-600 shadow-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Editar
                      </motion.button>
                      <motion.button
                        onClick={() => handleDelete(task.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Eliminar
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center gap-2">
                  <motion.button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === 1
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-amber-500 hover:bg-amber-600 text-white"
                    }`}
                    whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
                    whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
                  >
                    Anterior
                  </motion.button>
                  <span className="px-4 py-2 text-gray-700">
                    Página {currentPage} de {totalPages}
                  </span>
                  <motion.button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === totalPages
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-amber-500 hover:bg-amber-600 text-white"
                    }`}
                    whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
                    whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
                  >
                    Siguiente
                  </motion.button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Modal for Adding/Editing Task */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={closeModal}
            role="dialog"
            aria-labelledby="modal-title"
            aria-modal="true"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-4xl mx-4 sm:mx-6 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 id="modal-title" className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                {editingTask ? "Editar Tarea" : "Añadir Nueva Tarea"}
              </h2>
              <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                {/* Name */}
                <div className="w-full sm:w-1/4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
                    placeholder="Nombre de la tarea"
                    aria-invalid={!!formErrors.name}
                    aria-describedby={formErrors.name ? "name-error" : undefined}
                  />
                  {formErrors.name && (
                    <p id="name-error" className="text-red-600 text-xs mt-1">{formErrors.name}</p>
                  )}
                </div>

                {/* Priority */}
                <div className="w-full sm:w-1/4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
                  >
                    <option value="Alta">Alta</option>
                    <option value="Media">Media</option>
                    <option value="Baja">Baja</option>
                  </select>
                </div>

                {/* Due Date */}
                <div className="w-full sm:w-1/4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Vencimiento</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
                    aria-invalid={!!formErrors.dueDate}
                    aria-describedby={formErrors.dueDate ? "dueDate-error" : undefined}
                  />
                  {formErrors.dueDate && (
                    <p id="dueDate-error" className="text-red-600 text-xs mt-1">{formErrors.dueDate}</p>
                  )}
                </div>

                {/* Assigned To */}
                <div className="w-full sm:w-1/4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Asignado a</label>
                  <input
                    type="text"
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
                    placeholder="Nombre del asignado"
                    aria-invalid={!!formErrors.assignedTo}
                    aria-describedby={formErrors.assignedTo ? "assignedTo-error" : undefined}
                  />
                  {formErrors.assignedTo && (
                    <p id="assignedTo-error" className="text-red-600 text-xs mt-1">{formErrors.assignedTo}</p>
                  )}
                </div>

                {/* Description */}
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
                    rows="4"
                    placeholder="Detalles de la tarea"
                    aria-invalid={!!formErrors.description}
                    aria-describedby={formErrors.description ? "description-error" : undefined}
                  />
                  {formErrors.description && (
                    <p id="description-error" className="text-red-600 text-xs mt-1">{formErrors.description}</p>
                  )}
                </div>

                {/* Category */}
                <div className="w-full sm:w-1/4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
                    aria-invalid={!!formErrors.category}
                    aria-describedby={formErrors.category ? "category-error" : undefined}
                  >
                    <option value="Trabajo">Trabajo</option>
                    <option value="Personal">Personal</option>
                    <option value="Urgente">Urgente</option>
                    <option value="Otros">Otros</option>
                  </select>
                  {formErrors.category && (
                    <p id="category-error" className="text-red-600 text-xs mt-1">{formErrors.category}</p>
                  )}
                </div>

                {/* Status */}
                <div className="w-full sm:w-1/4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="En Progreso">En Progreso</option>
                    <option value="Completada">Completada</option>
                  </select>
                </div>

                {/* Shared With */}
                <div className="w-full sm:w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Compartido con</label>
                  <input
                    type="text"
                    value={formData.sharedWith.join(", ")}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sharedWith: e.target.value.split(",").map((item) => item.trim()).filter(Boolean),
                      })
                    }
                    className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
                    placeholder="Correos separados por comas"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="mt-6 flex justify-end gap-3">
                <motion.button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition duration-200 shadow-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancelar
                </motion.button>
                <motion.button
                  onClick={handleSaveTask}
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-lg text-white shadow-sm ${
                    isLoading ? "bg-amber-300 cursor-not-allowed" : "bg-amber-500 hover:bg-amber-600"
                  }`}
                  whileHover={{ scale: isLoading ? 1 : 1.05 }}
                  whileTap={{ scale: isLoading ? 1 : 0.95 }}
                >
                  {isLoading ? "Guardando..." : editingTask ? "Actualizar Tarea" : "Añadir Tarea"}
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