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
    padding: 40,
  },
  screenTitle: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "left",
  },
  formContainer: {
    flexDirection: "row",
    backgroundColor: "#CCCCCC",
    padding: 40,
    borderRadius: 10,
    justifyContent: "space-between",
    maxHeight: 600,
  },
  column: {
    flex: 1,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    marginTop: 10,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  PickerContainer: {
    flex: 1,
    height: 36,
    marginRight: 10,
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#F8F8F8",
    padding: 8,
    marginBottom: 10,
    height: 36,
    borderColor: "#ccc",
    color: "black",
    paddingRight: 30,
  },
  dobContainer: {
    flexDirection: "row",
  },
  dobInput: {
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "#F8F8F8",
    padding: 8,
    width: 50,
    marginRight: 5,
    textAlign: "center",
  },
  dobSelect: {
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "#F8F8F8",
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
    marginTop: 20,
    justifyContent: "flex-end",
  },
  button: {
    width: 200,
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
    color: "#F8F8F8",
  },
  divider: {
    width: 2,
    backgroundColor: "gray",
    marginVertical: 5,
    marginHorizontal: 30,
    alignSelf: "stretch",
  },
  autocompleteContainer: {
    flex: 1,
    zIndex: 10,
    width: 415,
    marginBottom: 10,
  },
});

export default styles;