import api, { API_CONFIG } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserData {
  id?: string;
  nome?: string;
  name?: string;
  cpf?: string;
  matricula?: string;
  cargo?: string;
  funcao?: string;
  [key: string]: any;
}

export const loginUser = async (cpf: string, password: string): Promise<UserData> => {
  const payload = {
    key: API_CONFIG.key,
    cpf: cpf.replace(/\D/g, ''),
    password,
    versao: '3',
    logar: true,
  };

  const response = await api.post('login.php', payload);
  const data = response.data;

  if (data === 1) throw new Error('Senha inválida');
  if (data === 2) throw new Error('CPF inválido');
  if (data === 3) throw new Error('Usuário inativo');
  if (data === 4) throw new Error('Campos vazios');
  if (data === 5) throw new Error('Sem permissão de acesso');
  if (data === 7) throw new Error('Atualize o aplicativo');

  if (typeof data === 'object' && data !== null) {
    return data as UserData;
  }

  throw new Error('Erro desconhecido ao fazer login');
};

export const saveUserData = async (userData: UserData): Promise<void> => {
  await AsyncStorage.setItem('@sgt_user', JSON.stringify(userData));
};

export const getUserData = async (): Promise<UserData | null> => {
  const data = await AsyncStorage.getItem('@sgt_user');
  return data ? JSON.parse(data) : null;
};

export const removeUserData = async (): Promise<void> => {
  await AsyncStorage.removeItem('@sgt_user');
};
