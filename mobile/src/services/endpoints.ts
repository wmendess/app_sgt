import api, { API_CONFIG } from './api';

const KEY = API_CONFIG.key;

// ==================== BOAT ====================

export const getBoatList = async (userName: string) => {
  const response = await api.get(`listar_boat_edit.php?key=${KEY}&user=${userName}`);
  return response.data;
};

export const generateBoatNumber = async (agente: string) => {
  const payload = new URLSearchParams();
  payload.append('key', KEY);
  payload.append('agente_boat', agente);
  const response = await api.post('n_boat.php', payload.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return response.data;
};

export const saveBoat = async (boatData: Record<string, any>) => {
  const payload = new URLSearchParams();
  payload.append('key', KEY);
  Object.entries(boatData).forEach(([k, v]) => {
    if (v !== null && v !== undefined) payload.append(k, String(v));
  });
  const response = await api.post('inserir_boat.php', payload.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return response.data;
};

// ==================== VEÍCULOS ====================

export const getVehicles = async (boat: string) => {
  const response = await api.get(`listar_veiculos.php?key=${KEY}&boat=${boat}`);
  return response.data;
};

export const saveVehicle = async (vehicleData: Record<string, any>) => {
  const payload = new URLSearchParams();
  payload.append('key', KEY);
  Object.entries(vehicleData).forEach(([k, v]) => {
    if (v !== null && v !== undefined) payload.append(k, String(v));
  });
  const response = await api.post('insert_veiculo.php', payload.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return response.data;
};

// ==================== VÍTIMAS ====================

export const getVictims = async (boat: string) => {
  const response = await api.get(`listar_vitimas.php?key=${KEY}&boat=${boat}`);
  return response.data;
};

export const saveVictim = async (victimData: Record<string, any>) => {
  const payload = new URLSearchParams();
  payload.append('key', KEY);
  Object.entries(victimData).forEach(([k, v]) => {
    if (v !== null && v !== undefined) payload.append(k, String(v));
  });
  const response = await api.post('insert_vitima.php', payload.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return response.data;
};

// ==================== ACORDO ====================

export const saveAcordo = async (acordoData: Record<string, any>) => {
  const payload = new URLSearchParams();
  payload.append('key', KEY);
  Object.entries(acordoData).forEach(([k, v]) => {
    if (v !== null && v !== undefined) payload.append(k, String(v));
  });
  const response = await api.post('insert_acordo.php', payload.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return response.data;
};

// ==================== RELATÓRIO ====================

export const saveRelatorio = async (relatorioData: Record<string, any>) => {
  const payload = new URLSearchParams();
  payload.append('key', KEY);
  Object.entries(relatorioData).forEach(([k, v]) => {
    if (v !== null && v !== undefined) payload.append(k, String(v));
  });
  const response = await api.post('insert_relatorio.php', payload.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return response.data;
};

// ==================== PATRIMÔNIO ====================

export const savePatrimonio = async (patrimonioData: Record<string, any>) => {
  const payload = new URLSearchParams();
  payload.append('key', KEY);
  Object.entries(patrimonioData).forEach(([k, v]) => {
    if (v !== null && v !== undefined) payload.append(k, String(v));
  });
  const response = await api.post('insert_patrimonio.php', payload.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return response.data;
};

// ==================== FOTOS ====================

export const getPhotos = async (boatId: string) => {
  const response = await api.get(`upload_anexos.php?key=${KEY}&fk_boat_photo=${boatId}`);
  return response.data;
};

export const uploadPhotos = async (boatId: string, images: string[]) => {
  const payload = new URLSearchParams();
  payload.append('key', KEY);
  payload.append('insert_photo', 'true');
  payload.append('insert', 'true');
  payload.append('fk_boat', boatId);
  payload.append('img', images.join(','));
  const response = await api.post('upload_anexos.php', payload.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return response.data;
};

// ==================== REMOÇÃO ====================

export const getRemocoes = async (agente: string, funcao: number = 6) => {
  const response = await api.get(`crud_remocao.php?key=${KEY}&agente=${agente}&funcao=${funcao}`);
  return response.data;
};

export const saveRemocao = async (remocaoData: Record<string, any>, action: 'insert' | 'update') => {
  const payload = new URLSearchParams();
  payload.append('key', KEY);
  payload.append('action', action);
  Object.entries(remocaoData).forEach(([k, v]) => {
    if (v !== null && v !== undefined) payload.append(k, String(v));
  });
  const response = await api.post('crud_remocao.php', payload.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return response.data;
};

export const deleteRemocao = async (id: string) => {
  const payload = new URLSearchParams();
  payload.append('key', KEY);
  payload.append('action', 'delete');
  payload.append('id_remocao', id);
  const response = await api.post('crud_remocao.php', payload.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return response.data;
};
