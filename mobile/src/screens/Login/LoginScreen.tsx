import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MaskInput from 'react-native-mask-input';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { loginUser } from '../../services/auth';
import { useAuth } from '../../contexts/AuthContext';
import LoadingOverlay from '../../components/LoadingOverlay';
import { CPF_MASK } from '../../utils/masks';
import { RootStackParamList } from '../../types';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../utils/theme';

type LoginNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginNavigationProp>();
  const { signIn } = useAuth();

  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    const cleanCpf = cpf.replace(/\D/g, '');
    if (!cleanCpf || cleanCpf.length < 11) {
      Alert.alert('Atenção', 'Por favor, informe um CPF válido.');
      return;
    }
    if (!password) {
      Alert.alert('Atenção', 'Por favor, informe a senha.');
      return;
    }

    setIsLoading(true);
    try {
      const userData = await loginUser(cpf, password);
      await signIn(userData);
      navigation.replace('Home');
    } catch (error: any) {
      Alert.alert('Erro de Login', error.message || 'Não foi possível realizar o login.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Esqueceu sua senha?',
      'Entre em contato com o administrador do sistema para redefinir sua senha.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primaryDark} barStyle="light-content" />
      <LoadingOverlay visible={isLoading} message="Autenticando..." />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>SMTT</Text>
              <Text style={styles.logoSubText}>GTT</Text>
            </View>
            <Text style={styles.logoTitle}>GRUPO TÁTICO DE TRÂNSITO</Text>
            <Text style={styles.logoSubtitle}>SEGURANÇA PÚBLICA VIÁRIA</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>ACESSAR</Text>

          {/* CPF Field */}
          <View style={styles.inputContainer}>
            <View style={styles.inputIconContainer}>
              <Ionicons name="person-circle" size={36} color={COLORS.primary} />
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>CPF</Text>
              <MaskInput
                style={styles.input}
                value={cpf}
                onChangeText={(masked) => setCpf(masked)}
                mask={CPF_MASK}
                keyboardType="numeric"
                placeholder="000.000.000-00"
                placeholderTextColor={COLORS.textSecondary}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Password Field */}
          <View style={styles.inputContainer}>
            <View style={styles.inputIconContainer}>
              <Ionicons name="lock-closed" size={32} color={COLORS.primary} />
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="SENHA"
                placeholderTextColor={COLORS.textSecondary}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? 'eye' : 'eye-off'}
                size={24}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Ionicons name="log-in" size={28} color="#fff" />
          </TouchableOpacity>

          {/* Forgot Password */}
          <TouchableOpacity
            style={styles.forgotButton}
            onPress={handleForgotPassword}
            activeOpacity={0.7}
          >
            <Text style={styles.forgotText}>ESQUECEU SUA SENHA?</Text>
          </TouchableOpacity>

          <Text style={styles.version}>v1.0.0</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xxxl,
    // Gradiente simulado com background
    backgroundColor: '#1565C0',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: SPACING.xxxl * 2,
    marginBottom: SPACING.xxxl,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primaryDark,
    borderWidth: 4,
    borderColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  logoText: {
    color: '#fff',
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
  },
  logoSubText: {
    color: COLORS.secondary,
    fontSize: FONTS.sizes.md,
    fontWeight: 'bold',
  },
  logoTitle: {
    color: '#fff',
    fontSize: FONTS.sizes.sm,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1,
  },
  logoSubtitle: {
    color: COLORS.accent,
    fontSize: FONTS.sizes.xs,
    textAlign: 'center',
    marginTop: 2,
  },
  title: {
    fontSize: FONTS.sizes.title,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.sm,
    minHeight: 56,
  },
  inputIconContainer: {
    marginRight: SPACING.sm,
  },
  inputWrapper: {
    flex: 1,
  },
  inputLabel: {
    fontSize: FONTS.sizes.xs,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 2,
  },
  input: {
    fontSize: FONTS.sizes.md,
    color: '#fff',
    paddingVertical: SPACING.xs,
  },
  eyeButton: {
    padding: SPACING.sm,
  },
  loginButton: {
    backgroundColor: COLORS.primaryDark,
    borderRadius: BORDER_RADIUS.round,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  forgotButton: {
    backgroundColor: 'rgba(200,200,200,0.3)',
    borderRadius: BORDER_RADIUS.round,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  forgotText: {
    color: '#fff',
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
  },
  version: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.5)',
    fontSize: FONTS.sizes.xs,
  },
});

export default LoginScreen;
