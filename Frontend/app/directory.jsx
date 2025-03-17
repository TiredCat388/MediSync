import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import Sidebar from './components/sidebar';
import { useState, useEffect } from 'react';
import { Menu, Divider, Provider } from 'react-native-paper';

export default function PatientsDirectory() {
  const router = useRouter();
  const [patients, setPatients] = useState([]);
  const [visibleMenu, setVisibleMenu] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/patients/");
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const totalRows = 12;
  const displayedPatients = [...patients];

  if (displayedPatients.length === 0) {
    displayedPatients.push({ id: '0123456', name: 'TESTING PURPOSES ONLY' });
  }

  while (displayedPatients.length < totalRows) {
    displayedPatients.push({ id: '', name: '' });
  }

  return (
    <Provider>
      <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#f8f8f8' }}>
        <Sidebar onNavigate={(destination) => router.push(destination)} />
        <View style={{ flex: 1, marginLeft: 70, padding: 40 }}>
          {/* Header and Button Row */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Patients Directory</Text>
            <TouchableOpacity
              onPress={() => router.push('/registernew')}
              style={{
                backgroundColor: '#5879a5',
                paddingVertical: 8,
                paddingHorizontal: 20,
                borderRadius: 8,
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 180,
                marginTop: 40,
              }}
            >
              <Text style={{ color: 'white', fontSize: 18, fontWeight: "bold" }}>+  New Patient </Text>
            </TouchableOpacity>
          </View>
          
          {/* Simple Clickable Text for Redirect */}
          <TouchableOpacity onPress={() => router.push('/newmedsched')}>
              <Text style={{ color: 'blue', textDecorationLine: 'underline', marginTop: 10 }}>
                New Med Sched (temporary)
              </Text>
            </TouchableOpacity>

          {/* Table */}
          <View
            style={{
              marginTop: 20,
              backgroundColor: 'white',
              borderRadius: 15,
              borderWidth: 1,
              borderColor: 'black',
              overflow: 'hidden',
            }}
          >
            {/* Table Header */}
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: 'white',
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderColor: 'black',
              }}
            >
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Patient ID</Text>
              </View>
              <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Patient Name</Text>
              </View>
            </View>

            {/* Table Rows */}
            <FlatList
              data={displayedPatients}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: item.id ? 'white' : 'lightgrey',
                    borderBottomWidth: 1,
                    borderColor: 'black',
                    minHeight: 35,
                  }}
                >
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 10 }}>
                    <Text style={{ fontSize: 16 }}>{item.id || ''}</Text>
                  </View>
                  <View style={{ width: 2, backgroundColor: 'black', alignSelf: 'stretch' }} />
                  <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10 }}>
                    <Text style={{ fontSize: 16, flex: 1, textAlign: 'center' }}>{item.name || ''}</Text>
                    {item.id && (
                      <Menu
                        visible={visibleMenu === index}
                        onDismiss={() => setVisibleMenu(null)}
                        anchorPosition="bottom"
                        anchor={
                          <TouchableOpacity 
                            onPress={() => setVisibleMenu(visibleMenu === index ? null : index)} 
                            style={{ marginLeft: 10 }}>
                            <Text style={{ fontSize: 20 }}>⋯</Text>
                          </TouchableOpacity>
                        }
                      >
                        <Menu.Item onPress={() => router.push('/viewpatient')} title="View" />
                        <Divider />
                        <Menu.Item onPress={() => console.log('Delete', item.id)} title="Delete" />
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