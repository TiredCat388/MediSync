import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Modal, ScrollView, Platform } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Autocomplete from 'react-native-autocomplete-input';
import { useRouter, useLocalSearchParams } from 'expo-router';

const mockData = {
  medicationName: 'Ibuprofen',
  dosage: '200',
  unit: 'mg',
  hour: '10',
  minute: '30',
  ampm: 'AM',
  medHour: '6',
  medMinute: '0',
  notes: 'Take with food.',
  physicianID: 'Dr456',
};

const UpdateSched = () => {
  const router = useRouter();
  const { medicationId } = useLocalSearchParams();

  const [formData, setFormData] = useState({
    medicationName: '',
    dosage: '',
    unit: '',
    hour: '',
    minute: '',
    ampm: '',
    medHour: '',
    medMinute: '',
    notes: '',
    physicianID: '',
  });

  const [isCancelModalVisible, setCancelModalVisible] = useState(false);
  const [isWarningModalVisible, setWarningModalVisible] = useState(false);

  useEffect(() => {
    // Simulate fetching from backend
    const fetchMedicationData = async () => {
      try {
        // Replace this with actual API call
        const dataFromDB = {}; // example: await getMedicationById(medicationId);

        if (Object.keys(dataFromDB).length === 0) {
          setFormData(mockData);
        } else {
          setFormData({
            medicationName: dataFromDB.medicationName || '',
            dosage: dataFromDB.dosage || '',
            unit: dataFromDB.unit || '',
            hour: dataFromDB.hour || '',
            minute: dataFromDB.minute || '',
            ampm: dataFromDB.ampm || '',
            medHour: dataFromDB.medHour || '',
            medMinute: dataFromDB.medMinute || '',
            notes: dataFromDB.notes || '',
            physicianID: dataFromDB.physicianID || '',
          });
        }
      } catch (error) {
        console.error('Failed to fetch medication data:', error);
        setFormData(mockData); // fallback to mock data
      }
    };

    fetchMedicationData();
  }, [medicationId]);

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.rectangle}>
        <Text style={styles.sectionTitle}>UPDATE MEDICATION SCHEDULE</Text>
        <Text style={styles.subTitle}>Medication ID: {medicationId}</Text>

        <View style={styles.twoColumnLayout}>
          {/* LEFT SECTION */}
          <View style={styles.leftColumn}>
            <Text style={styles.label}>Medication Name</Text>
            <Autocomplete
              data={[]}
              defaultValue={formData.medicationName}
              editable={false}
              inputContainerStyle={styles.input}
              listStyle={{ display: 'none' }}
            />

            <Text style={styles.label}>Dosage</Text>
            <View style={styles.dobContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={formData.dosage}
                keyboardType="numeric"
                onChangeText={(text) => handleInputChange('dosage', text)}
              />
              <RNPickerSelect
                onValueChange={(value) => handleInputChange('unit', value)}
                value={formData.unit}
                style={Platform.OS === 'web' ? styles.dobSelectWeb : styles.dobSelect}
                items={[
                  { label: 'mg', value: 'mg' },
                  { label: 'ml', value: 'ml' },
                  { label: 'tablets', value: 'tablets' },
                ]}
              />
            </View>

            <Text style={styles.label}>Time of Medication</Text>
            <View style={styles.dobContainer}>
              <RNPickerSelect
                onValueChange={(value) => handleInputChange('hour', value)}
                value={formData.hour}
                style={Platform.OS === 'web' ? styles.dobSelectWeb : styles.dobSelect}
                items={[...Array(12)].map((_, i) => ({
                  label: String(i + 1),
                  value: String(i + 1),
                }))}
              />
              <RNPickerSelect
                onValueChange={(value) => handleInputChange('minute', value)}
                value={formData.minute}
                style={Platform.OS === 'web' ? styles.dobSelectWeb : styles.dobSelect}
                items={[...Array(60)].map((_, i) => ({
                  label: i.toString().padStart(2, '0'),
                  value: i.toString().padStart(2, '0'),
                }))}
              />
              <RNPickerSelect
                onValueChange={(value) => handleInputChange('ampm', value)}
                value={formData.ampm}
                style={Platform.OS === 'web' ? styles.dobSelectWeb : styles.dobSelect}
                items={[
                  { label: 'AM', value: 'AM' },
                  { label: 'PM', value: 'PM' },
                ]}
              />
            </View>

            <Text style={styles.label}>Medication Timing</Text>
            <View style={styles.dobContainer}>
              <RNPickerSelect
                onValueChange={(value) => handleInputChange('medHour', value)}
                value={formData.medHour}
                style={Platform.OS === 'web' ? styles.dobSelectWeb : styles.dobSelect}
                items={[...Array(24)].map((_, i) => ({
                  label: `${i} hr`,
                  value: String(i),
                }))}
              />
              <RNPickerSelect
                onValueChange={(value) => handleInputChange('medMinute', value)}
                value={formData.medMinute}
                style={Platform.OS === 'web' ? styles.dobSelectWeb : styles.dobSelect}
                items={[...Array(12)].map((_, i) => {
                  const val = i * 5;
                  return {
                    label: `${val} min`,
                    value: String(val),
                  };
                })}
              />
            </View>
          </View>

          {/* DIVIDER */}
          <View style={styles.divider} />

          {/* RIGHT SECTION */}
          <View style={styles.rightColumn}>
            <Text style={styles.label}>Additional Information</Text>
            <TextInput
              style={styles.input}
              value={formData.notes}
              multiline
              numberOfLines={4}
              onChangeText={(text) => handleInputChange('notes', text)}
            />

            <Text style={styles.label}>Physician ID</Text>
            <TextInput
              style={styles.input}
              value={formData.physicianID}
              onChangeText={(text) => handleInputChange('physicianID', text)}
            />
          </View>
        </View>

        {/* Cancel Modal */}
        <Modal transparent visible={isCancelModalVisible} animationType="fade">
          <View style={styles.modalContainer}>
            <View style={styles.modalBox}>
              <Text style={styles.modalText}>Are you sure you want to leave this page?</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.stayButton} onPress={() => setCancelModalVisible(false)}>
                  <Text style={styles.buttonText}>Stay</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.leaveButton} onPress={() => Alert.alert('Left')}>
                  <Text style={styles.buttonText}>Leave</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Warning Modal */}
        <Modal transparent visible={isWarningModalVisible} animationType="fade">
          <View style={styles.modalContainer}>
            <View style={styles.modalBox}>
              <Text style={styles.modalText}>Some required fields are empty. Proceed anyway?</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.stayButton} onPress={() => setWarningModalVisible(false)}>
                  <Text style={styles.buttonText}>Go Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.leaveButton} onPress={() => Alert.alert('Proceeding...')}>
                  <Text style={styles.buttonText}>Proceed</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  formContainer: {
    flexDirection: 'row',
  },
  column: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  autocompleteContainer: {
    flexDirection: 'row',
  },
  autocompleteWrapper: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  autocompleteInput: {
    height: 40,
    paddingLeft: 10,
    fontSize: 14,
  },
  autocompleteItem: {
    padding: 10,
    backgroundColor: '#fff',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  autocompleteText: {
    fontSize: 14,
  },
  dobContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  dobInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingLeft: 10,
    fontSize: 14,
    marginRight: 10,
  },
  dobSelect: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingLeft: 10,
    fontSize: 14,
  },
  dobSelectWeb: {
    paddingRight: 10,
  },
  divider: {
    width: 1,
    backgroundColor: '#ccc',
    height: '100%',
    marginHorizontal: 20,
  },
  rightSection: {
    flex: 1,
    paddingLeft: 20,
  },
  textArea: {
    height: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 14,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingLeft: 10,
    fontSize: 14,
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 5,
    width: 300,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default UpdateSched;
