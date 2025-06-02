import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const isTablet = width > 900;

export const styles = StyleSheet.create({
  container: {
    flex: 1, 
    flexDirection: "row", 
    backgroundColor: "#f0f0f0",
    color: "#000000", 
  },
  mainContent: { 
    flex: 1, 
    padding: 20 
  },
  boldLabel: { 
    fontWeight: "bold", 
    fontSize: 14, 
    marginTop: 10,
    color: "#000000", 
  },
  headerButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  backButton: {
    backgroundColor: "#808080",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  UpdateButton: {
    backgroundColor: "#4E84D3",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  deactivateButton: {
    backgroundColor: "#D9534F",
    padding: 10,
    borderRadius: 5,
  },
  patientId: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  infoContainer: {
    flexDirection: "row",
    backgroundColor: "#b8cbdb",
    padding: 15,
    borderRadius: 8,
    maxHeight: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  detailsSection: {
    flex: 1.5,
    paddingHorizontal: 10,
    maxHeight: 300,
    overflow: "hidden",
  },
  subsdetailsSection: {
    flex: 1.5,
    paddingHorizontal: 10,
    maxHeight: 300,
    overflow: "hidden",
  },
  
  subdetailsSection: {
    flex: 2.3,
    paddingHorizontal: 10,
    maxHeight: 300,
    overflow: "hidden",
  },
  divider: { width: 1, backgroundColor: "gray", marginHorizontal: 10 },
  dividers: { width: 1, marginHorizontal: 10 },

  sectionTitle: { fontWeight: "bold", fontSize: 20, marginBottom: 5 },
  medicationToggleButton: {
    backgroundColor: "#5879A5",
    padding: 10,
    alignItems: "flex-start",
    borderRadius: 5,
    marginTop: 15,
    alignSelf: "flex-start",
    marginLeft: 0,
  },
  buttonText: {
    fontWeight: "bold",
    paddingHorizontal: 10, 
    color: "#F8F8F8",
  },
  deactbuttonText: { 
    fontWeight: "bold",
    paddingHorizontal: 10, 
    color: "#F8F8F8" 
  },
  tableContainer: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#808080",
    borderRadius: 8,
    maxHeight: 600,
    overflow: "hidden",
  },
  tableHeader: {
    fontSize: 1,
    backgroundColor: "#F8F8F8",
    flexDirection: "row",
    alignItems: "center",
  },
  tableHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
  },
  row: { 
    borderColor: "#808080",
  },
  buttonWrapper: { 
    alignItems: "flex-end", 
    marginTop: 10, 
    marginBottom: 30,
  },
  addMedicationButton: {
    backgroundColor: "#4E84D3",
    paddingHorizontal: 10,
    borderRadius: 7,
    color: "#FFFFFF",
  },
  searchBarColumn:{
    paddingVertical: 21,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#999999",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    width: 140,
    height: 25,
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
    top: 0,
    right: 40,
    backgroundColor: "#FFFFFF",
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
  rowText: {
    fontSize: 14,
    color: "#000000",
  },
});
  
export default styles;