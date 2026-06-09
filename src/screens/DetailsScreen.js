// src/screens/DetailsScreen.js
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Animated, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

// 1. O "Banco de Dados" simulado com as 3 estufas diferentes
const ESTUFAS_DB = [
  {
    id: '1',
    nome: 'Módulo Lunar Alfa',
    localizacao: 'Cratera Shackleton - Lua',
    statusInicial: 'normal',
    sensores: { temperatura: 24.5, umidade: 45, nivel_agua: 80, lux: 12000 }
  },
  {
    id: '2',
    nome: 'Doma Hidropônica 04',
    localizacao: 'Vale Marineris - Marte',
    statusInicial: 'critico',
    sensores: { temperatura: 41.2, umidade: 22, nivel_agua: 12, lux: 15000 }
  },
  {
    id: '3',
    nome: 'Refúgio Deserto Atacama',
    localizacao: 'Base Terrestre - Chile',
    statusInicial: 'alerta',
    sensores: { temperatura: 30.1, umidade: 30, nivel_agua: 45, lux: 8500 }
  }
];

export default function DetailsScreen({ route, navigation }) {
  // 2. Captura o ID exato que foi passado ao clicar no Card lá no Dashboard
  const { estufaId } = route.params || { estufaId: '1' };
  
  // 3. Procura no nosso DB mockado qual estufa tem esse ID
  const estufaAtual = ESTUFAS_DB.find(e => e.id === estufaId) || ESTUFAS_DB[0];
  
  const [status, setStatus] = useState(estufaAtual.statusInicial);
  const [sensores, setSensores] = useState(estufaAtual.sensores);
  const fadeAnim = useState(new Animated.Value(1))[0];

  // 4. Atualiza o título do cabeçalho com o nome correto do bioma
  useLayoutEffect(() => {
    navigation.setOptions({
      title: estufaAtual.nome,
    });
  }, [navigation, estufaAtual]);

  useEffect(() => {
    if (status === 'critico') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, { toValue: 0.2, duration: 500, useNativeDriver: true }),
          Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true })
        ])
      ).start();
    } else {
      fadeAnim.setValue(1); 
    }
  }, [status]);

  const handleEmergencia = () => {
    Alert.alert(
      "AÇÃO CRÍTICA",
      "Confirma o acionamento dos exaustores e liberação de água de reserva?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "CONFIRMAR", 
          style: "destructive",
          onPress: () => {
            setStatus('normal');
            setSensores({ ...sensores, temperatura: 24.5, nivel_agua: 80 });
            Alert.alert("Sucesso", "Sistemas auxiliares ativados. O bioma está estabilizando.");
          }
        }
      ]
    );
  };

  const isCritico = status === 'critico';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={styles.container}>
        
        {/* Banner de Status Dinâmico */}
        <Animated.View style={[styles.headerStatus, { 
          backgroundColor: isCritico ? COLORS.status.critico : (status === 'alerta' ? COLORS.status.alerta : COLORS.status.normal),
          opacity: isCritico ? fadeAnim : 1 
        }]}>
          <Ionicons 
            name={isCritico ? "warning" : (status === 'alerta' ? "alert-circle" : "checkmark-circle")} 
            size={32} 
            color={COLORS.background} 
          />
          <Text style={styles.headerStatusText}>
            {isCritico ? "ANOMALIA DETECTADA: RISCO SEVERO" : (status === 'alerta' ? "ATENÇÃO: PARÂMETROS INSTÁVEIS" : "SISTEMA OPERACIONAL ESTÁVEL")}
          </Text>
        </Animated.View>

        <View style={styles.gridContainer}>
          <View style={[styles.sensorCard, isCritico && sensores.temperatura > 38 ? styles.sensorCriticoBorder : null]}>
            <Ionicons name="thermometer" size={32} color={COLORS.status.critico} />
            <Text style={styles.sensorValue}>{sensores.temperatura}°C</Text>
            <Text style={styles.sensorLabel}>Temperatura</Text>
          </View>

          <View style={[styles.sensorCard, isCritico && sensores.nivel_agua < 15 ? styles.sensorCriticoBorder : null]}>
            <Ionicons name="water" size={32} color={COLORS.primary} />
            <Text style={styles.sensorValue}>{sensores.nivel_agua}%</Text>
            <Text style={styles.sensorLabel}>Reservatório</Text>
          </View>

          <View style={styles.sensorCard}>
            <Ionicons name="cloud-outline" size={32} color={COLORS.textMuted} />
            <Text style={styles.sensorValue}>{sensores.umidade}%</Text>
            <Text style={styles.sensorLabel}>Umidade do Ar</Text>
          </View>

          <View style={styles.sensorCard}>
            <Ionicons name="sunny" size={32} color={COLORS.status.alerta} />
            <Text style={styles.sensorValue}>{sensores.lux}</Text>
            <Text style={styles.sensorLabel}>Luminosidade (Lux)</Text>
          </View>
        </View>

        {/* O botão de emergência só aparece se o status for crítico */}
        {isCritico && (
          <TouchableOpacity style={styles.btnEmergencia} onPress={handleEmergencia}>
            <Ionicons name="nuclear" size={24} color={COLORS.text} style={{marginRight: 10}} />
            <Text style={styles.btnEmergenciaText}>ATIVAR RESFRIAMENTO DE EMERGÊNCIA</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  headerStatus: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    padding: 15, borderRadius: 8, marginBottom: 30,
  },
  headerStatusText: { color: COLORS.background, fontWeight: 'bold', fontSize: 13, marginLeft: 10 },
  gridContainer: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between'
  },
  sensorCard: {
    width: '48%', backgroundColor: COLORS.panel,
    padding: 20, borderRadius: 12, alignItems: 'center', marginBottom: 15,
    borderWidth: 1, borderColor: '#1F2A44',
  },
  sensorCriticoBorder: { borderColor: COLORS.status.critico, borderWidth: 2 },
  sensorValue: { color: COLORS.text, fontSize: 28, fontWeight: 'bold', marginVertical: 10 },
  sensorLabel: { color: COLORS.textMuted, fontSize: 12, textTransform: 'uppercase' },
  btnEmergencia: {
    flexDirection: 'row', backgroundColor: COLORS.status.critico,
    padding: 18, borderRadius: 8, justifyContent: 'center', alignItems: 'center',
    position: 'absolute', bottom: 40, left: 20, right: 20,
    shadowColor: COLORS.status.critico, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 15, elevation: 10
  },
  btnEmergenciaText: { color: COLORS.text, fontWeight: 'bold', fontSize: 13 }
});