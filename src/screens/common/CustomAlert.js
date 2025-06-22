// src/components/common/CustomAlert.js
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CustomAlert = ({ message, onConfirm, onCancel, type = 'info', visible = false }) => {
  // A condição para renderizar o componente agora depende APENAS da prop 'visible'.
  // Se 'visible' for false, o componente não será renderizado, nem mesmo o Modal.
  if (!visible) return null; //

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible} // <-- CORREÇÃO AQUI: REMOVIDO || !!message
      onRequestClose={onCancel || onConfirm || (() => {})}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={type === 'error' ? styles.alertErrorText : styles.alertInfoText}>{message}</Text>
          <View style={styles.modalActions}>
            {onCancel && (
              <TouchableOpacity style={[styles.modalButton, styles.modalCancelButton]} onPress={onCancel}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
            )}
            {onConfirm && (
              <TouchableOpacity style={[styles.modalButton, styles.modalConfirmButton]} onPress={onConfirm}>
                <Text style={styles.modalButtonText}>Ok</Text>
              </TouchableOpacity>
            )}
            {/* Se nem onConfirm nem onCancel forem passados, exibe um botão "Fechar" */}
            {!onConfirm && !onCancel && (
              <TouchableOpacity style={[styles.modalButton, styles.modalConfirmButton]} onPress={onCancel || (() => {})}>
                <Text style={styles.modalButtonText}>Fechar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', },
  modalContent: { backgroundColor: '#ffffff', borderRadius: 10, padding: 25, margin: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5, width: '80%', },
  alertInfoText: { fontSize: 18, marginBottom: 20, textAlign: 'center', color: '#343a40', },
  alertErrorText: { fontSize: 18, marginBottom: 20, textAlign: 'center', color: '#dc3545', fontWeight: 'bold', },
  modalActions: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', },
  modalButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5, minWidth: 100, alignItems: 'center', },
  modalConfirmButton: { backgroundColor: '#007bff', },
  modalCancelButton: { backgroundColor: '#6c757d', },
  modalButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, },
});

export default CustomAlert;