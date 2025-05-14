import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isTablet = width > 900;
const sidebarWidth = isTablet ? 200 : 70; 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f8f8f8', 
  },
  contentContainer: {
    flex: 1,
    marginLeft: sidebarWidth, 
    padding: 40, 
  },
  screenTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left', 
  },
  formContainer: {
    flexDirection: 'row',
    backgroundColor: 'lightgrey',
    padding: 40,
    borderRadius: 10,
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 10, 
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 8,
    marginBottom: 10,
    fontSize: 16,
    minHeight: 40, 
    textAlignVertical: 'top',
  },
  dobContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  dobInput: {
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'white',
    padding: 8,
    width: 50,
    marginRight: 5,
    textAlign: 'center',
  },
  dobSelect: {
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'white',
    paddingHorizontal: 70,
    width: 60,
    height: 40,
    marginRight: 8,
    textAlign: 'center',
    fontSize: 18,
    borderRadius: 8,
  },
  dobSelectWeb: {
    width: 'auto', 
    minWidth: 80,
    height: 50,
    justifyContent: 'center', 
    alignItems: 'center',
  },  
  dobSelectContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-between', 
  },
  dobSelectLabel: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  dobSelectDropdown: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  dobSelectOption: {
    paddingVertical: 5, 
    paddingHorizontal: 10, 
    fontSize: 18,
  },
  dobSelectOptionSelected: {
    backgroundColor: '#4e84d3',
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'flex-end',
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
    color: 'white',
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
    backgroundColor: "#5879a5",
  },
  leaveButton: {
    backgroundColor: "#989898",
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
    alignSelf: 'stretch'
  },
  autocompleteContainer: {
    position: 'relative',
    zIndex: 0,
    marginBottom: 20,
  },
  autocompleteWrapper: {
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'white',
    padding: 8,
    fontSize: 16,
    minHeight: 40,
  },
  autocompleteInput: {
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'white',
    padding: 8,
    fontSize: 16,
    minHeight: 40,
  },
  autocompleteItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
  },
  autocompleteText: {
    fontSize: 16,
  },
  checkboxContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginVertical: 10,
  zIndex: 1,
  },
  checkbox: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: 'white',
  },
  checkboxSelected: {
    backgroundColor: 'black',
  },
  checkmark: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default styles;