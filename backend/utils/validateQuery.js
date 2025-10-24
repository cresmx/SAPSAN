export const validateQuery = (text, params) => {
  if (!text || typeof text !== 'string') throw new Error('Consulta SQL inválida');
  if (!Array.isArray(params)) throw new Error('Parámetros deben ser un array');
};
