import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  ScrollView, // Import ScrollView
} from "react-native";
import { useRouter } from "expo-router";
import Sidebar from "./components/sidebar";
import { useState, useEffect } from "react";
import { Menu, Divider, Provider } from "react-native-paper";
import styles from "./stylesheets/directorystyles";
import Constants from 'expo-constants';

const BASE_API = Constants.expoConfig.extra.BASE_API;

const TESTING_PATIENT = {
  patient_number: "0123456",
  first_name: "TESTING",
  middle_name: "ABC",
  last_name: "PURPOSES ONLY",
};

export default function PatientsDirectory() {
  const router = useRouter();
  const [patients, setPatients] = useState([]);
  const [visibleMenu, setVisibleMenu] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [sortAscending, setSortAscending] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch(`${BASE_API}/api/patients/`);
      const data = await response.json();

      const activePatients = data.filter((patient) => !patient.is_archived);

      setPatients(
        activePatients.length > 0 ? activePatients : [TESTING_PATIENT]
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
      formattedMiddleInitial ? ` ${formattedMiddleInitial}` : ""
    }`;
  };

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
    <Provider>
      <View style={styles.container}>
        <Sidebar onNavigate={(destination) => router.push(destination)} />
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Patients Directory</Text>
            <TouchableOpacity
              onPress={() => router.push("/registernew")}
              style={styles.newPatientButton}
            >
              <Text style={styles.newPatientButtonText}>+ New Patient</Text>
            </TouchableOpacity>
          </View>

          {/* Search + Sort */}
          <View style={styles.searchSortContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name or patient number"
              placeholderTextColor="#666"
              value={searchText}
              onChangeText={setSearchText}
            />
            <TouchableOpacity
              onPress={() => setSortAscending(!sortAscending)}
              style={styles.sortButton}
            >
              <Text style={styles.sortButtonText}>
                Sort {sortAscending ? "↑" : "↓"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Table with ScrollView */}
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <View style={[styles.tableHeaderCellID]}>
                <Text style={styles.tableHeaderText}>Patient ID</Text>
              </View>
              <View style={[styles.tableHeaderCellName]}>
                <Text style={styles.tableHeaderText}>Patient Name</Text>
              </View>
            </View>
            <ScrollView style={{ maxHeight: 500 }}>
              {/* Added maxHeight for visual scroll */}
              <FlatList
                data={displayedPatients}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() =>
                      item.patient_number &&
                      router.push(
                        `/viewpatient?patient_number=${item.patient_number}`
                      )
                    }
                    style={[
                      styles.row,
                      {
                        backgroundColor: item.patient_number
                          ? "white"
                          : "lightgrey",
                      },
                    ]}
                  >
                    <View style={styles.rowCellID}>
                      <Text style={styles.rowText}>
                        {item.patient_number || ""}
                      </Text>
                    </View>
                    <View style={styles.rowDivider} />
                    <View style={styles.rowCellName}>
                      <Text style={styles.rowTextCentered}>
                        {item.first_name && item.last_name
                          ? formatName(
                              item.first_name,
                              item.middle_name,
                              item.last_name
                            )
                          : ""}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </ScrollView>
          </View>
        </View>
      </View>
    </Provider>
  );
}