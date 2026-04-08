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
import { getVehicles, saveVehicle } from '../../../services/endpoints';
import FormField from '../../../components/FormField';
import SelectField, { SelectOption } from '../../../components/SelectField';
import LoadingOverlay from '../../../components/LoadingOverlay';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../../utils/theme';
import { PLACA_MERCOSUL_MASK, CHASSI_MASK, RENAVAM_MASK } from '../../../utils/masks';
import { Veiculo } from '../../../types';

interface VeiculosTabProps {
  boatNumber: string;
}

const UNIDADE_OPTIONS: SelectOption[] = [
  { label: 'V1', value: 'V1' },
  { label: 'V2', value: 'V2' },
  { label: 'V3', value: 'V3' },
  { label: 'V4', value: 'V4' },
  { label: 'V5', value: 'V5' },
];

const TIPO_VEICULO_OPTIONS: SelectOption[] = [
  { label: 'Automóvel', value: 'AUTOMOVEL' },
  { label: 'Motocicleta', value: 'MOTOCICLETA' },
  { label: 'Caminhão', value: 'CAMINHAO' },
  { label: 'Ônibus', value: 'ONIBUS' },
  { label: 'Bicicleta', value: 'BICICLETA' },
  { label: 'Caminhonete', value: 'CAMINHONETE' },
  { label: 'Outros', value: 'OUTROS' },
];

