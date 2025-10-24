// Funciones de formateo

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(amount);
};

export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatShortDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('es-MX');
};

export const formatDateForInput = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

export const formatNumber = (number, decimals = 2) => {
  return Number(number).toFixed(decimals);
};

export const formatPeriodo = (periodo) => {
  if (!periodo) return '';
  const [year, month] = periodo.split('-');
  const fecha = new Date(year, parseInt(month) - 1);
  return fecha.toLocaleDateString('es-MX', { year: 'numeric', month: 'long' });
};

export const getEstadoColor = (estado) => {
  const colores = {
    pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    pagada: 'bg-green-100 text-green-800 border-green-300',
    vencida: 'bg-red-100 text-red-800 border-red-300',
    parcial: 'bg-blue-100 text-blue-800 border-blue-300',
    cancelada: 'bg-gray-100 text-gray-800 border-gray-300'
  };
  return colores[estado] || 'bg-gray-100 text-gray-800 border-gray-300';
};

export const getTipoUsuarioColor = (tipo) => {
  const colores = {
    domestico: 'bg-blue-100 text-blue-800',
    comercial: 'bg-purple-100 text-purple-800',
    industrial: 'bg-orange-100 text-orange-800'
  };
  return colores[tipo] || 'bg-gray-100 text-gray-800';
};

export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
