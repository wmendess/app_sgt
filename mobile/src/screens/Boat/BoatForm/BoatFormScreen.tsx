import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Header from '../../../components/Header';
import BoatTab from '../components/BoatTab';
import VeiculosTab from '../components/VeiculosTab';
import VitimasTab from '../components/VitimasTab';
import AcordoTab from '../components/AcordoTab';
import RelatorioTab from '../components/RelatorioTab';
import PatrimonioTab from '../components/PatrimonioTab';
import FotosTab from '../components/FotosTab';
import { RootStackParamList } from '../../../types';
import { COLORS, SPACING, FONTS } from '../../../utils/theme';

type BoatFormNavigationProp = StackNavigationProp<RootStackParamList, 'BoatForm'>;
type BoatFormRouteProp = RouteProp<RootStackParamList, 'BoatForm'>;

const TABS = [
  { id: 'boat', label: 'BOAT' },
  { id: 'veiculos', label: 'VEÍCULOS' },
  { id: 'vitimas', label: 'VÍTIMA' },
  { id: 'acordo', label: 'ACORDO' },
  { id: 'relatorio', label: 'RELATÓRIO' },
  { id: 'patrimonio', label: 'PATRIMÔNIO' },
  { id: 'fotos', label: 'FOTOS' },
];

const BoatFormScreen: React.FC = () => {
  const navigation = useNavigation<BoatFormNavigationProp>();
  const route = useRoute<BoatFormRouteProp>();
  const { boatId, boatNumber: initialBoatNumber } = route.params || {};

  const [activeTab, setActiveTab] = useState('boat');
  const [currentBoatNumber, setCurrentBoatNumber] = useState(boatId || initialBoatNumber || '');
  const tabScrollRef = useRef<ScrollView>(null);

  const handleBoatSaved = (boatNum: string) => {
    setCurrentBoatNumber(boatNum);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'boat':
        return (
          <BoatTab
            boatId={boatId}
            onBoatSaved={handleBoatSaved}
          />
        );
      case 'veiculos':
        return <VeiculosTab boatNumber={currentBoatNumber} />;
      case 'vitimas':
        return <VitimasTab boatNumber={currentBoatNumber} />;
      case 'acordo':
        return <AcordoTab boatNumber={currentBoatNumber} />;
      case 'relatorio':
        return <RelatorioTab boatNumber={currentBoatNumber} />;
      case 'patrimonio':
        return <PatrimonioTab boatNumber={currentBoatNumber} />;
      case 'fotos':
        return <FotosTab boatNumber={currentBoatNumber} />;
      default:
        return null;
    }
  };

  const title = boatId
    ? `BOAT ${boatId}`
    : currentBoatNumber
    ? `BOAT ${currentBoatNumber}`
    : 'Novo BOAT';

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title={title}
        onBack={() => navigation.goBack()}
      />

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <ScrollView
          ref={tabScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScrollContent}
        >
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && styles.activeTab,
              ]}
              onPress={() => setActiveTab(tab.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.id && styles.activeTabText,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Tab Content */}
      <View style={styles.content}>
        {renderTabContent()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  tabBar: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabScrollContent: {
    paddingHorizontal: SPACING.sm,
  },
  tab: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    marginHorizontal: 2,
  },
  activeTab: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
});

export default BoatFormScreen;
