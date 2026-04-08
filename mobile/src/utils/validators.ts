export const validateCPF = (cpf: string): boolean => {
  const digits = cpf.replace(/\D/g, '');
  if (digits.length !== 11) return false;
  if (/^(\d)\1+$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(digits[i]) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(digits[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(digits[i]) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  return remainder === parseInt(digits[10]);
};

export const validatePlaca = (placa: string): boolean => {
  const clean = placa.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  // Placa Mercosul: AAA0A00
  const mercosul = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/.test(clean);
  // Placa antiga: AAA0000
  const antiga = /^[A-Z]{3}[0-9]{4}$/.test(clean);
  return mercosul || antiga;
};

export const validateChassi = (chassi: string): boolean => {
  return /^[A-HJ-NPR-Z0-9]{17}$/i.test(chassi);
};

export const validateRenavam = (renavam: string): boolean => {
  return /^\d{11}$/.test(renavam.replace(/\D/g, ''));
};

export const isRequired = (value: string | null | undefined): boolean => {
  return value !== null && value !== undefined && value.trim() !== '';
};
