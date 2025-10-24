// Funciones de validación

export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const isValidPhone = (phone) => {
  const regex = /^\d{10}$/;
  return regex.test(phone.replace(/\s|-/g, ''));
};

export const isValidPeriodo = (periodo) => {
  const regex = /^\d{4}-(0[1-9]|1[0-2])$/;
  return regex.test(periodo);
};

export const isPositiveNumber = (num) => {
  return !isNaN(num) && parseFloat(num) > 0;
};

export const minLength = (str, min) => {
  return str && str.length >= min;
};

export const validateRequired = (fields) => {
  const errors = {};
  Object.keys(fields).forEach(key => {
    if (!fields[key] || fields[key].toString().trim() === '') {
      errors[key] = 'Este campo es requerido';
    }
  });
  return errors;
};
