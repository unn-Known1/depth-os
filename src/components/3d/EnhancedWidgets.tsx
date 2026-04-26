import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import type { Widget as WidgetType } from '../../types';
import { useDepthOSStore } from '../../stores/depthOSStore';

// Weather widget
export const WeatherWidget3D: React.FC<{ widget: WidgetType }> = ({ widget }) => {
  const { weatherData, refreshWeather } = useDepthOSStore();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    refreshWeather();
    const interval = setInterval(refreshWeather, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  useFrame(() => {
    const now = new Date();
    if (now.getSeconds() !== time.getSeconds()) {
      setTime(now);
    }
  });

  const weatherIcons: Record<string, string> = {
    sunny: '☀️',
    cloudy: '☁️',
    rainy: '🌧️',
    snowy: '❄️',
    stormy: '⛈️',
  };

  return (
    <group position={[widget.position.x, widget.position.y, widget.position.z]}>
      {/* Background */}
      <mesh>
        <planeGeometry args={[widget.scale.x, widget.scale.y]} />
        <meshStandardMaterial color="#000000" transparent opacity={0.7} />
      </mesh>

      {/* Border glow */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[widget.scale.x + 0.02, widget.scale.y + 0.02]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.3} />
      </mesh>

      {/* Weather icon */}
      <Text position={[0, 0.25, 0.02]} fontSize={0.4} anchorX="center" anchorY="middle">
        {weatherData ? weatherIcons[weatherData.condition] : '☀️'}
      </Text>

      {/* Temperature */}
      <Text position={[0, 0, 0.02]} fontSize={0.3} color="#ffffff" anchorX="center" anchorY="middle">
        {weatherData ? `${weatherData.temperature}°C` : '--°C'}
      </Text>

      {/* Location */}
      <Text position={[0, -0.25, 0.02]} fontSize={0.1} color="#a0aec0" anchorX="center" anchorY="middle">
        {weatherData?.location || 'Loading...'}
      </Text>

      {/* Refresh button indicator */}
      <mesh position={[widget.scale.x / 2 - 0.15, widget.scale.y / 2 - 0.15, 0.02]}>
        <circleGeometry args={[0.08, 16]} />
        <meshBasicMaterial color="#3b82f6" />
      </mesh>
      <Text position={[widget.scale.x / 2 - 0.15, widget.scale.y / 2 - 0.15, 0.03]} fontSize={0.08} color="#ffffff" anchorX="center" anchorY="middle">
        ↻
      </Text>
    </group>
  );
};

// System monitor widget
export const SystemWidget3D: React.FC<{ widget: WidgetType }> = ({ widget }) => {
  const { systemInfo, updateSystemInfo } = useDepthOSStore();

  useEffect(() => {
    const interval = setInterval(() => {
      updateSystemInfo({
        cpuUsage: Math.random() * 100,
        memoryUsage: 40 + Math.random() * 30,
        gpuUsage: Math.random() * 80,
        networkSpeed: Math.random() * 100,
        temperature: 40 + Math.random() * 20,
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const barWidth = widget.scale.x * 0.7;

  return (
    <group position={[widget.position.x, widget.position.y, widget.position.z]}>
      {/* Background */}
      <mesh>
        <planeGeometry args={[widget.scale.x, widget.scale.y]} />
        <meshStandardMaterial color="#000000" transparent opacity={0.7} />
      </mesh>

      {/* Border */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[widget.scale.x + 0.02, widget.scale.y + 0.02]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.3} />
      </mesh>

      {/* Title */}
      <Text position={[0, widget.scale.y / 2 - 0.1, 0.02]} fontSize={0.1} color="#ffffff" anchorX="center" anchorY="middle">
        System Monitor
      </Text>

      {/* CPU bar */}
      <Text position={[-widget.scale.x / 2 + 0.1, 0.3, 0.02]} fontSize={0.08} color="#a0aec0" anchorX="left" anchorY="middle">
        CPU
      </Text>
      <mesh position={[0, 0.3, 0.02]}>
        <planeGeometry args={[barWidth, 0.08]} />
        <meshBasicMaterial color="#333333" />
      </mesh>
      <mesh position={[-barWidth / 2 + (barWidth * systemInfo.cpuUsage) / 200, 0.3, 0.03]}>
        <planeGeometry args={[(barWidth * systemInfo.cpuUsage) / 100, 0.08]} />
        <meshBasicMaterial color="#3b82f6" />
      </mesh>

      {/* Memory bar */}
      <Text position={[-widget.scale.x / 2 + 0.1, 0.1, 0.02]} fontSize={0.08} color="#a0aec0" anchorX="left" anchorY="middle">
        RAM
      </Text>
      <mesh position={[0, 0.1, 0.02]}>
        <planeGeometry args={[barWidth, 0.08]} />
        <meshBasicMaterial color="#333333" />
      </mesh>
      <mesh position={[-barWidth / 2 + (barWidth * systemInfo.memoryUsage) / 200, 0.1, 0.03]}>
        <planeGeometry args={[(barWidth * systemInfo.memoryUsage) / 100, 0.08]} />
        <meshBasicMaterial color="#10b981" />
      </mesh>

      {/* GPU bar */}
      <Text position={[-widget.scale.x / 2 + 0.1, -0.1, 0.02]} fontSize={0.08} color="#a0aec0" anchorX="left" anchorY="middle">
        GPU
      </Text>
      <mesh position={[0, -0.1, 0.02]}>
        <planeGeometry args={[barWidth, 0.08]} />
        <meshBasicMaterial color="#333333" />
      </mesh>
      <mesh position={[-barWidth / 2 + (barWidth * systemInfo.gpuUsage) / 200, -0.1, 0.03]}>
        <planeGeometry args={[(barWidth * systemInfo.gpuUsage) / 100, 0.08]} />
        <meshBasicMaterial color="#f59e0b" />
      </mesh>

      {/* Temperature */}
      <Text position={[0, -0.35, 0.02]} fontSize={0.12} color="#ffffff" anchorX="center" anchorY="middle">
        {Math.round(systemInfo.temperature)}°C
      </Text>
    </group>
  );
};

// Calendar widget
export const CalendarWidget3D: React.FC<{ widget: WidgetType }> = ({ widget }) => {
  const [date, setDate] = useState(new Date());

  useFrame(() => {
    const now = new Date();
    if (now.getMinutes() !== date.getMinutes()) {
      setDate(now);
    }
  });

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <group position={[widget.position.x, widget.position.y, widget.position.z]}>
      {/* Background */}
      <mesh>
        <planeGeometry args={[widget.scale.x, widget.scale.y]} />
        <meshStandardMaterial color="#000000" transparent opacity={0.7} />
      </mesh>

      {/* Border */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[widget.scale.x + 0.02, widget.scale.y + 0.02]} />
        <meshBasicMaterial color="#ec4899" transparent opacity={0.3} />
      </mesh>

      {/* Month and Year */}
      <Text position={[0, widget.scale.y / 2 - 0.15, 0.02]} fontSize={0.12} color="#ffffff" anchorX="center" anchorY="middle">
        {months[date.getMonth()]} {date.getFullYear()}
      </Text>

      {/* Day name */}
      <Text position={[0, 0.15, 0.02]} fontSize={0.2} color="#ffffff" anchorX="center" anchorY="middle">
        {days[date.getDay()]}
      </Text>

      {/* Date number */}
      <Text position={[0, -0.1, 0.02]} fontSize={0.4} color="#ec4899" anchorX="center" anchorY="middle">
        {date.getDate()}
      </Text>

      {/* Time */}
      <Text position={[0, -0.4, 0.02]} fontSize={0.1} color="#a0aec0" anchorX="center" anchorY="middle">
        {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </group>
  );
};

// Notes widget
export const NotesWidget3D: React.FC<{ widget: WidgetType }> = ({ widget }) => {
  const notes = [
    'Welcome to Depth OS!',
    'Click apps to select them',
    'Double-click to focus',
    'Press ESC to exit focus',
  ];

  return (
    <group position={[widget.position.x, widget.position.y, widget.position.z]}>
      {/* Background */}
      <mesh>
        <planeGeometry args={[widget.scale.x, widget.scale.y]} />
        <meshStandardMaterial color="#fef3c7" transparent opacity={0.9} />
      </mesh>

      {/* Border */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[widget.scale.x + 0.02, widget.scale.y + 0.02]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.5} />
      </mesh>

      {/* Title */}
      <Text position={[0, widget.scale.y / 2 - 0.1, 0.02]} fontSize={0.1} color="#78350f" anchorX="center" anchorY="middle">
        Quick Notes
      </Text>

      {/* Notes list */}
      {notes.map((note, i) => (
        <Text
          key={i}
          position={[-widget.scale.x / 2 + 0.1, 0.2 - i * 0.15, 0.02]}
          fontSize={0.07}
          color="#92400e"
          anchorX="left"
          anchorY="middle"
          maxWidth={widget.scale.x - 0.2}
        >
          • {note}
        </Text>
      ))}
    </group>
  );
};
