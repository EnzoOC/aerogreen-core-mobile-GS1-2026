// src/screens/DashboardScreen.js
import React, { useState } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, StyleSheet, 
  SafeAreaView, Platform, StatusBar, Alert, ActivityIndicator, Modal 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

// 1. TEMPLATES DE BIOMAS EXPANDIDOS (11 Opções no total)
const BIOMA_TEMPLATES = [
  { id: 't1', nome: 'Módulo Floresta Amazônia', localizacao: 'Manaus - Terra', status: 'normal', temp: 26.8, agua: 95 },
  { id: 't2', nome: 'Estação Ceres-1', localizacao: 'Cinturão de Asteroides', status: 'normal', temp: 22.1, agua: 70 },
  { id: 't3', nome: 'Base Antártica VII', localizacao: 'Polo Sul - Terra', status: 'alerta', temp: 18.5, agua: 40 },
  { id: 't4', nome: 'Doma Alpha Centauri', localizacao: 'Sistema Proxima B', status: 'normal', temp: 25.0, agua: 88 },
  { id: 't5', nome: 'Módulo Cerrado Seguro', localizacao: 'Goiás - Terra', status: 'normal', temp: 29.3, agua: 55 },
  { id: 't6', nome: 'Doma Olympus Mons', localizacao: 'Planalto de Marte', status: 'critico', temp: 44.1, agua: 8 },
  { id: 't7', nome: 'Base de Gelo Europa', localizacao: 'Órbita de Júpiter', status: 'normal', temp: 16.2, agua: 99 },
  { id: 't8', nome: 'Estação Kepler-186f', localizacao: 'Zona Exoplanetária', status: 'normal', temp: 21.7, agua: 74 },
  { id: 't9', nome: 'Módulo Estufa Sahara', localizacao: 'Níger - Terra', status: 'alerta', temp: 37.4, agua: 21 },
  { id: 't10', nome: 'Laboratório Titan', localizacao: 'Satélite de Saturno', status: 'normal', temp: 19.8, agua: 63 },
  { id: 't11', nome: 'Cultivo Submarino Atlântico', localizacao: 'Fossa de Sargaços', status: 'normal', temp: 23.5, agua: 100 },
];

const DADOS_INICIAIS = [
  { id: '1', nome: 'Módulo Lunar Alfa', localizacao: 'Cratera Shackleton', status: 'normal', temp: 24.5, agua: 80 },
  { id: '2', nome: 'Doma Hidropônica 04', localizacao: 'Vale Marineris', status: 'critico', temp: 41.2, agua: 12 },
];

