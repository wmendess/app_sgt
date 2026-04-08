import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaskInput from 'react-native-mask-input';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { saveRemocao } from '../../../services/endpoints';
import { useAuth } from '../../../contexts/AuthContext';
import Header from '../../../components/Header';
import FormField from '../../../components/FormField';
import SelectField, { SelectOption } from '../../../components/SelectField';
import CheckboxField from '../../../components/CheckboxField';
import LoadingOverlay from '../../../components/LoadingOverlay';
import { RootStackParamList, Remocao } from '../../../types';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../../utils/theme';
import { PLACA_MERCOSUL_MASK, CHASSI_MASK, isoToDisplay } from '../../../utils/masks';

type RemocaoFormNavigationProp = StackNavigationProp<RootStackParamList, 'RemocaoForm'>;
type RemocaoFormRouteProp = RouteProp<RootStackParamList, 'RemocaoForm'>;

const { width } = Dimensions.get('window');
const IMAGE_SIZE = (width - SPACING.md * 2 - SPACING.sm * 2) / 3;

const PATIO_OPTIONS: SelectOption[] = [
  { label: 'Pátio Central', value: 'CENTRAL' },
  { label: 'Pátio Norte', value: 'NORTE' },
  { label: 'Pátio Sul', value: 'SUL' },
  { label: 'Pátio Leste', value: 'LESTE' },
  { label: 'Pátio Oeste', value: 'OESTE' },
];

interface LocalPhoto {
  uri: string;
  base64?: string;
}

