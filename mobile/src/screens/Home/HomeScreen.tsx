import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../contexts/AuthContext';
import { RootStackParamList } from '../../types';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../utils/theme';

type HomeNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface MenuItemProps {
  title: string;
  iconName: string;
  iconFamily?: 'ionicons' | 'material';
  onPress: () => void;
  fullWidth?: boolean;
  enabled?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  title,
  iconName,
  iconFamily = 'ionicons',
  onPress,
  fullWidth = false,
  enabled = true,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.menuItem,
        fullWidth && styles.menuItemFull,
        !enabled && styles.menuItemDisabled,
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={styles.menuIconContainer}>
        {iconFamily === 'ionicons' ? (
          <Ionicons name={iconName as any} size={40} color="#fff" />
        ) : (
          <MaterialCommunityIcons name={iconName as any} size={40} color="#fff" />
        )}
      </View>
      <Text style={styles.menuTitle}>{title}</Text>
    </TouchableOpacity>
  );
};

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const { getUserDisplayName, signOut, user } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Deseja realmente sair do aplicativo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  const handleNotImplemented = (feature: string) => {
    Alert.alert('Em Desenvolvimento', `A funcionalidade "${feature}" está em desenvolvimento e será disponibilizada em breve.`);
  };

  const displayName = getUserDisplayName() || (user?.nome || user?.name || 'USUÁRIO').toUpperCase();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleLogout} style={styles.menuButton}>
          <Ionicons name="menu" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SGT</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>BEM VINDO!</Text>
          <Text style={styles.userName}>{displayName}</Text>

          {/* Badge/Shield */}
          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Ionicons name="shield" size={60} color={COLORS.primary} />
              <Text style={styles.badgeText}>SMTT</Text>
            </View>
          </View>
        </View>

        {/* Menu Grid */}
        <View style={styles.menuGrid}>
          {/* BOAT - Full width */}
          <MenuItem
            title="BOAT"
            iconName="car-crash"
            iconFamily="material"
            onPress={() => navigation.navigate('BoatList')}
            fullWidth
            enabled
          />

          {/* Row 2 */}
          <View style={styles.menuRow}>
            <MenuItem
              title="REMOÇÃO"
              iconName="tow-truck"
              iconFamily="material"
              onPress={() => navigation.navigate('RemocaoList')}
              enabled
            />
            <MenuItem
              title="CHECK LIST"
              iconName="clipboard-check"
              iconFamily="material"
              onPress={() => handleNotImplemented('Check List')}
              enabled={false}
            />
          </View>

          {/* Row 3 */}
          <View style={styles.menuRow}>
            <MenuItem
              title="HORAS"
              iconName="time-outline"
              iconFamily="ionicons"
              onPress={() => handleNotImplemented('Horas')}
              enabled={false}
            />
            <MenuItem
              title="EVENTO EXTRAS"
              iconName="star-outline"
              iconFamily="ionicons"
              onPress={() => handleNotImplemented('Evento Extras')}
              enabled={false}
            />
          </View>

          {/* Row 4 */}
          <View style={styles.menuRow}>
            <MenuItem
              title="VISTORIA"
              iconName="search-outline"
              iconFamily="ionicons"
              onPress={() => handleNotImplemented('Vistoria')}
              enabled={false}
            />
            <MenuItem
              title="NOTIFICAÇÃO"
              iconName="notifications-outline"
              iconFamily="ionicons"
              onPress={() => handleNotImplemented('Notificação')}
              enabled={false}
            />
          </View>

          {/* OCORRÊNCIA - Full width */}
          <MenuItem
            title="OCORRÊNCIA"
            iconName="warning-outline"
            iconFamily="ionicons"
            onPress={() => handleNotImplemented('Ocorrência')}
            fullWidth
            enabled={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  header: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    elevation: 4,
  },
  menuButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    flex: 1,
    color: '#fff',
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 2,
  },
  logoutButton: {
    padding: SPACING.xs,
  },
  container: {
    flex: 1,
    backgroundColor: '#E0E0E0',
  },
  content: {
    paddingBottom: SPACING.xxxl,
  },
  welcomeContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    backgroundColor: '#E0E0E0',
  },
  welcomeText: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  userName: {
    fontSize: FONTS.sizes.xl,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: SPACING.xs,
  },
  badgeContainer: {
    marginTop: SPACING.lg,
  },
  badge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  badgeText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginTop: -4,
  },
  menuGrid: {
    paddingHorizontal: 2,
  },
  menuRow: {
    flexDirection: 'row',
  },
  menuItem: {
    flex: 1,
    backgroundColor: COLORS.primary,
    margin: 2,
    paddingVertical: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  menuItemFull: {
    flex: 0,
    width: '100%',
  },
  menuItemDisabled: {
    opacity: 0.7,
  },
  menuIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  menuTitle: {
    color: '#fff',
    fontSize: FONTS.sizes.sm,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});

export default HomeScreen;
