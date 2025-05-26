import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
    },
    mainRow: {
      flexDirection: 'row',
      flex: 1,
      marginLeft: 70,
      paddingTop: 0,
      paddingHorizontal: 40,
    },
    alertPanel: {
      flex: 1,
      marginRight: 20,
      backgroundColor: '#CCCCCC',
      borderRadius: 10,
      padding: 10,
      minWidth: 350,
      maxWidth: width * 1.3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 8,
    },
    header: {
      paddingHorizontal: 40,
      paddingBottom: 20,
    },
    headerText: {
      fontSize: 30,
      fontWeight: "bold",
    },
    tabHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    tabText: {
      flex: 1,
      fontSize: 20,
      fontWeight: 'bold',
      paddingVertical: 8,
      paddingHorizontal: 12,
      textAlign: 'center',
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      color: '#333',
    },
    activeTab: {
      backgroundColor: '#5879A5',
      color: '#F8F8F8',
    },
    inactiveTab: {
      backgroundColor: '#999999',
      color: '#F8F8F8',
    },
    tabContent: {
      flex: 1,
      backgroundColor: '#5879A5',
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      padding: 10,
      width: '100%',
    },
    checkboxPosition: {
      alignSelf: 'flex-start',
      marginTop: 5,
      margineLeft: 5,
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
      color: '#333333',
    },
    alertTextActive: {
      fontSize: 16,
      color: '#333',
    },
    alertTime: {
      fontStyle: 'italic',
      fontSize: 16,
    },
    clockPanel: { 
      padding: 30,
      justifyContent: 'center',
      alignItems: 'center',
    },
    digitalTime: {
      marginTop: 12,
      fontSize: 30,
      fontWeight: 'bold',
      color: '#333',
    },
    tabButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 20,
    },
    tabButton: {
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
      backgroundColor: "#F8F8F8",
      borderRadius: 10,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
    },
    modalInput: {
      borderWidth: 1,
      borderColor: '#CCCCCC',
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
      backgroundColor: "#808080",
    },
    cancelButton: {
      backgroundColor: "#D9534F",
    },
    confirmButton: {
      backgroundColor: "#4E84D3",
    },
    modalButton: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#F8F8F8",
    },
  });

  export default styles;