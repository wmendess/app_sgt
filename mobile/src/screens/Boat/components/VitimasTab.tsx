import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import MaskInput from 'react-native-mask-input';
import { Ionicons } from '@expo/vector-icons';
import { getVictims, saveVictim } from '../../../services/endpoints';
import FormField from '../../../components/FormField';
import SelectField, { SelectOption } from '../../../components/SelectField';
import LoadingOverlay from '../../../components/LoadingOverlay';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../../utils/theme';
import { CPF_MASK, PHONE_MASK } from '../../../utils/masks';
import { Vitima } from '../../../types';

interface VitimasTabProps {
  boatNumber: string;
}

const UNIDADE_OPTIONS: SelectOption[] = [
  { label: 'V1', value: 'V1' },
  { label: 'V2', value: 'V2' },
  { label: 'V3', value: 'V3' },
  { label: 'V4', value: 'V4' },
  { label: 'V5', value: 'V5' },
  { label: 'Pedestre', value: 'PEDESTRE' },
];

const ESTADO_CIVIL_OPTIONS: SelectOption[] = [
  { label: 'Solteiro(a)', value: 'SOLTEIRO' },
  { label: 'Casado(a)', value: 'CASADO' },
  { label: 'Divorciado(a)', value: 'DIVORCIADO' },
  { label: 'Viúvo(a)', value: 'VIUVO' },
  { label: 'União Estável', value: 'UNIAO_ESTAVEL' },
];

const SEXO_OPTIONS: SelectOption[] = [
  { label: 'Masculino', value: 'M' },
  { label: 'Feminino', value: 'F' },
];

const CONDICAO_OPTIONS: SelectOption[] = [
  { label: 'Condutor', value: 'CONDUTOR' },
  { label: 'Passageiro', value: 'PASSAGEIRO' },
  { label: 'Pedestre', value: 'PEDESTRE' },
  { label: 'Ciclista', value: 'CICLISTA' },
];

const FERIMENTOS_OPTIONS: SelectOption[] = [
  { label: 'Ileso', value: 'ILESO' },
  { label: 'Leve', value: 'LEVE' },
  { label: 'Grave', value: 'GRAVE' },
  { label: 'Gravíssimo', value: 'GRAVISSIMO' },
  { label: 'Fatal', value: 'FATAL' },
];

const UF_OPTIONS: SelectOption[] = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG',
  'PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'
].map(uf => ({ label: uf, value: uf }));

