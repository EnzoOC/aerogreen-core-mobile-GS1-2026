// src/screens/LoginScreen.js
import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, Alert, KeyboardAvoidingView, Platform 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    setErrorMsg(''); // Limpa erros anteriores

    // Validação de inputs
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Acesso negado: Preencha suas credenciais.');
      return;
    }

    try {
      // Simulação da Fase 5: Salvando o token de sessão localmente
      await AsyncStorage.setItem('@AeroGreen_Token', 'mock_token_123');
      await AsyncStorage.setItem('@AeroGreen_User', email);
      
      // Navega para o Dashboard e reseta a pilha (não pode voltar pro login)
      navigation.reset({
        index: 0,
        routes: [{ name: 'AppTabs' }],
      });
    } catch (e) {
      Alert.alert('Erro', 'Falha ao acessar os sistemas da base.');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.logoContainer}>
        <Ionicons name="planet-outline" size={80} color={COLORS.primary} />
        <Text style={styles.title}>AEROGREEN<Text style={{color: COLORS.text}}>CORE</Text></Text>
        <Text style={styles.subtitle}>Acesso Restrito • Eng. Espacial</Text>
      </View>

      <View style={styles.formContainer}>
        {errorMsg !== '' && <Text style={styles.errorText}>{errorMsg}</Text>}
        
        <View style={styles.inputBox}>
          <Ionicons name="mail-outline" size={20} color={COLORS.primary} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="ID de Transmissão (E-mail)"
            placeholderTextColor={COLORS.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputBox}>
          <Ionicons name="lock-closed-outline" size={20} color={COLORS.primary} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Senha de Acesso"
            placeholderTextColor={COLORS.textMuted}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>INICIAR CONEXÃO</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 50 },
  title: { fontSize: 32, fontWeight: '900', color: COLORS.primary, marginTop: 10, letterSpacing: 2 },
  subtitle: { fontSize: 14, color: COLORS.textMuted, marginTop: 5, letterSpacing: 1 },
  formContainer: { paddingHorizontal: 30 },
  inputBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.panel, borderRadius: 8,
    marginBottom: 15, paddingHorizontal: 15,
    borderWidth: 1, borderColor: '#1F2A44',
  },
  icon: { marginRight: 10 },
  input: { flex: 1, color: COLORS.text, height: 50, fontSize: 16 },
  button: {
    backgroundColor: COLORS.primary, borderRadius: 8,
    height: 50, justifyContent: 'center', alignItems: 'center',
    marginTop: 10, shadowColor: COLORS.primary, 
    shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 5
  },
  buttonText: { color: COLORS.background, fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
  errorText: { color: COLORS.status.critico, marginBottom: 10, textAlign: 'center', fontWeight: 'bold' }
});