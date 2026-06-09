// src/screens/DashboardScreen.js
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Platform, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

// Dados Iniciais
const DADOS_INICIAIS = [
  { id: '1', nome: 'Módulo Lunar Alfa', localizacao: 'Cratera Shackleton', status: 'normal', temp: 24.5, agua: 80 },
  { id: '2', nome: 'Doma Hidropônica 04', localizacao: 'Vale Marineris', status: 'critico', temp: 41.2, agua: 12 },
  { id: '3', nome: 'Refúgio Deserto Atacama', localizacao: 'Base Terrestre', status: 'alerta', temp: 30.1, agua: 45 },
];

export default function DashboardScreen({ navigation }) {
  // Estado dinâmico para podermos alterar a tela visualmente
  const [estufas, setEstufas] = useState(DADOS_INICIAIS);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);

  const getStatusColor = (status) => {
    if (status === 'normal') return COLORS.status.normal;
    if (status === 'alerta') return COLORS.status.alerta;
    return COLORS.status.critico;
  };

  const hasCritico = estufas.some(estufa => estufa.status === 'critico');

  // --- FUNÇÕES DE SIMULAÇÃO VISUAL ---
  
  const handleSincronizar = () => {
    setIsSyncing(true); // Liga o spinner de carregamento
    
    // Simula 1.5 segundos de atraso de rede espacial
    setTimeout(() => {
      setIsSyncing(false); // Desliga o spinner
      Alert.alert("Sincronizado", "Telemetria recebida. Ping orbital de 12ms.");
    }, 1500);
  };

  const handleReiniciar = () => {
    Alert.alert(
      "Atenção: Reinicialização Crítica",
      "Isso fará um Hard Reset em todos os módulos auxiliares. Confirmar?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Confirmar", 
          style: "destructive",
          onPress: () => {
            setIsRestarting(true); // Muda o status global
            
            // Simula 2.5 segundos de reinicialização do hardware
            setTimeout(() => {
              // Transforma todos os biomas críticos em "normal" para mostrar que o problema foi resolvido
              const estufasRecuperadas = estufas.map(e => ({
                ...e,
                status: 'normal',
                temp: e.status === 'critico' ? 24.5 : e.temp, // Esfria o que estava quente
                agua: e.status === 'critico' ? 80 : e.agua    // Enche a água do que estava seco
              }));
              
              setEstufas(estufasRecuperadas);
              setIsRestarting(false);
              Alert.alert("Sucesso", "Biomas reiniciados e estabilizados com sucesso.");
            }, 2500);
          }
        }
      ]
    );
  };

  // Funções secundárias
  const handleRelatorios = () => Alert.alert("Exportar Relatório", "Baixando histórico CSV...");
  const handleAddBioma = () => Alert.alert("Novo Bioma", "Buscando novos módulos Bluetooth...");

  // --- RENDERIZAÇÃO DOS CARDS ---
  const renderEstufaCard = ({ item }) => {
    const statusColor = getStatusColor(item.status);

    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('Details', { estufaId: item.id })}
      >
        <View style={styles.cardIconContainer}>
          <Ionicons name={item.status === 'critico' ? 'warning' : 'leaf'} size={24} color={statusColor} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{item.nome}</Text>
          <Text style={styles.cardLocation}>{item.localizacao}</Text>
        </View>
        <View style={styles.cardTelemetry}>
          <Text style={[styles.telemetryText, { color: statusColor }]}>{item.temp}°C</Text>
          <Text style={styles.telemetrySub}>{item.agua}% H2O</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* TOPO */}
        <View style={styles.topHeader}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="menu" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="scan" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* ÁREA DE STATUS GLOBAL DINÂMICA */}
        <View style={styles.balanceArea}>
          <Text style={styles.balanceLabel}>Status do Ecossistema</Text>
          <View style={styles.balanceRow}>
            
            {/* Lógica condicional: Se estiver reiniciando, se estiver sincronizando ou o status normal */}
            {isRestarting ? (
              <Text style={[styles.balanceValue, { color: COLORS.primary, fontSize: 32 }]}>REINICIANDO...</Text>
            ) : isSyncing ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                 <ActivityIndicator size="large" color={COLORS.primary} style={{marginRight: 15}} />
                 <Text style={[styles.balanceValue, { color: COLORS.text, fontSize: 32 }]}>Buscando...</Text>
              </View>
            ) : (
              <Text style={[styles.balanceValue, { color: hasCritico ? COLORS.status.critico : COLORS.status.normal }]}>
                {hasCritico ? 'ALERTA' : 'ESTÁVEL'}
              </Text>
            )}

            <View style={styles.currencyBadge}>
              <Ionicons name="earth" size={14} color={COLORS.text} style={{marginRight: 4}} />
              <Text style={styles.currencyText}>REDE</Text>
            </View>
          </View>
          <Text style={styles.balanceSubtext}>
            <Ionicons name="caret-up" size={12} color={COLORS.status.normal} /> 3 Biomas Sincronizados
          </Text>
        </View>

        {/* BOTÕES DE AÇÃO */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.actionBtnPrimary, { backgroundColor: COLORS.primary }]} onPress={handleAddBioma}>
            <Ionicons name="add" size={28} color={COLORS.background} />
          </TouchableOpacity>
          
          {/* Botão Sincronizar Substituindo Relatórios */}
          <TouchableOpacity style={styles.actionBtnSecondary} onPress={handleSincronizar} disabled={isSyncing || isRestarting}>
            <Ionicons name="sync-outline" size={20} color={COLORS.text} style={{marginRight: 8}} />
            <Text style={styles.actionBtnText}>Sincronizar</Text>
          </TouchableOpacity>

          {/* Botão Reiniciar Substituindo Comandos */}
          <TouchableOpacity style={styles.actionBtnSecondary} onPress={handleReiniciar} disabled={isSyncing || isRestarting}>
            <Ionicons name="power-outline" size={20} color={COLORS.status.critico} style={{marginRight: 8}} />
            <Text style={styles.actionBtnText}>Reiniciar</Text>
          </TouchableOpacity>
        </View>

        {/* LISTA DE BIOMAS */}
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Biomas Ativos</Text>
          <TouchableOpacity onPress={handleRelatorios}>
            <Text style={styles.listSeeMore}>CSV Relatórios</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={estufas}
          keyExtractor={(item) => item.id}
          renderItem={renderEstufaCard}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }} 
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  container: { flex: 1, paddingHorizontal: 20 },
  topHeader: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginBottom: 30 },
  iconButton: { width: 45, height: 45, borderRadius: 25, backgroundColor: COLORS.panel, justifyContent: 'center', alignItems: 'center' },
  balanceArea: { marginBottom: 30 },
  balanceLabel: { color: COLORS.textMuted, fontSize: 14, marginBottom: 5 },
  balanceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  balanceValue: { fontSize: 40, fontWeight: '900', letterSpacing: 1 },
  currencyBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.panel, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  currencyText: { color: COLORS.text, fontSize: 12, fontWeight: 'bold' },
  balanceSubtext: { color: COLORS.status.normal, fontSize: 13, marginTop: 8, fontWeight: '600' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 },
  actionBtnPrimary: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  actionBtnSecondary: { flex: 1, height: 60, backgroundColor: COLORS.panel, borderRadius: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  actionBtnText: { color: COLORS.text, fontWeight: 'bold', fontSize: 14 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  listTitle: { color: COLORS.text, fontSize: 18, fontWeight: 'bold' },
  listSeeMore: { color: COLORS.primary, fontSize: 14, fontWeight: 'bold' },
  card: { flexDirection: 'row', backgroundColor: COLORS.panel, borderRadius: 16, padding: 15, marginBottom: 15, alignItems: 'center' },
  cardIconContainer: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#1F2A44', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  cardInfo: { flex: 1 },
  cardTitle: { color: COLORS.text, fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  cardLocation: { color: COLORS.textMuted, fontSize: 12 },
  cardTelemetry: { alignItems: 'flex-end' },
  telemetryText: { fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
  telemetrySub: { color: COLORS.textMuted, fontSize: 11 }
});