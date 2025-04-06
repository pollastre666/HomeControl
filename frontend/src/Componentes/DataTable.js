import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DataTable = () => {
  const [schedules, setSchedules] = useState(() => {
    const savedSchedules = localStorage.getItem('schedules');
    try {
      return savedSchedules ? JSON.parse(savedSchedules) : [
        { id: 1, name: "Horari 1", devices: ["Llums sala", "Persiana principal"], days: "Dilluns - Divendres", time: "08:00", active: true },
        { id: 2, name: "Horari 2", devices: ["Termòstat", "Aire condicionat"], days: "Dissabte - Diumenge", time: "10:00", active: true },
        { id: 3, name: "Horari 3", devices: ["Totes les llums"], days: "Cada dia", time: "19:30", active: false },
        { id: 4, name: "Horari 4", devices: ["Alarma"], days: "Dilluns - Divendres", time: "23:00", active: true }
      ];
    } catch (e) {
      console.error("Error parsing localStorage schedules:", e);
      return [
        { id: 1, name: "Horari 1", devices: ["Llums sala", "Persiana principal"], days: "Dilluns - Divendres", time: "08:00", active: true },
        { id: 2, name: "Horari 2", devices: ["Termòstat", "Aire condicionat"], days: "Dissabte - Diumenge", time: "10:00", active: true },
        { id: 3, name: "Horari 3", devices: ["Totes les llums"], days: "Cada dia", time: "19:30", active: false },
        { id: 4, name: "Horari 4", devices: ["Alarma"], days: "Dilluns - Divendres", time: "23:00", active: true }
      ];
    }
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 7;

  useEffect(() => {
    try {
      localStorage.setItem('schedules', JSON.stringify(schedules));
    } catch (e) {
      console.error("Error saving to localStorage:", e);
    }
  }, [schedules]);

  const getNextId = () => {
    return schedules.length > 0 ? Math.max(...schedules.map(s => s.id)) + 1 : 1;
  };

  const handleAddSchedule = () => {
    const newId = getNextId();
    const newSchedule = {
      id: newId,
      name: `Horari ${newId}`,
      devices: ["Nou dispositiu"],
      days: "Cada dia",
      time: "00:00",
      active: true
    };
    setSchedules(prevSchedules => [...prevSchedules, newSchedule]);
    toast.success("Horari afegit amb èxit!");
  };

  const handleDelete = (id) => {
    if (window.confirm("Segur que vols eliminar aquest horari?")) {
      setSchedules(prevSchedules => prevSchedules.filter(schedule => schedule.id !== id));
      setEditingId(null); // Resetear edición si se elimina el horario en edición
      toast.success("Horari eliminat amb èxit!");
    }
  };

  const handleToggleActive = (id) => {
    setSchedules(prevSchedules =>
      prevSchedules.map(schedule =>
        schedule.id === id ? { ...schedule, active: !schedule.active } : schedule
      )
    );
  };

  const handleSave = (id, updatedFields) => {
    const trimmedFields = {
      ...updatedFields,
      name: updatedFields.name.trim(),
      devices: updatedFields.devices.map(d => d.trim()).filter(d => d !== ""),
      days: updatedFields.days.trim(),
      time: updatedFields.time.trim()
    };

    if (!trimmedFields.name || !trimmedFields.time || trimmedFields.devices.length === 0) {
      toast.error("Nom, hora i almenys un dispositiu són obligatoris!");
      return;
    }

    setSchedules(prevSchedules =>
      prevSchedules.map(schedule =>
        schedule.id === id ? { ...schedule, ...trimmedFields } : schedule
      )
    );
    setEditingId(null);
    toast.success("Horari guardat amb èxit!");
  };

  const filteredSchedules = schedules.filter(schedule =>
    schedule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.days.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredSchedules.length / itemsPerPage));
  const indexOfLastSchedule = currentPage * itemsPerPage;
  const indexOfFirstSchedule = indexOfLastSchedule - itemsPerPage;
  const currentSchedules = filteredSchedules.slice(indexOfFirstSchedule, indexOfLastSchedule);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Control Domòtic - Horaris</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Cercar horaris..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddSchedule}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
          >
            + Afegir Horari
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Horari</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aparells</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dies</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hora</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estat</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Accions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentSchedules.map((schedule) => (
              <tr key={schedule.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{schedule.id}</td>
                <td className="px-6 py-4">
                  {editingId === schedule.id ? (
                    <input
                      type="text"
                      className="border p-1 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue={schedule.name}
                      onBlur={(e) => handleSave(schedule.id, { ...schedule, name: e.target.value })}
                    />
                  ) : (
                    <span className="text-sm text-gray-900">{schedule.name}</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === schedule.id ? (
                    <input
                      type="text"
                      className="border p-1 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue={schedule.devices.join(", ")}
                      onBlur={(e) => handleSave(schedule.id, { ...schedule, devices: e.target.value.split(",").map(d => d.trim()) })}
                    />
                  ) : (
                    <span className="text-sm text-gray-700">{schedule.devices.join(", ")}</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === schedule.id ? (
                    <select
                      className="border p-1 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue={schedule.days}
                      onChange={(e) => handleSave(schedule.id, { ...schedule, days: e.target.value })}
                    >
                      <option value="Cada dia">Cada dia</option>
                      <option value="Dilluns - Divendres">Dilluns - Divendres</option>
                      <option value="Dissabte - Diumenge">Dissabte - Diumenge</option>
                    </select>
                  ) : (
                    <span className="text-sm text-gray-700">{schedule.days}</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === schedule.id ? (
                    <input
                      type="time"
                      className="border p-1 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue={schedule.time}
                      onBlur={(e) => handleSave(schedule.id, { ...schedule, time: e.target.value })}
                    />
                  ) : (
                    <span className="text-sm text-gray-700">{schedule.time}</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggleActive(schedule.id)}
                    className={`px-2 py-1 rounded text-white ${schedule.active ? 'bg-green-500' : 'bg-red-500'} hover:${schedule.active ? 'bg-green-600' : 'bg-red-600'}`}
                  >
                    {schedule.active ? 'Actiu' : 'Inactiu'}
                  </button>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  {editingId === schedule.id ? (
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Guardar
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditingId(schedule.id)}
                      className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Editar
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(schedule.id)}
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
        >
          Anterior
        </button>
        <span>Pàgina {currentPage} de {totalPages}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
        >
          Següent
        </button>
      </div>
    </div>
  );
};

export default DataTable;