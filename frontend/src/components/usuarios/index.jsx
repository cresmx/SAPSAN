import React from 'react';

const Usuarios = () => {
  // Datos simulados
  const usuarios = [
    { id: 1, nombre: 'Juan Pérez', email: 'juan@example.com', rol: 'admin' },
    { id: 2, nombre: 'María López', email: 'maria@example.com', rol: 'usuario' },
    { id: 3, nombre: 'Carlos Ruiz', email: 'carlos@example.com', rol: 'usuario' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">👤 Gestión de Usuarios</h1>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-2 px-4 text-left">ID</th>
            <th className="py-2 px-4 text-left">Nombre</th>
            <th className="py-2 px-4 text-left">Email</th>
            <th className="py-2 px-4 text-left">Rol</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id} className="border-b hover:bg-gray-100">
              <td className="py-2 px-4">{u.id}</td>
              <td className="py-2 px-4">{u.nombre}</td>
              <td className="py-2 px-4">{u.email}</td>
              <td className="py-2 px-4">{u.rol}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Usuarios;
