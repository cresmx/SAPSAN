import React from 'react';

const Facturas = () => {
  const facturas = [
    { id: 1, usuario: 'Juan Pérez', fecha: '2025-10-10', monto: 250.5, estado: 'Pagada' },
    { id: 2, usuario: 'María López', fecha: '2025-10-12', monto: 180.75, estado: 'Pendiente' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">💵 Gestión de Facturas</h1>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-2 px-4 text-left">ID</th>
            <th className="py-2 px-4 text-left">Usuario</th>
            <th className="py-2 px-4 text-left">Fecha</th>
            <th className="py-2 px-4 text-left">Monto</th>
            <th className="py-2 px-4 text-left">Estado</th>
          </tr>
        </thead>
        <tbody>
          {facturas.map((f) => (
            <tr key={f.id} className="border-b hover:bg-gray-100">
              <td className="py-2 px-4">{f.id}</td>
              <td className="py-2 px-4">{f.usuario}</td>
              <td className="py-2 px-4">{f.fecha}</td>
              <td className="py-2 px-4">${f.monto.toFixed(2)}</td>
              <td className="py-2 px-4">{f.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Facturas;
