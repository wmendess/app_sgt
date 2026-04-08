// Máscaras para react-native-mask-input

export const CPF_MASK = [
  /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/,
];

export const PHONE_MASK = [
  '(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/,
];

export const DATE_MASK = [
  /\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/,
];

export const TIME_MASK = [
  /\d/, /\d/, ':', /\d/, /\d/,
];

export const RENAVAM_MASK = [
  /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/,
];

// Placa Mercosul: AAA0A00
export const PLACA_MERCOSUL_MASK = [
  /[A-Za-z]/, /[A-Za-z]/, /[A-Za-z]/, /\d/, /[A-Za-z0-9]/, /\d/, /\d/,
];

// Placa antiga: AAA0000
export const PLACA_ANTIGA_MASK = [
  /[A-Za-z]/, /[A-Za-z]/, /[A-Za-z]/, /\d/, /\d/, /\d/, /\d/,
];

// Chassi: 17 caracteres alfanuméricos maiúsculos
export const CHASSI_MASK = [
  /[A-Za-z0-9]/, /[A-Za-z0-9]/, /[A-Za-z0-9]/, /[A-Za-z0-9]/, /[A-Za-z0-9]/,
  /[A-Za-z0-9]/, /[A-Za-z0-9]/, /[A-Za-z0-9]/, /[A-Za-z0-9]/, /[A-Za-z0-9]/,
  /[A-Za-z0-9]/, /[A-Za-z0-9]/, /[A-Za-z0-9]/, /[A-Za-z0-9]/, /[A-Za-z0-9]/,
  /[A-Za-z0-9]/, /[A-Za-z0-9]/,
];

// Funções de formatação
export const formatCPF = (cpf: string): string => {
  const digits = cpf.replace(/\D/g, '');
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

export const formatPhone = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11) {
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
};

export const formatDate = (date: string): string => {
  const digits = date.replace(/\D/g, '');
  return digits.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
};

export const dateToISO = (date: string): string => {
  // Converte DD/MM/YYYY para YYYY-MM-DD
  const parts = date.split('/');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return date;
};

export const isoToDisplay = (date: string): string => {
  // Converte YYYY-MM-DD para DD/MM/YYYY
  const parts = date.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return date;
};

export const cleanCPF = (cpf: string): string => cpf.replace(/\D/g, '');
export const cleanPhone = (phone: string): string => phone.replace(/\D/g, '');