const RemocaoFormScreen: React.FC = () => {
  const navigation = useNavigation<RemocaoFormNavigationProp>();
  const route = useRoute<RemocaoFormRouteProp>();
  const { remocaoId } = route.params || {};
  const { getUserName } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Form fields
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [hora, setHora] = useState('');
  const [patio, setPatio] = useState('');
  const [acidente, setAcidente] = useState(false);
  const [abandonado, setAbandonado] = useState(false);
  const [placa, setPlaca] = useState('');
  const [chassi, setChassi] = useState('');
  const [modelo, setModelo] = useState('');
  const [cor, setCor] = useState('');
  const [local, setLocal] = useState('');
  const [bairro, setBairro] = useState('');
  const [pontoRef, setPontoRef] = useState('');
  const [infracao, setInfracao] = useState('');
  const [codigo, setCodigo] = useState('');
  const [guincho, setGuincho] = useState('');
  const [km, setKm] = useState('');
  const [avarias, setAvarias] = useState('');
  const [obs, setObs] = useState('');
  const [photos, setPhotos] = useState<LocalPhoto[]>([]);

  const userName = getUserName();

  const handleDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setData(selectedDate.toISOString().split('T')[0]);
    }
  };

  const handleTimeChange = (_: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const h = selectedTime.getHours().toString().padStart(2, '0');
      const m = selectedTime.getMinutes().toString().padStart(2, '0');
      setHora(`${h}:${m}`);
    }
  };

  const handlePickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'É necessário permitir o acesso à galeria.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets) {
      const newPhotos: LocalPhoto[] = result.assets.map((asset) => ({
        uri: asset.uri,
        base64: asset.base64 || '',
      }));
      setPhotos((prev) => [...prev, ...newPhotos]);
    }
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'É necessário permitir o acesso à câmera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotos((prev) => [
        ...prev,
        { uri: result.assets[0].uri, base64: result.assets[0].base64 || '' },
      ]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!placa && !chassi) {
      Alert.alert('Atenção', 'Informe a placa ou o chassi do veículo.');
      return;
    }

    setIsLoading(true);
    try {
      const base64Images = photos
        .filter((p) => p.base64)
        .map((p) => `data:image/jpeg;base64,${p.base64}`);

      const payload: Record<string, any> = {
        data,
        hora,
        patio,
        acidente: acidente ? '1' : '0',
        abandonado: abandonado ? '1' : '0',
        placa: placa.replace(/[^A-Za-z0-9]/g, '').toUpperCase(),
        chassi: chassi.toUpperCase(),
        modelo: modelo.toUpperCase(),
        cor: cor.toUpperCase(),
        local: local.toUpperCase(),
        bairro: bairro.toUpperCase(),
        ponto_referencia: pontoRef.toUpperCase(),
        infracao: infracao.toUpperCase(),
        codigo,
        guincho: guincho.toUpperCase(),
        km,
        avarias: avarias.toUpperCase(),
        obs_remocao: obs.toUpperCase(),
        agente: userName.toUpperCase(),
        status: 'REMOVIDO',
      };

      if (remocaoId) {
        payload.id_remocao = remocaoId;
      }

      if (base64Images.length > 0) {
        payload.img = base64Images.join(',');
        payload.insert_photo = 'true';
      }

      const action = remocaoId ? 'update' : 'insert';
      const result = await saveRemocao(payload, action);

      if (typeof result === 'string' && (result.includes('SUCESSO') || result.includes('sucesso') || result.includes('SALVO') || result.includes('OK'))) {
        Alert.alert('Sucesso', `Remoção ${remocaoId ? 'atualizada' : 'registrada'} com sucesso!`, [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('Aviso', result || 'Remoção não foi salva. Verifique os dados.');
      }
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao salvar remoção.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title={remocaoId ? 'Editar Remoção' : 'Nova Remoção'}
        onBack={() => navigation.goBack()}
      />
      <LoadingOverlay visible={isLoading} message="Salvando remoção..." />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Data e Hora */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DATA E HORA</Text>
          <View style={styles.row}>
            <View style={styles.halfField}>
              <Text style={styles.fieldLabel}>DATA</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateButtonText}>{isoToDisplay(data)}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.halfField}>
              <Text style={styles.fieldLabel}>HORA</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={styles.dateButtonText}>{hora || 'HH:MM'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={data ? new Date(data) : new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
            />
          )}
          {showTimePicker && (
            <DateTimePicker
              value={new Date()}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleTimeChange}
            />
          )}
        </View>

        {/* Pátio e Tipo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMAÇÕES</Text>
          <SelectField
            label="Pátio"
            value={patio}
            options={PATIO_OPTIONS}
            onSelect={setPatio}
          />
          <View style={styles.checkboxRow}>
            <View style={styles.checkboxHalf}>
              <CheckboxField
                label="Acidente"
                checked={acidente}
                onToggle={() => setAcidente(!acidente)}
              />
            </View>
            <View style={styles.checkboxHalf}>
              <CheckboxField
                label="Abandonado"
                checked={abandonado}
                onToggle={() => setAbandonado(!abandonado)}
              />
            </View>
          </View>
        </View>

        {/* Veículo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>VEÍCULO</Text>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>PLACA</Text>
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
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>CHASSI</Text>
            <MaskInput
              style={styles.maskedInput}
              value={chassi}
              onChangeText={(v) => setChassi(v.toUpperCase())}
              mask={CHASSI_MASK}
              autoCapitalize="characters"
              placeholder="17 caracteres"
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>
          <FormField label="Marca/Modelo" value={modelo} onChangeText={setModelo} autoCapitalize="characters" placeholder="Ex: HONDA CIVIC" />
          <FormField label="Cor" value={cor} onChangeText={setCor} autoCapitalize="characters" placeholder="Ex: PRATA" />
        </View>

        {/* Local */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LOCAL</Text>
          <FormField label="Local" value={local} onChangeText={setLocal} autoCapitalize="characters" required placeholder="Rua/Avenida" />
          <FormField label="Bairro" value={bairro} onChangeText={setBairro} autoCapitalize="characters" placeholder="Nome do bairro" />
          <FormField label="Ponto de Referência" value={pontoRef} onChangeText={setPontoRef} autoCapitalize="characters" />
        </View>

        {/* Infração */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFRAÇÃO</Text>
          <FormField label="Infração" value={infracao} onChangeText={setInfracao} autoCapitalize="characters" placeholder="Descrição da infração" />
          <FormField label="Código" value={codigo} onChangeText={setCodigo} keyboardType="numeric" placeholder="Código da infração" />
        </View>

        {/* Guincho */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GUINCHO</Text>
          <FormField label="Guincho" value={guincho} onChangeText={setGuincho} autoCapitalize="characters" placeholder="Nome/identificação do guincho" />
          <FormField label="KM" value={km} onChangeText={setKm} keyboardType="numeric" placeholder="Quilometragem" />
        </View>

        {/* Observações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>OBSERVAÇÕES</Text>
          <FormField
            label="Avarias"
            value={avarias}
            onChangeText={setAvarias}
            multiline
            numberOfLines={3}
            autoCapitalize="characters"
            style={{ minHeight: 80, textAlignVertical: 'top' }}
          />
          <FormField
            label="Observação"
            value={obs}
            onChangeText={setObs}
            multiline
            numberOfLines={3}
            autoCapitalize="characters"
            style={{ minHeight: 80, textAlignVertical: 'top' }}
          />
        </View>

        {/* Fotos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FOTOS</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.mediaButton} onPress={handleTakePhoto} activeOpacity={0.8}>
              <Ionicons name="camera" size={22} color="#fff" />
              <Text style={styles.mediaButtonText}>CÂMERA</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.mediaButton, styles.galleryButton]} onPress={handlePickPhoto} activeOpacity={0.8}>
              <Ionicons name="images" size={22} color="#fff" />
              <Text style={styles.mediaButtonText}>GALERIA</Text>
            </TouchableOpacity>
          </View>

          {photos.length > 0 && (
            <View style={styles.photosGrid}>
              {photos.map((photo, index) => (
                <View key={index} style={styles.photoContainer}>
                  <Image source={{ uri: photo.uri }} style={styles.photo} resizeMode="cover" />
                  <TouchableOpacity
                    style={styles.removePhotoButton}
                    onPress={() => handleRemovePhoto(index)}
                  >
                    <Ionicons name="close-circle" size={24} color={COLORS.error} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Salvar */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.8}>
          <Text style={styles.saveButtonText}>
            {remocaoId ? 'ATUALIZAR REMOÇÃO' : 'SALVAR REMOÇÃO'}
          </Text>
        </TouchableOpacity>

        <View style={{ height: SPACING.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, padding: SPACING.md },
  section: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md, elevation: 1 },
  sectionTitle: { fontSize: FONTS.sizes.sm, fontWeight: 'bold', color: COLORS.primary, marginBottom: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingBottom: SPACING.xs, letterSpacing: 0.5 },
  row: { flexDirection: 'row', gap: SPACING.sm },
  halfField: { flex: 1 },
  fieldContainer: { marginBottom: SPACING.md },
  fieldLabel: { fontSize: FONTS.sizes.sm, color: COLORS.text, fontWeight: '600', marginBottom: SPACING.xs, textTransform: 'uppercase' },
  dateButton: { borderWidth: 1, borderColor: COLORS.border, borderRadius: BORDER_RADIUS.md, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, backgroundColor: COLORS.surface, minHeight: 44, justifyContent: 'center' },
  dateButtonText: { fontSize: FONTS.sizes.md, color: COLORS.text },
  maskedInput: { borderWidth: 1, borderColor: COLORS.border, borderRadius: BORDER_RADIUS.md, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, fontSize: FONTS.sizes.md, color: COLORS.text, backgroundColor: COLORS.surface, minHeight: 44 },
  checkboxRow: { flexDirection: 'row', gap: SPACING.md },
  checkboxHalf: { flex: 1 },
  buttonRow: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.md },
  mediaButton: { flex: 1, backgroundColor: COLORS.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: SPACING.md, borderRadius: BORDER_RADIUS.md, gap: SPACING.sm, elevation: 2 },
  galleryButton: { backgroundColor: COLORS.secondary },
  mediaButtonText: { color: '#fff', fontSize: FONTS.sizes.sm, fontWeight: 'bold' },
  photosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  photoContainer: { width: IMAGE_SIZE, height: IMAGE_SIZE, borderRadius: BORDER_RADIUS.sm, overflow: 'hidden', position: 'relative' },
  photo: { width: '100%', height: '100%' },
  removePhotoButton: { position: 'absolute', top: 2, right: 2, backgroundColor: '#fff', borderRadius: 12 },
  saveButton: { backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.md, paddingVertical: SPACING.md, alignItems: 'center', marginBottom: SPACING.md, elevation: 3 },
  saveButtonText: { color: '#fff', fontSize: FONTS.sizes.lg, fontWeight: 'bold', letterSpacing: 0.5 },
});

export default RemocaoFormScreen;
