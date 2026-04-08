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
import { getBoatList } from '../../../services/endpoints';
import { useAuth } from '../../../contexts/AuthContext';
import Header from '../../../components/Header';
import FAB from '../../../components/FAB';
import LoadingOverlay from '../../../components/LoadingOverlay';
import { RootStackParamList } from '../../../types';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../../utils/theme';
import { isoToDisplay } from '../../../utils/masks';

type BoatListNavigationProp = StackNavigationProp<RootStackParamList, 'BoatList'>;

interface BoatItem {
  boat: string;
  local_boat: string;
  data_acidente: string;
  data_registro: string;
  consulta: string;
  agente_boat: string;
}

const ADMIN_USERS = ['W.MENDES', 'GUSMAO', 'JULIARD', 'DOMINGOS', 'FRANCISCO'];

const BoatListScreen: React.FC = () => {
  const navigation = useNavigation<BoatListNavigationProp>();
  const { getUserName } = useAuth();

  const [boats, setBoats] = useState<BoatItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const userName = getUserName().toUpperCase();

  const loadBoats = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setIsLoading(true);

    try {
      const data = await getBoatList(userName);
      if (Array.isArray(data)) {
        setBoats(data);
      } else if (typeof data === 'string') {
        setBoats([]);
      }
    } catch (error: any) {
      Alert.alert('Erro', 'Não foi possível carregar os BOATs. Verifique sua conexão.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadBoats();
    }, [])
  );

  const getStatusColor = (status: string) => {
    if (!status) return COLORS.statusPendente;
    const s = status.toUpperCase();
    if (s === 'OK' || s === 'APROVADO') return COLORS.statusOk;
    if (s === 'CORREÇÃO' || s === 'CORRECAO') return COLORS.statusCorrecao;
    return COLORS.statusPendente;
  };

  const getStatusLabel = (status: string) => {
    if (!status) return 'PENDENTE';
    const s = status.toUpperCase();
    if (s === 'OK' || s === 'APROVADO') return 'APROVADO';
    if (s === 'CORREÇÃO' || s === 'CORRECAO') return 'CORREÇÃO';
    return 'PENDENTE';
  };

  const renderBoatItem = ({ item }: { item: BoatItem }) => {
    const date = item.data_acidente || item.data_registro || '';
    const displayDate = date ? isoToDisplay(date) : '-';
    const statusColor = getStatusColor(item.consulta);
    const statusLabel = getStatusLabel(item.consulta);

    return (
      <TouchableOpacity
        style={styles.boatCard}
        onPress={() => navigation.navigate('BoatForm', { boatId: item.boat, boatNumber: item.boat })}
        activeOpacity={0.7}
      >
        <View style={styles.boatCardContent}>
          <View style={styles.boatInfo}>
            <Text style={styles.boatNumber}>BOAT: {item.boat}</Text>
            <Text style={styles.boatLocal} numberOfLines={2}>
              LOCAL: {item.local_boat || '-'}
            </Text>
            <Text style={styles.boatDate}>DATA: {displayDate}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{statusLabel}</Text>
          </View>
        </View>
        <View style={styles.boatDivider} />
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="document-text-outline" size={64} color={COLORS.disabled} />
      <Text style={styles.emptyText}>Nenhum BOAT encontrado</Text>
      <Text style={styles.emptySubText}>Toque no botão + para criar um novo BOAT</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Lista Boat's"
        onBack={() => navigation.goBack()}
      />
      <LoadingOverlay visible={isLoading} message="Carregando BOATs..." />

      <FlatList
        data={boats}
        keyExtractor={(item) => item.boat}
        renderItem={renderBoatItem}
        ListEmptyComponent={!isLoading ? renderEmpty : null}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadBoats(true)}
            colors={[COLORS.primary]}
          />
        }
        contentContainerStyle={boats.length === 0 ? styles.emptyList : styles.list}
        style={styles.flatList}
      />

      <FAB onPress={() => navigation.navigate('BoatForm', {})} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flatList: {
    flex: 1,
  },
  list: {
    paddingBottom: 80,
  },
  emptyList: {
    flex: 1,
  },
  boatCard: {
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
  boatCardContent: {
    flexDirection: 'row',
    padding: SPACING.md,
    alignItems: 'center',
  },
  boatInfo: {
    flex: 1,
  },
  boatNumber: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  boatLocal: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  boatDate: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    marginLeft: SPACING.sm,
  },
  statusText: {
    color: '#fff',
    fontSize: FONTS.sizes.xs,
    fontWeight: 'bold',
  },
  boatDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxxl * 2,
  },
  emptyText: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
    fontWeight: '600',
  },
  emptySubText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.disabled,
    marginTop: SPACING.sm,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
  },
});

export default BoatListScreen;
