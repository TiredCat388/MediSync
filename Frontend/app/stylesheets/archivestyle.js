import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#F8F8F8",
  },
  content: {
    flex: 1,
    marginLeft: 70,
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    paddingTop: 20,
    fontSize: 30,
    fontWeight: "bold",
  },
  searchSortContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  searchInput: {
    flex: 1,
    height: 45,
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    marginRight: 12,
    backgroundColor: "#fff",
    fontSize: 16,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    // Elevation for Android
    elevation: 2,
  },
  sortButton: {
    backgroundColor: "#5c87b2",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    // Elevation for Android
    elevation: 2,
  },
  sortButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  table: {
    flex: 0.95,
    marginTop: 20,
    backgroundColor: "#F8F8F8",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#000000",
    overflow: "hidden",
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    // Elevation for Android
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
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tableHeaderCellName: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  tableHeaderCellDate: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  tableHeaderCellEmpty: {
    width: 50,
  },
  row: {
    flexDirection: "row",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderColor: "black",
    minHeight: 35,
  },
  rowCellID: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderColor: "black",
    paddingHorizontal: 5,
  },
  rowCellName: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderColor: "black",
    paddingHorizontal: 5,
  },
  rowCellDate: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "black",
    paddingHorizontal: 5,
  },
  rowCellEmpty: {
    width: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  rowText: {
    fontSize: 15,
  },
  rowTextCentered: {
    fontSize: 15,
    textAlign: "center",
  },
});