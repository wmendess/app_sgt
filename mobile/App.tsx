import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { RootStackParamList } from './src/types';
import { COLORS } from './src/utils/theme';

// Screens
import LoginScreen from './src/screens/Login/LoginScreen';
import HomeScreen from './src/screens/Home/HomeScreen';
import BoatListScreen from './src/screens/Boat/BoatList/BoatListScreen';
import BoatFormScreen from './src/screens/Boat/BoatForm/BoatFormScreen';
import RemocaoListScreen from './src/screens/Remocao/RemocaoList/RemocaoListScreen';
import RemocaoFormScreen from './src/screens/Remocao/RemocaoForm/RemocaoFormScreen';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // Pode ser substituído por uma Splash Screen
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: COLORS.background },
      }}
      initialRouteName={isAuthenticated ? 'Home' : 'Login'}
    >
      {!isAuthenticated ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="BoatList" component={BoatListScreen} />
          <Stack.Screen name="BoatForm" component={BoatFormScreen} />
          <Stack.Screen name="RemocaoList" component={RemocaoListScreen} />
          <Stack.Screen name="RemocaoForm" component={RemocaoFormScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <StatusBar style="light" backgroundColor={COLORS.primaryDark} />
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