const VeiculosTab: React.FC<VeiculosTabProps> = ({ boatNumber }) => {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingVeiculo, setEditingVeiculo] = useState<Veiculo | null>(null);

  // Form fields
  const [unidade, setUnidade] = useState('V1');
  const [placa, setPlaca] = useState('');
  const [marca, setMarca] = useState('');
  const [cor, setCor] = useState('');
  const [chassi, setChassi] = useState('');
  const [renavam, setRenavam] = useState('');
  const [ano, setAno] = useState('');
  const [tipoVeiculo, setTipoVeiculo] = useState('');
  const [avarias, setAvarias] = useState('');

  useEffect(() => {
    if (boatNumber) loadVeiculos();
  }, [boatNumber]);

  const loadVeiculos = async () => {
    setIsLoading(true);
    try {
      const data = await getVehicles(boatNumber);
      if (Array.isArray(data)) setVeiculos(data);
    } catch (error) {
      console.error('Error loading vehicles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setUnidade('V1');
    setPlaca('');
    setMarca('');
    setCor('');
    setChassi('');
    setRenavam('');
    setAno('');
    setTipoVeiculo('');
    setAvarias('');
    setEditingVeiculo(null);
  };

  const openModal = (veiculo?: Veiculo) => {
    if (veiculo) {
      setEditingVeiculo(veiculo);
      setUnidade(veiculo.unidade_veiculo || 'V1');
      setPlaca(veiculo.placa_veiculo || '');
      setMarca(veiculo.marca_veiculo || '');
      setCor(veiculo.cor_veiculo || '');
      setChassi(veiculo.chassi_veiculo || '');
      setRenavam(veiculo.renavam_veiculo || '');
      setAno(veiculo.ano_veiculo || '');
      setTipoVeiculo(veiculo.tipo_veiculo || '');
      setAvarias(veiculo.avarias_veiculo || '');
    } else {
      resetForm();
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!placa) {
      Alert.alert('Atenção', 'A placa do veículo é obrigatória.');
      return;
    }

    setIsLoading(true);
    try {
      const payload: Record<string, any> = {
        fk_boat: boatNumber,
        unidade_veiculo: unidade,
        placa_veiculo: placa.replace(/[^A-Za-z0-9]/g, '').toUpperCase(),
        marca_veiculo: marca.toUpperCase(),
        cor_veiculo: cor.toUpperCase(),
        chassi_veiculo: chassi.toUpperCase(),
        renavam_veiculo: renavam.replace(/\D/g, ''),
        ano_veiculo: ano,
        tipo_veiculo: tipoVeiculo,
        avarias_veiculo: avarias.toUpperCase(),
      };

      if (editingVeiculo?.id_veiculo) {
        payload.id_veiculo = editingVeiculo.id_veiculo;
      }

      const result = await saveVehicle(payload);
      if (typeof result === 'string' && (result.includes('SUCESSO') || result.includes('sucesso'))) {
        Alert.alert('Sucesso', 'Veículo salvo com sucesso!');
        setModalVisible(false);
        resetForm();
        loadVeiculos();
      } else {
        Alert.alert('Aviso', result || 'Veículo não foi salvo.');
      }
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao salvar veículo.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderVeiculo = ({ item }: { item: Veiculo }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => openModal(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.unidadeBadge}>
          <Text style={styles.unidadeText}>{item.unidade_veiculo}</Text>
        </View>
        <Text style={styles.placa}>{item.placa_veiculo}</Text>
        <Ionicons name="pencil" size={18} color={COLORS.primary} />
      </View>
      {item.marca_veiculo ? (
        <Text style={styles.cardDetail}>{item.marca_veiculo} - {item.cor_veiculo}</Text>
      ) : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LoadingOverlay visible={isLoading} message="Carregando veículos..." />

      {!boatNumber ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="car-outline" size={48} color={COLORS.disabled} />
          <Text style={styles.emptyText}>Salve o BOAT primeiro para adicionar veículos</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={veiculos}
            keyExtractor={(item, index) => item.id_veiculo || String(index)}
            renderItem={renderVeiculo}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="car-outline" size={48} color={COLORS.disabled} />
                <Text style={styles.emptyText}>Nenhum veículo cadastrado</Text>
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
            <Text style={styles.addButtonText}>ADICIONAR VEÍCULO</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Modal de Veículo */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingVeiculo ? 'Editar Veículo' : 'Adicionar Veículo'}
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <SelectField
              label="Unidade de Tráfego"
              value={unidade}
              options={UNIDADE_OPTIONS}
              onSelect={setUnidade}
              required
            />

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>PLACA *</Text>
              <MaskInput
                style={styles.maskedInput}
                value={placa}
                onChangeText={setPlaca}
                mask={PLACA_MERCOSUL_MASK}
                autoCapitalize="characters"
                placeholder="AAA-0000 ou AAA0A00"
                placeholderTextColor={COLORS.textSecondary}
              />
            </View>

            <FormField
              label="Marca/Modelo"
              value={marca}
              onChangeText={setMarca}
              autoCapitalize="characters"
              placeholder="Ex: HONDA CIVIC"
            />

            <FormField
              label="Cor"
              value={cor}
              onChangeText={setCor}
              autoCapitalize="characters"
              placeholder="Ex: PRATA"
            />

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>CHASSI (17 CARACTERES)</Text>
              <MaskInput
                style={styles.maskedInput}
                value={chassi}
                onChangeText={(v) => setChassi(v.toUpperCase())}
                mask={CHASSI_MASK}
                autoCapitalize="characters"
                placeholder="9BWZZZ377VT004251"
                placeholderTextColor={COLORS.textSecondary}
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>RENAVAM (11 DÍGITOS)</Text>
              <MaskInput
                style={styles.maskedInput}
                value={renavam}
                onChangeText={setRenavam}
                mask={RENAVAM_MASK}
                keyboardType="numeric"
                placeholder="00000000000"
                placeholderTextColor={COLORS.textSecondary}
              />
            </View>

            <FormField
              label="Ano"
              value={ano}
              onChangeText={setAno}
              keyboardType="numeric"
              maxLength={4}
              placeholder="2024"
            />

            <SelectField
              label="Tipo de Veículo"
              value={tipoVeiculo}
              options={TIPO_VEICULO_OPTIONS}
              onSelect={setTipoVeiculo}
            />

            <FormField
              label="Avarias"
              value={avarias}
              onChangeText={setAvarias}
              multiline
              numberOfLines={3}
              autoCapitalize="characters"
              placeholder="Descreva as avarias do veículo..."
              style={{ minHeight: 80, textAlignVertical: 'top' }}
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <Text style={styles.saveButtonText}>SALVAR VEÍCULO</Text>
            </TouchableOpacity>

            <View style={{ height: SPACING.xxxl }} />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  list: {
    padding: SPACING.md,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  unidadeBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  unidadeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: FONTS.sizes.sm,
  },
  placa: {
    flex: 1,
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    letterSpacing: 1,
  },
  cardDetail: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxxl * 2,
  },
  emptyText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: SPACING.md,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
    elevation: 3,
  },
  addButtonText: {
    color: '#fff',
    fontSize: FONTS.sizes.md,
    fontWeight: 'bold',
  },
  modal: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  modalContent: {
    flex: 1,
    padding: SPACING.md,
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
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.md,
    elevation: 3,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
  },
});

export default VeiculosTab;
