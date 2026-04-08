import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { saveRelatorio } from '../../../services/endpoints';
import LoadingOverlay from '../../../components/LoadingOverlay';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../../utils/theme';

interface RelatorioTabProps {
  boatNumber: string;
  relatorioData?: any;
}

const RelatorioTab: React.FC<RelatorioTabProps> = ({ boatNumber, relatorioData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [relato, setRelato] = useState(relatorioData?.relato_agente || '');

  const handleSave = async () => {
    if (!boatNumber) {
      Alert.alert('Atenção', 'Salve o BOAT primeiro.');
      return;
    }
    if (!relato.trim()) {
      Alert.alert('Atenção', 'O relato do agente é obrigatório.');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        fk_boat: boatNumber,
        relato_agente: relato.toUpperCase(),
      };

      const result = await saveRelatorio(payload);
      if (typeof result === 'string' && (result.includes('SUCESSO') || result.includes('sucesso') || result.includes('SALVO'))) {
        Alert.alert('Sucesso', 'Relatório salvo com sucesso!');
      } else {
        Alert.alert('Aviso', result || 'Relatório não foi salvo.');
      }
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao salvar relatório.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LoadingOverlay visible={isLoading} message="Salvando relatório..." />

      {!boatNumber ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Salve o BOAT primeiro para registrar o relatório</Text>
        </View>
      ) : (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>RELATO DO AGENTE</Text>
            <Text style={styles.hint}>
              Descreva detalhadamente o ocorrido, incluindo circunstâncias, condições da via, 
              comportamento dos envolvidos e outras informações relevantes.
            </Text>
            <TextInput
              style={styles.textarea}
              value={relato}
              onChangeText={setRelato}
              multiline
              numberOfLines={15}
              textAlignVertical="top"
              autoCapitalize="characters"
              placeholder="DESCREVA O RELATO DO AGENTE AQUI..."
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.8}>
            <Text style={styles.saveButtonText}>SALVAR RELATÓRIO</Text>
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
  sectionTitle: { fontSize: FONTS.sizes.sm, fontWeight: 'bold', color: COLORS.primary, marginBottom: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingBottom: SPACING.xs, letterSpacing: 0.5 },
  hint: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginBottom: SPACING.md, fontStyle: 'italic', lineHeight: 18 },
  textarea: { borderWidth: 1, borderColor: COLORS.border, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, fontSize: FONTS.sizes.md, color: COLORS.text, minHeight: 300, textAlignVertical: 'top', lineHeight: 22 },
  saveButton: { backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.md, paddingVertical: SPACING.md, alignItems: 'center', marginBottom: SPACING.md, elevation: 3 },
  saveButtonText: { color: '#fff', fontSize: FONTS.sizes.lg, fontWeight: 'bold' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: SPACING.xxxl * 2 },
  emptyText: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary, textAlign: 'center', paddingHorizontal: SPACING.xl },
});

export default RelatorioTab;
