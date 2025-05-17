import React, { useState, useEffect, useCallback, useMemo, useReducer, useDeferredValue } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Autenticacion/AuthProvider';
import { db } from '../../config/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import Layout from '../../hocs/layouts/layout';
import { motion, AnimatePresence } from 'framer-motion';
import Spinner from '../Spinner';
import { toast } from 'react-toastify';
import { Switch } from '@headlessui/react';
import { ClockIcon, PencilIcon, TrashIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import produce from 'immer';
import devices from './devices'; // Import static devices
import Dispositivos from './Dispositivos'; // Import devices component

// Custom hook for schedule execution
const useScheduleExecutor = (schedules, devices, user) => {
  useEffect(() => {
    if (!user || schedules.length === 0 || devices.length === 0) return;

    const checkSchedules = async () => {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5);
      const currentDay = now.getDay();
      const currentTimestamp = now.getTime();

      for (const schedule of schedules) {
        if (!schedule.active) continue;

        let isDayMatch = false;
        if (schedule.days === 'Cada día') isDayMatch = true;
        else if (schedule.days === 'Lunes - Viernes' && currentDay >= 1 && currentDay <= 5) isDayMatch = true;
        else if (schedule.days === 'Sábado - Domingo' && (currentDay === 0 || currentDay === 6)) isDayMatch = true;

        if (!isDayMatch) continue;

        for (const deviceSchedule of schedule.devices) {
          if (deviceSchedule.time !== currentTime && !deviceSchedule.timeRange) continue;

          if (deviceSchedule.timeRange) {
            const [start, end] = deviceSchedule.timeRange.split('-');
            if (currentTime < start || currentTime > end) continue;
          }

          const device = devices.find(d => d.id === deviceSchedule.deviceId);
          if (!device) continue;

          const lastTriggered = schedule.lastTriggered instanceof Timestamp 
            ? schedule.lastTriggered.toDate().getTime()
            : schedule.lastTriggered
            ? new Date(schedule.lastTriggered).getTime()
            : 0;

          if (currentTimestamp - lastTriggered < 30000) continue;

          try {
            toast.info(`Ejecutando "${schedule.name}": ${deviceSchedule.timeRange ? 'Rango' : 'Encendiendo'} ${device.name} a las ${deviceSchedule.time || deviceSchedule.timeRange}`);
            await setDoc(doc(db, 'schedules', schedule.id), { 
              ...schedule, 
              lastTriggered: Timestamp.fromDate(now)
            }, { merge: true });
          } catch (error) {
            console.error('Error executing schedule:', error);
            toast.error('Error al ejecutar el horario');
          }
        }
      }
    };

    const intervalId = setInterval(checkSchedules, 15000);
    checkSchedules();

    return () => clearInterval(intervalId);
  }, [schedules, devices, user]);
};

// Reducer for schedules
const schedulesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SCHEDULES':
      return action.payload;
    case 'ADD_SCHEDULE':
      return produce(state, draft => {
        draft.push(action.payload);
      });
    case 'UPDATE_SCHEDULE':
      return produce(state, draft => {
        const index = draft.findIndex(s => s.id === action.payload.id);
        if (index !== -1) draft[index] = action.payload;
      });
    case 'DELETE_SCHEDULE':
      return produce(state, draft => {
        return draft.filter(s => s.id !== action.payload);
      });
    default:
      return state;
  }
};

