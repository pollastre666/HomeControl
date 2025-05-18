
import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../Autenticacion/AuthProvider';
import { db } from '../../config/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import Layout from '../../hocs/layouts/layout';
import { toast } from 'react-toastify';

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: 'easeOut' },
  }),
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

// Custom hook for schedule execution
const useScheduleExecutor = (schedules, devices, user) => {
  useEffect(() => {
    if (!user || schedules.length === 0 || devices.length === 0) return;

    // Cache to prevent duplicate warnings (5-minute cooldown)
    const warningCache = new Map();

    // Helper to check if current time is within ±1 minute of scheduled time
    const isTimeClose = (scheduledTime, currentTime) => {
      const [schedHours, schedMinutes] = scheduledTime.split(':').map(Number);
      const [currHours, currMinutes] = currentTime.split(':').map(Number);
      const schedTotalMinutes = schedHours * 60 + schedMinutes;
      const currTotalMinutes = currHours * 60 + currMinutes;
      return Math.abs(schedTotalMinutes - currTotalMinutes) <= 1;
    };

    const checkSchedules = () => {
      const now = new Date();
      const currentTime = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC',
      });
      const currentDay = now.getDay();

      schedules.forEach(schedule => {
        if (!schedule.active) return;

        const isDayMatch = schedule.days === 'Cada día' ||
                          (schedule.days === 'Lunes - Viernes' && currentDay >= 1 && currentDay <= 5) ||
                          (schedule.days === 'Sábado - Domingo' && (currentDay === 0 || currentDay === 6));

        if (!isDayMatch) return; // Skip if day doesn't match

        schedule.devices.forEach(deviceSchedule => {
          // Only warn if time is close to scheduled time
          const shouldWarn = isTimeClose(deviceSchedule.time, currentTime);
          const cacheKey = `${schedule.id}-${deviceSchedule.deviceId}`;
          const lastWarned = warningCache.get(cacheKey) || 0;

          // Skip if warned recently (within 5 minutes)
          if (shouldWarn && Date.now() - lastWarned < 5 * 60 * 1000) return;

          if (deviceSchedule.time !== currentTime) {
            if (shouldWarn) {
              toast.warn(`Horario "${schedule.name}" no ejecutado: hora no coincide (${deviceSchedule.time} vs ${currentTime})`);
              warningCache.set(cacheKey, Date.now());
            }
            return;
          }

          const device = devices.find(d => d.id === deviceSchedule.deviceId);
          if (!device) {
            if (shouldWarn) {
              toast.warn(`Horario "${schedule.name}" no ejecutado: dispositivo no encontrado`);
              warningCache.set(cacheKey, Date.now());
            }
            return;
          }

          const lastTriggered = schedule.lastTriggered instanceof Timestamp
            ? schedule.lastTriggered.toDate().getTime()
            : schedule.lastTriggered || 0;

          if (Date.now() - lastTriggered < 30000) {
            if (shouldWarn) {
              toast.warn(`Horario "${schedule.name}" no ejecutado: ejecutado recientemente`);
              warningCache.set(cacheKey, Date.now());
            }
            return;
          }

          if (schedule.repeat !== 'once' && schedule.repeatInterval) {
            const intervalMs = schedule.repeatInterval * 60 * 1000;
            if (lastTriggered && Date.now() - lastTriggered < intervalMs) {
              if (shouldWarn) {
                toast.warn(`Horario "${schedule.name}" no ejecutado: intervalo de repetición no cumplido`);
                warningCache.set(cacheKey, Date.now());
              }
              return;
            }
          }

          setDoc(doc(db, 'schedules', schedule.id), { ...schedule, lastTriggered: Timestamp.fromDate(now) }, { merge: true })
            .then(() => toast.info(`Ejecutando "${schedule.name}": Encendiendo ${device.name} a las ${deviceSchedule.time}`))
            .catch(() => toast.error('Error al ejecutar el horario'));
        });
      });
    };

    const intervalId = setInterval(checkSchedules, 15000);
    checkSchedules();

    return () => clearInterval(intervalId);
  }, [schedules, devices, user]);
};

// Reducer for schedules
const schedulesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SCHEDULES': return action.payload;
    case 'ADD_SCHEDULE': return [...state, action.payload];
    case 'UPDATE_SCHEDULE': return state.map(s => s.id === action.payload.id ? action.payload : s);
    case 'DELETE_SCHEDULE': return state.filter(s => s.id !== action.payload);
    default: return state;
  }
};

