import { StyleSheet, Dimensions } from "react-native";

const { height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#F8F8F8",
    height: "100%"
  },
  content: {
    flex: 1,
    marginLeft: 70,
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  header: {
    paddingTop: 20,
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  searchSortContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    height: 45,
    borderColor: "#000000",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    marginRight: 12,
    backgroundColor: "#FFFFFF",
    fontSize: 16,
    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
    elevation: 2,
  },
  sortButton: {
    backgroundColor: "#4E84D3",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
    elevation: 2,
  },
  sortButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  table: {
    flex: 1,
    marginTop: 20,
    backgroundColor: "#F8F8F8",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#000000",
    overflow: "hidden",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F8F8F8",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#000000",
  },
  tableHeaderCellID: {
    flex: 0.34,
    alignItems: "center",
    justifyContent: "center",
  },
  tableHeaderCellName: {
    flex: 0.66,
    alignItems: "center",
    justifyContent: "center",
  },
  tableHeaderText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  newPatientButton: {
    backgroundColor: "#4E84D3",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 180,
    marginTop: 40,
  },
  newPatientButtonText: {
    color: "#F8F8F8",
    fontSize: 18,
    fontWeight: "bold",
  },

  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000000",
    minHeight: 35,
  },
  rowCellID: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  rowCellName: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  rowDivider: {
    width: 2,
    backgroundColor: "#000000",
    alignSelf: "stretch",
  },
  rowText: {
    fontSize: 16,
  },
  rowTextCentered: {
    fontSize: 16,
    flex: 1,
    textAlign: "center",
  },
});
