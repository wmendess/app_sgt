import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaskInput from 'react-native-mask-input';
import { generateBoatNumber, saveBoat } from '../../../services/endpoints';
import { useAuth } from '../../../contexts/AuthContext';
import FormField from '../../../components/FormField';
import SelectField, { SelectOption } from '../../../components/SelectField';
import CheckboxField from '../../../components/CheckboxField';
import LoadingOverlay from '../../../components/LoadingOverlay';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../../utils/theme';
import { DATE_MASK, TIME_MASK, isoToDisplay } from '../../../utils/masks';

interface BoatTabProps {
  boatId?: string;
  boatData?: any;
  onBoatSaved?: (boatNumber: string) => void;
}

const TIPO_BOAT_OPTIONS: SelectOption[] = [
  { label: 'Viatura Padrão', value: 'PADRAO' },
  { label: 'Moto', value: 'MOTO' },
  { label: 'Caminhonete', value: 'CAMINHONETE' },
];

const SEMANA_OPTIONS: SelectOption[] = [
  { label: 'Segunda-feira', value: 'SEGUNDA' },
  { label: 'Terça-feira', value: 'TERCA' },
  { label: 'Quarta-feira', value: 'QUARTA' },
  { label: 'Quinta-feira', value: 'QUINTA' },
  { label: 'Sexta-feira', value: 'SEXTA' },
  { label: 'Sábado', value: 'SABADO' },
  { label: 'Domingo', value: 'DOMINGO' },
];

const TIPO_SINISTRO_OPTIONS: SelectOption[] = [
  { label: 'Colisão Frontal', value: 'COLISAO_FRONTAL' },
  { label: 'Colisão Traseira', value: 'COLISAO_TRASEIRA' },
  { label: 'Colisão Lateral', value: 'COLISAO_LATERAL' },
  { label: 'Atropelamento', value: 'ATROPELAMENTO' },
  { label: 'Capotamento', value: 'CAPOTAMENTO' },
  { label: 'Tombamento', value: 'TOMBAMENTO' },
  { label: 'Choque com Objeto Fixo', value: 'CHOQUE_OBJETO_FIXO' },
  { label: 'Saída de Pista', value: 'SAIDA_PISTA' },
  { label: 'Outros', value: 'OUTROS' },
];

const CAUSA_SINISTRO_OPTIONS: SelectOption[] = [
  { label: 'Velocidade Incompatível', value: 'VELOCIDADE' },
  { label: 'Desobediência à Sinalização', value: 'SINALIZACAO' },
  { label: 'Ingestão de Álcool', value: 'ALCOOL' },
  { label: 'Ultrapassagem Indevida', value: 'ULTRAPASSAGEM' },
  { label: 'Falta de Atenção', value: 'ATENCAO' },
  { label: 'Defeito Mecânico', value: 'MECANICO' },
  { label: 'Pista Escorregadia', value: 'PISTA' },
  { label: 'Animais na Pista', value: 'ANIMAIS' },
  { label: 'Outros', value: 'OUTROS' },
];

const FAIXAS_OPTIONS: SelectOption[] = [
  { label: '1 Faixa', value: '1' },
  { label: '2 Faixas', value: '2' },
  { label: '3 Faixas', value: '3' },
  { label: '4 Faixas', value: '4' },
  { label: '5 ou mais Faixas', value: '5' },
];