// ScheduleCard Component
const ScheduleCard = ({ schedule, devices, handleToggleActive, openModal, handleDelete, selectedSchedules, setSelectedSchedules }) => {
  const getNextExecutions = useCallback((schedule) => {
    const executions = [];
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
      const day = date.getDay();
      let isValidDay = false;
      if (schedule.days === 'Cada día') isValidDay = true;
      else if (schedule.days === 'Lunes - Viernes' && day >= 1 && day <= 5) isValidDay = true;
      else if (schedule.days === 'Sábado - Domingo' && (day === 0 || day === 6)) isValidDay = true;

      if (isValidDay) {
        schedule.devices.forEach(device => {
          const time = device.timeRange ? device.timeRange : device.time;
          executions.push({
            date: new Date(date.toDateString() + ' ' + (device.time || device.timeRange.split('-')[0])),
            device: devices.find(d => d.id === device.deviceId)?.name || 'Desconocido',
          });
        });
      }
    }
    return executions.sort((a, b) => a.date - b.date).slice(0, 3);
  }, [devices]);

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-amber-200/20 hover:shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <input
          type="checkbox"
          checked={selectedSchedules.includes(schedule.id)}
          onChange={(e) => {
            setSelectedSchedules(prev =>
              e.target.checked ? [...prev, schedule.id] : prev.filter(id => id !== schedule.id)
            );
          }}
          className="rounded border-gray-300 focus:ring-amber-400"
          aria-label={`Seleccionar ${schedule.name}`}
        />
        <h3 className="text-lg font-semibold text-amber-600 dark:text-amber-400">{schedule.name}</h3>
      </div>
      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
        <p>
          Dispositivos: {schedule.devices.map(d => {
            const device = devices.find(device => device.id === d.deviceId);
            return device ? `${device.name} (${d.timeRange || d.time})` : 'Desconocido';
          }).join(', ')}
        </p>
        <p>Días: {schedule.days}</p>
        <p>Repetición: {schedule.repeat === 'once' ? 'Una vez' : schedule.repeat === 'hourly' ? 'Cada hora' : 'Diario'}</p>
        <p>
          Última ejecución: {schedule.lastTriggered 
            ? new Date(schedule.lastTriggered instanceof Timestamp 
              ? schedule.lastTriggered.toDate() 
              : schedule.lastTriggered).toLocaleString() 
            : 'Nunca'}
        </p>
        <p>
          Próximas ejecuciones:{' '}
          {getNextExecutions(schedule).map((exec, i) => (
            <span key={i}>{exec.date.toLocaleString()} - {exec.device}{i < 2 ? ', ' : ''}</span>
          ))}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 mt-4">
        <Switch
          checked={schedule.active}
          onChange={() => handleToggleActive(schedule.id)}
          className={`${
            schedule.active ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-600'
          } relative inline-flex items-center h-6 rounded-full w-11`}
        >
          <span className="sr-only">{schedule.active ? 'Desactivar horario' : 'Activar horario'}</span>
          <span
            className={`${
              schedule.active ? 'translate-x-6' : 'translate-x-1'
            } inline-block w-4 h-4 transform bg-white rounded-full transition`}
          />
        </Switch>
        <motion.button
          onClick={() => openModal(schedule)}
          className="flex-1 px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Editar horario"
        >
          <PencilIcon className="w-5 h-5 inline-block mr-1" /> Editar
        </motion.button>
        <motion.button
          onClick={() => handleDelete(schedule.id)}
          className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Eliminar horario"
        >
          <TrashIcon className="w-5 h-5 inline-block mr-1" /> Eliminar
        </motion.button>
        <motion.button
          onClick={() => openModal({ ...schedule, id: `schedule-${Date.now()}`, name: `${schedule.name} (Copia)`, createdAt: Timestamp.fromDate(new Date()) })}
          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Duplicar horario"
        >
          <DocumentDuplicateIcon className="w-5 h-5 inline-block mr-1" /> Duplicar
        </motion.button>
      </div>
    </motion.div>
  );
};

