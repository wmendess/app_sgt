import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  FlatList,
  Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { getPhotos, uploadPhotos } from '../../../services/endpoints';
import LoadingOverlay from '../../../components/LoadingOverlay';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../../utils/theme';
import { API_CONFIG } from '../../../services/api';

interface FotosTabProps {
  boatNumber: string;
}

const { width } = Dimensions.get('window');
const IMAGE_SIZE = (width - SPACING.md * 2 - SPACING.sm * 2) / 3;

interface PhotoItem {
  id?: string;
  uri: string;
  isLocal?: boolean;
  base64?: string;
}

const FotosTab: React.FC<FotosTabProps> = ({ boatNumber }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [savedPhotos, setSavedPhotos] = useState<PhotoItem[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<PhotoItem[]>([]);

  useEffect(() => {
    if (boatNumber) loadPhotos();
  }, [boatNumber]);

  const loadPhotos = async () => {
    setIsLoading(true);
    try {
      const data = await getPhotos(boatNumber);
      if (Array.isArray(data)) {
        const photos = data.map((p: any) => ({
          id: p.id_photo,
          uri: `${API_CONFIG.baseURL}${p.path}`,
          isLocal: false,
        }));
        setSavedPhotos(photos);
      }
    } catch (error) {
      console.error('Error loading photos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'É necessário permitir o acesso à galeria para selecionar fotos.');
      return false;
    }
    return true;
  };

  const requestCameraPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'É necessário permitir o acesso à câmera para tirar fotos.');
      return false;
    }
    return true;
  };

  const handlePickFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets) {
      const newPhotos: PhotoItem[] = result.assets.map((asset) => ({
        uri: asset.uri,
        isLocal: true,
        base64: asset.base64 || '',
      }));
      setSelectedPhotos((prev) => [...prev, ...newPhotos]);
    }
  };

  const handleTakePhoto = async () => {
    const hasPermission = await requestCameraPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      const newPhoto: PhotoItem = {
        uri: result.assets[0].uri,
        isLocal: true,
        base64: result.assets[0].base64 || '',
      };
      setSelectedPhotos((prev) => [...prev, newPhoto]);
    }
  };

  const handleRemoveSelected = (index: number) => {
    setSelectedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!boatNumber) {
      Alert.alert('Atenção', 'Salve o BOAT primeiro.');
      return;
    }
    if (selectedPhotos.length === 0) {
      Alert.alert('Atenção', 'Selecione pelo menos uma foto para enviar.');
      return;
    }

    setIsLoading(true);
    try {
      const base64Images = selectedPhotos
        .filter((p) => p.base64)
        .map((p) => `data:image/jpeg;base64,${p.base64}`);

      if (base64Images.length === 0) {
        Alert.alert('Erro', 'Não foi possível processar as imagens selecionadas.');
        return;
      }

      const result = await uploadPhotos(boatNumber, base64Images);
      if (typeof result === 'string' && (result.includes('SUCESSO') || result.includes('sucesso') || result.includes('OK'))) {
        Alert.alert('Sucesso', 'Fotos enviadas com sucesso!');
        setSelectedPhotos([]);
        loadPhotos();
      } else {
        Alert.alert('Aviso', result || 'Fotos não foram enviadas.');
      }
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao enviar fotos.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderSavedPhoto = ({ item }: { item: PhotoItem }) => (
    <View style={styles.photoContainer}>
      <Image source={{ uri: item.uri }} style={styles.photo} resizeMode="cover" />
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LoadingOverlay visible={isLoading} message="Processando fotos..." />

      {!boatNumber ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="images-outline" size={48} color={COLORS.disabled} />
          <Text style={styles.emptyText}>Salve o BOAT primeiro para adicionar fotos</Text>
        </View>
      ) : (
        <>
          {/* Botões de Câmera e Galeria */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.mediaButton} onPress={handleTakePhoto} activeOpacity={0.8}>
              <Ionicons name="camera" size={28} color="#fff" />
              <Text style={styles.mediaButtonText}>CÂMERA</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.mediaButton, styles.galleryButton]} onPress={handlePickFromGallery} activeOpacity={0.8}>
              <Ionicons name="images" size={28} color="#fff" />
              <Text style={styles.mediaButtonText}>GALERIA</Text>
            </TouchableOpacity>
          </View>

          {/* Fotos Selecionadas */}
          {selectedPhotos.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>FOTOS SELECIONADAS ({selectedPhotos.length})</Text>
              <View style={styles.photosGrid}>
                {selectedPhotos.map((photo, index) => (
                  <View key={index} style={styles.photoContainer}>
                    <Image source={{ uri: photo.uri }} style={styles.photo} resizeMode="cover" />
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemoveSelected(index)}
                    >
                      <Ionicons name="close-circle" size={24} color={COLORS.error} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              <TouchableOpacity style={styles.uploadButton} onPress={handleUpload} activeOpacity={0.8}>
                <Ionicons name="cloud-upload" size={22} color="#fff" />
                <Text style={styles.uploadButtonText}>SALVAR FOTOS</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Fotos Salvas */}
          {savedPhotos.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>FOTOS SALVAS ({savedPhotos.length})</Text>
              <View style={styles.photosGrid}>
                {savedPhotos.map((photo, index) => (
                  <View key={index} style={styles.photoContainer}>
                    <Image
                      source={{ uri: photo.uri }}
                      style={styles.photo}
                      resizeMode="cover"
                      defaultSource={require('../../../assets/placeholder.png')}
                    />
                  </View>
                ))}
              </View>
            </View>
          )}

          {savedPhotos.length === 0 && selectedPhotos.length === 0 && (
            <View style={styles.emptyContainer}>
              <Ionicons name="images-outline" size={48} color={COLORS.disabled} />
              <Text style={styles.emptyText}>Nenhuma foto adicionada</Text>
              <Text style={styles.emptySubText}>Use os botões acima para adicionar fotos</Text>
            </View>
          )}

          <View style={{ height: SPACING.xxxl }} />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  section: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, margin: SPACING.md, padding: SPACING.md, elevation: 1 },
  sectionTitle: { fontSize: FONTS.sizes.sm, fontWeight: 'bold', color: COLORS.primary, marginBottom: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingBottom: SPACING.xs, letterSpacing: 0.5 },
  buttonRow: { flexDirection: 'row', padding: SPACING.md, gap: SPACING.md },
  mediaButton: { flex: 1, backgroundColor: COLORS.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: SPACING.md, borderRadius: BORDER_RADIUS.md, gap: SPACING.sm, elevation: 3 },
  galleryButton: { backgroundColor: COLORS.secondary },
  mediaButtonText: { color: '#fff', fontSize: FONTS.sizes.md, fontWeight: 'bold' },
  photosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  photoContainer: { width: IMAGE_SIZE, height: IMAGE_SIZE, borderRadius: BORDER_RADIUS.sm, overflow: 'hidden', position: 'relative' },
  photo: { width: '100%', height: '100%' },
  removeButton: { position: 'absolute', top: 2, right: 2, backgroundColor: '#fff', borderRadius: 12 },
  uploadButton: { backgroundColor: COLORS.secondary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: SPACING.md, borderRadius: BORDER_RADIUS.md, marginTop: SPACING.md, gap: SPACING.sm, elevation: 3 },
  uploadButtonText: { color: '#fff', fontSize: FONTS.sizes.md, fontWeight: 'bold' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: SPACING.xxxl * 2 },
  emptyText: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary, marginTop: SPACING.md, textAlign: 'center' },
  emptySubText: { fontSize: FONTS.sizes.sm, color: COLORS.disabled, marginTop: SPACING.sm, textAlign: 'center' },
});

export default FotosTab;
