import React from 'react';

const Mediciones = () => {
  const mediciones = [
    { id: 1, medidor: 'M-001', fecha: '2025-10-01', lectura: 120 },
    { id: 2, medidor: 'M-002', fecha: '2025-10-05', lectura: 95 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">📊 Registro de Mediciones</h1>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-2 px-4 text-left">ID</th>
            <th className="py-2 px-4 text-left">Medidor</th>
            <th className="py-2 px-4 text-left">Fecha</th>
            <th className="py-2 px-4 text-left">Lectura (m³)</th>
          </tr>
        </thead>
        <tbody>
          {mediciones.map((med) => (
            <tr key={med.id} className="border-b hover:bg-gray-100">
              <td className="py-2 px-4">{med.id}</td>
              <td className="py-2 px-4">{med.medidor}</td>
              <td className="py-2 px-4">{med.fecha}</td>
              <td className="py-2 px-4">{med.lectura}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Mediciones;
