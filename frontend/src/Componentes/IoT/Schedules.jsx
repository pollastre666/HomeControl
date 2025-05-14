import React, { useState, useEffect } from 'react';
import { useAuth } from '../Autenticacion/AuthProvider';
import { db } from '../../config/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import Layout from '../../hocs/layouts/layout';
import { motion } from 'framer-motion';
import Spinner from '../Spinner';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

// Animation variants for cards
const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2 } },
};

// Modal variants
const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

const Schedules = () => {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [devices, setDevices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    devices: [], // [{ deviceId, time }]
    days: 'Cada dia',
    active: true,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 7;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) {
          console.error('Schedules: No user authenticated');
          setError('Debes iniciar sesión para ver los horarios. Por favor, inicia sesión.');
          setIsLoading(false);
          toast.error('Inicia sesión para continuar');
          return;
        }

        console.log('Schedules: Fetching data for user:', user.uid, { email: user.email });
        // Fetch devices
        console.log('Schedules: Fetching devices...');
        const devicesCollection = await getDocs(collection(db, 'devices'));
        const userDevices = devicesCollection.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(d => d.owner === user.uid);
        console.log('Schedules: Devices fetched:', userDevices.length, userDevices);
        setDevices(userDevices);

        // Fetch schedules
        console.log('Schedules: Fetching schedules...');
        const schedulesCollection = await getDocs(collection(db, 'schedules'));
        const userSchedules = schedulesCollection.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(s => s.owner === user.uid);
        console.log('Schedules: Schedules fetched:', userSchedules.length, userSchedules);
        setSchedules(userSchedules);

        setIsLoading(false);
      } catch (error) {
        console.error('Schedules: Data fetch error:', error.code, error.message, error.stack);
        const errorMessage = error.code === 'permission-denied'
          ? 'No tienes permiso para cargar dispositivos o horarios. Verifica tu autenticación o contacta al administrador.'
          : `Error al cargar datos: ${error.message}`;
        setError(errorMessage);
        toast.error(errorMessage);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const openModal = (schedule = null) => {
    console.log('Schedules: Opening modal, editing:', schedule?.id || 'new');
    if (!user) {
      toast.error('Debes iniciar sesión para editar horarios.');
      return;
    }
    if (devices.length === 0 && !schedule) {
      toast.error('Añade dispositivos antes de crear un horario.');
      return;
    }
    setEditingSchedule(schedule);
    setFormData(
      schedule
        ? {
            name: schedule.name,
            devices: schedule.devices || [],
            days: schedule.days,
            active: schedule.active,
          }
        : { name: `Horari ${schedules.length + 1}`, devices: [], days: 'Cada dia', active: true }
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    console.log('Schedules: Closing modal');
    setIsModalOpen(false);
    setEditingSchedule(null);
    setFormData({ name: '', devices: [], days: 'Cada dia', active: true });
    setError(null);
  };

  const handleAddDeviceToSchedule = () => {
    console.log('Schedules: Adding device to schedule form');
    if (devices.length === 0) {
      toast.error('No hay dispositivos disponibles para añadir.');
      return;
    }
    setFormData(prev => ({
      ...prev,
      devices: [...prev.devices, { deviceId: devices[0].id, time: '00:00' }],
    }));
  };

  const handleDeviceChange = (index, field, value) => {
    console.log('Schedules: Updating device in form:', { index, field, value });
    setFormData(prev => ({
      ...prev,
      devices: prev.devices.map((d, i) =>
        i === index ? { ...d, [field]: value } : d
      ),
    }));
  };

  const handleRemoveDevice = (index) => {
    console.log('Schedules: Removing device from form at index:', index);
    setFormData(prev => ({
      ...prev,
      devices: prev.devices.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    console.log('Schedules: Saving schedule:', formData);
    if (!user) {
      setError('Debes iniciar sesión para guardar horarios.');
      toast.error('Inicia sesión para continuar');
      return;
    }
    if (!formData.name.trim()) {
      setError('El nombre es obligatorio.');
      toast.error('El nombre es obligatorio.');
      return;
    }
    if (formData.devices.length === 0 || formData.devices.some(d => !d.deviceId || !d.time)) {
      setError('Debes seleccionar al menos un dispositivo con una hora válida.');
      toast.error('Selecciona al menos un dispositivo con una hora.');
      return;
    }
    if (formData.devices.some(d => !devices.find(device => device.id === d.deviceId))) {
      setError('Uno o más dispositivos seleccionados no son válidos.');
      toast.error('Dispositivos no válidos.');
      return;
    }

    try {
      const scheduleId = editingSchedule ? editingSchedule.id : `schedule-${Date.now()}`;
      const scheduleData = {
        owner: user.uid,
        name: formData.name.trim(),
        devices: formData.devices,
        days: formData.days,
        active: formData.active,
        createdAt: editingSchedule ? editingSchedule.createdAt : new Date(),
      };
      console.log('Schedules: Saving to Firestore:', scheduleData);
      await setDoc(doc(db, 'schedules', scheduleId), scheduleData);
      setSchedules(prev =>
        editingSchedule
          ? prev.map(s => (s.id === scheduleId ? { id: scheduleId, ...scheduleData } : s))
          : [...prev, { id: scheduleId, ...scheduleData }]
      );
      console.log('Schedules: Schedule saved:', scheduleId);
      toast.success('Horario guardado con éxito');
      closeModal();
    } catch (error) {
      console.error('Schedules: Error saving schedule:', error.code, error.message, error.stack);
      const errorMessage = error.code === 'permission-denied'
        ? 'No tienes permiso para guardar horarios. Verifica las reglas de Firestore o tu autenticación.'
        : `Error al guardar horario: ${error.message}`;
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (scheduleId) => {
    console.log('Schedules: Deleting schedule:', scheduleId);
    if (!user) {
      toast.error('Debes iniciar sesión para eliminar horarios.');
      return;
    }
    if (window.confirm('¿Seguro que quieres eliminar este horario?')) {
      try {
        await deleteDoc(doc(db, 'schedules', scheduleId));
        setSchedules(prev => prev.filter(s => s.id !== scheduleId));
        console.log('Schedules: Schedule deleted:', scheduleId);
        toast.success('Horario eliminado con éxito');
      } catch (error) {
        console.error('Schedules: Error deleting schedule:', error.code, error.message, error.stack);
        const errorMessage = error.code === 'permission-denied'
          ? 'No tienes permiso para eliminar horarios. Verifica las reglas de Firestore.'
          : `Error al eliminar horario: ${error.message}`;
        toast.error(errorMessage);
      }
    }
  };

  const handleToggleActive = async (scheduleId) => {
    console.log('Schedules: Toggling active state:', scheduleId);
    if (!user) {
      toast.error('Debes iniciar sesión para cambiar el estado.');
      return;
    }
    try {
      const schedule = schedules.find(s => s.id === scheduleId);
      if (!schedule) {
        console.error('Schedules: Schedule not found:', scheduleId);
        toast.error('Horario no encontrado.');
        return;
      }
      const updatedSchedule = { ...schedule, active: !schedule.active };
      await setDoc(doc(db, 'schedules', scheduleId), updatedSchedule);
      setSchedules(prev =>
        prev.map(s => (s.id === scheduleId ? updatedSchedule : s))
      );
      console.log('Schedules: Active state toggled:', scheduleId, updatedSchedule.active);
      toast.success(`Horario ${updatedSchedule.active ? 'activado' : 'desactivado'} con éxito`);
    } catch (error) {
      console.error('Schedules: Error toggling active:', error.code, error.message, error.stack);
      const errorMessage = error.code === 'permission-denied'
        ? 'No tienes permiso para cambiar el estado. Verifica las reglas de Firestore.'
        : `Error al cambiar estado: ${error.message}`;
      toast.error(errorMessage);
    }
  };

  const filteredSchedules = schedules.filter(schedule =>
    schedule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.days.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredSchedules.length / itemsPerPage));
  const indexOfLastSchedule = currentPage * itemsPerPage;
  const indexOfFirstSchedule = indexOfLastSchedule - itemsPerPage;
  const currentSchedules = filteredSchedules.slice(indexOfFirstSchedule, indexOfLastSchedule);

  const handlePageChange = (page) => {
    console.log('Schedules: Changing page to:', page);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div
        className="relative bg-gradient-to-br from-gray-50 via-white to-amber-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-amber-900/10 min-h-screen overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Dynamic Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-100/20 to-transparent dark:from-amber-900/10 dark:to-transparent animate-gradient-x" />
          <svg className="absolute inset-0 w-full h-full opacity-10 dark:opacity-20" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(255,193,7,0.05)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <g className="particles">
              {[...Array(20)].map((_, i) => (
                <circle
                  key={i}
                  cx={Math.random() * 100 + '%'}
                  cy={Math.random() * 100 + '%'}
                  r={Math.random() * 2 + 1}
                  fill="rgba(255,193,7,0.3)"
                  className="animate-float"
                />
              ))}
            </g>
          </svg>
        </div>

        <div className="relative max-w-6xl mx-auto p-6">
          <h1 className="text-4xl font-bold text-amber-600 dark:text-amber-400 mb-8 text-center">
            Horarios - IoT Solutions
          </h1>
          <motion.div
            className="bg-white/95 dark:bg-gray-800/95 rounded-xl shadow-2xl p-8 backdrop-blur-md border border-amber-200/40 dark:border-amber-900/40"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Control Domèstic - Horaris</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Cercar horaris..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 transition-all duration-200"
                />
                <motion.button
                  onClick={() => openModal()}
                  className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 dark:from-amber-500 dark:to-amber-600 text-white rounded-md hover:from-amber-700 hover:to-amber-800 transition-all duration-300 shadow-lg overflow-hidden relative group disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: user && devices.length > 0 ? 1.05 : 1 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!user || devices.length === 0}
                >
                  <span className="absolute inset-0 bg-amber-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10">+ Añadir Horario</span>
                </motion.button>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 dark:border-red-700 text-red-700 dark:text-red-200 p-4 rounded mb-6">
                <p>{error}</p>
                {!user && (
                  <p>
                    <Link to="/login" className="text-amber-600 dark:text-amber-400 underline">Inicia sesión</Link> para continuar.
                  </p>
                )}
                {user && devices.length === 0 && (
                  <p>
                    <Link to="/devices/add" className="text-amber-600 dark:text-amber-400 underline">Añade dispositivos</Link> para crear horarios.
                  </p>
                )}
              </div>
            )}

            {devices.length === 0 && (
              <div className="text-center text-gray-600 dark:text-gray-400 mb-6">
                No hay dispositivos disponibles. Añade dispositivos en{' '}
                <Link to="/devices/add" className="text-amber-600 dark:text-amber-400 underline">Añadir Dispositivo</Link>.
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentSchedules.map((schedule) => (
                <motion.div
                  key={schedule.id}
                  className="relative bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-xl p-6 border border-amber-200/40 dark:border-amber-900/40 backdrop-blur-md hover:shadow-2xl transition-all duration-300"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-amber-600 dark:text-amber-400">{schedule.name}</h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">ID: {schedule.id}</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Dispositivos:</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {schedule.devices && schedule.devices.length > 0
                          ? schedule.devices
                              .map(d => {
                                const device = devices.find(device => device.id === d.deviceId);
                                return device ? `${device.name} (${d.time})` : 'Desconocido';
                              })
                              .join(', ')
                          : 'Ningún dispositivo'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Días:</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{schedule.days}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Estado:</p>
                      <motion.button
                        onClick={() => handleToggleActive(schedule.id)}
                        className={`mt-1 px-3 py-1 rounded text-white ${
                          schedule.active
                            ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                            : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                        } transition-all duration-300 shadow-md overflow-hidden relative group disabled:opacity-50 disabled:cursor-not-allowed`}
                        whileHover={{ scale: user ? 1.05 : 1 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={!user}
                      >
                        <span className="absolute inset-0 bg-amber-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="relative z-10">{schedule.active ? 'Activo' : 'Inactivo'}</span>
                      </motion.button>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <motion.button
                      onClick={() => openModal(schedule)}
                      className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 dark:from-amber-500 dark:to-amber-600 text-white rounded-md hover:from-amber-700 hover:to-amber-800 transition-all duration-300 shadow-lg overflow-hidden relative group disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: user ? 1.05 : 1 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={!user}
                    >
                      <span className="absolute inset-0 bg-amber-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="relative z-10">Editar</span>
                    </motion.button>
                    <motion.button
                      onClick={() => handleDelete(schedule.id)}
                      className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 dark:from-red-500 dark:to-red-600 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg overflow-hidden relative group disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: user ? 1.05 : 1 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={!user}
                    >
                      <span className="absolute inset-0 bg-amber-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="relative z-10">Eliminar</span>
                    </motion.button>
                  </div>
                  <div className="absolute inset-0 animate-glow" style={{ boxShadow: '0 0 20px rgba(255,193,7,0.3)' }} />
                </motion.div>
              ))}
            </div>

            {currentSchedules.length === 0 && (
              <div className="text-center text-gray-600 dark:text-gray-400 mt-6">
                No hay horarios disponibles. Añade uno usando el botón de arriba{devices.length === 0 ? ' después de añadir dispositivos.' : '.'}
              </div>
            )}

            <div className="mt-6 flex justify-between items-center">
              <motion.button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 text-gray-800 dark:text-gray-200 rounded-md disabled:opacity-50 hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-500 dark:hover:to-gray-600 transition-all duration-300 shadow-md overflow-hidden relative group"
                whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="absolute inset-0 bg-amber-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10">Anterior</span>
              </motion.button>
              <span className="text-sm text-gray-700 dark:text-gray-300">Página {currentPage} de {totalPages}</span>
              <motion.button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 text-gray-800 dark:text-gray-200 rounded-md disabled:opacity-50 hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-500 dark:hover:to-gray-600 transition-all duration-300 shadow-md overflow-hidden relative group"
                whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="absolute inset-0 bg-amber-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10">Siguiente</span>
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Modal for Adding/Editing Schedules */}
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-lg w-full mx-4 border border-amber-200/40 dark:border-amber-900/40 shadow-2xl"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
            >
              <h2 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-6">
                {editingSchedule ? 'Editar Horario' : 'Añadir Horario'}
              </h2>
              {error && (
                <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 dark:border-red-700 text-red-700 dark:text-red-200 p-4 rounded mb-6">
                  <p>{error}</p>
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-amber-400 focus:ring-amber-400 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Días</label>
                  <select
                    value={formData.days}
                    onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-amber-400 focus:ring-amber-400 sm:text-sm"
                  >
                    <option value="Cada dia">Cada día</option>
                    <option value="Dilluns - Divendres">Lunes - Viernes</option>
                    <option value="Dissabte - Diumenge">Sábado - Domingo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Dispositivos</label>
                  {formData.devices.length === 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">Añade al menos un dispositivo.</p>
                  )}
                  {formData.devices.map((device, index) => (
                    <div key={index} className="flex items-center gap-2 mt-2">
                      <select
                        value={device.deviceId}
                        onChange={(e) => handleDeviceChange(index, 'deviceId', e.target.value)}
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-amber-400 focus:ring-amber-400 sm:text-sm"
                        required
                      >
                        <option value="">Selecciona un dispositivo</option>
                        {devices.map(d => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                      <input
                        type="time"
                        value={device.time}
                        onChange={(e) => handleDeviceChange(index, 'time', e.target.value)}
                        className="block w-32 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-amber-400 focus:ring-amber-400 sm:text-sm"
                        required
                      />
                      <button
                        onClick={() => handleRemoveDevice(index)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={handleAddDeviceToSchedule}
                    className="mt-2 text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-600 underline disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={devices.length === 0}
                  >
                    + Añadir dispositivo
                  </button>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <motion.button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancelar
                </motion.button>
                <motion.button
                  onClick={handleSave}
                  className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 dark:from-amber-500 dark:to-amber-600 text-white rounded-md hover:from-amber-700 hover:to-amber-800 transition-all duration-300 shadow-lg overflow-hidden relative group disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: user ? 1.05 : 1 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!user}
                >
                  <span className="absolute inset-0 bg-amber-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10">Guardar</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      {/* Custom CSS Animations */}
      <style>
        {`
          @keyframes gradient-x {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 15s ease infinite;
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .animate-float {
            animation: float 4s ease-in-out infinite;
          }
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 10px rgba(255,193,7,0.2); }
            50% { box-shadow: 0 0 20px rgba(255,193,7,0.4); }
          }
          .animate-glow {
            animation: glow 4s ease-in-out infinite;
          }
        `}
      </style>
    </Layout>
  );
};

export default Schedules;