export default function DashboardScreen({ navigation }) {
  const [estufas, setEstufas] = useState(DADOS_INICIAIS);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const getStatusColor = (status) => {
    if (status === 'normal') return COLORS.status.normal;
    if (status === 'alerta') return COLORS.status.alerta;
    return COLORS.status.critico;
  };

  const hasCritico = estufas.some(estufa => estufa.status === 'critico');

  // --- LÓGICA DE CRIAÇÃO ---
  const handleAddBioma = (template) => {
    const novoBioma = {
      ...template,
      id: Math.random().toString(),
    };
    setEstufas([...estufas, novoBioma]);
    setModalVisible(false);
    Alert.alert("Sucesso", `${template.nome} foi provisionado e sincronizado com a rede.`);
  };

  // --- LÓGICA DE REMOÇÃO (CORRIGIDO) ---
  const handleDeleteBioma = (id, nome) => {
    Alert.alert(
      "Desconectar Módulo",
      `Tem certeza que deseja interromper a sincronização e remover o ${nome} da malha ativa?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Remover", 
          style: "destructive", 
          onPress: () => {
            const listaAtualizada = estufas.filter(e => e.id !== id);
            setEstufas(listaAtualizada);
          } 
        }
      ]
    );
  };

  // --- SIMULAÇÕES DE COMANDO ---
  const handleSincronizar = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      Alert.alert("Sincronizado", "Malha de telemetria atualizada.");
    }, 1200);
  };

  const handleReiniciar = () => {
    Alert.alert("Hard Reset", "Confirmar reinicialização de todos os biomas?", [
      { text: "Cancelar" },
      { text: "Confirmar", style: "destructive", onPress: () => {
        setIsRestarting(true);
        setTimeout(() => {
          const recuperadas = estufas.map(e => ({
            ...e, status: 'normal', temp: 24.5, agua: 80
          }));
          setEstufas(recuperadas);
          setIsRestarting(false);
        }, 2000);
      }}
    ]);
  };

  // --- RENDERIZAÇÃO DOS CARDS ---
  const renderEstufaCard = ({ item }) => {
    const statusColor = getStatusColor(item.status);
    return (
      <View style={[styles.card, item.status === 'critico' && { borderColor: COLORS.status.critico, borderWidth: 1 }]}>
        
        {/* Área de Toque para abrir Detalhes */}
        <TouchableOpacity 
          style={styles.cardTouchArea}
          onPress={() => navigation.navigate('Details', { estufaId: item.id })}
        >
          <View style={styles.cardIconContainer}>
            <Ionicons name={item.status === 'critico' ? 'warning' : 'leaf'} size={24} color={statusColor} />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle} numberOfLines={1}>{item.nome}</Text>
            <Text style={styles.cardLocation}>{item.localizacao}</Text>
          </View>
          <View style={styles.cardTelemetry}>
            <Text style={[styles.telemetryText, { color: statusColor }]}>{item.temp}°C</Text>
            <Text style={styles.telemetrySub}>{item.agua}% H2O</Text>
          </View>
        </TouchableOpacity>

        {/* Botão de Excluir Separado à Direita */}
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={() => handleDeleteBioma(item.id, item.nome)}
        >
          <Ionicons name="trash-outline" size={20} color={COLORS.status.critico} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* TOPO */}
        <View style={styles.topHeader}>
          <TouchableOpacity style={styles.iconButton} onPress={() => Alert.alert("Operador", "Nível de Acesso: Engenheiro Master")}>
            <Ionicons name="menu" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.logoText}>AEROGREEN</Text>
          <TouchableOpacity style={styles.iconButton} onPress={() => Alert.alert("Scanner", "Buscando QR Code de hardware...")}>
            <Ionicons name="scan" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* ÁREA DE STATUS GLOBAL */}
        <View style={styles.balanceArea}>
          <Text style={styles.balanceLabel}>Monitoramento de Rede</Text>
          <View style={styles.balanceRow}>
            {isRestarting ? (
              <Text style={[styles.balanceValue, { color: COLORS.primary, fontSize: 32 }]}>REINICIANDO...</Text>
            ) : (
              <Text style={[styles.balanceValue, { color: hasCritico ? COLORS.status.critico : COLORS.status.normal }]}>
                {hasCritico ? 'ALERTA' : 'ESTÁVEL'}
              </Text>
            )}
            <View style={styles.currencyBadge}>
              <Ionicons name="earth" size={14} color={COLORS.text} />
              <Text style={styles.currencyText}>REDE</Text>
            </View>
          </View>
        </View>

        {/* BOTÕES DE AÇÃO */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.actionBtnPrimary, { backgroundColor: COLORS.primary }]} onPress={() => setModalVisible(true)}>
            <Ionicons name="add" size={28} color={COLORS.background} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionBtnSecondary} onPress={handleSincronizar} disabled={isSyncing}>
            {isSyncing ? <ActivityIndicator size="small" color={COLORS.primary} /> : (
              <>
                <Ionicons name="sync-outline" size={20} color={COLORS.text} style={{marginRight: 8}} />
                <Text style={styles.actionBtnText}>Sincronizar</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtnSecondary} onPress={handleReiniciar}>
            <Ionicons name="power-outline" size={20} color={COLORS.status.critico} style={{marginRight: 8}} />
            <Text style={styles.actionBtnText}>Reiniciar</Text>
          </TouchableOpacity>
        </View>

        {/* LISTA DE BIOMAS */}
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Módulos Sincronizados ({estufas.length})</Text>
        </View>

        <FlatList
          data={estufas}
          keyExtractor={(item) => item.id}
          renderItem={renderEstufaCard}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 140 }} 
        />
      </View>

      {/* --- MODAL / DROPDOWN DE SELEÇÃO COM SCROLL --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Provisionar Novo Bioma</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalSub}>Selecione uma das diretrizes catalogadas para inicializar os sensores:</Text>

            <FlatList
              data={BIOMA_TEMPLATES}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.templateOption}
                  onPress={() => handleAddBioma(item)}
                >
                  <View style={styles.templateIcon}>
                    <Ionicons 
                      name={item.status === 'critico' ? 'warning-outline' : 'planet-outline'} 
                      size={24} 
                      color={item.status === 'critico' ? COLORS.status.critico : COLORS.primary} 
                    />
                  </View>
                  <View style={{ flex: 1, paddingRight: 10 }}>
                    <Text style={styles.templateName} numberOfLines={1}>{item.nome}</Text>
                    <Text style={styles.templateLoc}>{item.localizacao}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  container: { flex: 1, paddingHorizontal: 20 },
  topHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 30 },
  logoText: { color: COLORS.text, fontWeight: 'bold', letterSpacing: 3, fontSize: 16 },
  iconButton: { width: 45, height: 45, borderRadius: 25, backgroundColor: COLORS.panel, justifyContent: 'center', alignItems: 'center' },
  balanceArea: { marginBottom: 30 },
  balanceLabel: { color: COLORS.textMuted, fontSize: 14, marginBottom: 5 },
  balanceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  balanceValue: { fontSize: 36, fontWeight: '900', letterSpacing: 1 },
  currencyBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.panel, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  currencyText: { color: COLORS.text, fontSize: 10, fontWeight: 'bold', marginLeft: 4 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 },
  actionBtnPrimary: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  actionBtnSecondary: { flex: 1, height: 60, backgroundColor: COLORS.panel, borderRadius: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  actionBtnText: { color: COLORS.text, fontWeight: 'bold', fontSize: 14 },
  listHeader: { marginBottom: 15 },
  listTitle: { color: COLORS.text, fontSize: 18, fontWeight: 'bold' },
  
  // Layout adaptado para conter o botão de excluir de forma limpa
  card: { 
    flexDirection: 'row', backgroundColor: COLORS.panel, borderRadius: 16, 
    marginBottom: 15, alignItems: 'center', overflow: 'hidden', paddingRight: 10
  },
  cardTouchArea: { 
    flex: 1, flexDirection: 'row', padding: 15, alignItems: 'center' 
  },
  cardIconContainer: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#1F2A44', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  cardInfo: { flex: 1, marginRight: 10 },
  cardTitle: { color: COLORS.text, fontSize: 15, fontWeight: 'bold', marginBottom: 4 },
  cardLocation: { color: COLORS.textMuted, fontSize: 12 },
  cardTelemetry: { alignItems: 'flex-end', justifyContent: 'center' },
  telemetryText: { fontSize: 15, fontWeight: 'bold' },
  telemetrySub: { color: COLORS.textMuted, fontSize: 11 },
  deleteButton: { 
    width: 40, height: 50, justifyContent: 'center', alignItems: 'center', 
    borderLeftWidth: 1, borderLeftColor: '#1F2A44', marginLeft: 5 
  },

  // Modal / Dropdown Customizado com suporte a rolagem interna
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.panel, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  modalTitle: { color: COLORS.primary, fontSize: 22, fontWeight: 'bold' },
  modalSub: { color: COLORS.textMuted, fontSize: 13, marginBottom: 20, lineHeight: 18 },
  templateOption: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, 
    padding: 15, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#1F2A44' 
  },
  templateIcon: { width: 45, height: 45, borderRadius: 10, backgroundColor: '#1F2A44', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  templateName: { color: COLORS.text, fontSize: 15, fontWeight: 'bold' },
  templateLoc: { color: COLORS.textMuted, fontSize: 12, marginTop: 2 }
});