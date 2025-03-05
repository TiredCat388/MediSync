import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isTablet = width > 900;
const sidebarWidth = isTablet ? 200 : 70; // Width when collapsed

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f8f8f8', 
  },
  contentContainer: {
    flex: 1,
    marginLeft: sidebarWidth, //prevents overlap with sidebar when collapsed
    padding: 40, 
  },
  screenTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left', //align text to the left
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
    backgroundColor: 'white',
    padding: 8,
    marginBottom: 10,
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
    borderColor: 'black', // Set the border color to black
    backgroundColor: 'white',
    paddingHorizontal: 70,
    width: 60, // Adjust width to your desired size
    marginRight: 8,
    textAlign: 'center',
    fontSize: 18,
    borderRadius: 8,
  },
  dobSelectContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-between', // Adjusts space between the dropdowns
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
    paddingVertical: 5, // Increased padding for better content fit
    paddingHorizontal: 10, // Increased horizontal padding
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
    backgroundColor: "#ccc",
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
});

export default styles;
