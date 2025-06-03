import {
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import Sidebar from "./components/sidebar";
import { useState, useEffect } from "react";
import { Provider } from "react-native-paper";
import Constants from 'expo-constants';
import { SafeAreaView } from "react-native-safe-area-context";
import AppText from './components/AppText';
import styles from './stylesheets/archivestyle';
import { FontAwesome5 } from '@expo/vector-icons';

const BASE_API = Constants.expoConfig.extra.BASE_API;

const TESTING_PATIENT = { id: "0123456", name: "TESTING PURPOSES ONLY" };

export default function PatientsDirectory() {
  const router = useRouter();
  const [patients, setPatients] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [sortAscending, setSortAscending] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch(`${BASE_API}/api/patients/`);
      const data = await response.json();
      const archivedPatients = data.filter((patient) => patient.is_archived);
      setPatients(
        archivedPatients.length > 0 ? archivedPatients : [TESTING_PATIENT]
      );
    } catch (error) {
      console.error("Error fetching patients:", error);
      setPatients([TESTING_PATIENT]);
    }
  };

  const formatName = (firstName, middleName, lastName) => {
    const formattedLastName = lastName.toUpperCase();
    const formattedFirstName = firstName;
    const formattedMiddleInitial = middleName ? `${middleName.charAt(0)}.` : "";
    return `${formattedLastName}, ${formattedFirstName}${
      formattedMiddleInitial ? `, ${formattedMiddleInitial}` : ""
    }`;
  };

  // Filter + Sort
  const filteredAndSortedPatients = [...patients].filter((patient) => {
    const search = searchText.toLowerCase();
    const name = `${patient.first_name ?? ""} ${patient.middle_name ?? ""} ${
      patient.last_name ?? ""
    }`.toLowerCase();
    const id = (patient.patient_number + "").toLowerCase();
    return id.includes(search) || name.includes(search);
  });

  patients.sort(
    (a, b) =>
      (parseInt(a.patient_number) || 0) - (parseInt(b.patient_number) || 0)
  );

  const totalRows = 25;
  const displayedPatients = [...filteredAndSortedPatients];
  while (displayedPatients.length < totalRows) {
    displayedPatients.push({ id: "", name: "" });
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Provider>
        <View style={styles.container}>
          <Sidebar onNavigate={(destination) => router.push(destination)} />
          <View style={styles.content}>
            {/* Header and Button Row */}
            <View style={styles.headerRow}>
              <AppText style={styles.headerText}>
                Archive History
              </AppText>
            </View>

            {/* Search + Sort */}
            <View style={styles.searchSortContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search by name or patient number or date"
                placeholderTextColor="#666"
                value={searchText}
                onChangeText={setSearchText}
              />
              <TouchableOpacity
                onPress={() => setSortAscending(!sortAscending)}
                style={styles.sortButton}
              >
                <AppText style={styles.sortButtonText}>
                  Sort{"  "}
                  <FontAwesome5 name={sortAscending ? "arrow-up" : "arrow-down"} size={14} color="#fff" />
                </AppText>
              </TouchableOpacity>
            </View>

            {/* Table with ScrollView */}
            <View style={styles.table}>
              {/* Table Header */}
              <View style={styles.tableHeader}>
                <View style={styles.tableHeaderCellID}>
                  <AppText style={{ fontSize: 20, fontWeight: "bold" }}>
                    Patient ID
                  </AppText>
                </View>
                <View style={styles.tableHeaderCellName}>
                  <AppText style={{ fontSize: 20, fontWeight: "bold" }}>
                    Patient Name
                  </AppText>
                </View>
                <View style={styles.tableHeaderCellDate}>
                  <AppText style={{ fontSize: 20, fontWeight: "bold" }}>
                    Archived Date
                  </AppText>
                </View>
                <View style={styles.tableHeaderCellEmpty} />
              </View>
              {/* ScrollView for Table Rows */}
              <ScrollView>
                <FlatList
                  data={displayedPatients}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      disabled={!item.patient_number}
                      onPress={() => {
                        if (item.patient_number) {
                          router.push(
                            `/history?patient_number=${item.patient_number}`
                          );
                        }
                      }}
                      style={[
                        styles.row,
                        {
                          backgroundColor: item.patient_number
                            ? "white"
                            : "lightgrey",
                        },
                      ]}
                    >
                      {/* Patient ID */}
                      <View style={styles.rowCellID}>
                        <AppText style={styles.rowText}>
                          {item.patient_number || ""}
                        </AppText>
                      </View>

                      {/* Patient Name */}
                      <View style={styles.rowCellName}>
                        <AppText style={styles.rowTextCentered}>
                          {item.first_name && item.last_name
                            ? formatName(
                                item.first_name,
                                item.middle_name,
                                item.last_name
                              )
                            : ""}
                        </AppText>
                      </View>

                      {/* Archived Date */}
                      <View style={styles.rowCellDate}>
                        <AppText style={styles.rowText}>
                          {item.date_archived
                            ? new Date(item.date_archived).toLocaleString(
                                "en-PH",
                                {
                                  timeZone: "Asia/Manila",
                                }
                              )
                            : ""}
                        </AppText>
                      </View>

                      <View style={styles.rowCellEmpty} />
                    </TouchableOpacity>
                  )}
                />
              </ScrollView>
            </View>
          </View>
        </View>
      </Provider>
    </SafeAreaView>
  );
}
