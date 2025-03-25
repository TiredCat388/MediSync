// import React from "react";
// import { View, StyleSheet } from "react-native";
// import { DataTable, Button, Text, Divider } from "react-native-paper";
// import { Feather } from "@expo/vector-icons"; // For the "..." icon

// const medicationData = [
//   { id: "0014CB", time: "01:00", notes: ["Notes for medication.", "Notes for medication."] },
//   { id: "0067CD", time: "02:00", notes: ["Notes for medication.", "Notes for medication."] },
//   { id: "0068CD", time: "13:00", notes: ["Notes for medication.", "Notes for medication."] },
//   { id: "0066BD", time: "17:00", notes: ["Notes for medication.", "Notes for medication."] },
// ];

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <View style={styles.tableContainer}>
//         {/* Table Header */}
//         <DataTable style={styles.table}>
//           <DataTable.Header style={styles.header}>
//             <DataTable.Title textStyle={styles.headerText} style={styles.cellSchedule}>Schedule ID</DataTable.Title>
//             <DataTable.Title textStyle={styles.headerText} style={styles.cellMedication}>Medication</DataTable.Title>
//             <DataTable.Title textStyle={styles.headerText} style={styles.cellTime}>Time</DataTable.Title>
//             <DataTable.Title textStyle={styles.headerText} style={styles.cellNotes}>Notes</DataTable.Title>
//             <DataTable.Title textStyle={styles.headerText} style={styles.cellAction}></DataTable.Title>
//           </DataTable.Header>

//           <Divider style={styles.divider} /> {/* Horizontal line below header */}

//           {/* Table Rows */}
//           {medicationData.map((item, index) => (
//             <View key={item.id}>
//               <DataTable.Row style={styles.row}>
//                 <DataTable.Cell style={styles.cellSchedule}>
//                   <Text style={styles.bold}>0012345AB - {item.id}</Text>
//                 </DataTable.Cell>
//                 <DataTable.Cell style={styles.cellMedication}>MedicineName</DataTable.Cell>
//                 <DataTable.Cell style={styles.cellTime}>{item.time}</DataTable.Cell>
//                 <DataTable.Cell style={styles.cellNotes}>
//                   <Text style={styles.noteText}>
//                     {item.notes.map(note => `• ${note}`).join("\n")}
//                   </Text>
//                 </DataTable.Cell>
//                 <DataTable.Cell style={styles.cellAction}>
//                   <Feather name="more-horizontal" size={20} color="black" />
//                 </DataTable.Cell>
//               </DataTable.Row>

//               {/* Divider between rows */}
//               {index < medicationData.length - 1 && <Divider style={styles.divider} />}
//             </View>
//           ))}
//         </DataTable>
//       </View>

//       {/* Add New Medication Button */}
//       <Button mode="contained" style={styles.button} onPress={() => alert("Add New Medication")}>
//         Add New Medication
//       </Button>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, backgroundColor: "white" },
//   tableContainer: { borderWidth: 1, borderColor: "black", borderRadius: 8, overflow: "hidden" },
//   table: { backgroundColor: "white" },
//   header: { backgroundColor: "white" },
//   headerText: { fontWeight: "bold", fontSize: 14, color: "black" },
//   row: { backgroundColor: "white" },
//   divider: { height: 1, backgroundColor: "black" },
//   bold: { fontWeight: "bold", color: "black" },
//   noteText: { fontSize: 12, color: "black", marginBottom: 4 }, // Notes stacked line by line
//   cellSchedule: { flex: 2.5, justifyContent: "center", borderRightWidth: 1, borderColor: "black", paddingHorizontal: 8 },
//   cellMedication: { flex: 2, justifyContent: "center", borderRightWidth: 1, borderColor: "black", paddingHorizontal: 8 },
//   cellTime: { flex: 1, justifyContent: "center", borderRightWidth: 1, borderColor: "black", paddingHorizontal: 8 },
//   cellNotes: { flex: 3, justifyContent: "center", borderRightWidth: 1, borderColor: "black", paddingHorizontal: 8 },
//   cellAction: { flex: 0.7, justifyContent: "center", alignItems: "center" },
//   button: { marginTop: 10, alignSelf: "flex-end", backgroundColor: "#1877F2" }, // Soft pastel blue
// });
