// src/hooks/useTasks.js
import { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../Componentes/Autenticacion/AuthProvider';
import { db } from '../config/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import debounce from 'lodash/debounce';

export const useTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterAssignedTo, setFilterAssignedTo] = useState('');
  const [sortColumn, setSortColumn] = useState('dueDate');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch tasks
  useEffect(() => {
    if (!user) return;
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const tasksRef = collection(db, `users/${user.uid}/tasks`);
        const querySnapshot = await getDocs(tasksRef);
        const fetchedTasks = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(fetchedTasks);
      } catch (error) {
        toast.error('Error al cargar las tareas');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, [user]);

  // Notify overdue and soon-due tasks
  useEffect(() => {
    const today = new Date();
    tasks.forEach((task) => {
      const dueDate = new Date(task.dueDate);
      if (dueDate < today && task.status !== 'Completada') {
        toast.warn(`Tarea "${task.name}" está vencida! Fecha límite: ${task.dueDate}`);
      } else if (
        (dueDate - today) / (1000 * 60 * 60 * 24) <= 2 &&
        dueDate >= today &&
        task.status !== 'Completada'
      ) {
        toast.warn(`Tarea "${task.name}" vence pronto: ${task.dueDate}`);
      }
    });
  }, [tasks]);

  // Debounced search
  const debouncedSetSearchTerm = useCallback(
    debounce((value) => setSearchTerm(value), 300),
    []
  );

  // Sorted and filtered tasks
  const sortedAndFilteredTasks = useMemo(() => {
    let filtered = tasks.filter(
      (task) =>
        (task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
         task.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))) &&
        (filterPriority ? task.priority === filterPriority : true) &&
        (filterStatus ? task.status === filterStatus : true) &&
        (filterAssignedTo ? task.assignedTo.toLowerCase().includes(filterAssignedTo.toLowerCase()) : true)
    );

    return filtered.sort((a, b) => {
      const valueA = a[sortColumn];
      const valueB = b[sortColumn];
      if (sortColumn === 'dueDate') {
        return sortDirection === 'asc'
          ? new Date(valueA) - new Date(valueB)
          : new Date(valueB) - new Date(valueA);
      }
      return sortDirection === 'asc'
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
    });
  }, [tasks, searchTerm, filterPriority, filterStatus, filterAssignedTo, sortColumn, sortDirection]);

  // Task actions
  const addTask = async (taskData) => {
    if (!user) {
      toast.error('Usuario no autenticado');
      return;
    }
    setIsLoading(true);
    try {
      const tasksRef = collection(db, `users/${user.uid}/tasks`);
      const newTaskRef = await addDoc(tasksRef, taskData);
      setTasks((prev) => [...prev, { id: newTaskRef.id, ...taskData }]);
      toast.success('Tarea añadida con éxito!');
    } catch (error) {
      toast.error('Error al añadir la tarea');
    } finally {
      setIsLoading(false);
    }
  };

  const updateTask = async (id, taskData) => {
    if (!user) {
      toast.error('Usuario no autenticado');
      return;
    }
    setIsLoading(true);
    try {
      const taskDocRef = doc(db, `users/${user.uid}/tasks`, id);
      await updateDoc(taskDocRef, taskData);
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, ...taskData } : task))
      );
      toast.success('Tarea actualizada con éxito!');
    } catch (error) {
      toast.error('Error al actualizar la tarea');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (id) => {
    if (!user) {
      toast.error('Usuario no autenticado');
      return;
    }
    if (window.confirm('¿Seguro que quieres eliminar esta tarea?')) {
      try {
        const taskDocRef = doc(db, `users/${user.uid}/tasks`, id);
        await deleteDoc(taskDocRef);
        setTasks((prev) => prev.filter((task) => task.id !== id));
        setSelectedTasks((prev) => prev.filter((taskId) => taskId !== id));
        toast.success('Tarea eliminada con éxito!');
      } catch (error) {
        toast.error('Error al eliminar la tarea');
      }
    }
  };

  const bulkDelete = async () => {
    if (!user || selectedTasks.length === 0) {
      toast.warn('Selecciona al menos una tarea');
      return;
    }
    if (window.confirm(`¿Seguro que quieres eliminar ${selectedTasks.length} tareas?`)) {
      try {
        const deletePromises = selectedTasks.map((id) =>
          deleteDoc(doc(db, `users/${user.uid}/tasks`, id))
        );
        await Promise.all(deletePromises);
        setTasks((prev) => prev.filter((task) => !selectedTasks.includes(task.id)));
        setSelectedTasks([]);
        toast.success('Tareas eliminadas con éxito!');
      } catch (error) {
        toast.error('Error al eliminar las tareas');
      }
    }
  };

  const bulkUpdateStatus = async (status) => {
    if (!user || selectedTasks.length === 0) {
      toast.warn('Selecciona al menos una tarea');
      return;
    }
    try {
      const updatePromises = selectedTasks.map((id) =>
        updateDoc(doc(db, `users/${user.uid}/tasks`, id), { status })
      );
      await Promise.all(updatePromises);
      setTasks((prev) =>
        prev.map((task) =>
          selectedTasks.includes(task.id) ? { ...task, status } : task
        )
      );
      setSelectedTasks([]);
      toast.success('Estado de las tareas actualizado!');
    } catch (error) {
      toast.error('Error al actualizar las tareas');
    }
  };

  const cloneTask = async (task) => {
    if (!user) {
      toast.error('Usuario no autenticado');
      return;
    }
    const clonedTask = {
      ...task,
      name: `${task.name} (Copia)`,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0],
    };
    await addTask(clonedTask);
  };

  const exportToCSV = (tasksToExport = sortedAndFilteredTasks) => {
    const headers = ['ID,Nombre,Descripción,Prioridad,Fecha de Vencimiento,Estado,Asignado a,Etiquetas'];
    const rows = tasksToExport.map((task) =>
      [
        task.id,
        task.name,
        task.description,
        task.priority,
        task.dueDate,
        task.status,
        task.assignedTo,
        task.tags?.join(', ') || '',
      ]
        .map((value) => `"${value}"`)
        .join(',')
    );
    const csvContent = [...headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'tareas.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Tareas exportadas a CSV!');
  };

  return {
    tasks,
    sortedAndFilteredTasks,
    searchTerm,
    setSearchTerm: debouncedSetSearchTerm,
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
  };
};