const BoatTab: React.FC<BoatTabProps> = ({ boatId, boatData, onBoatSaved }) => {
  const { getUserName, user } = useAuth();
  const userName = getUserName();

  const [isLoading, setIsLoading] = useState(false);
  const [boatNumber, setBoatNumber] = useState(boatId || '');
  const [fieldsEnabled, setFieldsEnabled] = useState(!!boatId);

  // Viatura
  const [tipoBoat, setTipoBoat] = useState(boatData?.viatura_boat || '');
  const [nVtr, setNVtr] = useState(boatData?.controle_boat || '');
  const [equipe, setEquipe] = useState(boatData?.equipe_boat || '');

  // Agente
  const [agente, setAgente] = useState(boatData?.agente_boat || userName);
  const [matricula, setMatricula] = useState(boatData?.matricula_boat || user?.matricula || '');

  // Datas
  const [dataAcidente, setDataAcidente] = useState(boatData?.data_acidente || '');
  const [dataRegistro] = useState(new Date().toISOString().split('T')[0]);
  const [semana, setSemana] = useState(boatData?.semana || '');
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Horas
  const [hOcorrido, setHOcorrido] = useState(boatData?.h_ocorrido || '');
  const [hComunicado, setHComunicado] = useState(boatData?.h_comunicado || '');
  const [hChegada, setHChegada] = useState(boatData?.h_chegada || '');
  const [hSaida, setHSaida] = useState(boatData?.h_saida || '');

  // Local
  const [local, setLocal] = useState(boatData?.local_boat || '');
  const [bairro, setBairro] = useState(boatData?.bairro_boat || '');
  const [pontoRef, setPontoRef] = useState(boatData?.ponto_referencia || '');

  // Sinistro
  const [tipoAcidente, setTipoAcidente] = useState(boatData?.tipo_acidente || '');
  const [causaAcidente, setCausaAcidente] = useState(boatData?.causa_acidente || '');

  // Condições da via
  const [nFaixas, setNFaixas] = useState(boatData?.pista || '');
  const [cruzamento, setCruzamento] = useState(boatData?.cruzamento === '1' || false);
  const [sinalizacao, setSinalizacao] = useState(boatData?.sinal_existente || '');

  // Via
  const [pista, setPista] = useState(boatData?.tipo_via || '');
  const [tipoVia, setTipoVia] = useState(boatData?.tipo_local1 || '');
  const [maoVia, setMaoVia] = useState(boatData?.mao_pista || '');

  // Estado
  const [estadoVia, setEstadoVia] = useState(boatData?.estado_boat || '');

  // Localização
  const [latitude, setLatitude] = useState(boatData?.latitude || '');
  const [longitude, setLongitude] = useState(boatData?.longitude || '');

  const handleGenerateBoat = async () => {
    setIsLoading(true);
    try {
      const result = await generateBoatNumber(userName);
      if (result && typeof result === 'object' && result.boat) {
        setBoatNumber(String(result.boat));
        setFieldsEnabled(true);
        Alert.alert('Sucesso', `Número BOAT gerado: ${result.boat}`);
        if (onBoatSaved) onBoatSaved(String(result.boat));
      } else if (typeof result === 'string' && result.includes('BOAT')) {
        const match = result.match(/\d+/);
        if (match) {
          setBoatNumber(match[0]);
          setFieldsEnabled(true);
          if (onBoatSaved) onBoatSaved(match[0]);
        } else {
          Alert.alert('Aviso', result);
        }
      } else {
        Alert.alert('Aviso', typeof result === 'string' ? result : 'Não foi possível gerar o número do BOAT.');
      }
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao gerar número do BOAT.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveBoat = async () => {
    if (!boatNumber) {
      Alert.alert('Atenção', 'Gere o número do BOAT antes de salvar.');
      return;
    }
    if (!local) {
      Alert.alert('Atenção', 'O campo Local é obrigatório.');
      return;
    }

    setIsLoading(true);
    try {
      const boatPayload = {
        boat: boatNumber,
        fk_user: user?.id || '',
        controle_boat: nVtr,
        viatura_boat: tipoBoat,
        agente_boat: agente,
        matricula_boat: matricula,
        equipe_boat: equipe,
        data_registro: dataRegistro,
        data_acidente: dataAcidente || dataRegistro,
        semana,
        h_ocorrido: hOcorrido,
        h_comunicado: hComunicado,
        h_chegada: hChegada,
        h_saida: hSaida,
        local_boat: local,
        bairro_boat: bairro,
        ponto_referencia: pontoRef,
        cidade_boat: 'SÃO LUÍS',
        tipo_acidente: tipoAcidente,
        causa_acidente: causaAcidente,
        pista: nFaixas,
        tipo_via: pista,
        cruzamento: cruzamento ? '1' : '0',
        sinal_existente: sinalizacao,
        estado_boat: estadoVia,
        iluminacao: '',
        pavimento: '',
        visibilidade: '',
        tempo: '',
        tipo_local1: tipoVia,
        tipo_local2: '',
        mao_pista: maoVia,
        latitude,
        longitude,
      };

      const result = await saveBoat(boatPayload);
      if (typeof result === 'string' && result.includes('SUCESSO')) {
        Alert.alert('Sucesso', 'BOAT salvo com sucesso!');
        if (onBoatSaved) onBoatSaved(boatNumber);
      } else {
        Alert.alert('Aviso', result || 'BOAT não foi salvo. Verifique os dados.');
      }
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao salvar o BOAT.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const iso = selectedDate.toISOString().split('T')[0];
      setDataAcidente(iso);
      // Auto-set semana
      const days = ['DOMINGO', 'SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO'];
      setSemana(days[selectedDate.getDay()]);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LoadingOverlay visible={isLoading} message="Processando..." />

      {/* Gerar Número BOAT */}
      {!boatId && (
        <TouchableOpacity
          style={styles.generateButton}
          onPress={handleGenerateBoat}
          activeOpacity={0.8}
        >
          <Text style={styles.generateButtonText}>GERAR Nº BOAT</Text>
        </TouchableOpacity>
      )}

      {/* Número do BOAT */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>IDENTIFICAÇÃO</Text>
        <FormField
          label="Nº BOAT"
          value={boatNumber}
          editable={false}
          style={styles.readonlyField}
          placeholder="Aguardando geração..."
        />
      </View>

      {/* Viatura */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>VIATURA</Text>
        <SelectField
          label="Tipo Boat"
          value={tipoBoat}
          options={TIPO_BOAT_OPTIONS}
          onSelect={setTipoBoat}
        />
        <FormField
          label="Nº Vtr"
          value={nVtr}
          onChangeText={setNVtr}
          editable={fieldsEnabled}
          placeholder="Número da viatura"
        />
        <FormField
          label="Equipe"
          value={equipe}
          onChangeText={setEquipe}
          editable={fieldsEnabled}
          placeholder="Nome da equipe"
        />
      </View>

      {/* Agente */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AGENTE</Text>
        <FormField
          label="Agente"
          value={agente}
          onChangeText={setAgente}
          editable={fieldsEnabled}
          autoCapitalize="characters"
        />
        <FormField
          label="Matrícula"
          value={matricula}
          onChangeText={setMatricula}
          editable={fieldsEnabled}
          keyboardType="numeric"
        />
      </View>

      {/* Local e Data */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>LOCAL E DATA</Text>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>DATA DO SINISTRO</Text>
          <TouchableOpacity
            style={[styles.dateButton, !fieldsEnabled && styles.disabledField]}
            onPress={() => fieldsEnabled && setShowDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              {dataAcidente ? isoToDisplay(dataAcidente) : 'Selecionar data...'}
            </Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={dataAcidente ? new Date(dataAcidente) : new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}

        <FormField
          label="Data do Registro"
          value={isoToDisplay(dataRegistro)}
          editable={false}
          style={styles.readonlyField}
        />

        <SelectField
          label="Semana"
          value={semana}
          options={SEMANA_OPTIONS}
          onSelect={setSemana}
        />
      </View>

      {/* Horas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>HORAS</Text>
        <View style={styles.row}>
          <View style={styles.halfField}>
            <Text style={styles.fieldLabel}>HORA DO SINISTRO</Text>
            <MaskInput
              style={[styles.maskedInput, !fieldsEnabled && styles.disabledField]}
              value={hOcorrido}
              onChangeText={setHOcorrido}
              mask={TIME_MASK}
              keyboardType="numeric"
              placeholder="HH:MM"
              editable={fieldsEnabled}
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>
          <View style={styles.halfField}>
            <Text style={styles.fieldLabel}>HORA DO COMUNICADO</Text>
            <MaskInput
              style={[styles.maskedInput, !fieldsEnabled && styles.disabledField]}
              value={hComunicado}
              onChangeText={setHComunicado}
              mask={TIME_MASK}
              keyboardType="numeric"
              placeholder="HH:MM"
              editable={fieldsEnabled}
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.halfField}>
            <Text style={styles.fieldLabel}>HORA DE CHEGADA</Text>
            <MaskInput
              style={[styles.maskedInput, !fieldsEnabled && styles.disabledField]}
              value={hChegada}
              onChangeText={setHChegada}
              mask={TIME_MASK}
              keyboardType="numeric"
              placeholder="HH:MM"
              editable={fieldsEnabled}
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>
          <View style={styles.halfField}>
            <Text style={styles.fieldLabel}>HORA DE SAÍDA</Text>
            <MaskInput
              style={[styles.maskedInput, !fieldsEnabled && styles.disabledField]}
              value={hSaida}
              onChangeText={setHSaida}
              mask={TIME_MASK}
              keyboardType="numeric"
              placeholder="HH:MM"
              editable={fieldsEnabled}
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>
        </View>
      </View>

      {/* Local */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>LOCALIZAÇÃO</Text>
        <FormField
          label="Local"
          value={local}
          onChangeText={setLocal}
          editable={fieldsEnabled}
          required
          autoCapitalize="characters"
          placeholder="Nome da rua/avenida"
        />
        <FormField
          label="Bairro"
          value={bairro}
          onChangeText={setBairro}
          editable={fieldsEnabled}
          autoCapitalize="characters"
          placeholder="Nome do bairro"
        />
        <FormField
          label="Ponto de Referência"
          value={pontoRef}
          onChangeText={setPontoRef}
          editable={fieldsEnabled}
          autoCapitalize="characters"
          placeholder="Ponto de referência"
        />
      </View>

      {/* Sinistro */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SINISTRO</Text>
        <SelectField
          label="Tipo de Sinistro"
          value={tipoAcidente}
          options={TIPO_SINISTRO_OPTIONS}
          onSelect={setTipoAcidente}
        />
        <SelectField
          label="Causa do Sinistro"
          value={causaAcidente}
          options={CAUSA_SINISTRO_OPTIONS}
          onSelect={setCausaAcidente}
        />
      </View>

      {/* Condições da Via */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CONDIÇÕES DA VIA</Text>
        <SelectField
          label="Nº de Faixas"
          value={nFaixas}
          options={FAIXAS_OPTIONS}
          onSelect={setNFaixas}
        />
        <CheckboxField
          label="Sinistro em Cruzamento?"
          checked={cruzamento}
          onToggle={() => setCruzamento(!cruzamento)}
        />
        <FormField
          label="Sinalização Existente"
          value={sinalizacao}
          onChangeText={setSinalizacao}
          editable={fieldsEnabled}
          autoCapitalize="characters"
          placeholder="Ex: SEMÁFORO, PLACA PARE..."
        />
      </View>

      {/* Via */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>VIA</Text>
        <View style={styles.checkboxGroup}>
          <Text style={styles.checkboxGroupLabel}>Pista:</Text>
          <CheckboxField label="SIMPLES" checked={pista === 'SIMPLES'} onToggle={() => setPista(pista === 'SIMPLES' ? '' : 'SIMPLES')} />
          <CheckboxField label="DUPLA" checked={pista === 'DUPLA'} onToggle={() => setPista(pista === 'DUPLA' ? '' : 'DUPLA')} />
        </View>
        <View style={styles.checkboxGroup}>
          <Text style={styles.checkboxGroupLabel}>Tipo:</Text>
          <CheckboxField label="RETA" checked={tipoVia === 'RETA'} onToggle={() => setTipoVia(tipoVia === 'RETA' ? '' : 'RETA')} />
          <CheckboxField label="CURVA" checked={tipoVia === 'CURVA'} onToggle={() => setTipoVia(tipoVia === 'CURVA' ? '' : 'CURVA')} />
          <CheckboxField label="RAMPA" checked={tipoVia === 'RAMPA'} onToggle={() => setTipoVia(tipoVia === 'RAMPA' ? '' : 'RAMPA')} />
          <CheckboxField label="NÍVEL" checked={tipoVia === 'NIVEL'} onToggle={() => setTipoVia(tipoVia === 'NIVEL' ? '' : 'NIVEL')} />
        </View>
        <View style={styles.checkboxGroup}>
          <Text style={styles.checkboxGroupLabel}>Mão:</Text>
          <CheckboxField label="MÃO ÚNICA" checked={maoVia === 'MAO_UNICA'} onToggle={() => setMaoVia(maoVia === 'MAO_UNICA' ? '' : 'MAO_UNICA')} />
          <CheckboxField label="MÃO DUPLA" checked={maoVia === 'MAO_DUPLA'} onToggle={() => setMaoVia(maoVia === 'MAO_DUPLA' ? '' : 'MAO_DUPLA')} />
        </View>
      </View>

      {/* Estado da Via */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ESTADO DA VIA</Text>
        <View style={styles.checkboxGroup}>
          <CheckboxField label="SECO" checked={estadoVia === 'SECO'} onToggle={() => setEstadoVia(estadoVia === 'SECO' ? '' : 'SECO')} />
          <CheckboxField label="MOLHADO" checked={estadoVia === 'MOLHADO'} onToggle={() => setEstadoVia(estadoVia === 'MOLHADO' ? '' : 'MOLHADO')} />
          <CheckboxField label="ENLAMEADO" checked={estadoVia === 'ENLAMEADO'} onToggle={() => setEstadoVia(estadoVia === 'ENLAMEADO' ? '' : 'ENLAMEADO')} />
          <CheckboxField label="OLEOSO" checked={estadoVia === 'OLEOSO'} onToggle={() => setEstadoVia(estadoVia === 'OLEOSO' ? '' : 'OLEOSO')} />
          <CheckboxField label="DANIFICADO" checked={estadoVia === 'DANIFICADO'} onToggle={() => setEstadoVia(estadoVia === 'DANIFICADO' ? '' : 'DANIFICADO')} />
          <CheckboxField label="EM OBRAS" checked={estadoVia === 'EM_OBRAS'} onToggle={() => setEstadoVia(estadoVia === 'EM_OBRAS' ? '' : 'EM_OBRAS')} />
        </View>
      </View>

      {/* Coordenadas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>COORDENADAS (OPCIONAL)</Text>
        <View style={styles.row}>
          <View style={styles.halfField}>
            <FormField
              label="Latitude"
              value={latitude}
              onChangeText={setLatitude}
              editable={fieldsEnabled}
              keyboardType="decimal-pad"
              placeholder="-2.5297"
            />
          </View>
          <View style={styles.halfField}>
            <FormField
              label="Longitude"
              value={longitude}
              onChangeText={setLongitude}
              editable={fieldsEnabled}
              keyboardType="decimal-pad"
              placeholder="-44.3028"
            />
          </View>
        </View>
      </View>

      {/* Salvar */}
      {fieldsEnabled && (
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveBoat}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>SALVAR BOAT</Text>
        </TouchableOpacity>
      )}

      <View style={{ height: SPACING.xxxl }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
  },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: SPACING.xs,
    letterSpacing: 0.5,
  },
  generateButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
    elevation: 3,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
    elevation: 3,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  readonlyField: {
    backgroundColor: COLORS.background,
    color: COLORS.textSecondary,
  },
  disabledField: {
    backgroundColor: COLORS.background,
    opacity: 0.7,
  },
  fieldContainer: {
    marginBottom: SPACING.md,
  },
  fieldLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    minHeight: 44,
    justifyContent: 'center',
  },
  dateButtonText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  halfField: {
    flex: 1,
  },
  maskedInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    backgroundColor: COLORS.surface,
    minHeight: 44,
  },
  checkboxGroup: {
    marginBottom: SPACING.sm,
  },
  checkboxGroupLabel: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
  },
});

export default BoatTab;
