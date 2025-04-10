import React, { useState } from "react";

const DataTable = () => {
  const [schedules, setSchedules] = useState([
    { id: 1, name: "Horari 1", devices: ["Llums sala", "Persiana principal"], days: "Dilluns - Divendres 08:00" },
    { id: 2, name: "Horari 2", devices: ["Termòstat", "Aire condicionat"], days: "Dissabte - Diumenge 10:00" },
    { id: 3, name: "Horari 3", devices: ["Totes les llums"], days: "Cada dia 19:30" },
    { id: 4, name: "Horari 4", devices: ["Alarma"], days: "Dilluns - Divendres 23:00" }
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const [editingId, setEditingId] = useState(null);

  const handleAddSchedule = () => {
    const newSchedule = {
      id: schedules.length + 1,
      name: `Horari ${schedules.length + 1}`,
      devices: ["Nou dispositiu"],
      days: "Nou dia i hora"
    };
    setSchedules([...schedules, newSchedule]);
  };

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleSave = (id, updatedSchedule) => {
    setSchedules(schedules.map(schedule => (schedule.id === id ? updatedSchedule : schedule)));
    setEditingId(null);
  };

  const indexOfLastSchedule = currentPage * itemsPerPage;
  const indexOfFirstSchedule = indexOfLastSchedule - itemsPerPage;
  const currentSchedules = schedules.slice(indexOfFirstSchedule, indexOfLastSchedule);
  const totalPages = Math.ceil(schedules.length / itemsPerPage);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Control domòtic - Horaris</h2>
        <button
          onClick={handleAddSchedule}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
        >
          Afegir Horari
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Horari</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aparells</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dies</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Accions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentSchedules.map((schedule) => (
              <tr key={schedule.id}>
                <td className="px-6 py-4 text-sm text-gray-900">{schedule.id}</td>
                <td className="px-6 py-4">
                  {editingId === schedule.id ? (
                    <input
                      type="text"
                      className="border p-1 w-full"
                      value={schedule.name}
                      onChange={(e) => handleSave(schedule.id, { ...schedule, name: e.target.value })}
                    />
                  ) : (
                    schedule.name
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === schedule.id ? (
                    <input
                      type="text"
                      className="border p-1 w-full"
                      value={schedule.devices.join(", ")}
                      onChange={(e) => handleSave(schedule.id, { ...schedule, devices: e.target.value.split(", ") })}
                    />
                  ) : (
                    schedule.devices.join(", ")
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === schedule.id ? (
                    <input
                      type="text"
                      className="border p-1 w-full"
                      value={schedule.days}
                      onChange={(e) => handleSave(schedule.id, { ...schedule, days: e.target.value })}
                    />
                  ) : (
                    schedule.days
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === schedule.id ? (
                    <button onClick={() => setEditingId(null)} className="px-2 py-1 bg-blue-500 text-white rounded">Guardar</button>
                  ) : (
                    <button onClick={() => handleEdit(schedule.id)} className="px-2 py-1 bg-yellow-500 text-white rounded">Editar</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
