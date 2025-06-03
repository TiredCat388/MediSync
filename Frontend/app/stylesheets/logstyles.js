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
});

export default styles;