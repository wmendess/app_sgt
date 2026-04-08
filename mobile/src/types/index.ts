// ==================== USER ====================
export interface User {
  id?: string;
  nome?: string;
  name?: string;
  cpf?: string;
  matricula?: string;
  cargo?: string;
  funcao?: string;
  [key: string]: any;
}

// ==================== BOAT ====================
export interface Boat {
  boat?: string;
  fk_user?: string;
  controle_boat?: string;
  viatura_boat?: string;
  agente_boat?: string;
  matricula_boat?: string;
  equipe_boat?: string;
  data_registro?: string;
  data_acidente?: string;
  semana?: string;
  h_ocorrido?: string;
  h_comunicado?: string;
  h_chegada?: string;
  h_saida?: string;
  local_boat?: string;
  bairro_boat?: string;
  ponto_referencia?: string;
  cidade_boat?: string;
  tipo_acidente?: string;
  causa_acidente?: string;
  pista?: string;
  tipo_via?: string;
  cruzamento?: string;
  sinal_existente?: string;
  estado_boat?: string;
  iluminacao?: string;
  pavimento?: string;
  visibilidade?: string;
  tempo?: string;
  tipo_local1?: string;
  tipo_local2?: string;
  mao_pista?: string;
  latitude?: string;
  longitude?: string;
  consulta?: string;
  status?: string;
}

// ==================== VEÍCULO ====================
export interface Veiculo {
  id_veiculo?: string;
  fk_boat?: string;
  unidade_veiculo?: string;
  placa_veiculo?: string;
  marca_veiculo?: string;
  cor_veiculo?: string;
  chassi_veiculo?: string;
  renavam_veiculo?: string;
  ano_veiculo?: string;
  tipo_veiculo?: string;
  avarias_veiculo?: string;
}

// ==================== VÍTIMA ====================
export interface Vitima {
  id_vitima?: string;
  fk_boat?: string;
  veiculo_vitima?: string;
  nome_vitima?: string;
  cpf_vitima?: string;
  rg_vitima?: string;
  endereco_vitima?: string;
  bairro_vitima?: string;
  cidade_vitima?: string;
  estado_vitima?: string;
  nacionalidade_vitima?: string;
  telefone_vitima?: string;
  idade_vitima?: string;
  estado_civil_vitima?: string;
  sexo_vitima?: string;
  condicao_vitima?: string;
  ferimentos_vit?: string;
  observacao_vit?: string;
}

// ==================== ACORDO ====================
export interface Acordo {
  id_acordo?: string;
  fk_boat?: string;
  testemunha1_nome?: string;
  testemunha1_cpf?: string;
  testemunha2_nome?: string;
  testemunha2_cpf?: string;
  descricao_acordo?: string;
}

// ==================== RELATÓRIO ====================
export interface Relatorio {
  id_relatorio?: string;
  fk_boat?: string;
  relato_agente?: string;
}

// ==================== PATRIMÔNIO ====================
export interface Patrimonio {
  id_patrimonio?: string;
  fk_boat?: string;
  nome_proprietario?: string;
  cpf_proprietario?: string;
  rg_proprietario?: string;
  endereco_proprietario?: string;
  bairro_proprietario?: string;
  sexo_proprietario?: string;
  estado_civil_proprietario?: string;
  idade_proprietario?: string;
  telefone_proprietario?: string;
  cidade_proprietario?: string;
  estado_proprietario?: string;
}

// ==================== REMOÇÃO ====================
export interface Remocao {
  id_remocao?: string;
  data?: string;
  hora?: string;
  patio?: string;
  acidente?: string;
  abandonado?: string;
  placa?: string;
  chassi?: string;
  modelo?: string;
  cor?: string;
  local?: string;
  bairro?: string;
  ponto_referencia?: string;
  infracao?: string;
  codigo?: string;
  guincho?: string;
  km?: string;
  avarias?: string;
  obs_remocao?: string;
  agente?: string;
  controle?: string;
  photos?: RemocaoPhoto[];
}

export interface RemocaoPhoto {
  id_photo?: string;
  fk_remocao?: string;
  path?: string;
}

// ==================== NAVIGATION ====================
export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  BoatList: undefined;
  BoatForm: { boatId?: string; boatNumber?: string };
  RemocaoList: undefined;
  RemocaoForm: { remocaoId?: string };
};
