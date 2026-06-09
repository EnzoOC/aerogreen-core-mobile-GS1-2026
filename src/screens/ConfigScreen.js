// src/screens/ConfigScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, SafeAreaView, Platform, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

export default function ConfigScreen() {
  const [tempLimite, setTempLimite] = useState(38);
  const [autoResfriamento, setAutoResfriamento] = useState(true);
  const [economiaAgua, setEconomiaAgua] = useState(false);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const savedTemp = await AsyncStorage.getItem('@AeroGreen_TempLimit');
        const savedAutoCool = await AsyncStorage.getItem('@AeroGreen_AutoCool');
        if (savedTemp !== null) setTempLimite(parseInt(savedTemp));
        if (savedAutoCool !== null) setAutoResfriamento(savedAutoCool === 'true');
      } catch (e) {
        console.error("Erro ao carregar configurações.");
      }
    };
    loadConfig();
  }, []);

  const saveConfig = async () => {
    try {
      await AsyncStorage.setItem('@AeroGreen_TempLimit', tempLimite.toString());
      await AsyncStorage.setItem('@AeroGreen_AutoCool', autoResfriamento.toString());
      Alert.alert('Sucesso', 'Regras de automação atualizadas no ecossistema.');
    } catch (e) {
      Alert.alert('Erro', 'Falha ao gravar na memória do dispositivo.');
    }
  };

  const alterarTemperatura = (valor) => {
    setTempLimite(prev => prev + valor);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Regras de Automação IoT</Text>

        {/* Ajuste de Limite de Temperatura */}
        <View style={styles.configCard}>
          <View style={styles.configHeader}>
            <Ionicons name="thermometer" size={24} color={COLORS.status.critico} />
            <Text style={styles.configTitle}>Gatilho de Alerta Térmico</Text>
          </View>
          <Text style={styles.configDesc}>Define o limite de temperatura para disparar eventos críticos na API.</Text>
          
          <View style={styles.stepperContainer}>
            <TouchableOpacity style={styles.stepperBtn} onPress={() => alterarTemperatura(-1)}>
              <Ionicons name="remove" size={24} color={COLORS.text} />
            </TouchableOpacity>
            
            <Text style={styles.stepperValue}>{tempLimite}°C</Text>
            
            <TouchableOpacity style={styles.stepperBtn} onPress={() => alterarTemperatura(1)}>
              <Ionicons name="add" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Switch de Automação - CORRIGIDO */}
        <View style={styles.configCard}>
          <View style={styles.switchRow}>
            <View style={styles.textContainer}>
              <View style={styles.configHeader}>
                <Ionicons name="snow" size={24} color={COLORS.primary} />
                <Text style={styles.configTitle}>Resfriamento Automático</Text>
              </View>
              <Text style={styles.configDesc}>Liga os exaustores via IoT sem intervenção humana.</Text>
            </View>
            <View style={styles.switchContainer}>
              <Switch
                trackColor={{ false: '#1F2A44', true: COLORS.primary }}
                thumbColor={autoResfriamento ? '#FFFFFF' : '#8A99A8'}
                onValueChange={setAutoResfriamento}
                value={autoResfriamento}
              />
            </View>
          </View>
        </View>

        {/* Switch de Economia de Recursos - CORRIGIDO */}
        <View style={styles.configCard}>
          <View style={styles.switchRow}>
            <View style={styles.textContainer}>
              <View style={styles.configHeader}>
                <Ionicons name="water" size={24} color={COLORS.status.normal} />
                <Text style={styles.configTitle}>Modo Seca Estrita</Text>
              </View>
              <Text style={styles.configDesc}>Bloqueia uso de água não-essencial se o reservatório baixar de 20%.</Text>
            </View>
            <View style={styles.switchContainer}>
              <Switch
                trackColor={{ false: '#1F2A44', true: COLORS.status.normal }}
                thumbColor={economiaAgua ? '#FFFFFF' : '#8A99A8'}
                onValueChange={setEconomiaAgua}
                value={economiaAgua}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={saveConfig}>
          <Text style={styles.saveBtnText}>APLICAR PROTOCOLOS</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  container: { flex: 1, padding: 20 },
  headerTitle: { fontSize: 18, color: COLORS.textMuted, marginBottom: 20, textTransform: 'uppercase', letterSpacing: 1 },
  configCard: {
    backgroundColor: COLORS.panel, padding: 20, borderRadius: 12,
    borderWidth: 1, borderColor: '#1F2A44', marginBottom: 15
  },
  
  // Organização do texto e botões no SwitchRow
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  textContainer: { flex: 1, paddingRight: 15 }, // <-- Evita que o texto encoste no Switch
  switchContainer: { justifyContent: 'center' },
  
  configHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  configTitle: { color: COLORS.text, fontSize: 16, fontWeight: 'bold', marginLeft: 10 }, // <-- Substituiu o gap
  configDesc: { color: COLORS.textMuted, fontSize: 13, marginBottom: 15, lineHeight: 18 },
  
  stepperContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20 },
  stepperBtn: { backgroundColor: '#1F2A44', width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  stepperValue: { color: COLORS.text, fontSize: 24, fontWeight: 'bold', width: 70, textAlign: 'center' },
  
  saveBtn: {
    backgroundColor: COLORS.primary, padding: 18, borderRadius: 8,
    alignItems: 'center', marginTop: 10,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 5
  },
  saveBtnText: { color: COLORS.background, fontSize: 14, fontWeight: 'bold', letterSpacing: 1 }
});