import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Svg, { Line, Circle, Text as SvgText } from 'react-native-svg';
import Sidebar from './components/sidebar';


const { width } = Dimensions.get("window");
const sidebarWidth = 70;

const AnalogClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const getRotation = (unit, max) => (unit / max) * 360;
  
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const upcomingAlerts = [
    { id: '0012330AC - 0077CB', time: 'in 2 hours' },
    { id: '0012321BA - 0061BC', time: 'in 4 hours' },
  ];

  return (
    <View style={styles.container}>
      <Sidebar />
      <ScrollView style={[styles.mainContent, { marginLeft: sidebarWidth }]}>
        {/* Centered Clock */}
        <View style={styles.clockWrapper}>
          <Svg height="500" width="500" viewBox="0 0 300 300">
            <Circle cx="150" cy="150" r="142.5" stroke="black" strokeWidth="3" fill="none" />
            
            {[...Array(12)].map((_, i) => (
              <React.Fragment key={`tick-${i}`}>
                <Line
                  x1={150 + 135 * Math.cos((i * 30 - 90) * (Math.PI / 180))}
                  y1={150 + 135 * Math.sin((i * 30 - 90) * (Math.PI / 180))}
                  x2={150 + 142.5 * Math.cos((i * 30 - 90) * (Math.PI / 180))}
                  y2={150 + 142.5 * Math.sin((i * 30 - 90) * (Math.PI / 180))}
                  stroke="black"
                  strokeWidth="3"
                />
                <SvgText
                  x={150 + 120 * Math.cos((i * 30 - 90) * (Math.PI / 180))}
                  y={150 + 120 * Math.sin((i * 30 - 90) * (Math.PI / 180))}
                  fontSize="18"
                  fontWeight="bold"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  {i === 0 ? 12 : i}
                </SvgText>
              </React.Fragment>
            ))}

            <Line
              x1="150"
              y1="150"
              x2={150 + 60 * Math.cos((getRotation(hours, 12) - 90) * (Math.PI / 180))}
              y2={150 + 60 * Math.sin((getRotation(hours, 12) - 90) * (Math.PI / 180))}
              stroke="black"
              strokeWidth="6"
            />
            
            <Line
              x1="150"
              y1="150"
              x2={150 + 90 * Math.cos((getRotation(minutes, 60) - 90) * (Math.PI / 180))}
              y2={150 + 90 * Math.sin((getRotation(minutes, 60) - 90) * (Math.PI / 180))}
              stroke="black"
              strokeWidth="4.5"
            />
            
            <Line
              x1="150"
              y1="150"
              x2={150 + 105 * Math.cos((getRotation(seconds, 60) - 90) * (Math.PI / 180))}
              y2={150 + 105 * Math.sin((getRotation(seconds, 60) - 90) * (Math.PI / 180))}
              stroke="red"
              strokeWidth="3"
            />
          </Svg>
        </View>

        {/* Upcoming Alerts Section */}
        <View style={styles.alertsContainer}>
          <Text style={styles.alertsTitle}>Upcoming Alerts</Text>
          {upcomingAlerts.map((alert, index) => (
            <View key={index} style={styles.alertItem}>
              <Text style={styles.alertText}>Schedule ID: {alert.id}</Text>
              <Text style={styles.alertTime}>[{alert.time}]</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
  },
  mainContent: {
    paddingVertical: 20,
  },
  clockWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 20,
  },
  alertsContainer: {
    backgroundColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
    marginHorizontal: 20,
  },
  alertsTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  alertItem: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 5,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  alertText: {
    fontSize: 14,
  },
  alertTime: {
    fontStyle: 'italic',
    fontSize: 14,
  },
});

export default AnalogClock;
