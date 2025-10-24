import React from 'react';

const Medidores = () => {
  const medidores = [
    { id: 1, numero: 'M-001', marca: 'Siemens', modelo: 'X100', estado: 'activo' },
    { id: 2, numero: 'M-002', marca: 'ABB', modelo: 'Y200', estado: 'inactivo' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">📟 Gestión de Medidores</h1>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-2 px-4 text-left">ID</th>
            <th className="py-2 px-4 text-left">Número</th>
            <th className="py-2 px-4 text-left">Marca</th>
            <th className="py-2 px-4 text-left">Modelo</th>
            <th className="py-2 px-4 text-left">Estado</th>
          </tr>
        </thead>
        <tbody>
          {medidores.map((m) => (
            <tr key={m.id} className="border-b hover:bg-gray-100">
              <td className="py-2 px-4">{m.id}</td>
              <td className="py-2 px-4">{m.numero}</td>
              <td className="py-2 px-4">{m.marca}</td>
              <td className="py-2 px-4">{m.modelo}</td>
              <td className="py-2 px-4">{m.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Medidores;
