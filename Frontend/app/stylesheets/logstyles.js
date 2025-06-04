import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
container: {
  flex: 1,
  flexDirection: "row",
  backgroundColor: "#F8F8F8",
},
mainContent: {
  flex: 1,
  paddingHorizontal: 40,
  paddingBottom: 40,
},
header: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},
headerText: {
  paddingTop: 20,
  fontSize: 30,
  fontWeight: "bold",
  marginBottom: 20,
},
listContainer: {
  flexGrow: 1,
},
card: {
  backgroundColor: "#CCCCCC",
  borderRadius: 15,
  padding: 20,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 15,
  width: "100%",
},
cardContent: {
  flex: 1,
},
noLogsText: {
  fontSize: 16,
},
date: {
  fontSize: 18,
  marginLeft: 10,
  fontWeight: "bold",
},
time: {
  fontSize: 18,
  fontWeight: "bold",
},
changes: {
  fontSize: 16,
  color: "#808080",
  marginTop: 5,
},
button: {
  backgroundColor: "#CCCCCC",
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 8,
},
buttonText: {
  fontWeight: "bold",
},
backButton: {
  backgroundColor: "#CCCCCC",
  paddingVertical: 12,
  paddingHorizontal: 40,
  alignItems: "center",
  borderRadius: 10,
  marginTop: 20,
  alignSelf: "flex-end",
},
backButtonText: {
  fontSize: 18,
  fontWeight: "bold",
},
modalContainer: {
  flex: 1,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  justifyContent: "center",
  alignItems: "center",
},
modalContent: {
  fontSize: 16,
  backgroundColor: "#FFFFFF",
  padding: 20,
  borderRadius: 10,
  width: "80%",
},
modalTitle: {
  fontSize: 20,
  fontWeight: "bold",
  marginBottom: 10,
  alignItems: "flex-start",
},
modalID: {
  fontSize: 18,
},
modalText: {
  fontSize: 16,
  color: "#333",
  textAlign: "left",
  marginBottom: 10,
},
closeButton: {
  marginTop: 20,
  backgroundColor: "#CCCCCC",
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 5,
  alignSelf: "flex-end",
  width: "20%",
  alignItems: "center",
},
closeButtonText: {
  fontSize: 16,
  fontWeight: "bold",
},
modalButtonContainer: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 20,
},
modalButton: {
  flex: 1,
  paddingVertical: 12,
  alignItems: "center",
  borderRadius: 8,
  marginHorizontal: 5,
},
cancelButton: {
  backgroundColor: "#CCCCCC",
},
modalButtonText: {
  fontSize: 16,
  fontWeight: "bold",
  color: "#F8F8F8",
},
dateTimeContainer: {
  flexDirection: "row",
  alignItems: "center",

  },
  headerText: {
    paddingTop: 20,
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },
  listContainer: {
    flexGrow: 1,
  },
  card: {
    backgroundColor: "#CCCCCC",
    borderRadius: 18,
    padding: isTablet ? 20 : 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 25,
    width: "100%",
  },
  cardContent: {
    flex: 1,
  },
  date: {
    paddingLeft: 10,
    fontSize: isTablet ? 26 : 18,
    fontWeight: "bold",
  },
  time: {
    fontSize: isTablet ? 23 : 14,
    fontWeight: "bold",
  },
  changes: {
    fontSize: isTablet ? 22 : 16,
    color: "#666",
  },
  button: {
    backgroundColor: "#CCCCCC",
    paddingVertical: isTablet ? 15 : 10,
    paddingHorizontal: isTablet ? 30 : 20,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: isTablet ? 22 : 16,
    fontWeight: "bold",
  },
  backButton: {
    backgroundColor: "#CCCCCC",
    paddingVertical: 18,
    paddingHorizontal: isTablet ? 80 : 40,
    alignItems: "center",
    borderRadius: 10,
    marginTop: 30,
    alignSelf: "flex-end",
  },
  backButtonText: {
    fontSize: isTablet ? 24 : 18,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    width: isTablet ? "45%" : "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    alignItems: "flex-start",
  },
  modalText: {
    fontSize: 14,
    color: "#333",
    textAlign: "left",
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: "#D9534F",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: "flex-end",
    width: "30%",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    flex: 0,
    width: "45%",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#CCCCCC",
  },
  logoutButton: {
    backgroundColor: "#D9534F",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#F8F8F8",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 5,
  },
  
  cancelButton: {
    backgroundColor: "#CCCCCC",
  },
  
  logoutButton: {
    backgroundColor: "#D9534F",
  },
  
  modalButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#F8F8F8",
  },
  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default styles;