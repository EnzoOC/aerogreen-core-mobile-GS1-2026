// App.js
import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from './src/theme/colors';

// Importações das Telas
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import MapScreen from './src/screens/MapScreen';
import ConfigScreen from './src/screens/ConfigScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// --- NOVA BARRA DE NAVEGAÇÃO INFERIOR ---
function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: COLORS.panel, shadowColor: 'transparent', elevation: 0 },
        headerTintColor: COLORS.primary,
        headerTitleStyle: { fontWeight: 'bold', letterSpacing: 1 },
        // Estilo da barra inferior (inspirado na sua imagem)
        tabBarStyle: {
          backgroundColor: COLORS.panel,
          borderTopWidth: 0,
          elevation: 10,
          shadowOpacity: 0.2,
          shadowRadius: 10,
          height: 70,
          paddingBottom: 15,
          paddingTop: 10,
          borderTopLeftRadius: 25, // Bordas arredondadas
          borderTopRightRadius: 25,
          position: 'absolute', // Faz ela flutuar levemente
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        // Configuração dinâmica dos ícones
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Map') {
            iconName = focused ? 'earth' : 'earth-outline'; // Ícone corrigido!
          } else if (route.name === 'Config') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size + 2} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Biomas', headerShown: false}} />
      <Tab.Screen name="Map" component={MapScreen} options={{ title: 'Radar' }} />
      <Tab.Screen name="Config" component={ConfigScreen} options={{ title: 'Ajustes' }} />
    </Tab.Navigator>
  );
}

// --- NAVEGAÇÃO RAIZ ---
export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      <Stack.Navigator screenOptions={{ contentStyle: { backgroundColor: COLORS.background } }}>
        {/* Tela de Login não tem barra inferior */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        
        {/* Entra no ecossistema com abas */}
        <Stack.Screen 
          name="AppTabs" 
          component={AppTabs} 
          options={{ headerShown: false }} 
        />
        
        {/* A Tela de Detalhes abre "por cima" de tudo para focar na emergência */}
        <Stack.Screen 
          name="Details" 
          component={DetailsScreen} 
          options={{ 
            title: 'Painel da Estufa',
            headerStyle: { backgroundColor: COLORS.panel },
            headerTintColor: COLORS.primary,
            headerShadowVisible: false,
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}