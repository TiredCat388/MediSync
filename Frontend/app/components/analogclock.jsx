import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import Svg, { Circle, Line, Text as SvgText } from "react-native-svg";

// Helper function to calculate rotation degrees for clock hands
const getRotation = (value, max) => (value / max) * 360;

export default function AnalogClock({ size = 350, style }) {
  const [time, setTime] = useState(new Date());

  // Update the time every second
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const center = size / 2;
  const radius = center - 7.5; // to match original radius 142.5 for size 350

  return (
    <View style={style}>
      <Svg height={size} width={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="black"
          strokeWidth="3"
          fill="none"
        />
        {[...Array(12)].map((_, i) => (
          <React.Fragment key={`tick-${i}`}>
            <Line
              x1={center + (radius - 7.5) * Math.cos((i * 30 - 90) * (Math.PI / 180))}
              y1={center + (radius - 7.5) * Math.sin((i * 30 - 90) * (Math.PI / 180))}
              x2={center + radius * Math.cos((i * 30 - 90) * (Math.PI / 180))}
              y2={center + radius * Math.sin((i * 30 - 90) * (Math.PI / 180))}
              stroke="black"
              strokeWidth="3"
            />
            <SvgText
              x={center + (radius - 30) * Math.cos((i * 30 - 90) * (Math.PI / 180))}
              y={center + (radius - 30) * Math.sin((i * 30 - 90) * (Math.PI / 180))}
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
          x1={center}
          y1={center}
          x2={center + 60 * Math.cos((getRotation(hours, 12) - 90) * (Math.PI / 180))}
          y2={center + 60 * Math.sin((getRotation(hours, 12) - 90) * (Math.PI / 180))}
          stroke="black"
          strokeWidth="6"
        />
        <Line
          x1={center}
          y1={center}
          x2={center + 90 * Math.cos((getRotation(minutes, 60) - 90) * (Math.PI / 180))}
          y2={center + 90 * Math.sin((getRotation(minutes, 60) - 90) * (Math.PI / 180))}
          stroke="black"
          strokeWidth="4.5"
        />
        <Line
          x1={center}
          y1={center}
          x2={center + 105 * Math.cos((getRotation(seconds, 60) - 90) * (Math.PI / 180))}
          y2={center + 105 * Math.sin((getRotation(seconds, 60) - 90) * (Math.PI / 180))}
          stroke="red"
          strokeWidth="3"
        />
      </Svg>
      <Text style={{ textAlign: "center", marginTop: 10, fontSize: 24, fontWeight: "bold" }}>
        {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })}
      </Text>
      <Text style={{ textAlign: "center", fontSize: 18, color: "#333" }}>
        {time.getFullYear()}-{String(time.getMonth() + 1).padStart(2, '0')}-{String(time.getDate()).padStart(2, '0')}
      </Text>

    </View>
  );
}
