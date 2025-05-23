import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, Button } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Sidebar from './components/sidebar';
import { ScrollView } from 'react-native';

const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

export default function CalendarApp() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [currentYear, setCurrentYear] = useState(2024);
  const [sidebarWidth, setSidebarWidth] = useState(70); // Default sidebar width when collapsed
  const router = useRouter();

  const handleDatePress = (date) => {
    setSelectedDate(date);
    setModalVisible(true);
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

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const dates = Array.from({ length: 42 }, (_, i) => {
    const day = i - firstDay + 1;
    return day > 0 && day <= daysInMonth ? day : null;
  });

  useEffect(() => {
    // Function to set sidebar width based on whether it's expanded
    const updateSidebarWidth = (width) => {
      setSidebarWidth(width);
    };

    return () => {
      updateSidebarWidth(70);
    };
  }, []);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
    <View style={{ flex: 1, flexDirection: 'row' }}>
      {/* Reusable Sidebar Component */}
      <Sidebar setSidebarWidth={setSidebarWidth} />

      {/* Main Calendar Content */}
      <ScrollView style={{ flex: 1, padding: 8, marginLeft: sidebarWidth }}>
        <Text style={{ fontSize: 30, fontWeight: "bold", margin: 8 }}>
          Calendar
        </Text>

      {/* Calendar Section */}
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
            style={{ flex: 1, aspectRatio: 1, borderWidth: 0.5, borderColor: '#ccc', alignItems: 'flex-start', justifyContent: 'flex-start', backgroundColor: item ? 'white' : '#e0e0e0', padding: 4 }}
            onPress={() => item && handleDatePress(item)}
            disabled={!item}
          >
            {item && <Text style={{ fontSize: 16 }}>{item}</Text>}
          </TouchableOpacity>
        )}
      />
    </View>

        {/* Date Details Modal */}
        <Modal visible={modalVisible} transparent={true} animationType="slide">
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Details for {selectedDate}</Text>
              <Text style={{ marginVertical: 10 }}>Add your notes or schedule for this date here.</Text>
              <Button title="Close" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  </ScrollView>
  );
}