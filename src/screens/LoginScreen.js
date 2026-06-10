// src/screens/LoginScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  SafeAreaView, Platform, StatusBar, Alert, ActivityIndicator, KeyboardAvoidingView, ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

export default function LoginScreen({ navigation }) {
  const [isRegistering, setIsRegistering] = useState(false); // Alterna entre Login e Registro
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Limpa os campos ao alternar entre as telas
  useEffect(() => {
    setEmail('');
    setPassword('');
  }, [isRegistering]);

  // --- VALIDAÇÕES DE SEGURANÇA ---
  const handleAuthAction = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    
    if (!trimmedEmail || !password) {
      Alert.alert("Erro de Acesso", "Por favor, preencha todos os campos do terminal.");
      return;
    }

    // Validação do domínio FIAP
    const isFiapEmail = trimmedEmail.endsWith('@fiap.com.br') || trimmedEmail.endsWith('@fiap.com');
    if (!isFiapEmail) {
      Alert.alert("Acesso Negado", "O sistema aceita apenas credenciais institucionais @fiap.");
      return;
    }

    if (isRegistering) {
      // Regras para senha no Registro: mínimo 8 caracteres e pelo menos 1 letra maiúscula
      const hasMinLength = password.length >= 8;
      const hasUppercase = /[A-Z]/.test(password);

      if (!hasMinLength || !hasUppercase) {
        Alert.alert(
          "Senha Insegura", 
          "A diretriz exige criptografia de bota com no mínimo 8 caracteres e pelo menos 1 letra maiúscula."
        );
        return;
      }

      // --- EXECUÇÃO DO REGISTRO (GRAVAÇÃO) ---
      setLoading(true);
      try {
        await AsyncStorage.setItem('@AeroGreen_StoredEmail', trimmedEmail);
        await AsyncStorage.setItem('@AeroGreen_StoredPassword', password);
        
        setLoading(false);
        Alert.alert(
          "Registro Concluído", 
          "Credenciais gravadas no chip criptográfico local. Proceda com o login de borda.",
          [{ text: "OK", onPress: () => setIsRegistering(false) }]
        );
      } catch (error) {
        setLoading(false);
        Alert.alert("Falha de Gravação", "Não foi possível persistir os dados no dispositivo.");
      }

    } else {
      // --- EXECUÇÃO DO LOGIN (AUTENTICAÇÃO) ---
      setLoading(true);
      try {
        const storedEmail = await AsyncStorage.getItem('@AeroGreen_StoredEmail');
        const storedPassword = await AsyncStorage.getItem('@AeroGreen_StoredPassword');

        setLoading(false);
        
        if (trimmedEmail === storedEmail && password === storedPassword) {
          // Login bem-sucedido: Redireciona limpando a pilha de histórico
          navigation.reset({
            index: 0,
            routes: [{ name: 'AppTabs' }],
          });
        } else {
          Alert.alert("Autenticação Falhou", "Credenciais incorretas ou não localizadas na memória local.");
        }
      } catch (error) {
        setLoading(false);
        Alert.alert("Erro de Leitura", "Falha ao acessar o banco de credenciais local.");
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          
          {/* Logo e Identidade Visual */}
          <View style={styles.logoContainer}>
            <View style={styles.radarIconBackground}>
              <Ionicons name="shield-checkmark-outline" size={40} color={COLORS.primary} />
            </View>
            <Text style={styles.logoText}>AEROGREEN CORE</Text>
            <Text style={styles.taglineText}>SISTEMA DE AUTENTICAÇÃO CRIPTOGRÁFICA</Text>
          </View>

          {/* Formulário */}
          <View style={styles.formContainer}>
            <Text style={styles.inputLabel}>{isRegistering ? "NOVO OPERADOR INSTITUCIONAL" : "CONEXÃO DE BORDA"}</Text>
            
            {/* Campo E-mail */}
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color={COLORS.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="usuario@fiap.com.br"
                placeholderTextColor={COLORS.textMuted}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
              />
            </View>

            {/* Campo Senha */}
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Senha de Acesso"
                placeholderTextColor={COLORS.textMuted}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Requisitos Informativos de Senha (Visível apenas no Registro) */}
            {isRegistering && (
              <View style={styles.requirementsBox}>
                <Text style={styles.requirementText}>
                  <Ionicons name="checkmark-circle-outline" size={12} color={password.length >= 8 ? COLORS.status.normal : COLORS.textMuted} /> Mínimo de 8 dígitos
                </Text>
                <Text style={styles.requirementText}>
                  <Ionicons name="checkmark-circle-outline" size={12} color={/[A-Z]/.test(password) ? COLORS.status.normal : COLORS.textMuted} /> Pelo menos 1 letra maiúscula
                </Text>
              </View>
            )}

            {/* Botão Principal de Ação */}
            <TouchableOpacity 
              style={[styles.authButton, { backgroundColor: isRegistering ? COLORS.status.normal : COLORS.primary }]} 
              onPress={handleAuthAction}
              activeOpacity={0.7}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color={COLORS.background} />
              ) : (
                <Text style={styles.authButtonText}>
                  {isRegistering ? "CONFIRMAR REGISTRO" : "ACESSAR TERMINAL"}
                </Text>
              )}
            </TouchableOpacity>

            {/* Alternador de Estado (Login <-> Registro) */}
            <TouchableOpacity 
              style={styles.switchStateButton} 
              onPress={() => setIsRegistering(!isRegistering)}
              disabled={loading}
            >
              <Text style={styles.switchStateText}>
                {isRegistering 
                  ? "Já possui RE cadastrado? Efetuar login" 
                  : "Novo operador? Clique aqui para se registrar"}
              </Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 25 },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  radarIconBackground: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.panel, justifyContent: 'center', alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: '#1F2A44' },
  logoText: { color: COLORS.text, fontSize: 22, fontWeight: '900', letterSpacing: 2 },
  taglineText: { color: COLORS.primary, fontSize: 10, fontWeight: 'bold', letterSpacing: 1, marginTop: 5 },
  formContainer: { backgroundColor: COLORS.panel, padding: 25, borderRadius: 20, borderWidth: 1, borderColor: '#1F2A44' },
  inputLabel: { color: COLORS.textMuted, fontSize: 11, fontWeight: 'bold', letterSpacing: 1, marginBottom: 15 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#1F2A44', paddingHorizontal: 15, height: 55 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: COLORS.text, fontSize: 15 },
  requirementsBox: { marginBottom: 15, paddingHorizontal: 5 },
  requirementText: { color: COLORS.textMuted, fontSize: 12, marginBottom: 4 },
  authButton: { height: 55, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 10, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  authButtonText: { color: COLORS.background, fontWeight: 'bold', fontSize: 14, letterSpacing: 1 },
  switchStateButton: { marginTop: 20, alignItems: 'center' },
  switchStateText: { color: COLORS.textMuted, fontSize: 13, textDecorationLine: 'underline' }
});