// ScheduleModal Component
const ScheduleModal = ({ isOpen, closeModal, formData, setFormData, devices, handleSave, isSaving, error, editingSchedule, handleAddDeviceToSchedule, handleDeviceChange, handleRemoveDevice }) => {
  const modalRef = React.useRef();

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
    }
  }, [isOpen]);

  const getNextExecutions = useCallback((formData) => {
    const executions = [];
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
      const day = date.getDay();
      let isValidDay = false;
      if (formData.days === 'Cada día') isValidDay = true;
      else if (formData.days === 'Lunes - Viernes' && day >= 1 && day <= 5) isValidDay = true;
      else if (formData.days === 'Sábado - Domingo' && (day === 0 || day === 6)) isValidDay = true;

      if (isValidDay) {
        formData.devices.forEach(device => {
          const time = device.timeRange ? device.timeRange.split('-')[0] : device.time;
          executions.push({
            date: new Date(date.toDateString() + ' ' + time),
            device: devices.find(d => d.id === device.deviceId)?.name || 'Desconocido',
          });
        });
      }
    }
    return executions.sort((a, b) => a.date - b.date).slice(0, 3);
  }, [devices]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          ref={modalRef}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg mx-4"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-bold text-amber-600 dark:text-amber-400 mb-4">
              {editingSchedule ? 'Editar Horario' : 'Nuevo Horario'}
            </h2>
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded mb-4" role="alert">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="name">Nombre</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-amber-400 p-3"
                  required
                  aria-required="true"
                  aria-label="Nombre del horario"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="days">Días</label>
                <select
                  id="days"
                  value={formData.days}
                  onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                  className="mt-1 w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-amber-400 p-3"
                  aria-label="Seleccionar días para el horario"
                >
                  <option value="Cada día">Cada día</option>
                  <option value="Lunes - Viernes">Lunes - Viernes</option>
                  <option value="Sábado - Domingo">Sábado - Domingo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Repetición</label>
                <div className="flex gap-2 mt-1">
                  {['once', 'hourly', 'daily'].map(type => (
                    <button
                      key={type}
                      onClick={() => setFormData({ ...formData, repeat: type })}
                      className={`flex-1 px-3 py-2 rounded-lg ${
                        formData.repeat === type
                          ? 'bg-amber-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
                      } hover:bg-amber-700 transition-colors`}
                      aria-label={`Seleccionar repetición ${type}`}
                    >
                      {type === 'once' ? 'Una vez' : type === 'hourly' ? 'Cada hora' : 'Diario'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Dispositivos</label>
                {formData.devices.map((device, index) => (
                  <div key={index} className="flex flex-col sm:flex-row items-center gap-2 mt-3">
                    <select
                      value={device.deviceId}
                      onChange={(e) => handleDeviceChange(index, 'deviceId', e.target.value)}
                      className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-amber-400 p-3"
                      aria-label={`Seleccionar dispositivo ${index + 1}`}
                    >
                      <option value="">Selecciona dispositivo</option>
                      {devices.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                    <div className="flex items-center gap-2 w-full">
                      <input
                        type="time"
                        value={device.time || ''}
                        onChange={(e) => handleDeviceChange(index, 'time', e.target.value)}
                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-amber-400 p-3"
                        aria-label={`Hora de inicio para dispositivo ${index + 1}`}
                        disabled={device.timeRange}
                      />
                      <span className="text-gray-600 dark:text-gray-400">o</span>
                      <input
                        type="time"
                        value={device.timeRange ? device.timeRange.split('-')[0] : ''}
                        onChange={(e) => {
                          const endTime = device.timeRange ? device.timeRange.split('-')[1] : '00:00';
                          handleDeviceChange(index, 'timeRange', `${e.target.value}-${endTime}`);
                        }}
                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-amber-400 p-3"
                        aria-label={`Hora de inicio para rango de tiempo ${index + 1}`}
                        disabled={device.time}
                      />
                      <span className="text-gray-600 dark:text-gray-400">-</span>
                      <input
                        type="time"
                        value={device.timeRange ? device.timeRange.split('-')[1] : ''}
                        onChange={(e) => {
                          const startTime = device.timeRange ? device.timeRange.split('-')[0] : '00:00';
                          handleDeviceChange(index, 'timeRange', `${startTime}-${e.target.value}`);
                        }}
                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-amber-400 p-3"
                        aria-label={`Hora de fin para rango de tiempo ${index + 1}`}
                        disabled={device.time}
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveDevice(index)}
                      className="text-red-600 hover:text-red-800"
                      aria-label={`Eliminar dispositivo ${index + 1}`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleAddDeviceToSchedule}
                  className="mt-3 text-amber-600 hover:text-amber-800 underline disabled:opacity-50"
                  disabled={devices.length === 0}
                  aria-label="Añadir nuevo dispositivo al horario"
                >
                  + Añadir dispositivo
                </button>
              </div>
              {formData.devices.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Próximas ejecuciones</p>
                  <ul className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {getNextExecutions(formData).map((exec, i) => (
                      <li key={i}>
                        {exec.date.toLocaleString()} - {exec.device}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <motion.button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Cancelar"
              >
                Cancelar
              </motion.button>
              <motion.button
                onClick={handleSave}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isSaving}
                aria-label="Guardar horario"
              >
                {isSaving ? 'Guardando...' : 'Guardar'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ScheduleToolbar Component
const ScheduleToolbar = ({ debouncedSearch, sortBy, setSortBy, selectedSchedules, handleBulkToggleActive, openModal, user, devices }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        <input
          type="text"
          placeholder="Buscar horarios..."
          onChange={(e) => debouncedSearch(e.target.value)}
          className="w-full sm:w-64 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-amber-400 dark:bg-gray-700"
          aria-label="Buscar horarios"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full sm:w-auto px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-amber-400"
          aria-label="Ordenar por"
        >
          <option value="name">Nombre</option>
          <option value="lastTriggered">Última ejecución</option>
        </select>
      </div>
      <div className="flex flex-wrap gap-2">
        {selectedSchedules.length > 0 && (
          <>
            <motion.button
              onClick={() => handleBulkToggleActive(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Activar horarios seleccionados"
            >
              Activar seleccionados
            </motion.button>
            <motion.button
              onClick={() => handleBulkToggleActive(false)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Desactivar horarios seleccionados"
            >
              Desactivar seleccionados
            </motion.button>
          </>
        )}
        <motion.button
          onClick={() => openModal()}
          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50"
          whileHover={{ scale: user && devices.length > 0 ? 1.05 : 1 }}
          whileTap={{ scale: 0.95 }}
          disabled={!user || devices.length === 0}
          aria-label="Añadir nuevo horario"
        >
          + Nuevo Horario
        </motion.button>
      </div>
    </div>
  );
};

// ScheduleList Component
const ScheduleList = ({ schedules, devices, currentPage, totalPages, handlePageChange, handleToggleActive, openModal, handleDelete, selectedSchedules, setSelectedSchedules }) => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {schedules.map(schedule => (
          <ScheduleCard
            key={schedule.id}
            schedule={schedule}
            devices={devices}
            handleToggleActive={handleToggleActive}
            openModal={openModal}
            handleDelete={handleDelete}
            selectedSchedules={selectedSchedules}
            setSelectedSchedules={setSelectedSchedules}
          />
        ))}
      </div>
      {schedules.length === 0 && (
        <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
          No hay horarios. Añade uno{devices.length === 0 ? ' después de añadir dispositivos.' : '.'}
        </p>
      )}
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <motion.button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-full sm:w-auto px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg disabled:opacity-50"
          whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Página anterior"
        >
          Anterior
        </motion.button>
        <span className="text-sm">Página {currentPage} de {totalPages}</span>
        <motion.button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-full sm:w-auto px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg disabled:opacity-50"
          whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Página siguiente"
        >
          Siguiente
        </motion.button>
      </div>
    </>
  );
};

// Main Schedules Component
const Schedules = () => {
  const { user } = useAuth();
  const [schedules, dispatch] = useReducer(schedulesReducer, []);
  const [devicesState, setDevicesState] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    devices: [],
    days: 'Cada día',
    active: true,
    repeat: 'once',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSchedules, setSelectedSchedules] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  const itemsPerPage = 7;

  // Fetch schedules and sync devices to Firebase
  useEffect(() => {
    const initializeData = async () => {
      try {
        if (!user) {
          setError('Inicia sesión para ver los horarios y dispositivos.');
          setIsLoading(false);
          toast.error('Inicia sesión para continuar');
          return;
        }

        setIsLoading(true);

        // Sync static devices to Firebase
        const devicesCollection = await getDocs(collection(db, 'devices'));
        const existingDeviceIds = devicesCollection.docs.map(doc => doc.id);
        for (const device of devices) {
          if (!existingDeviceIds.includes(device.id)) {
            await setDoc(doc(db, 'devices', device.id), device);
          }
        }
        setDevicesState(devices.filter(d => ['luz_1', 'enchufe_1'].includes(d.id)));

        // Fetch schedules
        const schedulesCollection = await getDocs(collection(db, 'schedules'));
        const userSchedules = schedulesCollection.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(s => s.owner === user.uid);
        dispatch({ type: 'SET_SCHEDULES', payload: userSchedules });

        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing data:', error);
        setError('Error al cargar los datos. Por favor, intenta de nuevo.');
        toast.error('Error al cargar los datos');
        setIsLoading(false);
      }
    };
    initializeData();
  }, [user]);

  useScheduleExecutor(schedules, devicesState, user);

  const openModal = useCallback((schedule = null) => {
    if (!user) {
      toast.error('Inicia sesión para gestionar horarios.');
      return;
    }
    if (devicesState.length === 0 && !schedule) {
      toast.error('No hay dispositivos disponibles para crear un horario.');
      return;
    }
    setEditingSchedule(schedule);
    setFormData(schedule
      ? { ...schedule, repeat: schedule.repeat || 'once' }
      : { name: `Horario ${schedules.length + 1}`, devices: [], days: 'Cada día', active: true, repeat: 'once' }
    );
    setIsModalOpen(true);
  }, [user, devicesState, schedules]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingSchedule(null);
    setFormData({ name: '', devices: [], days: 'Cada día', active: true, repeat: 'once' });
    setError(null);
  }, []);

  const handleAddDeviceToSchedule = useCallback(() => {
    if (devicesState.length === 0) {
      toast.error('No hay dispositivos disponibles.');
      return;
    }
    setFormData(prev => ({
      ...prev,
      devices: [...prev.devices, { deviceId: devicesState[0].id, time: '00:00' }],
    }));
  }, [devicesState]);

  const handleDeviceChange = useCallback((index, field, value) => {
    setFormData(prev => produce(prev, draft => {
      if (field === 'timeRange' && value) {
        delete draft.devices[index].time;
      } else if (field === 'time' && value) {
        delete draft.devices[index].timeRange;
      }
      draft.devices[index][field] = value;
    }));
  }, []);

  const handleRemoveDevice = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      devices: prev.devices.filter((_, i) => i !== index),
    }));
  }, []);

  const handleSave = useCallback(async () => {
    if (!user) {
      setError('Inicia sesión para guardar.');
      toast.error('Inicia sesión para continuar');
      return;
    }
    if (!formData.name.trim()) {
      setError('El nombre es obligatorio.');
      toast.error('El nombre es obligatorio.');
      return;
    }
    if (formData.devices.length === 0 || formData.devices.some(d => !d.deviceId || (!d.time && !d.timeRange))) {
      setError('Selecciona al menos un dispositivo con hora o rango válido.');
      toast.error('Configuración de dispositivo inválida.');
      return;
    }

    setIsSaving(true);
    try {
      const scheduleId = editingSchedule ? editingSchedule.id : `schedule-${Date.now()}`;
      const scheduleData = {
        owner: user.uid,
        name: formData.name.trim(),
        devices: formData.devices,
        days: formData.days,
        active: formData.active,
        repeat: formData.repeat,
        createdAt: editingSchedule ? editingSchedule.createdAt : Timestamp.fromDate(new Date()),
        lastTriggered: editingSchedule ? editingSchedule.lastTriggered : null,
      };
      await setDoc(doc(db, 'schedules', scheduleId), scheduleData);
      dispatch({
        type: editingSchedule ? 'UPDATE_SCHEDULE' : 'ADD_SCHEDULE',
        payload: { id: scheduleId, ...scheduleData }
      });
      toast.success('Horario guardado con éxito');
      closeModal();
    } catch (error) {
      console.error('Error saving schedule:', error);
      setError('Error al guardar el horario.');
      toast.error('Error al guardar el horario');
      setIsSaving(false);
    }
  }, [user, formData, editingSchedule, closeModal]);

  const handleDelete = useCallback(async (scheduleId) => {
    if (!user) {
      toast.error('Inicia sesión para eliminar.');
      return;
    }
    if (!window.confirm('¿Estás seguro de que quieres eliminar este horario?')) return;
    try {
      await deleteDoc(doc(db, 'schedules', scheduleId));
      dispatch({ type: 'DELETE_SCHEDULE', payload: scheduleId });
      setSelectedSchedules(prev => prev.filter(id => id !== scheduleId));
      toast.success('Horario eliminado con éxito');
    } catch (error) {
      console.error('Error deleting schedule:', error);
      toast.error('Error al eliminar el horario');
    }
  }, [user]);

  const handleToggleActive = useCallback(async (scheduleId) => {
    if (!user) {
      toast.error('Inicia sesión para cambiar el estado.');
      return;
    }
    try {
      const schedule = schedules.find(s => s.id === scheduleId);
      const updatedSchedule = { ...schedule, active: !schedule.active };
      await setDoc(doc(db, 'schedules', scheduleId), updatedSchedule);
      dispatch({ type: 'UPDATE_SCHEDULE', payload: updatedSchedule });
      toast.success(`Horario ${updatedSchedule.active ? 'activado' : 'desactivado'}`);
    } catch (error) {
      console.error('Error toggling active:', error);
      toast.error('Error al cambiar el estado');
    }
  }, [user, schedules]);

  const handleBulkToggleActive = useCallback(async (active) => {
    if (!user) {
      toast.error('Inicia sesión para cambiar el estado.');
      return;
    }
    try {
      const updates = selectedSchedules.map(async scheduleId => {
        const schedule = schedules.find(s => s.id === scheduleId);
        const updatedSchedule = { ...schedule, active };
        await setDoc(doc(db, 'schedules', scheduleId), updatedSchedule);
        return updatedSchedule;
      });
      const updatedSchedules = await Promise.all(updates);
      updatedSchedules.forEach(schedule => {
        dispatch({ type: 'UPDATE_SCHEDULE', payload: schedule });
      });
      toast.success(`Horarios ${active ? 'activados' : 'desactivados'} con éxito`);
      setSelectedSchedules([]);
    } catch (error) {
      console.error('Error toggling active:', error);
      toast.error('Error al cambiar el estado');
    }
  }, [user, schedules, selectedSchedules]);

  const debouncedSearch = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  const sortedSchedules = useMemo(() => {
    return [...schedules].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'lastTriggered') {
        const timeA = a.lastTriggered?.toDate?.().getTime() || 0;
        const timeB = b.lastTriggered?.toDate?.().getTime() || 0;
        return timeB - timeA;
      }
      return 0;
    });
  }, [schedules, sortBy]);

  const filteredSchedules = useMemo(() => {
    return sortedSchedules.filter(schedule =>
      schedule.name.toLowerCase().includes(deferredSearchTerm.toLowerCase()) ||
      schedule.days.toLowerCase().includes(deferredSearchTerm.toLowerCase())
    );
  }, [sortedSchedules, deferredSearchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredSchedules.length / itemsPerPage));
  const currentSchedules = filteredSchedules.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = useCallback((page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const summary = useMemo(() => {
    const total = schedules.length;
    const active = schedules.filter(s => s.active).length;
    const nextExecutions = schedules
      .flatMap(schedule => schedule.devices.map(device => ({
        date: new Date(new Date().toDateString() + ' ' + (device.time || device.timeRange?.split('-')[0])),
        device: devicesState.find(d => d.id === device.deviceId)?.name || 'Desconocido',
        schedule: schedule.name,
      })))
      .sort((a, b) => a.date - b.date)
      .slice(0, 3);
    return { total, active, inactive: total - active, nextExecutions };
  }, [schedules, devicesState]);

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
        className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 font-sans"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-6 text-center">
          Gestión de Horarios
        </h1>

        {/* Summary Dashboard */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Resumen</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Horarios</p>
              <p className="text-2xl font-bold text-amber-400">{summary.total}</p>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Horarios Activos</p>
              <p className="text-2xl font-bold text-amber-400">{summary.active}</p>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Horarios Inactivos</p>
              <p className="text-2xl font-bold text-amber-400">{summary.inactive}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Próximas Ejecuciones</p>
            <ul className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {summary.nextExecutions.length > 0 ? (
                summary.nextExecutions.map((exec, i) => (
                  <li key={i}>
                    {exec.date.toLocaleString()} - {exec.device} ({exec.schedule})
                  </li>
                ))
              ) : (
                <li>No hay ejecuciones programadas.</li>
              )}
            </ul>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6" role="alert">
              <p>{error}</p>
              {!user && <Link to="/login" className="text-amber-600 underline">Inicia sesión</Link>}
            </div>
          )}

          <ScheduleToolbar
            debouncedSearch={debouncedSearch}
            sortBy={sortBy}
            setSortBy={setSortBy}
            selectedSchedules={selectedSchedules}
            handleBulkToggleActive={handleBulkToggleActive}
            openModal={openModal}
            user={user}
            devices={devicesState}
          />

          <ScheduleList
            schedules={currentSchedules}
            devices={devicesState}
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
            handleToggleActive={handleToggleActive}
            openModal={openModal}
            handleDelete={handleDelete}
            selectedSchedules={selectedSchedules}
            setSelectedSchedules={setSelectedSchedules}
          />

          <ScheduleModal
            isOpen={isModalOpen}
            closeModal={closeModal}
            formData={formData}
            setFormData={setFormData}
            devices={devicesState}
            handleSave={handleSave}
            isSaving={isSaving}
            error={error}
            editingSchedule={editingSchedule}
            handleAddDeviceToSchedule={handleAddDeviceToSchedule}
            handleDeviceChange={handleDeviceChange}
            handleRemoveDevice={handleRemoveDevice}
          />
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default Schedules;