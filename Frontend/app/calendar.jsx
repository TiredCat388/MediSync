import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, Button } from 'react-native';
import { Feather } from '@expo/vector-icons';

const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const totalCells = 35;
const dates = Array.from({ length: totalCells }, (_, i) => (i < 31 ? i + 1 : null));

export default function CalendarApp() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleDatePress = (date) => {
    setSelectedDate(date);
    setModalVisible(true);
  };

  return (
    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#f0f0f0' }}>
      {/* Sidebar Icons */}
      <View style={{ width: 50, backgroundColor: '#e0e0e0', alignItems: 'center', paddingTop: 16 }}>
        <Feather name="menu" size={24} color="black" style={{ marginBottom: 24 }} />
        <Feather name="calendar" size={24} color="black" style={{ marginBottom: 24 }} />
        <Feather name="clock" size={24} color="black" style={{ marginBottom: 24 }} />
        <Feather name="settings" size={24} color="black" style={{ marginBottom: 24 }} />
        <Feather name="refresh-cw" size={24} color="black" style={{ marginBottom: 24 }} />
      </View>

      <View style={{ flex: 1, padding: 8 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', margin: 8 }}>Calendar</Text>
        <View style={{ backgroundColor: '#3b82f6', borderRadius: 8, margin: 8, padding: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Feather name="arrow-left-circle" size={24} color="white" />
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>JANUARY 2024</Text>
          <Feather name="arrow-right-circle" size={24} color="white" />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'white', padding: 4, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#ccc' }}>
          {daysOfWeek.map((day) => (
            <Text key={day} style={{ flex: 1, textAlign: 'center', fontWeight: '600', padding: 4 }}>{day}</Text>
          ))}
        </View>
        <FlatList
          data={dates}
          numColumns={7}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{ flex: 1, aspectRatio: 1, borderWidth: 0.5, borderColor: '#ccc', alignItems: 'center', justifyContent: 'center', backgroundColor: item ? 'white' : '#e0e0e0' }}
              onPress={() => item && handleDatePress(item)}
              disabled={!item}
            >
              {item && <Text style={{ fontSize: 16 }}>{item}</Text>}
            </TouchableOpacity>
          )}
        />
        <Modal visible={modalVisible} transparent={true} animationType="slide">
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Details for {selectedDate}</Text>
              <Text style={{ marginVertical: 10 }}>Add your notes or schedule for this date here.</Text>
              <Button title="Close" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}
