// Funciones auxiliares

/**
 * Formatea una fecha a string YYYY-MM-DD
 */
const formatDate = (date) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

/**
 * Obtiene el periodo actual (YYYY-MM)
 */
const getPeriodoActual = () => {
  const fecha = new Date();
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

/**
 * Calcula el consumo entre dos lecturas
 */
const calcularConsumo = (lecturaActual, lecturaAnterior) => {
  const consumo = parseFloat(lecturaActual) - parseFloat(lecturaAnterior);
  return consumo >= 0 ? consumo : 0;
};

/**
 * Calcula el monto según tarifa y consumo
 */
const calcularMonto = (consumo, tarifa) => {
  const { tarifa_base, tarifa_por_m3, consumo_minimo } = tarifa;
  
  if (consumo <= consumo_minimo) {
    return parseFloat(tarifa_base);
  }
  
  const consumoAdicional = consumo - consumo_minimo;
  return parseFloat(tarifa_base) + (consumoAdicional * parseFloat(tarifa_por_m3));
};

/**
 * Genera un número de factura único
 */
const generarNumeroFactura = (periodo) => {
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `FAC-${periodo.replace('-', '')}-${random}`;
};

/**
 * Valida si una fecha está vencida
 */
const estaVencida = (fechaVencimiento) => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const vencimiento = new Date(fechaVencimiento);
  vencimiento.setHours(0, 0, 0, 0);
  return vencimiento < hoy;
};

/**
 * Calcula la fecha de vencimiento (30 días después de emisión)
 */
const calcularFechaVencimiento = (fechaEmision = new Date(), dias = 30) => {
  const fecha = new Date(fechaEmision);
  fecha.setDate(fecha.getDate() + dias);
  return fecha;
};

/**
 * Valida formato de periodo (YYYY-MM)
 */
const validarPeriodo = (periodo) => {
  const regex = /^\d{4}-(0[1-9]|1[0-2])$/;
  return regex.test(periodo);
};

/**
 * Sanitiza input para prevenir SQL injection
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

module.exports = {
  formatDate,
  getPeriodoActual,
  calcularConsumo,
  calcularMonto,
  generarNumeroFactura,
  estaVencida,
  calcularFechaVencimiento,
  validarPeriodo,
  sanitizeInput
};
