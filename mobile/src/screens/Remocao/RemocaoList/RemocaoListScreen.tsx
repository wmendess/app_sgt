import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { getRemocoes, deleteRemocao } from '../../../services/endpoints';
import { useAuth } from '../../../contexts/AuthContext';
import Header from '../../../components/Header';
import FAB from '../../../components/FAB';
import LoadingOverlay from '../../../components/LoadingOverlay';
import { RootStackParamList, Remocao } from '../../../types';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../../utils/theme';
import { isoToDisplay } from '../../../utils/masks';

type RemocaoListNavigationProp = StackNavigationProp<RootStackParamList, 'RemocaoList'>;

const ADMIN_USERS = ['W.MENDES', 'GUSMAO', 'JULIARD', 'DOMINGOS', 'FRANCISCO'];

const RemocaoListScreen: React.FC = () => {
  const navigation = useNavigation<RemocaoListNavigationProp>();
  const { getUserName } = useAuth();

  const [remocoes, setRemocoes] = useState<Remocao[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'salvas' | 'pesquisar'>('salvas');

  const userName = getUserName().toUpperCase();
  const isAdmin = ADMIN_USERS.includes(userName);

  const loadRemocoes = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setIsLoading(true);

    try {
      const funcao = isAdmin ? 6 : 1;
      const data = await getRemocoes(userName, funcao);
      if (Array.isArray(data)) {
        const list = data.map((item: any) => item.remocao || item);
        setRemocoes(list);
      } else {
        setRemocoes([]);
      }
    } catch (error: any) {
      Alert.alert('Erro', 'Não foi possível carregar as remoções.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadRemocoes();
    }, [])
  );

  const handleDelete = (remocao: Remocao) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja excluir a remoção da placa ${remocao.placa || 'sem placa'}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            if (!remocao.id_remocao) return;
            setIsLoading(true);
            try {
              await deleteRemocao(remocao.id_remocao);
              loadRemocoes();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir a remoção.');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const formatDate = (date: string) => {
    if (!date) return '-';
    // Tenta converter de YYYY-MM-DD para DD-MM-YYYY
    if (date.includes('-') && date.length === 10) {
      const parts = date.split('-');
      if (parts.length === 3 && parts[0].length === 4) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }
    return date;
  };

  const renderRemocao = ({ item }: { item: Remocao }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.cardContent}
        onPress={() => navigation.navigate('RemocaoForm', { remocaoId: item.id_remocao })}
        activeOpacity={0.7}
      >
        <View style={styles.cardInfo}>
          <Text style={styles.cardDate}>DATA: {formatDate(item.data || '')}</Text>
          <Text style={styles.cardPlaca}>PLACA: {item.placa || '-'}</Text>
          <Text style={styles.cardLocal} numberOfLines={1}>
            LOCAL: {item.local || '-'}
          </Text>
          {item.patio ? (
            <Text style={styles.cardPatio}>PÁTIO: {item.patio}</Text>
          ) : null}
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('RemocaoForm', { remocaoId: item.id_remocao })}
          >
            <Ionicons name="pencil" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(item)}
          >
            <Ionicons name="trash" size={20} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      <View style={styles.cardDivider} />
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="car-outline" size={64} color={COLORS.disabled} />
      <Text style={styles.emptyText}>Nenhuma remoção encontrada</Text>
      <Text style={styles.emptySubText}>Toque no botão + para registrar uma nova remoção</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Lista Remoções"
        onBack={() => navigation.goBack()}
      />
      <LoadingOverlay visible={isLoading} message="Carregando remoções..." />

      {/* Sub-tabs */}
      <View style={styles.subTabBar}>
        <TouchableOpacity
          style={[styles.subTab, activeTab === 'salvas' && styles.activeSubTab]}
          onPress={() => setActiveTab('salvas')}
        >
          <Ionicons
            name="save-outline"
            size={20}
            color={activeTab === 'salvas' ? COLORS.primary : COLORS.textSecondary}
          />
          <Text style={[styles.subTabText, activeTab === 'salvas' && styles.activeSubTabText]}>
            SALVAS
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.subTab, activeTab === 'pesquisar' && styles.activeSubTab]}
          onPress={() => setActiveTab('pesquisar')}
        >
          <Ionicons
            name="search-outline"
            size={20}
            color={activeTab === 'pesquisar' ? COLORS.primary : COLORS.textSecondary}
          />
          <Text style={[styles.subTabText, activeTab === 'pesquisar' && styles.activeSubTabText]}>
            PESQUISAR
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={remocoes}
        keyExtractor={(item, index) => item.id_remocao || String(index)}
        renderItem={renderRemocao}
        ListEmptyComponent={!isLoading ? renderEmpty : null}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadRemocoes(true)}
            colors={[COLORS.primary]}
          />
        }
        contentContainerStyle={remocoes.length === 0 ? styles.emptyList : styles.list}
        style={styles.flatList}
      />

      <FAB onPress={() => navigation.navigate('RemocaoForm', {})} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  flatList: { flex: 1 },
  list: { paddingBottom: 80 },
  emptyList: { flex: 1 },
  subTabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  subTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    gap: SPACING.xs,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeSubTab: {
    borderBottomColor: COLORS.primary,
  },
  subTabText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  activeSubTabText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardContent: {
    flexDirection: 'row',
    padding: SPACING.md,
    alignItems: 'center',
  },
  cardInfo: { flex: 1 },
  cardDate: { fontSize: FONTS.sizes.md, fontWeight: 'bold', color: COLORS.text, marginBottom: 2 },
  cardPlaca: { fontSize: FONTS.sizes.md, color: COLORS.text, marginBottom: 2 },
  cardLocal: { fontSize: FONTS.sizes.md, color: COLORS.text, marginBottom: 2 },
  cardPatio: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
  cardActions: { flexDirection: 'row', gap: SPACING.sm },
  editButton: { padding: SPACING.sm },
  deleteButton: { padding: SPACING.sm },
  cardDivider: { height: 1, backgroundColor: COLORS.border, marginHorizontal: SPACING.md },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: SPACING.xxxl * 2 },
  emptyText: { fontSize: FONTS.sizes.lg, color: COLORS.textSecondary, marginTop: SPACING.md, fontWeight: '600' },
  emptySubText: { fontSize: FONTS.sizes.sm, color: COLORS.disabled, marginTop: SPACING.sm, textAlign: 'center', paddingHorizontal: SPACING.xl },
});

export default RemocaoListScreen;
