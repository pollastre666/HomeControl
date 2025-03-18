import React, { useState } from "react";

const DataTable = () => {
  // Estado para los horarios
  const [schedules, setSchedules] = useState([
    { id: 1, name: "Horari 1", devices: ["Llums sala", "Persiana principal"], days: "Dilluns - Divendres 08:00" },
    { id: 2, name: "Horari 2", devices: ["Termòstat", "Aire condicionat"], days: "Dissabte - Diumenge 10:00" },
    { id: 3, name: "Horari 3", devices: ["Totes les llums"], days: "Cada dia 19:30" },
    { id: 4, name: "Horari 4", devices: ["Alarma"], days: "Dilluns - Divendres 23:00" }
  ]);
  
  // Estado de la página actual y elementos por página
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  // Función para agregar un nuevo horario
  const handleAddSchedule = () => {
    const newSchedule = {
      id: schedules.length + 1,
      name: `Horari ${schedules.length + 1}`,
      devices: ["Nou dispositiu"],
      days: "Nou dia i hora"
    };
    setSchedules([...schedules, newSchedule]);
  };

  // Lógica para la paginación
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horari</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aparells afectats</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dies afectats hora</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentSchedules.map((schedule) => (
              <tr key={schedule.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{schedule.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">{schedule.name}</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <ul className="list-disc pl-4">
                    {schedule.devices.map((device, index) => (
                      <li key={index}>{device}</li>
                    ))}
                  </ul>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{schedule.days}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación mejorada */}
      <div className="mt-6 flex justify-center items-center space-x-2">
        {/* Botón de retroceso */}
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          className="p-2 text-gray-600 hover:text-blue-600 disabled:opacity-50"
          disabled={currentPage === 1}
          aria-label="Página anterior"
        >
          &lt;
        </button>

        {/* Botones de salto de página */}
        {currentPage > 3 && (
          <>
            <button
              onClick={() => setCurrentPage(1)}
              className="px-3 py-1 rounded text-gray-600 hover:bg-gray-100"
            >
              1
            </button>
            <span className="px-3 py-1">...</span>
          </>
        )}
        
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-3 py-1 rounded ${index + 1 === currentPage ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            aria-label={`Ir a la página ${index + 1}`}
          >
            {index + 1}
          </button>
        ))}
        
        {currentPage < totalPages - 2 && (
          <span className="px-3 py-1">...</span>
        )}

        {/* Botón de avance */}
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          className="p-2 text-gray-600 hover:text-blue-600 disabled:opacity-50"
          disabled={currentPage === totalPages}
          aria-label="Página siguiente"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default DataTable;
