import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import Sidebar from "./components/sidebar";
import { useState, useEffect } from "react";
import { Menu, Divider, Provider } from "react-native-paper";

const TESTING_PATIENT = { id: "0123456", name: "TESTING PURPOSES ONLY" };

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
     const response = await fetch("http://127.0.0.1:8000/api/patients/");
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

  patients.sort((a, b) =>
    (a.patient_number ?? "")
      .toString()
      .localeCompare((b.patient_number ?? "").toString())
  );

  const totalRows = 12;
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
            <Text style={{ fontSize: 25, fontWeight: "bold" }}>
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
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }}
              placeholder="Search by name or patient number"
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
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <Text style={{ fontSize: 16, color: "#fff", fontWeight: "600" }}>
                Sort {sortAscending ? "↑" : "↓"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Table */}
          <View
            style={{
              marginTop: 20,
              backgroundColor: "white",
              borderRadius: 15,
              borderWidth: 1,
              borderColor: "black",
              overflow: "hidden",
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
            </View>

            {/* Table Rows */}
            <FlatList
              data={displayedPatients}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View
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
                  <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 10,
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>
                      {item.patient_number || ""}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: 2,
                      backgroundColor: "black",
                      alignSelf: "stretch",
                    }}
                  />
                  <View
                    style={{
                      flex: 2,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 10,
                    }}
                  >
                    <Text
                      style={{ fontSize: 16, flex: 1, textAlign: "center" }}
                    >
                      {item.first_name && item.last_name
                        ? formatName(
                            item.first_name,
                            item.middle_name,
                            item.last_name
                          )
                        : ""}
                    </Text>
                    {item.patient_number && (
                      <Menu
                        visible={visibleMenu === index}
                        onDismiss={() => setVisibleMenu(null)}
                        anchorPosition="bottom"
                        anchor={
                          <TouchableOpacity
                            onPress={() =>
                              setVisibleMenu(
                                visibleMenu === index ? null : index
                              )
                            }
                            style={{ marginLeft: 10 }}
                          >
                            <Text style={{ fontSize: 20 }}>⋯</Text>
                          </TouchableOpacity>
                        }
                      >
                        <Menu.Item
                          onPress={() =>
                            router.push(
                              `/viewpatient?patient_number=${item.patient_number}`
                            )
                          }
                          title="History"
                        />
                        
                      </Menu>
                    )}
                  </View>
                </View>
              )}
            />
          </View>
        </View>
      </View>
    </Provider>
  );
}
