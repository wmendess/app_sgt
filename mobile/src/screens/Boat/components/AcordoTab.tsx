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
import { saveAcordo } from '../../../services/endpoints';
import FormField from '../../../components/FormField';
import LoadingOverlay from '../../../components/LoadingOverlay';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../../utils/theme';
import { CPF_MASK } from '../../../utils/masks';

interface AcordoTabProps {
  boatNumber: string;
  acordoData?: any;
}

const AcordoTab: React.FC<AcordoTabProps> = ({ boatNumber, acordoData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [test1Nome, setTest1Nome] = useState(acordoData?.testemunha1_nome || '');
  const [test1Cpf, setTest1Cpf] = useState(acordoData?.testemunha1_cpf || '');
  const [test2Nome, setTest2Nome] = useState(acordoData?.testemunha2_nome || '');
  const [test2Cpf, setTest2Cpf] = useState(acordoData?.testemunha2_cpf || '');
  const [descricao, setDescricao] = useState(acordoData?.descricao_acordo || '');

  const handleSave = async () => {
    if (!boatNumber) {
      Alert.alert('Atenção', 'Salve o BOAT primeiro.');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        fk_boat: boatNumber,
        testemunha1_nome: test1Nome.toUpperCase(),
        testemunha1_cpf: test1Cpf.replace(/\D/g, ''),
        testemunha2_nome: test2Nome.toUpperCase(),
        testemunha2_cpf: test2Cpf.replace(/\D/g, ''),
        descricao_acordo: descricao.toUpperCase(),
      };

      const result = await saveAcordo(payload);
      if (typeof result === 'string' && (result.includes('SUCESSO') || result.includes('sucesso') || result.includes('SALVO'))) {
        Alert.alert('Sucesso', 'Acordo salvo com sucesso!');
      } else {
        Alert.alert('Aviso', result || 'Acordo não foi salvo.');
      }
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao salvar acordo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LoadingOverlay visible={isLoading} message="Salvando acordo..." />

      {!boatNumber ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Salve o BOAT primeiro para registrar o acordo</Text>
        </View>
      ) : (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>TESTEMUNHA 1</Text>
            <FormField
              label="Nome"
              value={test1Nome}
              onChangeText={setTest1Nome}
              autoCapitalize="characters"
              placeholder="Nome completo da testemunha 1"
            />
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>CPF</Text>
              <MaskInput
                style={styles.maskedInput}
                value={test1Cpf}
                onChangeText={setTest1Cpf}
                mask={CPF_MASK}
                keyboardType="numeric"
                placeholder="000.000.000-00"
                placeholderTextColor={COLORS.textSecondary}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>TESTEMUNHA 2</Text>
            <FormField
              label="Nome"
              value={test2Nome}
              onChangeText={setTest2Nome}
              autoCapitalize="characters"
              placeholder="Nome completo da testemunha 2"
            />
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>CPF</Text>
              <MaskInput
                style={styles.maskedInput}
                value={test2Cpf}
                onChangeText={setTest2Cpf}
                mask={CPF_MASK}
                keyboardType="numeric"
                placeholder="000.000.000-00"
                placeholderTextColor={COLORS.textSecondary}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>TERMO DE ACORDO</Text>
            <FormField
              label="Descrição do Termo de Acordo"
              value={descricao}
              onChangeText={setDescricao}
              multiline
              numberOfLines={8}
              autoCapitalize="characters"
              placeholder="Descreva os termos do acordo entre as partes..."
              style={{ minHeight: 160, textAlignVertical: 'top' }}
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.8}>
            <Text style={styles.saveButtonText}>SALVAR ACORDO</Text>
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

export default AcordoTab;
