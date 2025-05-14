import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
    },
    mainRow: {
      flexDirection: 'row',
      flex: 1,
      padding: 20,
    },
    alertPanel: {
      flex: 1,
      marginRight: 20,
      backgroundColor: '#D9D9D9',
      borderRadius: 10,
      padding: 10,
      minWidth: 350,
      maxWidth: width * 1.3,
    },
    tabHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    tabText: {
      flex: 1,
      fontSize: 18,
      fontWeight: 'bold',
      paddingVertical: 8,
      paddingHorizontal: 12,
      textAlign: 'center',
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      color: '#333',
    },
    activeTab: {
      backgroundColor: '#5c87b2',
      color: '#FFFFFF',
    },
    inactiveTab: {
      backgroundColor: '#999999',
      color: '#FFFFFF',
    },
    tabContent: {
      flex: 1,
      backgroundColor: '#5c87b2',
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      padding: 10,
      width: '100%',
    },
    checkboxPosition: {
      position: 'absolute',
      top: 10,
      left: 10,
    },
    alertList: {
      flex: 1,
      width: '100%',
    },
    noAlerts: {
      fontStyle: 'italic',
      textAlign: 'center',
      marginTop: 20,
      color: '#FAFAFA',
    },
    alertItem: {
      backgroundColor: '#eee',
      padding: 10,
      borderRadius: 5,
      marginBottom: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      position: 'relative', 
    },
    alertText: {
      fontSize: 16,
      color: '#FAFAFA',
    },
    alertTextActive: {
      fontSize: 16,
      color: '#333',
    },
    alertTime: {
      fontStyle: 'italic',
      fontSize: 16,
    },
    clockWrapper: {
      flexShrink: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    digitalTime: {
      marginTop: 12,
      fontSize: 30,
      fontWeight: 'bold',
      color: '#333',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 20,
    },
    button: {
      paddingVertical: 8,
      paddingHorizontal: 25,
      borderRadius: 8,
      marginLeft: 10,
    },
    buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    },
    modalOverlay: {
      position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    },
    modalContainer: {
      width: 300,
      padding: 20,
      backgroundColor: "white",
      borderRadius: 10,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
    },
    modalInput: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      height: 80,
      padding: 10,
      marginBottom: 15,
      textAlignVertical: 'top',
    },
    modalButtonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 20,
    },
    modalButtons: {
      flex: 1,
      paddingVertical: 12,
      alignItems: "center",
      borderRadius: 8,
      marginHorizontal: 5,
    },
    cancelButton: {
      backgroundColor: "#5c87b2",
    },
    confirmButton: {
      backgroundColor: "#999999",
    },
    modalButton: {
      fontSize: 16,
      fontWeight: "bold",
      color: "white",
    },
  });

  export default styles;