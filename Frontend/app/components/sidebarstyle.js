import { StyleSheet, Dimensions } from "react-native";

// Check if it's a tablet (screen width greater than 900px)
const { width } = Dimensions.get("window");
const isTablet = width > 900;

const styles = StyleSheet.create({
  sidebar: {
    height: '100%',
    backgroundColor: "#e0e0e0",
    justifyContent: 'flex-start',
    alignItems: 'flex-start', // Keep items aligned to the start for consistency
    position: 'absolute',
    zIndex: 999,
    flexDirection: 'column',
    width: isTablet ? 200 : 70, // Adjust width based on tablet or not
  },
  sidebarContent: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start', // Keep items aligned to the start for consistency
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
    alignItems: 'flex-start', // Align items to the left
    paddingTop: 30,
    paddingLeft: 20, 
    flexDirection: 'column',
  },
  
  iconLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 35,
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
    alignItems: 'center', // Keep logo centered horizontally
    flexDirection: 'row',
  },
  logo: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
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
    backgroundColor: "#ccc",
  },
  logoutButton: {
    backgroundColor: "#d9534f",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});

export default styles;