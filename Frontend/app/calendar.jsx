import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, Button } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const totalCells = 35;
const dates = Array.from({ length: totalCells }, (_, i) => (i < 31 ? i + 1 : null));
const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

export default function CalendarApp() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [currentYear, setCurrentYear] = useState(2024);

  const handleDatePress = (date) => {
    setSelectedDate(date);
    setModalVisible(true);
  };

  const handleSidebarPress = (icon) => {
    console.log(`${icon} clicked`);
  };

  const handleMonthChange = (direction) => {
    setCurrentMonth((prevMonth) => {
      let newMonth = prevMonth + direction;
      let newYear = currentYear;
      if (newMonth < 0) {
        newMonth = 11;
        newYear--;
      } else if (newMonth > 11) {
        newMonth = 0;
        newYear++;
      }
      setCurrentYear(newYear);
      return newMonth;
    });
  };

  return (
    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#f0f0f0' }}>
      {/* Sidebar Icons */}
      <View style={{ width: 50, backgroundColor: '#e0e0e0', alignItems: 'center', paddingTop: 16 }}>
        <TouchableOpacity onPress={() => handleSidebarPress('menu')}>
          <FontAwesome name="bars" size={24} color="gray" style={{ marginBottom: 24 }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleSidebarPress('file')}>
          <FontAwesome name="file-text-o" size={24} color="gray" style={{ marginBottom: 24 }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleSidebarPress('calendar')}>
          <FontAwesome name="calendar" size={24} color="gray" style={{ marginBottom: 24 }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleSidebarPress('clock')}>
          <FontAwesome name="clock-o" size={24} color="gray" style={{ marginBottom: 24 }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleSidebarPress('settings')}>
          <FontAwesome name="cog" size={24} color="gray" style={{ marginBottom: 24 }} />
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, padding: 8 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', margin: 8 }}>Calendar</Text>

        {/* Enclosed Calendar */}
        <View style={{ 
          backgroundColor: '#3b82f6', 
          borderRadius: 8, 
          borderWidth: 1, 
          borderColor: '#ccc', 
          padding: 8, 
          margin: 8, 
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}>
          {/* Calendar Header */}
          <View style={{ 
            backgroundColor: '#3b82f6', 
            borderTopLeftRadius: 8, 
            borderTopRightRadius: 8, 
            padding: 8, 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'space-between' 
          }}>
            <TouchableOpacity onPress={() => handleMonthChange(-1)}>
              <Feather name="arrow-left-circle" size={24} color="white" />
            </TouchableOpacity>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>{months[currentMonth]} {currentYear}</Text>
            <TouchableOpacity onPress={() => handleMonthChange(1)}>
              <Feather name="arrow-right-circle" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Days of the Week */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'white', padding: 4, borderBottomWidth: 1, borderColor: '#ccc' }}>
            {daysOfWeek.map((day) => (
              <Text key={day} style={{ flex: 1, textAlign: 'center', fontWeight: '600', padding: 4 }}>{day}</Text>
            ))}
          </View>

          {/* Calendar Grid */}
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
        </View>

        {/* Modal for Date Details */}
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
