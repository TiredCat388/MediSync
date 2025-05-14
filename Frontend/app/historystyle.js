import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const isTablet = width > 900;

export const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row", backgroundColor: "#f0f0f0" },
  mainContent: { flex: 1, padding: 20 },
  boldLabel: { fontWeight: "bold", fontSize: 16, marginTop: 10 },
  headerButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  backButton: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  
  activateButton: {
    backgroundColor: "#5879a5",
    padding: 10,
    borderRadius: 5,
  },
  patientId: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  infoContainer: {
    flexDirection: "row",
    backgroundColor: "#e0e0e0",
    padding: 15,
    borderRadius: 8,
  },
  detailsSection: { flex: 1, paddingHorizontal: 10 },
  divider: { width: 1, backgroundColor: "gray", marginHorizontal: 10 },
  sectionTitle: { fontWeight: "bold", fontSize: 20, marginBottom: 5 },
  medicationToggleButton: {
    backgroundColor: "#5879a5",
    padding: 10,
    alignItems: "flex-start",
    borderRadius: 5,
    marginTop: 15,
    alignSelf: "flex-start",
    marginLeft: 0,
  },
  buttonText: {
    fontWeight: "bold",
    color: "white",
  },
  activatebuttonText: { fontWeight: "bold", color: "white" },
  tableContainer: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    maxHeight: 600,
    overflow: "hidden",
  },
  tableHeader: {
    backgroundColor: "#f6f6f6",
    flexDirection: "row",
    alignItems: "center",
  },
  row: { borderBottomWidth: 2, borderColor: "#ccc" },
  buttonWrapper: { alignItems: "flex-end", marginTop: 10 },
  addMedicationButton: {
    backgroundColor: "#5879a5",
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 10,
    fontSize: 14,
    width: 140,
    height: 24.5,
  },

  columnId: {
    flex: 1.2,
  },

  columnName: {
    flex: 1.2,
  },

  columnTime: {
    flex: 1.2,
  },

  columnNotes: {
    flex: 3,
  },

  columnActions: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },

  popupMenu: {
    position: "absolute",
    top: 30,
    right: 0,
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    elevation: 10,
    zIndex: 9999,
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
    width: 130,
  },

  menuItem: {
    paddingVertical: 8,
  },

  menuItemText: {
    fontSize: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },

  updateText: {
    color: "#000",
    fontWeight: "500",
  },

  deleteText: {
    color: "#",
    fontWeight: "500",
  },
});
  
export default styles;