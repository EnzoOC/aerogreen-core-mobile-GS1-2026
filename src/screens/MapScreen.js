// src/screens/MapScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

const NODES = [
  { id: '1', name: 'Módulo Lunar Alfa', orbita: 'Lua', top: '25%', left: '30%', ping: '120ms', status: 'Sinal Estável' },
  { id: '2', name: 'Doma 04 - Marineris', orbita: 'Marte', top: '75%', left: '65%', ping: '950ms', status: 'Latência Alta' },
  { id: '3', name: 'Base Atacama', orbita: 'Terra', top: '50%', left: '45%', ping: '12ms', status: 'Sinal Excelente' },
];

export default function MapScreen() {
  const [selectedNode, setSelectedNode] = useState(null);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>RADAR DE TELEMETRIA IOT</Text>

      {/* Interface do Radar */}
      <View style={styles.radarContainer}>
        <View style={styles.ring1}>
          <View style={styles.ring2}>
            <View style={styles.ring3} />
          </View>
        </View>

        {/* Linhas de Mira do Radar */}
        <View style={styles.crosshairVertical} />
        <View style={styles.crosshairHorizontal} />

        {/* Renderizando os Marcadores */}
        {NODES.map((node) => (
          <TouchableOpacity
            key={node.id}
            style={[styles.markerBase, { top: node.top, left: node.left }]}
            onPress={() => setSelectedNode(node)}
          >
            <View style={[styles.markerDot, selectedNode?.id === node.id && styles.markerSelected]} />
            <Text style={styles.markerLabel}>{node.orbita}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tooltip / Painel de Informação IoT */}
      <View style={styles.infoPanel}>
        {selectedNode ? (
          <>
            <View style={styles.infoRow}>
              <Ionicons name="planet" size={24} color={COLORS.primary} />
              <Text style={styles.infoTitle}>{selectedNode.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="wifi" size={20} color={COLORS.textMuted} />
              <Text style={styles.infoText}>Status IoT: <Text style={{color: COLORS.primary}}>{selectedNode.status}</Text></Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="pulse" size={20} color={COLORS.textMuted} />
              <Text style={styles.infoText}>Ping de Resposta: <Text style={{color: COLORS.status.alerta}}>{selectedNode.ping}</Text></Text>
            </View>
          </>
        ) : (
          <Text style={styles.placeholderText}>Selecione um nó orbital no radar para visualizar o status da conexão IoT.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, alignItems: 'center', paddingTop: 20 },
  header: { color: COLORS.textMuted, fontSize: 14, letterSpacing: 2, marginBottom: 40 },
  radarContainer: {
    width: 300, height: 300, justifyContent: 'center', alignItems: 'center', position: 'relative'
  },
  ring1: { width: 300, height: 300, borderRadius: 150, borderWidth: 1, borderColor: '#1F2A44', justifyContent: 'center', alignItems: 'center' },
  ring2: { width: 200, height: 200, borderRadius: 100, borderWidth: 1, borderColor: '#1F2A44', justifyContent: 'center', alignItems: 'center' },
  ring3: { width: 100, height: 100, borderRadius: 50, borderWidth: 1, borderColor: COLORS.primary, opacity: 0.5 },
  crosshairVertical: { position: 'absolute', width: 1, height: 300, backgroundColor: '#1F2A44' },
  crosshairHorizontal: { position: 'absolute', width: 300, height: 1, backgroundColor: '#1F2A44' },
  markerBase: { position: 'absolute', alignItems: 'center', justifyContent: 'center', width: 50, height: 50, marginLeft: -25, marginTop: -25 },
  markerDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.status.normal, shadowColor: COLORS.status.normal, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 10, elevation: 5 },
  markerSelected: { backgroundColor: COLORS.primary, transform: [{ scale: 1.5 }] },
  markerLabel: { color: COLORS.text, fontSize: 10, marginTop: 4, fontWeight: 'bold' },
  infoPanel: {
    width: '90%', backgroundColor: COLORS.panel, padding: 20, borderRadius: 12,
    marginTop: 50, borderWidth: 1, borderColor: '#1F2A44', minHeight: 120, justifyContent: 'center'
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
  infoTitle: { color: COLORS.text, fontSize: 18, fontWeight: 'bold' },
  infoText: { color: COLORS.textMuted, fontSize: 14 },
  placeholderText: { color: COLORS.textMuted, textAlign: 'center', fontStyle: 'italic', lineHeight: 22 }
});