// ScheduleCard Component
const ScheduleCard = React.memo(({ schedule, devices, handleToggleActive, openModal, handleDelete, index }) => (
  <motion.div
    className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-amber-200/20"
    variants={cardVariants}
    custom={index}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    whileHover={{ scale: 1.05, boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)' }}
    aria-label={`Horario: ${schedule.name}`}
  >
    <h3 className="text-lg font-semibold text-amber-600 dark:text-amber-400">{schedule.name}</h3>
    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
      <p>Dispositivos: {schedule.devices.map(d => devices.find(dd => dd.id === d.deviceId)?.name || 'Desconocido').join(', ')}</p>
      <p>Días: {schedule.days}</p>
      <p>Repetición: {schedule.repeat === 'once' ? 'Una vez' : schedule.repeat === 'daily' ? 'Diario' : 'Semanal'}</p>
      <p>Última ejecución: {schedule.lastTriggered ? new Date(schedule.lastTriggered instanceof Timestamp ? schedule.lastTriggered.toDate() : schedule.lastTriggered).toLocaleString() : 'Nunca'}</p>
    </div>
    <div className="flex gap-2 mt-4">
      <button
        onClick={() => handleToggleActive(schedule.id)}
        className={`${schedule.active ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500'} px-3 py-2 rounded-lg text-white`}
      >
        {schedule.active ? 'Activo' : 'Inactivo'}
      </button>
      <button onClick={() => openModal(schedule)} className="px-3 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600">Editar</button>
      <button onClick={() => handleDelete(schedule.id)} className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Eliminar</button>
    </div>
  </motion.div>
));

// Confirmation Dialog Component
const ConfirmationDialog = React.memo(({ isOpen, onConfirm, onCancel, message }) => (
  isOpen && (
    <motion.div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm">
        <p className="text-gray-700 dark:text-gray-200 mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500">Cancelar</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Confirmar</button>
        </div>
      </div>
    </motion.div>
  )
));

// ScheduleModal Component
const ScheduleModal = React.memo(({ isOpen, closeModal, formData, setFormData, devices, handleSave, isSaving, error }) => {
  const validateDevices = () => {
    return formData.devices.every(device => device.deviceId && device.time);
  };

  return (
    isOpen && (
      <motion.div
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg border border-amber-200/20">
          <h2 className="text-xl font-bold text-amber-600 dark:text-amber-400 mb-4">{formData.id ? 'Editar Horario' : 'Nuevo Horario'}</h2>
          {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded mb-4">{error}</div>}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="name">Nombre</label>
              <input
                id="name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3"
                required
                aria-required="true"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="days">Días</label>
              <select
                id="days"
                value={formData.days}
                onChange={e => setFormData({ ...formData, days: e.target.value })}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3"
              >
                <option value="Cada día">Cada día</option>
                <option value="Lunes - Viernes">Lunes - Viernes</option>
                <option value="Sábado - Domingo">Sábado - Domingo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Repetición</label>
              <div className="flex gap-2">
                {['once', 'daily', 'weekly'].map(type => (
                  <button
                    key={type}
                    onClick={() => setFormData({ ...formData, repeat: type })}
                    className={`${formData.repeat === type ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-amber-600 hover:text-white'} px-3 py-2 rounded-lg`}
                  >
                    {type === 'once' ? 'Una vez' : type === 'daily' ? 'Diario' : 'Semanal'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Dispositivos</label>
              {formData.devices.map((device, index) => (
                <div key={index} className="flex gap-2 mt-2">
                  <select
                    value={device.deviceId}
                    onChange={e => setFormData(prev => ({ ...prev, devices: prev.devices.map((d, i) => i === index ? { ...d, deviceId: e.target.value } : d) }))}
                    className="w-1/3 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3"
                    aria-label="Seleccionar dispositivo"
                  >
                    <option value="">Selecciona</option>
                    {devices.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                  <input
                    type="time"
                    value={device.time || ''}
                    onChange={e => setFormData(prev => ({ ...prev, devices: prev.devices.map((d, i) => i === index ? { ...d, time: e.target.value } : d) }))}
                    className="w-1/2 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3"
                    aria-label="Hora de activación"
                  />
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, devices: prev.devices.filter((_, i) => i !== index) }))}
                    className="text-red-600 hover:text-red-800"
                    aria-label="Eliminar dispositivo"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                onClick={() => setFormData(prev => ({ ...prev, devices: [...prev.devices, { deviceId: devices[0]?.id || '', time: '00:00' }] }))}
                className="mt-2 text-amber-600 hover:text-amber-800 underline"
              >
                + Añadir dispositivo
              </button>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button onClick={closeModal} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500">Cancelar</button>
            <button
              onClick={() => { if (validateDevices()) handleSave(); else toast.error('Corrige los errores en los dispositivos'); }}
              className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
              disabled={isSaving}
            >
              {isSaving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      </motion.div>
    )
  );
});

// Main Schedules Component
const Schedules = () => {
  const { user } = useAuth();
  const [schedules, dispatch] = useReducer(schedulesReducer, []);
  const [devicesState, setDevicesState] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', devices: [], days: 'Cada día', active: true, repeat: 'once' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, scheduleId: null });

  useEffect(() => {
    if (!user) {
      setError('Inicia sesión para ver los horarios.');
      setIsLoading(false);
      toast.error('Inicia sesión para continuar');
      return;
    }

    setIsLoading(true);
    Promise.all([
      getDocs(collection(db, 'devices')).then(snapshot => {
        const existingDeviceIds = snapshot.docs.map(doc => doc.id);
        return ['luz_1', 'enchufe_1'].filter(id => existingDeviceIds.includes(id) || setDoc(doc(db, 'devices', id), { id, name: id === 'luz_1' ? 'Luz Sala' : 'Enchufe 1' }));
      }),
      getDocs(collection(db, 'schedules')).then(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(s => s.owner === user.uid))
    ]).then(([deviceIds, userSchedules]) => {
      setDevicesState(deviceIds.map(id => ({ id, name: id === 'luz_1' ? 'Luz Sala' : 'Enchufe 1' })));
      dispatch({ type: 'SET_SCHEDULES', payload: userSchedules });
      setIsLoading(false);
    }).catch(() => {
      setError('Error al cargar los datos.');
      toast.error('Error al cargar los datos');
      setIsLoading(false);
    });
  }, [user]);

  useScheduleExecutor(schedules, devicesState, user);

  const openModal = useCallback((schedule = null) => {
    if (!user || devicesState.length === 0) {
      toast.error(!user ? 'Inicia sesión' : 'No hay dispositivos disponibles');
      return;
    }
    setFormData(schedule || { name: `Horario ${schedules.length + 1}`, devices: [], days: 'Cada día', active: true, repeat: 'once' });
    setIsModalOpen(true);
  }, [user, devicesState, schedules]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setError(null);
  }, []);

  const handleSave = useCallback(async () => {
    if (!formData.name.trim() || formData.devices.length === 0) {
      setError(formData.name.trim() ? 'Añade al menos un dispositivo' : 'El nombre es obligatorio');
      toast.error(error);
      return;
    }

    setIsSaving(true);
    try {
      const scheduleId = formData.id || `schedule-${Date.now()}`;
      const scheduleData = {
        owner: user.uid,
        name: formData.name.trim(),
        devices: formData.devices,
        days: formData.days,
        active: formData.active,
        repeat: formData.repeat,
        createdAt: formData.createdAt || Timestamp.fromDate(new Date()),
        lastTriggered: formData.lastTriggered || null,
      };
      await setDoc(doc(db, 'schedules', scheduleId), scheduleData);
      dispatch({ type: formData.id ? 'UPDATE_SCHEDULE' : 'ADD_SCHEDULE', payload: { id: scheduleId, ...scheduleData } });
      toast.success('Horario guardado con éxito');
      closeModal();
    } catch {
      setError('Error al guardar el horario');
      toast.error('Error al guardar el horario');
    } finally {
      setIsSaving(false);
    }
  }, [user, formData, closeModal]);

  const handleDelete = useCallback((scheduleId) => {
    if (!user) {
      toast.error('Inicia sesión');
      return;
    }
    setConfirmDelete({ isOpen: true, scheduleId });
  }, [user]);

  const confirmDeleteAction = useCallback(async () => {
    try {
      await deleteDoc(doc(db, 'schedules', confirmDelete.scheduleId));
      dispatch({ type: 'DELETE_SCHEDULE', payload: confirmDelete.scheduleId });
      toast.success('Horario eliminado');
    } catch {
      toast.error('Error al eliminar');
    }
    setConfirmDelete({ isOpen: false, scheduleId: null });
  }, [confirmDelete]);

  const cancelDelete = useCallback(() => {
    setConfirmDelete({ isOpen: false, scheduleId: null });
  }, []);

  const handleToggleActive = useCallback(async (scheduleId) => {
    if (!user) {
      toast.error('Inicia sesión');
      return;
    }
    const schedule = schedules.find(s => s.id === scheduleId);
    const updated = { ...schedule, active: !schedule.active };
    await setDoc(doc(db, 'schedules', scheduleId), updated);
    dispatch({ type: 'UPDATE_SCHEDULE', payload: updated });
    toast.success(`Horario ${updated.active ? 'activado' : 'desactivado'}`);
  }, [user, schedules]);

  if (isLoading) return <Layout><div className="text-center text-amber-600 text-lg">Cargando...</div></Layout>;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.h1
          className="text-3xl sm:text-4xl font-extrabold text-amber-600 dark:text-amber-400 mb-12 tracking-tight"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          Gestión de Horarios
        </motion.h1>
        {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">{error}</div>}
        <motion.button
          onClick={() => openModal()}
          className="px-4 py-2 bg-amber-500 text-white rounded-lg mb-6 hover:bg-amber-600"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          + Nuevo Horario
        </motion.button>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {schedules.map((schedule, index) => (
            <ScheduleCard
              key={schedule.id}
              schedule={schedule}
              devices={devicesState}
              handleToggleActive={handleToggleActive}
              openModal={openModal}
              handleDelete={handleDelete}
              index={index}
            />
          ))}
        </div>
        <ScheduleModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          formData={formData}
          setFormData={setFormData}
          devices={devicesState}
          handleSave={handleSave}
          isSaving={isSaving}
          error={error}
        />
        <ConfirmationDialog
          isOpen={confirmDelete.isOpen}
          onConfirm={confirmDeleteAction}
          onCancel={cancelDelete}
          message="¿Eliminar horario?"
        />
      </div>
    </Layout>
  );
};

export default Schedules;
