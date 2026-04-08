import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import MaskInput from 'react-native-mask-input';
import { savePatrimonio } from '../../../services/endpoints';
import FormField from '../../../components/FormField';
import SelectField, { SelectOption } from '../../../components/SelectField';
import LoadingOverlay from '../../../components/LoadingOverlay';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../../utils/theme';
import { CPF_MASK, PHONE_MASK } from '../../../utils/masks';

interface PatrimonioTabProps {
  boatNumber: string;
  patrimonioData?: any;
}

const SEXO_OPTIONS: SelectOption[] = [
  { label: 'Masculino', value: 'M' },
  { label: 'Feminino', value: 'F' },
];

const ESTADO_CIVIL_OPTIONS: SelectOption[] = [
  { label: 'Solteiro(a)', value: 'SOLTEIRO' },
  { label: 'Casado(a)', value: 'CASADO' },
  { label: 'Divorciado(a)', value: 'DIVORCIADO' },
  { label: 'Viúvo(a)', value: 'VIUVO' },
  { label: 'União Estável', value: 'UNIAO_ESTAVEL' },
];

const UF_OPTIONS: SelectOption[] = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG',
  'PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'
].map(uf => ({ label: uf, value: uf }));

const PatrimonioTab: React.FC<PatrimonioTabProps> = ({ boatNumber, patrimonioData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [nome, setNome] = useState(patrimonioData?.nome_proprietario || '');
  const [cpf, setCpf] = useState(patrimonioData?.cpf_proprietario || '');
  const [rg, setRg] = useState(patrimonioData?.rg_proprietario || '');
  const [endereco, setEndereco] = useState(patrimonioData?.endereco_proprietario || '');
  const [bairro, setBairro] = useState(patrimonioData?.bairro_proprietario || '');
  const [sexo, setSexo] = useState(patrimonioData?.sexo_proprietario || '');
  const [estadoCivil, setEstadoCivil] = useState(patrimonioData?.estado_civil_proprietario || '');
  const [idade, setIdade] = useState(patrimonioData?.idade_proprietario || '');
  const [telefone, setTelefone] = useState(patrimonioData?.telefone_proprietario || '');
  const [cidade, setCidade] = useState(patrimonioData?.cidade_proprietario || 'SÃO LUÍS');
  const [estado, setEstado] = useState(patrimonioData?.estado_proprietario || 'MA');

  const handleSave = async () => {
    if (!boatNumber) {
      Alert.alert('Atenção', 'Salve o BOAT primeiro.');
      return;
    }
    if (!nome) {
      Alert.alert('Atenção', 'O nome do proprietário é obrigatório.');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        fk_boat: boatNumber,
        nome_proprietario: nome.toUpperCase(),
        cpf_proprietario: cpf.replace(/\D/g, ''),
        rg_proprietario: rg,
        endereco_proprietario: endereco.toUpperCase(),
        bairro_proprietario: bairro.toUpperCase(),
        sexo_proprietario: sexo,
        estado_civil_proprietario: estadoCivil,
        idade_proprietario: idade,
        telefone_proprietario: telefone.replace(/\D/g, ''),
        cidade_proprietario: cidade.toUpperCase(),
        estado_proprietario: estado,
      };

      const result = await savePatrimonio(payload);
      if (typeof result === 'string' && (result.includes('SUCESSO') || result.includes('sucesso') || result.includes('SALVO'))) {
        Alert.alert('Sucesso', 'Patrimônio salvo com sucesso!');
      } else {
        Alert.alert('Aviso', result || 'Patrimônio não foi salvo.');
      }
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao salvar patrimônio.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LoadingOverlay visible={isLoading} message="Salvando patrimônio..." />

      {!boatNumber ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Salve o BOAT primeiro para registrar o patrimônio</Text>
        </View>
      ) : (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>DADOS DO PROPRIETÁRIO</Text>

            <FormField label="Nome do Proprietário" value={nome} onChangeText={setNome} autoCapitalize="characters" required placeholder="Nome completo" />

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
            <SelectField label="Sexo" value={sexo} options={SEXO_OPTIONS} onSelect={setSexo} />
            <SelectField label="Estado Civil" value={estadoCivil} options={ESTADO_CIVIL_OPTIONS} onSelect={setEstadoCivil} />
            <FormField label="Idade" value={idade} onChangeText={setIdade} keyboardType="numeric" maxLength={3} />

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

            <FormField label="Cidade" value={cidade} onChangeText={setCidade} autoCapitalize="characters" />
            <SelectField label="Estado (UF)" value={estado} options={UF_OPTIONS} onSelect={setEstado} />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.8}>
            <Text style={styles.saveButtonText}>SALVAR PATRIMÔNIO</Text>
          </TouchableOpacity>
          <View style={{ height: SPACING.xxxl }} />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.md },
  section: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md, elevation: 1 },
  sectionTitle: { fontSize: FONTS.sizes.sm, fontWeight: 'bold', color: COLORS.primary, marginBottom: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingBottom: SPACING.xs, letterSpacing: 0.5 },
  fieldContainer: { marginBottom: SPACING.md },
  fieldLabel: { fontSize: FONTS.sizes.sm, color: COLORS.text, fontWeight: '600', marginBottom: SPACING.xs, textTransform: 'uppercase' },
  maskedInput: { borderWidth: 1, borderColor: COLORS.border, borderRadius: BORDER_RADIUS.md, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, fontSize: FONTS.sizes.md, color: COLORS.text, backgroundColor: COLORS.surface, minHeight: 44 },
  saveButton: { backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.md, paddingVertical: SPACING.md, alignItems: 'center', marginBottom: SPACING.md, elevation: 3 },
  saveButtonText: { color: '#fff', fontSize: FONTS.sizes.lg, fontWeight: 'bold' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: SPACING.xxxl * 2 },
  emptyText: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary, textAlign: 'center', paddingHorizontal: SPACING.xl },
});

export default PatrimonioTab;
