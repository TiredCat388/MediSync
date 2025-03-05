import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import Sidebar from './components/sidebar';

export default function PatientsDirectory() {
  const router = useRouter();
  
  //will be replaced by database connection??
  const patients = [];
  const totalRows = 10;
  
  // Generate table data (filled + empty rows)
  const tableData = [
    { id: 'Patient ID', name: 'Patient Name', header: true }, // Header row
    ...patients,
    ...Array.from({ length: totalRows - patients.length }, (_, i) => ({ id: '', name: '', header: false }))
  ];

  const renderItem = ({ item }) => (
    <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: 'lightgrey', backgroundColor: item.id ? 'white' : 'lightgrey', padding: 10 }}>
      <Text style={{ flex: 1, textAlign: 'center', fontWeight: item.header ? 'bold' : 'normal' }}>{item.id}</Text>
      <Text style={{ flex: 2, textAlign: 'center', fontWeight: item.header ? 'bold' : 'normal' }}>{item.name}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <Sidebar />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Patients Directory</Text>
        <View style={{ width: '80%', backgroundColor: 'white', borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: 'lightgrey' }}>
          <FlatList
            data={tableData}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <TouchableOpacity onPress={() => router.push('/registernew')} style={{ backgroundColor: 'blue', padding: 10, borderRadius: 5, marginTop: 20 }}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>New Patient +</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