const VitimasTab: React.FC<VitimasTabProps> = ({ boatNumber }) => {
  const [vitimas, setVitimas] = useState<Vitima[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingVitima, setEditingVitima] = useState<Vitima | null>(null);

  // Form fields
  const [veiculo, setVeiculo] = useState('V1');
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [rg, setRg] = useState('');
  const [endereco, setEndereco] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('SÃO LUÍS');
  const [estado, setEstado] = useState('MA');
  const [nacionalidade, setNacionalidade] = useState('BRASILEIRA');
  const [telefone, setTelefone] = useState('');
  const [idade, setIdade] = useState('');
  const [estadoCivil, setEstadoCivil] = useState('');
  const [sexo, setSexo] = useState('');
  const [condicao, setCondicao] = useState('');
  const [ferimentos, setFerimentos] = useState('');
  const [observacao, setObservacao] = useState('');

  useEffect(() => {
    if (boatNumber) loadVitimas();
  }, [boatNumber]);

  const loadVitimas = async () => {
    setIsLoading(true);
    try {
      const data = await getVictims(boatNumber);
      if (Array.isArray(data)) setVitimas(data);
    } catch (error) {
      console.error('Error loading victims:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setVeiculo('V1'); setNome(''); setCpf(''); setRg('');
    setEndereco(''); setBairro(''); setCidade('SÃO LUÍS'); setEstado('MA');
    setNacionalidade('BRASILEIRA'); setTelefone(''); setIdade('');
    setEstadoCivil(''); setSexo(''); setCondicao(''); setFerimentos('');
    setObservacao(''); setEditingVitima(null);
  };

  const openModal = (vitima?: Vitima) => {
    if (vitima) {
      setEditingVitima(vitima);
      setVeiculo(vitima.veiculo_vitima || 'V1');
      setNome(vitima.nome_vitima || '');
      setCpf(vitima.cpf_vitima || '');
      setRg(vitima.rg_vitima || '');
      setEndereco(vitima.endereco_vitima || '');
      setBairro(vitima.bairro_vitima || '');
      setCidade(vitima.cidade_vitima || 'SÃO LUÍS');
      setEstado(vitima.estado_vitima || 'MA');
      setNacionalidade(vitima.nacionalidade_vitima || 'BRASILEIRA');
      setTelefone(vitima.telefone_vitima || '');
      setIdade(vitima.idade_vitima || '');
      setEstadoCivil(vitima.estado_civil_vitima || '');
      setSexo(vitima.sexo_vitima || '');
      setCondicao(vitima.condicao_vitima || '');
      setFerimentos(vitima.ferimentos_vit || '');
      setObservacao(vitima.observacao_vit || '');
    } else {
      resetForm();
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!nome) {
      Alert.alert('Atenção', 'O nome da vítima é obrigatório.');
      return;
    }

    setIsLoading(true);
    try {
      const payload: Record<string, any> = {
        fk_boat: boatNumber,
        veiculo_vitima: veiculo,
        nome_vitima: nome.toUpperCase(),
        cpf_vitima: cpf.replace(/\D/g, ''),
        rg_vitima: rg,
        endereco_vitima: endereco.toUpperCase(),
        bairro_vitima: bairro.toUpperCase(),
        cidade_vitima: cidade.toUpperCase(),
        estado_vitima: estado,
        nacionalidade_vitima: nacionalidade.toUpperCase(),
        telefone_vitima: telefone.replace(/\D/g, ''),
        idade_vitima: idade,
        estado_civil_vitima: estadoCivil,
        sexo_vitima: sexo,
        condicao_vitima: condicao,
        ferimentos_vit: ferimentos,
        observacao_vit: observacao.toUpperCase(),
      };

      if (editingVitima?.id_vitima) {
        payload.id_vitima = editingVitima.id_vitima;
      }

      const result = await saveVictim(payload);
      if (typeof result === 'string' && (result.includes('SUCESSO') || result.includes('sucesso'))) {
        Alert.alert('Sucesso', 'Vítima salva com sucesso!');
        setModalVisible(false);
        resetForm();
        loadVitimas();
      } else {
        Alert.alert('Aviso', result || 'Vítima não foi salva.');
      }
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao salvar vítima.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderVitima = ({ item }: { item: Vitima }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => openModal(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.unidadeBadge}>
          <Text style={styles.unidadeText}>{item.veiculo_vitima}</Text>
        </View>
        <Text style={styles.nome} numberOfLines={1}>{item.nome_vitima}</Text>
        <Ionicons name="pencil" size={18} color={COLORS.primary} />
      </View>
      <Text style={styles.cardDetail}>
        {item.condicao_vitima} | {item.ferimentos_vit || 'Sem ferimentos'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LoadingOverlay visible={isLoading} message="Carregando vítimas..." />

      {!boatNumber ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={48} color={COLORS.disabled} />
          <Text style={styles.emptyText}>Salve o BOAT primeiro para adicionar vítimas</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={vitimas}
            keyExtractor={(item, index) => item.id_vitima || String(index)}
            renderItem={renderVitima}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="people-outline" size={48} color={COLORS.disabled} />
                <Text style={styles.emptyText}>Nenhuma vítima cadastrada</Text>
              </View>
            }
            contentContainerStyle={styles.list}
          />

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => openModal()}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={24} color="#fff" />
            <Text style={styles.addButtonText}>ADICIONAR VÍTIMA</Text>
          </TouchableOpacity>
        </>
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingVitima ? 'Editar Vítima' : 'Adicionar Vítima'}
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <SelectField label="Unidade (Veículo)" value={veiculo} options={UNIDADE_OPTIONS} onSelect={setVeiculo} required />
            <FormField label="Nome Completo" value={nome} onChangeText={setNome} autoCapitalize="characters" required placeholder="Nome completo da vítima" />

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>CPF</Text>
              <MaskInput
                style={styles.maskedInput}
                value={cpf}
                onChangeText={setCpf}
                mask={CPF_MASK}
                keyboardType="numeric"
                placeholder="000.000.000-00"
                placeholderTextColor={COLORS.textSecondary}
              />
            </View>

            <FormField label="RG" value={rg} onChangeText={setRg} keyboardType="numeric" placeholder="Número do RG" />
            <FormField label="Endereço" value={endereco} onChangeText={setEndereco} autoCapitalize="characters" />
            <FormField label="Bairro" value={bairro} onChangeText={setBairro} autoCapitalize="characters" />
            <FormField label="Cidade" value={cidade} onChangeText={setCidade} autoCapitalize="characters" />
            <SelectField label="Estado (UF)" value={estado} options={UF_OPTIONS} onSelect={setEstado} />
            <FormField label="Nacionalidade" value={nacionalidade} onChangeText={setNacionalidade} autoCapitalize="characters" />

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>TELEFONE</Text>
              <MaskInput
                style={styles.maskedInput}
                value={telefone}
                onChangeText={setTelefone}
                mask={PHONE_MASK}
                keyboardType="phone-pad"
                placeholder="(98) 99999-9999"
                placeholderTextColor={COLORS.textSecondary}
              />
            </View>

            <FormField label="Idade" value={idade} onChangeText={setIdade} keyboardType="numeric" maxLength={3} />
            <SelectField label="Estado Civil" value={estadoCivil} options={ESTADO_CIVIL_OPTIONS} onSelect={setEstadoCivil} />
            <SelectField label="Sexo" value={sexo} options={SEXO_OPTIONS} onSelect={setSexo} />
            <SelectField label="Condição" value={condicao} options={CONDICAO_OPTIONS} onSelect={setCondicao} />
            <SelectField label="Ferimentos" value={ferimentos} options={FERIMENTOS_OPTIONS} onSelect={setFerimentos} />

            <FormField
              label="Observação"
              value={observacao}
              onChangeText={setObservacao}
              multiline
              numberOfLines={3}
              autoCapitalize="characters"
              style={{ minHeight: 80, textAlignVertical: 'top' }}
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.8}>
              <Text style={styles.saveButtonText}>SALVAR VÍTIMA</Text>
            </TouchableOpacity>
            <View style={{ height: SPACING.xxxl }} />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: SPACING.md, paddingBottom: 80 },
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  unidadeBadge: { backgroundColor: COLORS.secondary, borderRadius: BORDER_RADIUS.sm, paddingHorizontal: SPACING.sm, paddingVertical: 2 },
  unidadeText: { color: '#fff', fontWeight: 'bold', fontSize: FONTS.sizes.sm },
  nome: { flex: 1, fontSize: FONTS.sizes.md, fontWeight: 'bold', color: COLORS.text },
  cardDetail: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginTop: SPACING.xs },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: SPACING.xxxl * 2 },
  emptyText: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary, marginTop: SPACING.md, textAlign: 'center', paddingHorizontal: SPACING.xl },
  addButton: { backgroundColor: COLORS.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: SPACING.md, padding: SPACING.md, borderRadius: BORDER_RADIUS.md, gap: SPACING.sm, elevation: 3 },
  addButtonText: { color: '#fff', fontSize: FONTS.sizes.md, fontWeight: 'bold' },
  modal: { flex: 1, backgroundColor: COLORS.background },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  modalTitle: { fontSize: FONTS.sizes.xl, fontWeight: 'bold', color: COLORS.text },
  modalContent: { flex: 1, padding: SPACING.md },
  fieldContainer: { marginBottom: SPACING.md },
  fieldLabel: { fontSize: FONTS.sizes.sm, color: COLORS.text, fontWeight: '600', marginBottom: SPACING.xs, textTransform: 'uppercase' },
  maskedInput: { borderWidth: 1, borderColor: COLORS.border, borderRadius: BORDER_RADIUS.md, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, fontSize: FONTS.sizes.md, color: COLORS.text, backgroundColor: COLORS.surface, minHeight: 44 },
  saveButton: { backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.md, paddingVertical: SPACING.md, alignItems: 'center', marginTop: SPACING.md, elevation: 3 },
  saveButtonText: { color: '#fff', fontSize: FONTS.sizes.lg, fontWeight: 'bold' },
});

export default VitimasTab;
