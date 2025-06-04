import {
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import Sidebar from "./components/sidebar";
import { useState, useEffect } from "react";
import { Provider } from "react-native-paper";
import styles from "./stylesheets/directorystyles";
import Constants from 'expo-constants';
import { SafeAreaView } from "react-native-safe-area-context";
import AppText from './components/AppText';
import { FontAwesome5 } from '@expo/vector-icons';

const BASE_API = Constants.expoConfig.extra.BASE_API;

const { height } = Dimensions.get('window');
const TABLE_HEIGHT = height-200;

export default function PatientsDirectory() {
  const router = useRouter();
  const [patients, setPatients] = useState([]);
  const [visibleMenu, setVisibleMenu] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [sortAscending, setSortAscending] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  const TESTING_PATIENT = {
  patient_number: "000000",
  first_name: "Test",
  middle_name: "T",
  last_name: "Patient",
  is_archived: false,
};

  const fetchPatients = async () => {
    try {
      const response = await fetch(`${BASE_API}/api/patients/`);
      const data = await response.json();

      const activePatients = data.filter((patient) => !patient.is_archived);

      setPatients(
        activePatients.length > 0 ? activePatients : [TESTING_PATIENT]
      );
    } catch (error) {
      // On error, use the testing patient
      setPatients([TESTING_PATIENT]);
      console.error("Error fetching patients:", error);
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
    <SafeAreaView style={{ flex: 1 }}>
    <Provider>
      <View style={styles.container}>
        <Sidebar onNavigate={(destination) => router.push(destination)} />
        <View style={styles.content}>
          <View style={styles.header}>
            <AppText style={[ styles.headerText ]}>Patients Directory</AppText>
            <TouchableOpacity
              onPress={() => router.push("/registernew")}
              style={styles.newPatientButton}>
              <AppText style={styles.newPatientButtonText}>+ New Patient</AppText>
            </TouchableOpacity>
          </View>

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
              <AppText style={styles.sortButtonText}>
                Sort{"  "}
                <FontAwesome5 name={sortAscending ? "arrow-up" : "arrow-down"} size={14} color="#fff" />
              </AppText>
            </TouchableOpacity>
          </View>

          {/* Table with ScrollView */}
          <View style={[styles.table]}>
            <View style={styles.tableHeader}>
              <View style={[styles.tableHeaderCellID]}>
                <AppText style={styles.tableHeaderText}>Patient ID</AppText>
              </View>
              <View style={[styles.tableHeaderCellName]}>
                <AppText style={styles.tableHeaderText}>Patient Name</AppText>
              </View>
            </View>
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
                      <AppText style={styles.rowText}>
                        {item.patient_number || ""}
                      </AppText>
                    </View>
                    <View style={styles.rowDivider} />
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
                  </TouchableOpacity>
                )}
              />
          </View>
        </View>
      </View>
    </Provider>
    </SafeAreaView>
  );
}