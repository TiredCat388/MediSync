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

  return (
    <View style={styles.container}>
      <Sidebar />
      <ScrollView style={[styles.mainContent, { marginLeft: sidebarWidth }]}>
        <Svg height="500" width="500" viewBox="0 0 300 300">
          <Circle cx="150" cy="150" r="142.5" stroke="black" strokeWidth="3" fill="none" />
          
          {[...Array(12)].map((_, i) => (
            <>
              <Line
                key={`tick-${i}`}
                x1={150 + 135 * Math.cos((i * 30 - 90) * (Math.PI / 180))}
                y1={150 + 135 * Math.sin((i * 30 - 90) * (Math.PI / 180))}
                x2={150 + 142.5 * Math.cos((i * 30 - 90) * (Math.PI / 180))}
                y2={150 + 142.5 * Math.sin((i * 30 - 90) * (Math.PI / 180))}
                stroke="black"
                strokeWidth="3"
              />
              <SvgText
                key={`num-${i}`}
                x={150 + 120 * Math.cos((i * 30 - 90) * (Math.PI / 180))}
                y={150 + 120 * Math.sin((i * 30 - 90) * (Math.PI / 180))}
                fontSize="18"
                fontWeight="bold"
                textAnchor="middle"
                alignmentBaseline="middle"
              >
                {i === 0 ? 12 : i}
              </SvgText>
            </>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default AnalogClock;