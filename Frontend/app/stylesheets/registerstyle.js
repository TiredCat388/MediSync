import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isTablet = width > 900;
const sidebarWidth = isTablet ? 200 : 70; 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#f8f8f8",
  },
  contentContainer: {
    flex: 1,
    marginLeft: sidebarWidth,
    padding: 30,
  },
  screenTitle: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "left",
  },
  formContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#b8cbdb",
    padding: 20,
    borderRadius: 10,
    justifyContent: "space-between",
    maxHeight: 520,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  column: {
    flex: 1,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
    marginTop: 10,
  },
  sectionsubTitle: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 15,
    marginTop: 50,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    borderColor: "black",
    backgroundColor: "#F8F8F8",
    padding: 8,
    marginBottom: 10,
    height: 38,
  },
  dobContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  dobInput: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "black",
    backgroundColor: "white",
    padding: 8,
    width: 50,
    marginRight: 5,
    textAlign: "center",
  },
  dobSelect: {
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "white",
    paddingHorizontal: 70,
    width: 60,
    marginRight: 8,
    textAlign: "center",
    fontSize: 18,
    borderRadius: 8,
  },
  dobSelectContainer: {
    flexDirection: "row",
    marginBottom: 10,
    justifyContent: "space-between",
  },
  dobSelectLabel: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: "bold",
  },
  dobSelectDropdown: {
    width: "100%",
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CCCCCC",
  },
  dobSelectOption: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 18,
  },
  dobSelectOptionSelected: {
    backgroundColor: "#4e84d3",
    color: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 15,
    marginRight: -5,
    justifyContent: "flex-end",
  },
  button: {
    width: 211,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#F8F8F8",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: 150,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    marginBottom: 20,
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
  stayButton: {
    backgroundColor: "#5879A5",
  },
  leaveButton: {
    backgroundColor: "#999999",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  divider: {
    width: 2,
    backgroundColor: "gray",
    marginVertical: 5,
    marginHorizontal: 30,
    alignSelf: "stretch",
  },
  heightRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  heightInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 0, 
  },
  heightInput: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "black",
    backgroundColor: "white",
    padding: 8,
    width: 100,
    textAlign: "center",
  },
  unitLabel: {
    marginLeft: 5,
    fontSize: 16,
    color: "black",
  },
  ageInput: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "black",
    backgroundColor: "white",
    padding: 8,
    marginBottom: 5,
    width: 50, 
    textAlign: "left", 
  },
  weightRow: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 10,
  },
  weightInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  weightInput: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "black",
    backgroundColor: "white",
    padding: 8,
    width: 100, 
    textAlign: "center",
  },
  unitLabel: {
    marginLeft: 5,
    fontSize: 16,
    color: "black",
  },
  inlineContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  inlineItem: {
    flex: 1,
    marginHorizontal: 0, 
  },
  chiefComplaintInput: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "black",
    backgroundColor: "white",
    padding: 10,
    marginBottom: 10,
    height: 100, 
    textAlignVertical: "top", 
  },

  diagnosisInput: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "black",
    backgroundColor: "white",
    padding: 10,
    marginBottom: 10,
    height: 100, 
    textAlignVertical: "top", 
  },
});

export default styles;