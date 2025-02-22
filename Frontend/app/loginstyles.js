import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const isTablet = width > 900;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    padding: 20,
    flexDirection: "column",
  },
  roleContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 50,
    width: "100%",
  },
  roleButton: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007bff",
    paddingVertical: 15, 
    paddingHorizontal: 30, 
    borderRadius: 15,
    marginBottom: 10,
    width: width * 0.6,
  },    
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginTop: 5,
    borderRadius: 5,
    width: "80%",
    maxWidth: 400,
    textAlign: "center",
  },    
  sidebar: {
    width: isTablet ? 100 : 75,
    backgroundColor: "#E0E0E0",
    alignItems: "center",
    paddingVertical: 20,
  },
  icon: {
    marginVertical: 20,
  },
  iconClock: {
    marginRight: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  mainContent: {
    flex: 4,
    paddingHorizontal: isTablet ? 80 : 20,
    paddingTop: isTablet ? 60 : 30,
  },
  title: {
    fontSize: isTablet ? 40 : 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "left",
  },
  listContainer: {
    flexGrow: 1,
  },
  card: {
    backgroundColor: "#E0E0E0",
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
    fontSize: isTablet ? 26 : 18,
    fontWeight: "bold",
  },
  time:{
    padding: 10,
    fontSize: isTablet ? 23 : 14,
    fontWeight: "bold",
  },
  changes: {
    fontSize: isTablet ? 22 : 16,
    color: "#666",
  },
  button: {
    backgroundColor: "#D9D9D9",
    paddingVertical: isTablet ? 15 : 10,
    paddingHorizontal: isTablet ? 30 : 20,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: isTablet ? 22 : 16,
    fontWeight: "bold",
  },
  backButton: {
    backgroundColor: "#BDBDBD",
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
  modalDate: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    alignItems: "flex-start",
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 5,
    alignItems: "center",
  },
  modalText: {
    fontSize: 14,
    color: "#333",
    textAlign: "left",
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: "#ccc",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: "flex-start",
    width: "30%",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  logoContainer: {
    position: "absolute",
    bottom: 100,
    left: 100,
  },
  logo: {
    width: isTablet ? 200 : 150,
    height: isTablet ? 200 : 150,
    resizeMode: "contain",
  },
});

export default styles;