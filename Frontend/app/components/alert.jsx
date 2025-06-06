import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import AppText from './AppText';

const CustomAlert = ({
  visible,
  message,
  onClose,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Okay",
}) => (
  <Modal
    animationType="fade"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <AppText style={styles.modalText}>{message}</AppText>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onClose}
          >
            <AppText style={styles.extStyle}>{cancelText}</AppText>
          </TouchableOpacity>
          {onConfirm && (
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={onConfirm}
            >
              <AppText style={styles.textStyle}>{confirmText}</AppText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "block",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 10,
    backgroundColor: "#F8F8F8",
    borderRadius: 10,
    padding: 20,
    width: 600,
    alignItems: "center",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    color: "black",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    elevation: 2,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#999999",
  },

  textStyle: {
    color: "#F8F8F8",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default CustomAlert;
