import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const isTablet = width > 900;

const styles = StyleSheet.create({
  sidebar: {
    height: '100%',
    paddingVertical: 10,
    backgroundColor: "#5879A5",
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
    width: '100%',  
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  iconLabelContainer: {
    paddingVertical: 15,
    paddingLeft: 25,
    flexDirection: 'row',
    color: '#f8f8f8',
    alignItems: 'center',
  },
  iconLabel: {
    fontSize: 18,
    opacity: 1,
    fontWeight: 'bold',
    color: "white",
    paddingLeft: 15,
  },
  logoContainer: {
    position: 'absolute',
    bottom: 5,
    alignItems: 'center', 
    flexDirection: 'row',
    marginLeft: 15,
  },
  logo: {
    width: 40,
    height: 40,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F8F8F8F',
    alignSelf: 'center', 
    paddingLeft: 15,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  overlayBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 998,
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
  cancelButton: {
    backgroundColor: "grey",
  },
  logoutButton: {
    backgroundColor: "#d9534f",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#F8F8F8",
  },
  subOptionContainer: {
    marginBottom: 10,
  },
  subOption: {
    paddingVertical: 10,
    marginBottom: 5,
    paddingHorizontal: 45,
  },
  subOptionText: {
    color: "#F8F8F8",
    fontSize: 18,
    fontWeight: '600',
  },
  activeItem: {
    width: "100%",
    backgroundColor: "#00000033",
    },
  activesubItem: {
    backgroundColor: '#00000033',
    width: "100%",
  },
});

export default styles;