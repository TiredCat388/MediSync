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
import Constants from 'expo-constants';

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
    <Provider>
      <View
        style={{ flex: 1, flexDirection: "row", backgroundColor: "#f8f8f8" }}
      >
        <Sidebar onNavigate={(destination) => router.push(destination)} />
        <View style={{ flex: 1, marginLeft: 70, padding: 40 }}>
          {/* Header and Button Row */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 30, fontWeight: "bold"}}>
              Archive History
            </Text>
          </View>

          {/* Search + Sort */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <TextInput
              style={{
                flex: 1,
                height: 45,
                borderColor: "#000",
                borderWidth: 1,
                borderRadius: 10,
                paddingHorizontal: 14,
                marginRight: 12,
                backgroundColor: "#fff",
                fontSize: 16,
                boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
                elevation: 2,
              }}
              placeholder="Search by name or patient number or date"
              placeholderTextColor="#666"
              value={searchText}
              onChangeText={setSearchText}
            />
            <TouchableOpacity
              onPress={() => setSortAscending(!sortAscending)}
              style={{
                backgroundColor: "#5c87b2",
                paddingVertical: 10,
                paddingHorizontal: 16,
                borderRadius: 10,
                boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
                elevation: 2,
              }}
            >
              <Text style={{ fontSize: 16, color: "#fff", fontWeight: "600" }}>
                Sort {sortAscending ? "↑" : "↓"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Table with ScrollView */}
          <View
            style={{
              marginTop: 20,
              backgroundColor: "white",
              borderRadius: 15,
              borderWidth: 1,
              borderColor: "black",
              overflow: "hidden",
              maxHeight: 560, // Added maxHeight for table scroll
            }}
          >
            {/* Table Header */}
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "white",
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderColor: "black",
              }}
            >
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                  Patient ID
                </Text>
              </View>
              <View
                style={{
                  flex: 2,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                  Patient Name
                </Text>
              </View>
              <View
                style={{
                  flex: 2,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                  Archived Date
                </Text>
              </View>
              <View style={{ width: 50 }} />{" "}
              {/* Empty view for the removed button space */}
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
                    style={{
                      flexDirection: "row",
                      backgroundColor: item.patient_number
                        ? "white"
                        : "lightgrey",
                      borderBottomWidth: 1,
                      borderColor: "black",
                      minHeight: 35,
                    }}
                  >
                    {/* Patient ID */}
                    <View
                      style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRightWidth: 1,
                        borderColor: "black",
                        paddingHorizontal: 5,
                      }}
                    >
                      <Text style={{ fontSize: 15 }}>
                        {item.patient_number || ""}
                      </Text>
                    </View>

                    {/* Patient Name */}
                    <View
                      style={{
                        flex: 2,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRightWidth: 1,
                        borderColor: "black",
                        paddingHorizontal: 5,
                      }}
                    >
                      <Text style={{ fontSize: 15, textAlign: "center" }}>
                        {item.first_name && item.last_name
                          ? formatName(
                              item.first_name,
                              item.middle_name,
                              item.last_name
                            )
                          : ""}
                      </Text>
                    </View>

                    {/* Archived Date */}
                    <View
                      style={{
                        flex: 2,
                        alignItems: "center",
                        justifyContent: "center",
                        borderColor: "black",
                        paddingHorizontal: 5,
                      }}
                    >
                      <Text style={{ fontSize: 15 }}>
                        {item.date_archived
                          ? new Date(item.date_archived).toLocaleString(
                              "en-PH",
                              {
                                timeZone: "Asia/Manila",
                              }
                            )
                          : ""}
                      </Text>
                    </View>

                    <View
                      style={{
                        width: 50,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    />
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
