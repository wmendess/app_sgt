import axios from 'axios';

export const API_CONFIG = {
  baseURL: 'https://sgt.smtt.saoluis.ma.gov.br/app/',
  key: 'w.mendessmtt63761',
  timeout: 30000,
};

const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export default api;
