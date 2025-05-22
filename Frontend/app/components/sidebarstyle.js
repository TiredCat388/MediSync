import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const isTablet = width > 900;

const styles = StyleSheet.create({
  sidebar: {
    height: '100%',
    backgroundColor: "#e0e0e0",
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    position: 'absolute',
    zIndex: 999,
    flexDirection: 'column',
    width: isTablet ? 200 : 70, 
  },
  sidebarContent: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start', 
  },
  textContainer: {
    flex: 1, 
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    opacity: 0, 
    transition: 'opacity 1s',
    paddingTop: 40, 
  },
  iconsContainer: {
    width: 'auto',  
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 30,
    flexDirection: 'column',
  },
  
  iconLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 35,
    paddingLeft: 20,
  },

  activeItem: {
  backgroundColor: '#ffffff33', // translucent white
  width: '100%',
  padding: 10,
  alignSelf: 'center',
  },
  
  iconLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'gray',
    marginLeft: 10,
    opacity: 1,
    paddingLeft: 10,
  },
  logoContainer: {
    position: 'absolute',
    bottom: 10,
    width: 'auto',
    alignItems: 'center', 
    flexDirection: 'row',
  },
  logo: {
    width: 70,
    height: 70,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'gray',
    alignSelf: 'center', 
  },
  overlay: {
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
  cancelButton: {
    backgroundColor: "grey",
  },
  logoutButton: {
    backgroundColor: "#d9534f",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  subOptionContainer: {
    paddingLeft: 10,
    marginTop: -20,
    marginBottom: 20,
  },
  subOption: {
    padding: 15,
  },
  subOptionText: {
    color: '#D3E8F9',
    fontSize: 18,
    fontWeight: '600',
  },
  activesubItem: {
  backgroundColor: '#FFFFFF33',
  alignSelf: 'center',
  },
});

export default styles;